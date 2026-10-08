'use strict';

const crypto = require('crypto');
const { paymentRepository, orderRepository, rentalRepository, webhookEventRepository, userRepository } = require('../repository');
const { razorpayGateway, email } = require('../libs');
const { adminNotificationEventBus } = require('../libs/notification');
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
    const idempotencyKey = data.idempotency_key || data.idempotencyKey || crypto.randomUUID();

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
      orderInstance = await orderRepository.findOrderDetails(orderId);
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
      throw new BadRequest('Maximum payment attempt limit reached for this order. Please contact support or start a new order.');
    }
    const nextAttemptNo = existingAttemptsCount + 1;

    // SECTION 6: Server-generated gateway-facing idempotency key (distinct from client idempotencyKey)
    const gatewayIdempotencyKey = crypto.randomUUID();

    const amountInPaise = Math.round(derivedAmount * 100);
    const deterministicReceipt = gatewayIdempotencyKey.substring(0, 40);

    const rzpOrder = await razorpayGateway.createOrder({
      amount: amountInPaise,
      currency,
      receipt: deterministicReceipt,
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
          receipt: deterministicReceipt,
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
      receipt: deterministicReceipt,
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

    // 1. Locate existing Payment Attempt record
    const existingAttempt = razorpay_order_id
      ? await paymentRepository.findByGatewayOrderId(razorpay_order_id)
      : null;

    if (!existingAttempt) {
      throw new NotFound('Payment attempt record not found for this gateway order');
    }

    // 2. Validate ownership if user is authenticated
    if (existingAttempt.user_id && userId && existingAttempt.user_id !== userId) {
      throw new Forbidden('Unauthorized access to specified payment attempt');
    }

    // 3. Validate gateway order ID matches
    if (existingAttempt.gateway_order_id !== razorpay_order_id) {
      throw new BadRequest('Gateway order ID does not match the payment attempt');
    }

    // 4. Enforce Confirmation-Attempt Cap (max 5 per attempt)
    if (existingAttempt.confirmation_attempts >= 5) {
      console.warn('[EXCESSIVE_CONFIRMATION_ATTEMPTS] Confirmation limit reached:', {
        order_id: existingAttempt.order_id || existingAttempt.rental_order_id,
        attempt_id: existingAttempt.id,
        gateway_order_id: razorpay_order_id,
        user_id: userId,
        confirmation_attempts: existingAttempt.confirmation_attempts,
      });
      throw new BadRequest('Maximum confirmation attempt limit reached for this attempt. Please initiate a new payment attempt or contact support.');
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
      throw new BadRequest('Maximum confirmation attempt limit reached for this attempt. Please initiate a new payment attempt or contact support.');
    }

    // 5. Cryptographic HMAC SHA-256 Signature Verification
    const isValid = razorpayGateway.verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!isValid) {
      throw new BadRequest('Cryptographic signature verification failed. Payment cannot be validated.');
    }

    // 6. Record browser callback receipt metadata & gateway payment ID
    await existingAttempt.update({
      gateway_payment_id: existingAttempt.gateway_payment_id || razorpay_payment_id,
      payment_method: payment_method || existingAttempt.payment_method || 'razorpay',
      notes: {
        ...(existingAttempt.notes || {}),
        browser_callback_received: true,
        browser_callback_at: new Date().toISOString(),
        browser_payment_id: razorpay_payment_id,
        payment_method: payment_method || 'razorpay',
      },
    });

    // 7. Authoritatively capture payment and finalize order status (Salon-style instant confirmation)
    if (existingAttempt.status !== 'captured') {
      await this.finalizeCapturedPayment({
        paymentRecord: existingAttempt,
        gatewayPaymentId: razorpay_payment_id,
        gatewayOrderId: razorpay_order_id,
        paymentMethod: payment_method || 'razorpay',
        source: 'verify_callback',
      });
      await existingAttempt.reload();
    }

    return {
      success: true,
      status: 'captured',
      paymentId: existingAttempt.gateway_payment_id || razorpay_payment_id,
      orderId: existingAttempt.order_id || order_id || null,
      rentalOrderId: existingAttempt.rental_order_id || rental_order_id || null,
      message: 'Payment verified and captured successfully',
    };
  }

  /**
   * Single Authoritative Finalization Function.
   * This is the ONLY application-level function permitted to perform the state transitions:
   *   payment.status: pending -> captured
   *   order.status: pending -> paid
   *   rental.status: pending -> confirmed (deposit_status: held)
   *
   * Both POST /webhook and PaymentReconciliationWorker must invoke this exact function.
   *
   * @param {Object} params
   * @param {Object|number} params.paymentRecord - Payment model instance or id
   * @param {string} params.gatewayPaymentId - Razorpay payment ID (pay_xxx)
   * @param {string} params.gatewayOrderId - Razorpay order ID (order_xxx)
   * @param {number} [params.amountInPaise] - Gateway captured amount in paise
   * @param {string} [params.currency] - Gateway currency (e.g. 'INR')
   * @param {string} [params.paymentMethod] - Gateway payment method (e.g. 'upi', 'card')
   * @param {string} params.source - Authoritative source ('webhook' | 'reconciliation')
   * @param {Object} [params.options] - Optional options with transaction
   * @returns {Promise<{ finalized: boolean, alreadyCaptured: boolean, mismatch?: boolean, reason?: string, payment: Object }>}
   */
  async finalizeCapturedPayment({
    paymentId,
    paymentRecord,
    gatewayPayment,
    gatewayPaymentId,
    gatewayOrderId,
    amountInPaise,
    currency,
    paymentMethod,
    source,
    triggerSource,
    options = {},
  }) {
    const targetPaymentId = paymentId || (paymentRecord && typeof paymentRecord === 'object' ? paymentRecord.id : paymentRecord);
    const effectiveGatewayPaymentId = gatewayPaymentId || (gatewayPayment && gatewayPayment.id);
    const effectiveGatewayOrderId = gatewayOrderId || (gatewayPayment && gatewayPayment.order_id);
    const effectiveAmountInPaise = amountInPaise !== undefined && amountInPaise !== null
      ? Number(amountInPaise)
      : (gatewayPayment && gatewayPayment.amount !== undefined ? Number(gatewayPayment.amount) : undefined);
    const effectiveCurrency = (currency || (gatewayPayment && gatewayPayment.currency) || 'INR').toUpperCase();
    const effectivePaymentMethod = paymentMethod || (gatewayPayment && (gatewayPayment.method || gatewayPayment.payment_method)) || 'razorpay';
    const effectiveSource = source || triggerSource || 'webhook';

    const executeInTransaction = async (transaction) => {
      // 1. Lock payment record for update to prevent concurrent double-processing
      const lockedPayment = await paymentRepository.lockForUpdate(targetPaymentId, { transaction });
      if (!lockedPayment) {
        throw new NotFound(`Payment record #${targetPaymentId} not found for finalization`);
      }

      // 2. Check if already captured
      if (lockedPayment.status === 'captured') {
        return {
          finalized: false,
          alreadyCaptured: true,
          payment: lockedPayment,
        };
      }

      // 3. Independent Payload Validation against stored database invariants
      const expectedAmountInPaise = Math.round(Number(lockedPayment.amount) * 100);
      const reportedAmountInPaise = effectiveAmountInPaise !== undefined ? effectiveAmountInPaise : expectedAmountInPaise;
      const storedCurrency = (lockedPayment.currency || 'INR').toUpperCase();

      const amountMatches = expectedAmountInPaise === reportedAmountInPaise;
      const currencyMatches = storedCurrency === effectiveCurrency;
      const orderMatches = !effectiveGatewayOrderId || lockedPayment.gateway_order_id === effectiveGatewayOrderId;

      if (!amountMatches || !currencyMatches || !orderMatches) {
        const mismatchReason = !amountMatches
          ? 'AMOUNT_MISMATCH'
          : (!currencyMatches ? 'CURRENCY_MISMATCH' : 'ORDER_ID_MISMATCH');

        console.error(`[AUTHORITATIVE_PAYMENT_MISMATCH] Source: ${effectiveSource}. Invariant check failed:`, {
          payment_id: lockedPayment.id,
          expected_amount_paise: expectedAmountInPaise,
          reported_amount_paise: reportedAmountInPaise,
          expected_currency: storedCurrency,
          reported_currency: effectiveCurrency,
          expected_gateway_order_id: lockedPayment.gateway_order_id,
          reported_gateway_order_id: effectiveGatewayOrderId,
          mismatchReason,
        });

        await lockedPayment.update(
          {
            notes: {
              ...(lockedPayment.notes || {}),
              flagged_anomaly: `WEBHOOK_${mismatchReason}`,
              flagged_at: new Date().toISOString(),
              reported_amount_paise: reportedAmountInPaise,
              reported_currency: effectiveCurrency,
              finalization_source: effectiveSource,
            },
          },
          { transaction }
        );

        return {
          finalized: false,
          alreadyCaptured: false,
          mismatch: true,
          reason: `WEBHOOK_${mismatchReason}`,
          payment: lockedPayment,
        };
      }

      // 4. Atomic state transition
      try {
        await lockedPayment.update(
          {
            status: 'captured',
            gateway_payment_id: effectiveGatewayPaymentId,
            payment_method: effectivePaymentMethod,
            notes: {
              ...(lockedPayment.notes || {}),
              finalized_at: new Date().toISOString(),
              finalized_by: effectiveSource,
            },
          },
          { transaction }
        );

        let isCancelledOrder = false;
        if (lockedPayment.order_id) {
          const order = await orderRepository.findByPk(lockedPayment.order_id, {
            transaction,
            lock: transaction.LOCK ? transaction.LOCK.UPDATE : true,
          });
          if (order) {
            if (order.status === 'cancelled') {
              isCancelledOrder = true;
            } else if (order.status !== 'paid') {
              await order.update(
                { status: 'paid', payment_id: effectiveGatewayPaymentId },
                { transaction }
              );
            }
          }
        }

        if (lockedPayment.rental_order_id) {
          const rental = await rentalRepository.findByPk(lockedPayment.rental_order_id, {
            transaction,
            lock: transaction.LOCK ? transaction.LOCK.UPDATE : true,
          });
          if (rental) {
            if (rental.status === 'cancelled') {
              isCancelledOrder = true;
            } else if (rental.status !== 'confirmed') {
              await rental.update(
                { status: 'confirmed', payment_id: effectiveGatewayPaymentId, deposit_status: 'held' },
                { transaction }
              );
            }
          }
        }

        if (isCancelledOrder) {
          await lockedPayment.update(
            {
              notes: {
                ...(lockedPayment.notes || {}),
                flagged_anomaly: 'LATE_PAYMENT_ON_CANCELLED_ORDER',
                requires_manual_review_or_refund: true,
                finalized_at: new Date().toISOString(),
                finalized_by: effectiveSource,
              },
            },
            { transaction }
          );

          return {
            finalized: false,
            alreadyCaptured: false,
            latePaymentCancelled: true,
            payment: lockedPayment,
          };
        }

        return {
          finalized: true,
          alreadyCaptured: false,
          payment: lockedPayment,
        };
      } catch (err) {
        if (
          err instanceof UniqueConstraintError ||
          (err.name && err.name.includes('UniqueConstraint')) ||
          (err.parent && err.parent.code === '23505')
        ) {
          console.warn('[finalizeCapturedPayment] Concurrent capture collision caught via DB partial unique index.');
          return {
            finalized: false,
            alreadyCaptured: true,
            payment: lockedPayment,
          };
        }
        throw err;
      }
    };

    let result;
    if (options.transaction) {
      result = await executeInTransaction(options.transaction);
    } else {
      result = await paymentRepository.handleManagedTransaction(executeInTransaction);
    }

    // 5. Post-Commit Fulfillment & Notifications (executed ONLY once upon genuine authoritative finalization)
    if (result.finalized) {
      const p = result.payment;
      if (p.order_id) {
        adminNotificationEventBus.emitAsync('transaction.purchase.successful', {
          orderId: p.order_id,
          paymentId: effectiveGatewayPaymentId,
          paymentMethod: effectivePaymentMethod,
        });

        (async () => {
          try {
            const order = await orderRepository.findOrderDetailsById(p.order_id);
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
                  paymentMethod: effectivePaymentMethod || 'Online Razorpay Gateway',
                  transactionId: effectiveGatewayPaymentId,
                });
              }
            }
          } catch (mailErr) {
            console.error('[finalizeCapturedPayment] Order confirmation email dispatch failed:', mailErr.message);
          }
        })();
      }

      if (p.rental_order_id) {
        adminNotificationEventBus.emitAsync('transaction.rental.successful', {
          rentalId: p.rental_order_id,
          paymentId: effectiveGatewayPaymentId,
          paymentMethod: effectivePaymentMethod,
        });
      }
    }

    return result;
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
      (gatewayPaymentId ? `${event}_${gatewayPaymentId}` : `evt_${crypto.randomUUID()}`);

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
      let payment = await paymentRepository.findByGatewayOrderId(gatewayOrderId);
      if (!payment && gatewayPaymentId) {
        payment = await paymentRepository.findByGatewayPaymentId(gatewayPaymentId);
      }

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
        // Authoritative single-point capture transition
        const finalizationResult = await this.finalizeCapturedPayment({
          paymentRecord: payment,
          gatewayPayment: rzpPayment,
          triggerSource: 'webhook',
        });

        await this._recordWebhookAudit(gatewayEventId, event, eventPayload, new Date());

        if (finalizationResult.mismatch) {
          return {
            received: true,
            ignored: true,
            flagged: true,
            reason: finalizationResult.reason,
            orderId: gatewayOrderId,
            paymentId: gatewayPaymentId,
          };
        }

        return {
          received: true,
          processed: event,
          finalized: finalizationResult.finalized,
          alreadyCaptured: finalizationResult.alreadyCaptured,
          payment: finalizationResult.payment,
          paymentRecord: finalizationResult.payment,
        };
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
      let payment = await paymentRepository.findByGatewayOrderId(gatewayOrderId);
      if (!payment && gatewayPaymentId) {
        payment = await paymentRepository.findByGatewayPaymentId(gatewayPaymentId);
      }
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
      return { reconciled: true, status: 'captured', alreadyCaptured: true };
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
        const paymentEntity = capturedPaymentEntity || paymentItems[0] || {
          id: `pay_recon_${paymentRecord.gateway_order_id}`,
          order_id: paymentRecord.gateway_order_id,
          amount: Math.round(Number(paymentRecord.amount) * 100),
          currency: paymentRecord.currency || 'INR',
          method: 'razorpay',
        };

        const finalizationResult = await this.finalizeCapturedPayment({
          paymentRecord,
          gatewayPayment: paymentEntity,
          source: 'reconciliation',
          options: options.transaction ? { transaction: options.transaction } : {},
        });

        if (finalizationResult.mismatch) {
          return {
            reconciled: false,
            mismatch: true,
            status: paymentRecord.status,
            reason: finalizationResult.reason,
          };
        }

        return {
          reconciled: true,
          status: 'captured',
          alreadyCaptured: finalizationResult.alreadyCaptured,
          latePaymentCancelled: !!finalizationResult.latePaymentCancelled,
          paymentId: finalizationResult.payment ? finalizationResult.payment.gateway_payment_id : paymentEntity.id,
          payment: finalizationResult.payment,
        };
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
          if (paymentModel.status !== 'captured') {
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
          }
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
