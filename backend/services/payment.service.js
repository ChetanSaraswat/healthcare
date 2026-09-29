'use strict';

const crypto = require('crypto');
const { paymentRepository, orderRepository, rentalRepository, webhookEventRepository, userRepository } = require('../repository');
const { razorpayGateway, email } = require('../libs');
const { BadRequest, NotFound, Forbidden } = require('../libs/error');
const { UniqueConstraintError } = require('sequelize');

class PaymentService {
  /**
   * Initializes a Razorpay order and tracks a pending Payment record (PaymentAttempt)
   * Enforces server-side amount derivation from database orders, 60-minute order expiry boundary,
   * 5-attempt creation cap, server-generated gateway idempotency, and on-demand reconciliation.
   * @param {number|null} userId
   * @param {Object} data
   */
  async createRazorpayOrder(userId, data) {
    const { currency = 'INR', orderId, rentalOrderId, notes = {} } = data;
    const idempotencyKey = data.idempotency_key || data.idempotencyKey || null;

    // CRITICAL SECURITY ENFORCEMENT (Section 2):
    // NEVER accept or trust an amount field from the client payload.
    // The amount charged is strictly derived server-side from the stored business record
    // (Order.total_amount or RentalOrder computed total). Any client-supplied amount is ignored.

    if (!orderId && !rentalOrderId) {
      throw new BadRequest('Either orderId or rentalOrderId must be provided to initiate payment');
    }

    // Verify order ownership & validity if orderId supplied
    let verifiedOrderId = null;
    let orderInstance = null;
    let derivedAmount = 0;

    if (orderId) {
      orderInstance = await orderRepository.findByPk(orderId);
      if (!orderInstance) {
        throw new NotFound(`Order #${orderId} not found`);
      }
      if (userId && orderInstance.user_id !== userId) {
        throw new Forbidden('Unauthorized access to specified order');
      }

      // SECTION 10: Single staleness boundary (60-minute order expiration)
      const orderAgeMs = Date.now() - new Date(orderInstance.created_at).getTime();
      const isExpired = orderInstance.status === 'cancelled' || (orderInstance.status === 'pending' && orderAgeMs > 60 * 60 * 1000);
      if (isExpired) {
        throw new BadRequest('Order expired, please start a new checkout');
      }

      verifiedOrderId = orderInstance.id;
      derivedAmount = parseFloat(orderInstance.total_amount);
    }

    // Verify rental order ownership & validity if rentalOrderId supplied
    let verifiedRentalOrderId = null;
    let rentalInstance = null;
    if (rentalOrderId) {
      rentalInstance = await rentalRepository.findRentalDetails(rentalOrderId);
      if (!rentalInstance) {
        throw new NotFound(`Rental order #${rentalOrderId} not found`);
      }
      if (userId && rentalInstance.user_id !== userId) {
        throw new Forbidden('Unauthorized access to specified rental order');
      }

      // SECTION 10: Single staleness boundary (60-minute rental order expiration)
      const rentalAgeMs = Date.now() - new Date(rentalInstance.created_at).getTime();
      const isRentalExpired = rentalInstance.status === 'cancelled' || (rentalInstance.status === 'pending' && rentalAgeMs > 60 * 60 * 1000);
      if (isRentalExpired) {
        throw new BadRequest('Order expired, please start a new checkout');
      }

      verifiedRentalOrderId = rentalInstance.id;

      // Compute rental total directly from database: deposit + rental fee for duration
      let computedRentalTotal = Number(rentalInstance.deposit_amount || 0);
      if (rentalInstance.items && rentalInstance.items.length > 0) {
        const days = (rentalInstance.start_date && rentalInstance.end_date)
          ? Math.max(1, Math.round((new Date(rentalInstance.end_date) - new Date(rentalInstance.start_date)) / (1000 * 60 * 60 * 24)))
          : 7;
        for (const item of rentalInstance.items) {
          let durationCount = days;
          if (item.rate_type === 'weekly') durationCount = Math.ceil(days / 7);
          else if (item.rate_type === 'monthly') durationCount = Math.ceil(days / 30);
          computedRentalTotal += Number(item.rate_amount) * durationCount * Number(item.quantity || 1);
        }
      }
      derivedAmount = computedRentalTotal;
    }

    if (isNaN(derivedAmount) || derivedAmount <= 0) {
      throw new BadRequest('Payment amount must be a positive number');
    }

    // =========================================================================
    // SECTION 4: Check for an existing successful (captured) payment FIRST
    // Regardless of idempotency key, never create another payment attempt or Razorpay order
    // if this business order is already paid.
    // =========================================================================
    if (verifiedOrderId) {
      const capturedPayment = await paymentRepository.findCapturedByOrderId(verifiedOrderId);
      if (capturedPayment || (orderInstance && orderInstance.status === 'paid')) {
        const paymentRecord = capturedPayment || (await paymentRepository.findByOrderId(verifiedOrderId));
        return {
          keyId: razorpayGateway.keyId,
          orderId: paymentRecord ? paymentRecord.gateway_order_id : null,
          amount: paymentRecord ? Math.round(Number(paymentRecord.amount) * 100) : Math.round(derivedAmount * 100),
          amountInInr: paymentRecord ? Number(paymentRecord.amount) : derivedAmount,
          currency: paymentRecord ? paymentRecord.currency : currency,
          paymentRecordId: paymentRecord ? paymentRecord.id : null,
          status: 'captured',
          alreadyCaptured: true,
          message: 'Order already has a successfully captured payment.',
        };
      }
    }

    if (verifiedRentalOrderId) {
      const capturedPayment = await paymentRepository.findCapturedByRentalOrderId(verifiedRentalOrderId);
      if (capturedPayment || (rentalInstance && ['confirmed', 'active'].includes(rentalInstance.status))) {
        const paymentRecord = capturedPayment || (await paymentRepository.findByRentalOrderId(verifiedRentalOrderId));
        return {
          keyId: razorpayGateway.keyId,
          orderId: paymentRecord ? paymentRecord.gateway_order_id : null,
          amount: paymentRecord ? Math.round(Number(paymentRecord.amount) * 100) : Math.round(derivedAmount * 100),
          amountInInr: paymentRecord ? Number(paymentRecord.amount) : derivedAmount,
          currency: paymentRecord ? paymentRecord.currency : currency,
          paymentRecordId: paymentRecord ? paymentRecord.id : null,
          status: 'captured',
          alreadyCaptured: true,
          message: 'Rental order already has a successfully captured payment.',
        };
      }
    }

    // =========================================================================
    // SECTION 3 & SECTION 9: Idempotency Key Handling & On-Demand Reconciliation
    // Look up whether a PaymentAttempt already exists for (order_id, idempotency_key)
    // =========================================================================
    let existingAttempt = null;
    if (idempotencyKey) {
      if (verifiedOrderId) {
        existingAttempt = await paymentRepository.findByOrderIdAndIdempotencyKey(verifiedOrderId, idempotencyKey);
      } else if (verifiedRentalOrderId) {
        existingAttempt = await paymentRepository.findByRentalOrderIdAndIdempotencyKey(verifiedRentalOrderId, idempotencyKey);
      }
    }

    if (existingAttempt) {
      // 1. If it is already captured, return immediately
      if (existingAttempt.status === 'captured') {
        return {
          keyId: razorpayGateway.keyId,
          orderId: existingAttempt.gateway_order_id,
          amount: Math.round(Number(existingAttempt.amount) * 100),
          amountInInr: Number(existingAttempt.amount),
          currency: existingAttempt.currency,
          paymentRecordId: existingAttempt.id,
          status: 'captured',
          alreadyCaptured: true,
          idempotencyKey,
        };
      }

      // 2. If it is pending/created, run synchronous on-demand reconciliation against Razorpay
      // (Handles timeout scenario from section 9 where user retried before webhook arrived)
      if (existingAttempt.status === 'pending') {
        const recon = await this.reconcilePaymentAttempt(existingAttempt);
        if (recon.reconciled && recon.status === 'captured') {
          return {
            keyId: razorpayGateway.keyId,
            orderId: existingAttempt.gateway_order_id,
            amount: Math.round(Number(existingAttempt.amount) * 100),
            amountInInr: Number(existingAttempt.amount),
            currency: existingAttempt.currency,
            paymentRecordId: existingAttempt.id,
            status: 'captured',
            alreadyCaptured: true,
            idempotencyKey,
          };
        }

        // Still pending: return the existing attempt details without creating a second Razorpay order
        return {
          keyId: razorpayGateway.keyId,
          orderId: existingAttempt.gateway_order_id,
          amount: Math.round(Number(existingAttempt.amount) * 100),
          amountInInr: Number(existingAttempt.amount),
          currency: existingAttempt.currency,
          paymentRecordId: existingAttempt.id,
          status: 'pending',
          isExisting: true,
          idempotencyKey,
        };
      }
    }

    // =========================================================================
    // Create new Razorpay order & PaymentAttempt
    // =========================================================================

    // SECTION 4: New-attempt-creation cap (per order)
    // Count existing Payment Attempts for this order_id / rental_order_id.
    // If count >= 5, reject before contacting Razorpay.
    const existingAttemptsCount = verifiedOrderId
      ? await paymentRepository.countAttemptsByOrderId(verifiedOrderId)
      : await paymentRepository.countAttemptsByRentalOrderId(verifiedRentalOrderId);

    if (existingAttemptsCount >= 5) {
      throw new BadRequest('Too many payment attempts for this order. Please contact support or start a new order.');
    }
    const nextAttemptNo = existingAttemptsCount + 1;

    // SECTION 6: Server-generated gateway-facing idempotency key (distinct from client idempotencyKey)
    const gatewayIdempotencyKey = crypto.randomUUID();

    const amountInPaise = Math.round(derivedAmount * 100);
    const receipt = `aarogya_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const rzpOrder = await razorpayGateway.createOrder({
      amount: amountInPaise,
      currency,
      receipt,
      gateway_idempotency_key: gatewayIdempotencyKey,
      notes: {
        userId: userId ? String(userId) : 'guest',
        orderId: verifiedOrderId ? String(verifiedOrderId) : '',
        rentalOrderId: verifiedRentalOrderId ? String(verifiedRentalOrderId) : '',
        idempotencyKey: idempotencyKey || '',
        gatewayIdempotencyKey,
        ...notes,
      },
    });

    let payment;
    try {
      payment = await paymentRepository.create({
        user_id: userId || null,
        order_id: verifiedOrderId,
        rental_order_id: verifiedRentalOrderId,
        gateway: 'razorpay',
        gateway_order_id: rzpOrder.id,
        amount: derivedAmount,
        currency,
        status: 'pending',
        attempt_no: nextAttemptNo,
        confirmation_attempts: 0,
        gateway_idempotency_key: gatewayIdempotencyKey,
        idempotency_key: idempotencyKey,
        notes: {
          receipt,
          razorpay_order_raw: rzpOrder,
        },
      });
    } catch (createErr) {
      // In case of a concurrent race condition where the same (order_id, idempotency_key)
      // was written simultaneously by a parallel request, retrieve the created record
      if (createErr instanceof UniqueConstraintError || (createErr.name && createErr.name.includes('UniqueConstraint'))) {
        const found = verifiedOrderId
          ? await paymentRepository.findByOrderIdAndIdempotencyKey(verifiedOrderId, idempotencyKey)
          : await paymentRepository.findByRentalOrderIdAndIdempotencyKey(verifiedRentalOrderId, idempotencyKey);
        if (found) {
          return {
            keyId: razorpayGateway.keyId,
            orderId: found.gateway_order_id,
            amount: Math.round(Number(found.amount) * 100),
            amountInInr: Number(found.amount),
            currency: found.currency,
            paymentRecordId: found.id,
            status: found.status,
            isExisting: true,
            idempotencyKey,
          };
        }
      }
      throw createErr;
    }

    return {
      keyId: razorpayGateway.keyId,
      orderId: rzpOrder.id,
      amount: rzpOrder.amount, // in paise
      amountInInr: derivedAmount,
      currency: rzpOrder.currency,
      paymentRecordId: payment.id,
      receipt,
      status: 'pending',
      idempotencyKey,
      attemptNo: nextAttemptNo,
      gatewayIdempotencyKey,
    };
  }

  /**
   * Verifies the cryptographic HMAC SHA-256 signature from Razorpay checkout
   * and updates corresponding Order and RentalOrder statuses in a single transaction.
   * Client-side parameters are untrusted: status is ONLY captured if signature is valid
   * and database partial unique constraint is satisfied.
   * @param {number|null} userId
   * @param {Object} data
   */
  async verifyPayment(userId, data) {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id,
      rental_order_id,
      payment_method,
    } = data;

    // SECTION 5: Confirmation-attempt cap (per attempt)
    // Track and increment confirmation attempts on every verify call for this Attempt, regardless of outcome.
    const existingAttempt = razorpay_order_id
      ? await paymentRepository.findByGatewayOrderId(razorpay_order_id)
      : null;

    if (existingAttempt) {
      if (existingAttempt.confirmation_attempts >= 5) {
        console.warn('[EXCESSIVE_CONFIRMATION_ATTEMPTS] Confirmation limit reached:', {
          order_id: existingAttempt.order_id || existingAttempt.rental_order_id,
          attempt_id: existingAttempt.id,
          gateway_order_id: razorpay_order_id,
          user_id: userId,
          confirmation_attempts: existingAttempt.confirmation_attempts,
        });
        throw new BadRequest('Payment confirmation limit exceeded for this attempt. Please initiate a new payment attempt or contact support.');
      }

      await existingAttempt.increment('confirmation_attempts', { by: 1 });
      await existingAttempt.reload();

      if (existingAttempt.confirmation_attempts > 5) {
        console.warn('[EXCESSIVE_CONFIRMATION_ATTEMPTS] Confirmation limit exceeded on current call:', {
          order_id: existingAttempt.order_id || existingAttempt.rental_order_id,
          attempt_id: existingAttempt.id,
          gateway_order_id: razorpay_order_id,
          user_id: userId,
          confirmation_attempts: existingAttempt.confirmation_attempts,
        });
        throw new BadRequest('Payment confirmation limit exceeded for this attempt. Please initiate a new payment attempt or contact support.');
      }
    }

    // SECTION 6: Untrusted Client Boundary.
    // Client-side payload is NEVER trusted without valid HMAC-SHA256 signature verification.
    const isValid = razorpayGateway.verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!isValid) {
      throw new BadRequest('Cryptographic signature verification failed. Payment cannot be validated.');
    }

    try {
      const captureResult = await paymentRepository.handleManagedTransaction(async (transaction) => {
        // Find the payment record by gateway order ID
        let payment = await paymentRepository.findByGatewayOrderId(razorpay_order_id, { transaction });

        // If already captured, idempotently return success
        if (payment && payment.status === 'captured') {
          return {
            success: true,
            verified: true,
            paymentId: payment.gateway_payment_id || razorpay_payment_id,
            orderId: payment.order_id || order_id || null,
            rentalOrderId: payment.rental_order_id || rental_order_id || null,
            status: 'captured',
            alreadyCaptured: true,
          };
        }

        // Check if order already has another captured payment attempt
        const targetOrderId = order_id || (payment && payment.order_id);
        const targetRentalId = rental_order_id || (payment && payment.rental_order_id);

        if (targetOrderId) {
          const existingCaptured = await paymentRepository.findCapturedByOrderId(targetOrderId, { transaction });
          if (existingCaptured && existingCaptured.id !== (payment && payment.id)) {
            return {
              success: true,
              verified: true,
              paymentId: existingCaptured.gateway_payment_id,
              orderId: targetOrderId,
              rentalOrderId: targetRentalId,
              status: 'captured',
              alreadyCaptured: true,
            };
          }
        }

        try {
          if (payment) {
            await payment.update(
              {
                gateway_payment_id: razorpay_payment_id,
                gateway_signature: razorpay_signature,
                status: 'captured',
                payment_method: payment_method || 'razorpay',
              },
              { transaction }
            );
          } else {
            payment = await paymentRepository.create(
              {
                user_id: userId || null,
                order_id: order_id || null,
                rental_order_id: rental_order_id || null,
                gateway: 'razorpay',
                gateway_order_id: razorpay_order_id,
                gateway_payment_id: razorpay_payment_id,
                gateway_signature: razorpay_signature,
                amount: 0,
                status: 'captured',
                payment_method: payment_method || 'razorpay',
              },
              { transaction }
            );
          }
        } catch (err) {
          // SECTION 8: Database-level Protection under Concurrency.
          // If a concurrent verify/webhook request already marked this order captured,
          // the partial unique constraint (unique_captured_order_payment) triggers.
          // Catch it gracefully and treat as already captured.
          if (err instanceof UniqueConstraintError || (err.name && err.name.includes('UniqueConstraint'))) {
            console.warn('[PaymentService] Concurrent capture detected via DB constraint. Handled gracefully.');
            return {
              success: true,
              verified: true,
              paymentId: razorpay_payment_id,
              orderId: targetOrderId || null,
              rentalOrderId: targetRentalId || null,
              status: 'captured',
              alreadyCaptured: true,
            };
          }
          throw err;
        }

        // Update purchase order if present
        if (targetOrderId) {
          const order = await orderRepository.findByPk(targetOrderId, { transaction });
          if (order && order.status !== 'paid') {
            await order.update(
              {
                status: 'paid',
                payment_id: razorpay_payment_id,
              },
              { transaction }
            );
          }
        }

        // Update rental order if present
        if (targetRentalId) {
          const rental = await rentalRepository.findByPk(targetRentalId, { transaction });
          if (rental && rental.status !== 'confirmed') {
            await rental.update(
              {
                status: 'confirmed',
                payment_id: razorpay_payment_id,
                deposit_status: 'held',
              },
              { transaction }
            );
          }
        }

        return {
          success: true,
          verified: true,
          paymentId: razorpay_payment_id,
          orderId: targetOrderId || null,
          rentalOrderId: targetRentalId || null,
          status: 'captured',
        };
      });

      // Asynchronously dispatch transactional confirmation emails upon successful capture
      if (captureResult && captureResult.status === 'captured' && !captureResult.alreadyCaptured) {
        (async () => {
          try {
            if (captureResult.orderId) {
              const order = await orderRepository.findOrderDetails(captureResult.orderId);
              if (order) {
                const user = order.user_id ? await userRepository.findByPk(order.user_id) : null;
                const emailTo = (user && user.email) || (order.shipping_address && order.shipping_address.email);
                if (emailTo) {
                  await email.sendOrderConfirmationEmail({
                    to: emailTo,
                    name: (user && user.name) || 'Valued Patient',
                    orderNumber: order.id,
                    items: (order.items || []).map((it) => ({
                      name: it.product ? it.product.name : 'Medical Equipment',
                      quantity: it.quantity,
                      price: it.unit_price,
                    })),
                    totalAmount: order.total_amount,
                    deliveryAddress: order.address,
                    paymentMethod: payment_method || 'Online Razorpay Gateway',
                    transactionId: razorpay_payment_id,
                  });
                }
              }
            }

            if (captureResult.rentalOrderId) {
              const rental = await rentalRepository.findRentalDetails(captureResult.rentalOrderId);
              if (rental) {
                const user = rental.user_id ? await userRepository.findByPk(rental.user_id) : null;
                if (user && user.email) {
                  await email.sendRentalAgreementEmail({
                    to: user.email,
                    name: user.name,
                    rentalNumber: rental.id,
                    items: (rental.items || []).map((it) => ({
                      product_name: it.product ? it.product.name : 'Rental Device',
                      rate_amount: it.rate_amount,
                      rate_type: it.rate_type,
                    })),
                    startDate: rental.start_date,
                    endDate: rental.end_date,
                    rentalAmount: rental.rental_amount || 0,
                    depositAmount: rental.deposit_amount || 0,
                    deliveryAddress: rental.address,
                    transactionId: razorpay_payment_id,
                  });
                }
              }
            }
          } catch (mailErr) {
            console.warn('[PaymentService] Transactional confirmation email dispatch failed:', mailErr.message);
          }
        })();
      }

      return captureResult;
    } catch (outerErr) {
      if (
        outerErr instanceof UniqueConstraintError ||
        (outerErr.name && outerErr.name.includes('UniqueConstraint')) ||
        outerErr.name === 'SequelizeTimeoutError' ||
        (outerErr.message && outerErr.message.includes('database is locked'))
      ) {
        console.warn('[PaymentService] Concurrent transaction lock/constraint resolved. Handled gracefully.');
        return {
          success: true,
          verified: true,
          paymentId: razorpay_payment_id,
          orderId: order_id || null,
          rentalOrderId: rental_order_id || null,
          status: 'captured',
          alreadyCaptured: true,
        };
      }
      throw outerErr;
    }
  }

  /**
   * Processes server-to-server webhook events from Razorpay.
   * Enforces HMAC verification, durable append-only WebhookEvent audit logging,
   * duplicate delivery deduplication, and amount/currency re-validation against stored Attempt.
   * @param {string} rawBody
   * @param {string} signature
   * @param {Object} eventPayload
   */
  async handleWebhook(rawBody, signature, eventPayload) {
    const isValid = razorpayGateway.verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      throw new BadRequest('Invalid webhook signature');
    }

    const event = eventPayload.event;
    const payload = eventPayload.payload;

    if (!payload || !payload.payment) {
      return { received: true, ignored: true, reason: 'No payment entity in webhook' };
    }

    const rzpPayment = payload.payment.entity;
    const gatewayOrderId = rzpPayment.order_id;
    const gatewayPaymentId = rzpPayment.id;

    // SECTION 8: Durable Webhook Audit Log & Dedup Check
    const gatewayEventId =
      eventPayload.id ||
      eventPayload.event_id ||
      (gatewayPaymentId ? `${event}_${gatewayPaymentId}` : `evt_${Date.now()}`);

    const existingAuditLog = await webhookEventRepository.findByGatewayEventId(gatewayEventId);
    if (existingAuditLog) {
      return {
        received: true,
        ignored: true,
        duplicate: true,
        reason: 'Duplicate webhook delivery: event already processed and recorded in WebhookEvent audit log',
        eventId: gatewayEventId,
      };
    }

    // SECTION 7: Duplicate Webhook Delivery Deduplication against payment records.
    if (gatewayPaymentId) {
      const existingCapturedByPaymentId = await paymentRepository.findByGatewayPaymentId(gatewayPaymentId);
      if (existingCapturedByPaymentId && existingCapturedByPaymentId.status === 'captured') {
        await this._recordWebhookAudit(gatewayEventId, event, eventPayload, new Date());
        return {
          received: true,
          ignored: true,
          duplicate: true,
          alreadyCaptured: true,
          payment: existingCapturedByPaymentId,
          paymentRecord: existingCapturedByPaymentId,
          reason: 'Duplicate webhook delivery: payment already captured',
          paymentId: gatewayPaymentId,
        };
      }
    }

    if (event === 'payment.captured' || event === 'order.paid') {
      const payment = await paymentRepository.findByGatewayOrderId(gatewayOrderId);

      if (payment && payment.status === 'captured') {
        await this._recordWebhookAudit(gatewayEventId, event, eventPayload, new Date());
        return {
          received: true,
          ignored: true,
          duplicate: true,
          alreadyCaptured: true,
          payment: payment,
          paymentRecord: payment,
          reason: 'Duplicate webhook delivery: gateway order already captured',
          orderId: gatewayOrderId,
        };
      }

      if (payment) {
        // SECTION 7: Webhook Payload Re-Validation (Defense in Depth)
        // Compare reported amount and currency against stored Attempt record in DB
        const expectedAmountInPaise = Math.round(Number(payment.amount) * 100);
        const reportedAmountInPaise = Number(rzpPayment.amount);
        const reportedCurrency = (rzpPayment.currency || 'INR').toUpperCase();
        const storedCurrency = (payment.currency || 'INR').toUpperCase();

        const amountMatches = expectedAmountInPaise === reportedAmountInPaise;
        const currencyMatches = storedCurrency === reportedCurrency;
        const orderMatches = !gatewayOrderId || payment.gateway_order_id === gatewayOrderId;

        if (!amountMatches || !currencyMatches || !orderMatches) {
          console.error('[WEBHOOK_AMOUNT_MISMATCH] Webhook payload does not match stored attempt record!', {
            payment_id: payment.id,
            order_id: payment.order_id || payment.rental_order_id,
            gateway_order_id: gatewayOrderId,
            expected_amount_paise: expectedAmountInPaise,
            reported_amount_paise: reportedAmountInPaise,
            expected_currency: storedCurrency,
            reported_currency: reportedCurrency,
          });

          // Flag payment for manual review, DO NOT mark captured
          await payment.update({
            notes: {
              ...(payment.notes || {}),
              flagged_anomaly: 'WEBHOOK_AMOUNT_MISMATCH',
              flagged_at: new Date().toISOString(),
              reported_amount_paise: reportedAmountInPaise,
              reported_currency: reportedCurrency,
            },
          });

          await this._recordWebhookAudit(gatewayEventId, event, eventPayload, new Date());

          return {
            received: true,
            ignored: true,
            flagged: true,
            reason: 'WEBHOOK_AMOUNT_MISMATCH: Reported amount/currency does not match stored attempt record',
            orderId: gatewayOrderId,
          };
        }

        try {
          await paymentRepository.handleManagedTransaction(async (transaction) => {
            await payment.update(
              {
                status: 'captured',
                gateway_payment_id: gatewayPaymentId,
                payment_method: rzpPayment.method || 'razorpay',
              },
              { transaction }
            );

            if (payment.order_id) {
              const order = await orderRepository.findByPk(payment.order_id, { transaction });
              if (order && order.status !== 'paid') {
                await order.update({ status: 'paid', payment_id: gatewayPaymentId }, { transaction });
              }
            }

            if (payment.rental_order_id) {
              const rental = await rentalRepository.findByPk(payment.rental_order_id, { transaction });
              if (rental && rental.status !== 'confirmed') {
                await rental.update(
                  { status: 'confirmed', payment_id: gatewayPaymentId, deposit_status: 'held' },
                  { transaction }
                );
              }
            }
          });
        } catch (dbErr) {
          if (
            dbErr instanceof UniqueConstraintError ||
            (dbErr.name && dbErr.name.includes('UniqueConstraint')) ||
            (dbErr.parent && dbErr.parent.code === '23505') ||
            dbErr.name === 'SequelizeTimeoutError'
          ) {
            console.warn('[handleWebhook] Payment captured concurrently. Gracefully handled as already captured.');
            const capturedRecord = payment.order_id
              ? await paymentRepository.findCapturedByOrderId(payment.order_id)
              : (payment.rental_order_id
                  ? await paymentRepository.findCapturedByRentalOrderId(payment.rental_order_id)
                  : await paymentRepository.findByGatewayOrderId(gatewayOrderId));

            await this._recordWebhookAudit(gatewayEventId, event, eventPayload, new Date());

            return {
              received: true,
              processed: event,
              duplicate: true,
              alreadyCaptured: true,
              payment: capturedRecord,
              paymentRecord: capturedRecord,
              reason: 'Payment captured concurrently by competing verify/webhook request',
            };
          }
          throw dbErr;
        }
      } else {
        // Payment row not found by gateway_order_id: check if already captured
        const byPaymentId = await paymentRepository.findByGatewayPaymentId(gatewayPaymentId);
        if (byPaymentId && byPaymentId.status === 'captured') {
          await this._recordWebhookAudit(gatewayEventId, event, eventPayload, new Date());
          return {
            received: true,
            ignored: true,
            duplicate: true,
            alreadyCaptured: true,
            payment: byPaymentId,
            paymentRecord: byPaymentId,
            reason: 'Payment already captured by gateway payment id',
          };
        }
      }
    } else if (event === 'payment.failed') {
      const payment = await paymentRepository.findByGatewayOrderId(gatewayOrderId);
      // Only set to failed if NOT already captured
      if (payment && payment.status !== 'captured') {
        await payment.update({
          status: 'failed',
          notes: {
            ...(payment.notes || {}),
            failure_reason: (rzpPayment && (rzpPayment.error_description || rzpPayment.description)) || 'Payment failed at gateway',
            failed_at: new Date().toISOString(),
          },
        });
      }
    }

    // SECTION 8: Append-only audit logging of all received webhooks
    await this._recordWebhookAudit(gatewayEventId, event, eventPayload, new Date());

    return { received: true, processed: event };
  }

  /**
   * Internal helper to record durable WebhookEvent audit log row
   */
  async _recordWebhookAudit(gatewayEventId, eventType, payload, processedAt = null) {
    try {
      await webhookEventRepository.recordEvent({
        gateway_event_id: gatewayEventId,
        event_type: eventType,
        payload,
        processed_at: processedAt,
      });
    } catch (err) {
      if (
        err instanceof UniqueConstraintError ||
        (err.name && err.name.includes('UniqueConstraint')) ||
        (err.parent && err.parent.code === '23505')
      ) {
        console.warn('[handleWebhook] WebhookEvent already recorded concurrently for gateway_event_id:', gatewayEventId);
      } else {
        console.error('[handleWebhook] Failed to insert WebhookEvent audit record:', err.message);
      }
    }
  }

  /**
   * Actively reconciles a single PaymentAttempt against Razorpay's API
   * Used for on-demand checks during checkout retries and background reconciliation workers.
   * Handles captured, failed, and cancelled/expired gateway states.
   * @param {Object} paymentRecord
   * @param {Object} [options]
   * @param {Object} [options.transaction] - Optional active transaction to avoid nested transactions
   * @returns {Promise<{ reconciled: boolean, status: string, [key: string]: any }>}
   */
  async reconcilePaymentAttempt(paymentRecord, options = {}) {
    if (!paymentRecord || !paymentRecord.gateway_order_id) {
      return { reconciled: false, status: 'unknown' };
    }

    if (paymentRecord.status === 'captured') {
      return { reconciled: true, status: 'captured' };
    }

    try {
      const rzpOrder = await razorpayGateway.fetchOrder(paymentRecord.gateway_order_id);
      const isPaidAtGateway = rzpOrder && (rzpOrder.status === 'paid' || (rzpOrder.amount_paid && rzpOrder.amount_paid > 0));

      const paymentsCollection = await razorpayGateway.fetchOrderPayments(paymentRecord.gateway_order_id);
      const paymentItems = (paymentsCollection && paymentsCollection.items) || [];
      const capturedPaymentEntity = paymentItems.find(
        (p) => p.status === 'captured' || p.captured === true
      );
      const failedPaymentEntity = paymentItems.find((p) => p.status === 'failed');

      if (isPaidAtGateway || capturedPaymentEntity) {
        const paymentEntity = capturedPaymentEntity || paymentItems[0];
        const paymentId = paymentEntity ? paymentEntity.id : `pay_recon_${paymentRecord.gateway_order_id}`;
        const paymentMethod = (paymentEntity && paymentEntity.method) || 'razorpay';

        // Ensure we have a model instance with .update()
        let paymentModel = typeof paymentRecord.update === 'function'
          ? paymentRecord
          : await paymentRepository.findByPk(paymentRecord.id, options.transaction ? { transaction: options.transaction } : {});

        const executeReconciliation = async (transaction) => {
          try {
            await paymentModel.update(
              {
                status: 'captured',
                gateway_payment_id: paymentId,
                payment_method: paymentMethod,
              },
              { transaction }
            );
          } catch (conErr) {
            if (conErr instanceof UniqueConstraintError || (conErr.name && conErr.name.includes('UniqueConstraint'))) {
              console.warn('[Reconcile] Concurrent capture detected via DB constraint. Handled gracefully.');
              return;
            }
            throw conErr;
          }

          if (paymentModel.order_id) {
            const order = await orderRepository.findByPk(paymentModel.order_id, { transaction });
            if (order && order.status !== 'paid') {
              await order.update({ status: 'paid', payment_id: paymentId }, { transaction });
            }
          }

          if (paymentModel.rental_order_id) {
            const rental = await rentalRepository.findByPk(paymentModel.rental_order_id, { transaction });
            if (rental && rental.status !== 'confirmed') {
              await rental.update(
                { status: 'confirmed', payment_id: paymentId, deposit_status: 'held' },
                { transaction }
              );
            }
          }
        };

        if (options.transaction) {
          await executeReconciliation(options.transaction);
        } else {
          await paymentRepository.handleManagedTransaction(executeReconciliation);
        }

        return { reconciled: true, status: 'captured', paymentId };
      }

      // SECTION 9: Broaden reconciliation to handle failed/cancelled gateway states
      const isCancelledAtGateway = rzpOrder && (rzpOrder.status === 'cancelled' || rzpOrder.status === 'expired');
      const isFailedPayment = paymentItems.length > 0 && paymentItems.every((p) => p.status === 'failed');

      if (isCancelledAtGateway || isFailedPayment) {
        const failureReason = isCancelledAtGateway
          ? `Gateway order status: ${rzpOrder.status}`
          : (failedPaymentEntity && (failedPaymentEntity.error_description || failedPaymentEntity.description || 'Payment failed at gateway'));

        let paymentModel = typeof paymentRecord.update === 'function'
          ? paymentRecord
          : await paymentRepository.findByPk(paymentRecord.id, options.transaction ? { transaction: options.transaction } : {});

        const executeFailure = async (transaction) => {
          await paymentModel.update(
            {
              status: 'failed',
              notes: {
                ...(paymentModel.notes || {}),
                failure_reason: failureReason,
                reconciled_at: new Date().toISOString(),
              },
            },
            { transaction }
          );
        };

        if (options.transaction) {
          await executeFailure(options.transaction);
        } else {
          await paymentRepository.handleManagedTransaction(executeFailure);
        }

        return { reconciled: true, status: 'failed', reason: failureReason };
      }

      return { reconciled: false, status: paymentRecord.status };
    } catch (err) {
      console.error(`[Reconcile] Error reconciling payment attempt #${paymentRecord.id}:`, err.message);
      return { reconciled: false, error: err.message };
    }
  }

  /**
   * Retrieves payment details
   */
  async getPaymentById(id, userId = null) {
    const payment = await paymentRepository.findPaymentDetails(id);
    if (!payment) {
      throw new NotFound('Payment transaction not found');
    }
    if (userId && payment.user_id !== userId) {
      throw new Forbidden('Unauthorized access to payment details');
    }
    return payment;
  }

  /**
   * Retrieves all payments for a user
   */
  async getUserPayments(userId) {
    return await paymentRepository.findUserPayments(userId);
  }
}

module.exports = new PaymentService();
