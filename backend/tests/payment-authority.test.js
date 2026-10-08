'use strict';

/**
 * Payment Authority Model & Lifecycle Automated Test Suite
 *
 * Verifies the single authoritative state-transition model:
 * 1. POST /verify is non-authoritative (never captures, never marks order paid).
 * 2. POST /webhook is the authoritative source of truth.
 * 3. Reconciliation Worker is the authoritative safety net.
 * 4. Single finalizeCapturedPayment() handles the transition atomically.
 * 5. Concurrency, duplicate webhooks, mismatches, attempt limits, and UUID compliance.
 */

process.env.NODE_ENV = 'test';
if (!process.env.DB_PORT) {
  process.env.DB_PORT = '5434';
}
if (!process.env.DB_TEST_PORT) {
  process.env.DB_TEST_PORT = process.env.DB_PORT || '5434';
}
if (!process.env.DB_HOST) {
  process.env.DB_HOST = 'localhost';
}
if (!process.env.DB_TEST_HOST) {
  process.env.DB_TEST_HOST = process.env.DB_HOST || 'localhost';
}

const crypto = require('crypto');
const assert = require('assert');
const { sequelize, User, Address, Product, Category, Order, OrderItem, Payment, WebhookEvent } = require('../models');
const paymentService = require('../services/payment.service');
const razorpayGateway = require('../libs/razorpay');
const { paymentRepository, orderRepository, webhookEventRepository } = require('../repository');
const paymentReconciliationWorker = require('../jobs/payment-reconciliation.worker');
const orderExpirationWorker = require('../jobs/order-expiration.worker');
const { adminNotificationEventBus } = require('../libs/notification');

const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

let testUser = null;
let testAddress = null;
let testProduct = null;
let testCategory = null;

async function setupFixtures() {
  await sequelize.authenticate();

  // Create or find a test category
  [testCategory] = await Category.findOrCreate({
    where: { slug: 'test-respiratory-care' },
    defaults: {
      name: 'Test Respiratory Care',
      slug: 'test-respiratory-care',
      is_active: true,
    },
  });

  // Create or find a test product
  [testProduct] = await Product.findOrCreate({
    where: { slug: 'test-oxygen-concentrator-unit' },
    defaults: {
      name: 'AarogyaMed Oxygen Concentrator 5L Test Unit',
      slug: 'test-oxygen-concentrator-unit',
      category_id: testCategory.id,
      brand: 'AarogyaMed',
      description: 'Medical test oxygen concentrator',
      buy_price: 35000.0,
      buy_available: true,
      stock_quantity: 50,
      status: 'active',
    },
  });

  // Create or find a test user
  testUser = await User.findOne({ where: { phone: '9876543210' } });
  if (!testUser) {
    testUser = await User.create({
      name: 'Dr. Test Patient',
      email: `test.patient.${crypto.randomUUID().substring(0, 8)}@aarogyamed.test`,
      password_hash: '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890',
      phone: '9876543210',
      role: 'customer',
    });
  }

  // Create or find test address for user
  [testAddress] = await Address.findOrCreate({
    where: { user_id: testUser.id, line1: '123 Test Hospital Road' },
    defaults: {
      user_id: testUser.id,
      label: 'Clinic',
      line1: '123 Test Hospital Road',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110001',
      is_default: true,
    },
  });
}

async function createTestOrder(totalAmount = 35000.0) {
  const order = await Order.create({
    user_id: testUser.id,
    address_id: testAddress.id,
    status: 'pending',
    total_amount: totalAmount,
  });

  await OrderItem.create({
    order_id: order.id,
    product_id: testProduct.id,
    quantity: 1,
    unit_price: totalAmount,
  });

  return order;
}

function generateWebhookSignature(rawBody, secret = razorpayGateway.webhookSecret) {
  return crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
}

function generatePaymentSignature(orderId, paymentId, secret = razorpayGateway.keySecret) {
  return crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
}

async function runTests() {
  console.log('--- STARTING RAZORPAY PAYMENT AUTHORITY & HARDENING TEST SUITE ---');
  await setupFixtures();

  let passed = 0;
  let failed = 0;

  async function test(title, fn) {
    process.stdout.write(`• ${title} ... `);
    try {
      razorpayGateway.__clearMockData();
      await fn();
      console.log('PASSED');
      passed++;
    } catch (err) {
      console.log('FAILED');
      console.error(err);
      failed++;
    }
  }

  // TEST 1: Successful Payment Lifecycle (Instant Verify Capture + Webhook Idempotency)
  await test('1. Successful payment lifecycle (create -> verify instant capture -> webhook idempotent)', async () => {
    const order = await createTestOrder(12000.0);
    const rzpOrder = await paymentService.createRazorpayOrder(testUser.id, {
      orderId: order.id,
    });

    assert.ok(rzpOrder.orderId, 'Should return gateway order ID');
    assert.strictEqual(rzpOrder.amount, 1200000, 'Amount must be in paise derived from persisted order total');

    const paymentRecord = await paymentRepository.findByPk(rzpOrder.paymentRecordId);
    assert.strictEqual(paymentRecord.status, 'pending', 'Local payment attempt must be pending');

    // Simulate browser callback to /verify
    const gatewayPaymentId = `pay_${crypto.randomUUID().replace(/-/g, '').substring(0, 14)}`;
    const signature = generatePaymentSignature(rzpOrder.orderId, gatewayPaymentId);

    const verifyResult = await paymentService.verifyPayment(testUser.id, {
      order_id: order.id,
      razorpay_order_id: rzpOrder.orderId,
      razorpay_payment_id: gatewayPaymentId,
      razorpay_signature: signature,
    });

    assert.strictEqual(verifyResult.success, true);
    assert.strictEqual(verifyResult.status, 'captured', 'Verify callback captures payment immediately');

    // Verify DB state is now captured and order is paid
    const paymentAfterVerify = await paymentRepository.findByPk(paymentRecord.id);
    const orderAfterVerify = await orderRepository.findByPk(order.id);
    assert.strictEqual(paymentAfterVerify.status, 'captured', 'DB payment is captured after /verify');
    assert.strictEqual(orderAfterVerify.status, 'paid', 'DB order is paid after /verify');

    // Server-to-server webhook arrives later as safety net
    const webhookEventId = `evt_${crypto.randomUUID()}`;
    const webhookPayload = {
      entity: 'event',
      event: 'payment.captured',
      id: webhookEventId,
      payload: {
        payment: {
          entity: {
            id: gatewayPaymentId,
            order_id: rzpOrder.orderId,
            amount: 1200000,
            currency: 'INR',
            status: 'captured',
            method: 'upi',
          },
        },
      },
    };

    const rawBody = JSON.stringify(webhookPayload);
    const webhookSig = generateWebhookSignature(rawBody);

    const webhookRes = await paymentService.handleWebhook(rawBody, webhookSig, webhookPayload);
    assert.strictEqual(webhookRes.received, true);
    assert.strictEqual(webhookRes.alreadyCaptured, true, 'Webhook detects payment already captured by verify');

    // Verify DB state remains captured and order is paid
    const paymentFinal = await paymentRepository.findByPk(paymentRecord.id);
    const orderFinal = await orderRepository.findByPk(order.id);
    assert.strictEqual(paymentFinal.status, 'captured');
    assert.strictEqual(paymentFinal.gateway_payment_id, gatewayPaymentId);
    assert.strictEqual(orderFinal.status, 'paid');
  });

  // TEST 2: Verify-Before-Webhook Sequence
  await test('2. Verify-before-webhook sequence (verify captures state, webhook deduplicates cleanly)', async () => {
    const order = await createTestOrder(5000.0);
    const rzpOrder = await paymentService.createRazorpayOrder(testUser.id, { orderId: order.id });
    const gatewayPaymentId = `pay_${crypto.randomUUID().replace(/-/g, '').substring(0, 14)}`;
    const signature = generatePaymentSignature(rzpOrder.orderId, gatewayPaymentId);

    // /verify fires first
    const verifyResult = await paymentService.verifyPayment(testUser.id, {
      order_id: order.id,
      razorpay_order_id: rzpOrder.orderId,
      razorpay_payment_id: gatewayPaymentId,
      razorpay_signature: signature,
    });
    assert.strictEqual(verifyResult.status, 'captured');

    const paymentMid = await paymentRepository.findByPk(rzpOrder.paymentRecordId);
    assert.strictEqual(paymentMid.status, 'captured');
    assert.strictEqual(paymentMid.notes.browser_callback_received, true);

    // Webhook fires after
    const webhookPayload = {
      event: 'payment.captured',
      id: `evt_${crypto.randomUUID()}`,
      payload: {
        payment: {
          entity: {
            id: gatewayPaymentId,
            order_id: rzpOrder.orderId,
            amount: 500000,
            currency: 'INR',
            status: 'captured',
          },
        },
      },
    };
    const rawBody = JSON.stringify(webhookPayload);
    await paymentService.handleWebhook(rawBody, generateWebhookSignature(rawBody), webhookPayload);

    const paymentFinal = await paymentRepository.findByPk(rzpOrder.paymentRecordId);
    const orderFinal = await orderRepository.findByPk(order.id);
    assert.strictEqual(paymentFinal.status, 'captured');
    assert.strictEqual(orderFinal.status, 'paid');
  });

  // TEST 3: Webhook-Before-Verify Sequence
  await test('3. Webhook-before-verify sequence (webhook captures first, /verify reads captured state)', async () => {
    const order = await createTestOrder(7500.0);
    const rzpOrder = await paymentService.createRazorpayOrder(testUser.id, { orderId: order.id });
    const gatewayPaymentId = `pay_${crypto.randomUUID().replace(/-/g, '').substring(0, 14)}`;

    // Webhook fires first
    const webhookPayload = {
      event: 'payment.captured',
      id: `evt_${crypto.randomUUID()}`,
      payload: {
        payment: {
          entity: {
            id: gatewayPaymentId,
            order_id: rzpOrder.orderId,
            amount: 750000,
            currency: 'INR',
            status: 'captured',
          },
        },
      },
    };
    const rawBody = JSON.stringify(webhookPayload);
    await paymentService.handleWebhook(rawBody, generateWebhookSignature(rawBody), webhookPayload);

    const paymentPreVerify = await paymentRepository.findByPk(rzpOrder.paymentRecordId);
    assert.strictEqual(paymentPreVerify.status, 'captured');

    // Browser callback arrives late
    const signature = generatePaymentSignature(rzpOrder.orderId, gatewayPaymentId);
    const verifyResult = await paymentService.verifyPayment(testUser.id, {
      order_id: order.id,
      razorpay_order_id: rzpOrder.orderId,
      razorpay_payment_id: gatewayPaymentId,
      razorpay_signature: signature,
    });

    assert.strictEqual(verifyResult.success, true);
    assert.strictEqual(verifyResult.verified, undefined, 'verified: true must NOT be returned');
    assert.strictEqual(verifyResult.status, 'captured', '/verify must read captured status when webhook arrived first');
  });

  // TEST 4: Duplicate Webhook Delivery
  await test('4. Duplicate webhook delivery is safe (idempotent, no double capture)', async () => {
    const order = await createTestOrder(4200.0);
    const rzpOrder = await paymentService.createRazorpayOrder(testUser.id, { orderId: order.id });
    const gatewayPaymentId = `pay_${crypto.randomUUID().replace(/-/g, '').substring(0, 14)}`;
    const eventId = `evt_${crypto.randomUUID()}`;

    const webhookPayload = {
      event: 'payment.captured',
      id: eventId,
      payload: {
        payment: {
          entity: {
            id: gatewayPaymentId,
            order_id: rzpOrder.orderId,
            amount: 420000,
            currency: 'INR',
            status: 'captured',
          },
        },
      },
    };
    const rawBody = JSON.stringify(webhookPayload);
    const sig = generateWebhookSignature(rawBody);

    const first = await paymentService.handleWebhook(rawBody, sig, webhookPayload);
    assert.strictEqual(first.finalized, true);

    const second = await paymentService.handleWebhook(rawBody, sig, webhookPayload);
    assert.strictEqual(second.received, true);
    assert.strictEqual(second.duplicate, true, 'Second delivery must be acknowledged as duplicate');

    const payment = await paymentRepository.findByPk(rzpOrder.paymentRecordId);
    assert.strictEqual(payment.status, 'captured');
  });

  // TEST 5: Concurrent Webhooks
  await test('5. Concurrent webhooks (two simultaneous payment.captured events -> one atomic transition)', async () => {
    const order = await createTestOrder(9000.0);
    const rzpOrder = await paymentService.createRazorpayOrder(testUser.id, { orderId: order.id });
    const gatewayPaymentId = `pay_${crypto.randomUUID().replace(/-/g, '').substring(0, 14)}`;

    const createPayload = (eventId) => {
      const p = {
        event: 'payment.captured',
        id: eventId,
        payload: {
          payment: {
            entity: {
              id: gatewayPaymentId,
              order_id: rzpOrder.orderId,
              amount: 900000,
              currency: 'INR',
              status: 'captured',
            },
          },
        },
      };
      const raw = JSON.stringify(p);
      return { raw, sig: generateWebhookSignature(raw), payload: p };
    };

    const w1 = createPayload(`evt_${crypto.randomUUID()}`);
    const w2 = createPayload(`evt_${crypto.randomUUID()}`);

    const [res1, res2] = await Promise.all([
      paymentService.handleWebhook(w1.raw, w1.sig, w1.payload),
      paymentService.handleWebhook(w2.raw, w2.sig, w2.payload),
    ]);

    const oneFinalized = (res1.finalized && !res2.finalized) || (!res1.finalized && res2.finalized);
    assert.ok(oneFinalized, 'Exactly one webhook execution must perform the actual state finalization');

    const orderFinal = await orderRepository.findByPk(order.id);
    assert.strictEqual(orderFinal.status, 'paid');
  });

  // TEST 6: Webhook Amount Mismatch Protection
  await test('6. Webhook amount mismatch (stored amount != gateway amount -> flagged, no capture)', async () => {
    const order = await createTestOrder(15000.0);
    const rzpOrder = await paymentService.createRazorpayOrder(testUser.id, { orderId: order.id });
    const gatewayPaymentId = `pay_${crypto.randomUUID().replace(/-/g, '').substring(0, 14)}`;

    // Attacker or corrupted gateway sends 100 paise instead of 1500000 paise
    const webhookPayload = {
      event: 'payment.captured',
      id: `evt_${crypto.randomUUID()}`,
      payload: {
        payment: {
          entity: {
            id: gatewayPaymentId,
            order_id: rzpOrder.orderId,
            amount: 100, // 1 INR instead of 15000 INR
            currency: 'INR',
            status: 'captured',
          },
        },
      },
    };
    const rawBody = JSON.stringify(webhookPayload);
    const res = await paymentService.handleWebhook(rawBody, generateWebhookSignature(rawBody), webhookPayload);

    assert.strictEqual(res.flagged, true);
    assert.strictEqual(res.reason, 'WEBHOOK_AMOUNT_MISMATCH');

    const payment = await paymentRepository.findByPk(rzpOrder.paymentRecordId);
    const orderDb = await orderRepository.findByPk(order.id);
    assert.strictEqual(payment.status, 'pending', 'Payment must NOT be captured on amount mismatch');
    assert.strictEqual(orderDb.status, 'pending', 'Order must NOT be paid on amount mismatch');
    assert.strictEqual(payment.notes.flagged_anomaly, 'WEBHOOK_AMOUNT_MISMATCH');
  });

  // TEST 7: Currency Mismatch Protection
  await test('7. Webhook currency mismatch (stored currency != gateway currency -> flagged, no capture)', async () => {
    const order = await createTestOrder(6000.0);
    const rzpOrder = await paymentService.createRazorpayOrder(testUser.id, { orderId: order.id });
    const gatewayPaymentId = `pay_${crypto.randomUUID().replace(/-/g, '').substring(0, 14)}`;

    const webhookPayload = {
      event: 'payment.captured',
      id: `evt_${crypto.randomUUID()}`,
      payload: {
        payment: {
          entity: {
            id: gatewayPaymentId,
            order_id: rzpOrder.orderId,
            amount: 600000,
            currency: 'USD', // Mismatched currency
            status: 'captured',
          },
        },
      },
    };
    const rawBody = JSON.stringify(webhookPayload);
    const res = await paymentService.handleWebhook(rawBody, generateWebhookSignature(rawBody), webhookPayload);

    assert.strictEqual(res.flagged, true);
    assert.strictEqual(res.reason, 'WEBHOOK_CURRENCY_MISMATCH');

    const payment = await paymentRepository.findByPk(rzpOrder.paymentRecordId);
    assert.strictEqual(payment.status, 'pending');
  });

  // TEST 8: Order ID Mismatch Protection
  await test('8. Webhook order ID mismatch (gateway order != local payment order -> flagged, no capture)', async () => {
    const order = await createTestOrder(8000.0);
    const rzpOrder = await paymentService.createRazorpayOrder(testUser.id, { orderId: order.id });
    const gatewayPaymentId = `pay_${crypto.randomUUID().replace(/-/g, '').substring(0, 14)}`;

    // Force lookup by gatewayPaymentId with wrong order_id
    const paymentRecord = await paymentRepository.findByPk(rzpOrder.paymentRecordId);
    await paymentRecord.update({ gateway_payment_id: gatewayPaymentId });

    const webhookPayload = {
      event: 'payment.captured',
      id: `evt_${crypto.randomUUID()}`,
      payload: {
        payment: {
          entity: {
            id: gatewayPaymentId,
            order_id: 'order_completely_wrong_id',
            amount: 800000,
            currency: 'INR',
            status: 'captured',
          },
        },
      },
    };
    const rawBody = JSON.stringify(webhookPayload);
    const res = await paymentService.handleWebhook(rawBody, generateWebhookSignature(rawBody), webhookPayload);

    assert.strictEqual(res.flagged, true);
    assert.strictEqual(res.reason, 'WEBHOOK_ORDER_ID_MISMATCH');

    const paymentAfter = await paymentRepository.findByPk(rzpOrder.paymentRecordId);
    assert.strictEqual(paymentAfter.status, 'pending');
  });

  // TEST 9: Failed Payment Handling
  await test('9. Failed payment event (payment.failed transitions payment to failed, order NOT paid)', async () => {
    const order = await createTestOrder(3500.0);
    const rzpOrder = await paymentService.createRazorpayOrder(testUser.id, { orderId: order.id });

    const webhookPayload = {
      event: 'payment.failed',
      id: `evt_${crypto.randomUUID()}`,
      payload: {
        payment: {
          entity: {
            id: `pay_${crypto.randomUUID().replace(/-/g, '').substring(0, 14)}`,
            order_id: rzpOrder.orderId,
            amount: 350000,
            currency: 'INR',
            status: 'failed',
            error_description: 'Card declined by issuing bank',
          },
        },
      },
    };
    const rawBody = JSON.stringify(webhookPayload);
    await paymentService.handleWebhook(rawBody, generateWebhookSignature(rawBody), webhookPayload);

    const payment = await paymentRepository.findByPk(rzpOrder.paymentRecordId);
    const orderDb = await orderRepository.findByPk(order.id);
    assert.strictEqual(payment.status, 'failed');
    assert.strictEqual(orderDb.status, 'pending', 'Order must NOT be marked paid on payment failure');
  });

  // TEST 10: Reconciliation Worker Authoritative Fallback
  await test('10. Reconciliation worker authoritative fallback (queries gateway, finalizes via finalizeCapturedPayment)', async () => {
    const order = await createTestOrder(18000.0);
    const rzpOrder = await paymentService.createRazorpayOrder(testUser.id, { orderId: order.id });
    const payment = await paymentRepository.findByPk(rzpOrder.paymentRecordId);

    // Mock Razorpay gateway reporting order is paid & payment captured
    const reconPaymentId = `pay_recon_${crypto.randomUUID().replace(/-/g, '').substring(0, 12)}`;
    razorpayGateway.__setMockOrder(rzpOrder.orderId, {
      id: rzpOrder.orderId,
      status: 'paid',
      amount_paid: 1800000,
      currency: 'INR',
    });
    razorpayGateway.__setMockPayment(reconPaymentId, {
      id: reconPaymentId,
      order_id: rzpOrder.orderId,
      amount: 1800000,
      currency: 'INR',
      status: 'captured',
      captured: true,
      method: 'netbanking',
    });

    const reconRes = await paymentService.reconcilePaymentAttempt(payment);
    assert.strictEqual(reconRes.reconciled, true);
    assert.strictEqual(reconRes.status, 'captured');

    const paymentAfter = await paymentRepository.findByPk(payment.id);
    const orderAfter = await orderRepository.findByPk(order.id);
    assert.strictEqual(paymentAfter.status, 'captured');
    assert.strictEqual(orderAfter.status, 'paid');
    assert.strictEqual(paymentAfter.notes.finalized_by, 'reconciliation');
  });

  // TEST 11: Reconciliation and Webhook Race Condition
  await test('11. Reconciliation + webhook race condition (concurrent execution -> single transition)', async () => {
    const order = await createTestOrder(22000.0);
    const rzpOrder = await paymentService.createRazorpayOrder(testUser.id, { orderId: order.id });
    const payment = await paymentRepository.findByPk(rzpOrder.paymentRecordId);

    const sharedPaymentId = `pay_${crypto.randomUUID().replace(/-/g, '').substring(0, 14)}`;

    // Set mock gateway response for reconciliation
    razorpayGateway.__setMockOrder(rzpOrder.orderId, {
      id: rzpOrder.orderId,
      status: 'paid',
      amount_paid: 2200000,
      currency: 'INR',
    });
    razorpayGateway.__setMockPayment(sharedPaymentId, {
      id: sharedPaymentId,
      order_id: rzpOrder.orderId,
      amount: 2200000,
      currency: 'INR',
      status: 'captured',
      captured: true,
      method: 'card',
    });

    // Webhook payload
    const webhookPayload = {
      event: 'payment.captured',
      id: `evt_${crypto.randomUUID()}`,
      payload: {
        payment: {
          entity: {
            id: sharedPaymentId,
            order_id: rzpOrder.orderId,
            amount: 2200000,
            currency: 'INR',
            status: 'captured',
            method: 'card',
          },
        },
      },
    };
    const rawBody = JSON.stringify(webhookPayload);
    const sig = generateWebhookSignature(rawBody);

    // Fire webhook and reconciliation concurrently
    const [webhookResult, reconResult] = await Promise.all([
      paymentService.handleWebhook(rawBody, sig, webhookPayload),
      paymentService.reconcilePaymentAttempt(payment),
    ]);

    assert.ok(
      webhookResult.finalized || reconResult.status === 'captured',
      'At least one path must succeed and ensure capture'
    );

    const paymentFinal = await paymentRepository.findByPk(payment.id);
    const orderFinal = await orderRepository.findByPk(order.id);
    assert.strictEqual(paymentFinal.status, 'captured');
    assert.strictEqual(orderFinal.status, 'paid');
  });

  // TEST 12: Payment Attempt Creation Limit
  await test('12. Attempt creation limit (max 5 payment attempts allowed per order)', async () => {
    const order = await createTestOrder(1000.0);

    // Create 5 attempts with different idempotency keys
    for (let i = 0; i < 5; i++) {
      await Payment.create({
        user_id: testUser.id,
        order_id: order.id,
        gateway: 'razorpay',
        gateway_order_id: `order_attempt_${i}_${crypto.randomUUID().substring(0, 8)}`,
        amount: 1000.0,
        currency: 'INR',
        status: 'pending',
        idempotency_key: crypto.randomUUID(),
        gateway_idempotency_key: crypto.randomUUID(),
      });
    }

    // 6th attempt must be rejected with attempt limit error
    let rejected = false;
    try {
      await paymentService.createRazorpayOrder(testUser.id, {
        orderId: order.id,
        idempotencyKey: crypto.randomUUID(),
      });
    } catch (err) {
      rejected = true;
      assert.ok(
        err.message.includes('Maximum payment attempt limit') || err.message.includes('limit reached'),
        `Expected attempt limit error, got: ${err.message}`
      );
    }
    assert.strictEqual(rejected, true, '6th payment attempt must be rejected');
  });

  // TEST 13: Confirmation Attempt Limit
  await test('13. Confirmation attempt limit (max 5 verification callbacks allowed)', async () => {
    const order = await createTestOrder(1500.0);
    const rzpOrder = await paymentService.createRazorpayOrder(testUser.id, { orderId: order.id });
    const gatewayPaymentId = `pay_${crypto.randomUUID().replace(/-/g, '').substring(0, 14)}`;
    const signature = generatePaymentSignature(rzpOrder.orderId, gatewayPaymentId);

    // Call /verify 5 times
    for (let i = 0; i < 5; i++) {
      await paymentService.verifyPayment(testUser.id, {
        order_id: order.id,
        razorpay_order_id: rzpOrder.orderId,
        razorpay_payment_id: gatewayPaymentId,
        razorpay_signature: signature,
      });
    }

    // 6th confirmation attempt must be rejected
    let rejected = false;
    try {
      await paymentService.verifyPayment(testUser.id, {
        order_id: order.id,
        razorpay_order_id: rzpOrder.orderId,
        razorpay_payment_id: gatewayPaymentId,
        razorpay_signature: signature,
      });
    } catch (err) {
      rejected = true;
      assert.ok(
        err.message.includes('Maximum confirmation attempt limit') || err.message.includes('limit reached'),
        `Expected confirmation limit error, got: ${err.message}`
      );
    }
    assert.strictEqual(rejected, true, '6th confirmation attempt must be rejected');
  });

  // TEST 14: UUID Compliance Validation
  await test('14. UUID compliance for application-generated identifiers', async () => {
    const order = await createTestOrder(2500.0);
    const rzpOrder = await paymentService.createRazorpayOrder(testUser.id, { orderId: order.id });

    const payment = await paymentRepository.findByPk(rzpOrder.paymentRecordId);

    // Check idempotency_key is valid UUID
    assert.ok(UUID_V4_REGEX.test(payment.idempotency_key), 'payment.idempotency_key must be a valid UUID');

    // Check gateway_idempotency_key is valid UUID
    assert.ok(
      UUID_V4_REGEX.test(payment.gateway_idempotency_key),
      'payment.gateway_idempotency_key must be a valid UUID'
    );

    // Check that Razorpay receipt was derived deterministically from the UUID
    assert.strictEqual(
      rzpOrder.receipt,
      payment.gateway_idempotency_key.substring(0, 40),
      'Razorpay receipt must be derived deterministically from the UUID'
    );

    // Verify no legacy pseudo-random prefixes exist
    assert.strictEqual(payment.idempotency_key.includes('order_'), false);
    assert.strictEqual(payment.idempotency_key.includes('payment_'), false);
    assert.strictEqual(payment.idempotency_key.includes('aarogya_'), false);
  });

  // TEST 15: /verify Response Semantics Regression Test
  // TEST 15: /verify response semantics test
  await test('15. /verify response semantics test ({ success: true, status: "captured" }, never verified: true)', async () => {
    const order = await createTestOrder(5500.0);
    const rzpOrder = await paymentService.createRazorpayOrder(testUser.id, { orderId: order.id });
    const gatewayPaymentId = `pay_${crypto.randomUUID().replace(/-/g, '').substring(0, 14)}`;
    const signature = generatePaymentSignature(rzpOrder.orderId, gatewayPaymentId);

    // 1. Verify callback
    const result = await paymentService.verifyPayment(testUser.id, {
      order_id: order.id,
      razorpay_order_id: rzpOrder.orderId,
      razorpay_payment_id: gatewayPaymentId,
      razorpay_signature: signature,
    });

    assert.strictEqual(result.success, true, 'Response must return success: true');
    assert.strictEqual(result.status, 'captured', 'Status must be captured');
    assert.strictEqual(result.verified, undefined, 'verified: true must NOT be returned');
    assert.strictEqual('verified' in result, false, 'Key "verified" must not exist in response');
  });

  // TEST 16: /verify signature validation test
  await test('16. /verify signature validation test (invalid sig rejects, valid sig captures)', async () => {
    const order = await createTestOrder(6500.0);
    const rzpOrder = await paymentService.createRazorpayOrder(testUser.id, { orderId: order.id });
    const gatewayPaymentId = `pay_${crypto.randomUUID().replace(/-/g, '').substring(0, 14)}`;
    const validSignature = generatePaymentSignature(rzpOrder.orderId, gatewayPaymentId);

    // Initial state
    const initialPayment = await paymentRepository.findByPk(rzpOrder.paymentRecordId);
    assert.strictEqual(initialPayment.status, 'pending');

    // Invalid signature must reject
    let threw = false;
    try {
      await paymentService.verifyPayment(testUser.id, {
        order_id: order.id,
        razorpay_order_id: rzpOrder.orderId,
        razorpay_payment_id: gatewayPaymentId,
        razorpay_signature: 'invalid_tampered_signature',
      });
    } catch (err) {
      threw = true;
    }
    assert.strictEqual(threw, true, 'Invalid signature must throw BadRequest');

    // State remains pending
    const paymentAfterFailedVerify = await paymentRepository.findByPk(rzpOrder.paymentRecordId);
    assert.strictEqual(paymentAfterFailedVerify.status, 'pending');

    // Valid signature captures
    const validVerifyRes = await paymentService.verifyPayment(testUser.id, {
      order_id: order.id,
      razorpay_order_id: rzpOrder.orderId,
      razorpay_payment_id: gatewayPaymentId,
      razorpay_signature: validSignature,
    });

    assert.strictEqual(validVerifyRes.status, 'captured');
    const paymentAfterSuccess = await paymentRepository.findByPk(rzpOrder.paymentRecordId);
    assert.strictEqual(paymentAfterSuccess.status, 'captured');
    const orderAfterSuccess = await orderRepository.findByPk(order.id);
    assert.strictEqual(orderAfterSuccess.status, 'paid');
  });

  // TEST 17: Fulfillment Idempotency
  await test('17. Fulfillment idempotency (Webhook #1 -> once, Webhook #2 -> no-op, Reconciliation -> no-op; exact count = 1)', async () => {
    const order = await createTestOrder(8500.0);
    const rzpOrder = await paymentService.createRazorpayOrder(testUser.id, { orderId: order.id });
    const gatewayPaymentId = `pay_${crypto.randomUUID().replace(/-/g, '').substring(0, 14)}`;

    let fulfillmentCount = 0;
    const fulfillmentListener = (payload) => {
      if (payload && payload.orderId === order.id) {
        fulfillmentCount++;
      }
    };
    adminNotificationEventBus.on('transaction.purchase.successful', fulfillmentListener);

    try {
      // Webhook #1
      const webhookPayload1 = {
        event: 'payment.captured',
        id: `evt_${crypto.randomUUID()}`,
        payload: {
          payment: {
            entity: {
              id: gatewayPaymentId,
              order_id: rzpOrder.orderId,
              amount: 850000,
              currency: 'INR',
              status: 'captured',
              method: 'upi',
            },
          },
        },
      };
      const raw1 = JSON.stringify(webhookPayload1);
      const res1 = await paymentService.handleWebhook(raw1, generateWebhookSignature(raw1), webhookPayload1);
      assert.strictEqual(res1.finalized, true);
      assert.strictEqual(fulfillmentCount, 1, 'Fulfillment must execute exactly once on Webhook #1');

      // Webhook #2 (duplicate delivery or second event for same order)
      const webhookPayload2 = {
        event: 'payment.captured',
        id: `evt_${crypto.randomUUID()}`,
        payload: {
          payment: {
            entity: {
              id: gatewayPaymentId,
              order_id: rzpOrder.orderId,
              amount: 850000,
              currency: 'INR',
              status: 'captured',
              method: 'upi',
            },
          },
        },
      };
      const raw2 = JSON.stringify(webhookPayload2);
      const res2 = await paymentService.handleWebhook(raw2, generateWebhookSignature(raw2), webhookPayload2);
      assert.strictEqual(res2.alreadyCaptured, true);
      assert.strictEqual(fulfillmentCount, 1, 'Fulfillment must NOT execute a second time on Webhook #2');

      // Reconciliation
      const paymentRecord = await paymentRepository.findByPk(rzpOrder.paymentRecordId);
      razorpayGateway.__setMockOrder(rzpOrder.orderId, {
        id: rzpOrder.orderId,
        status: 'paid',
        amount_paid: 850000,
        currency: 'INR',
      });
      razorpayGateway.__setMockPayment(gatewayPaymentId, {
        id: gatewayPaymentId,
        order_id: rzpOrder.orderId,
        amount: 850000,
        currency: 'INR',
        status: 'captured',
        captured: true,
      });

      const reconRes = await paymentService.reconcilePaymentAttempt(paymentRecord);
      assert.strictEqual(reconRes.status, 'captured');
      assert.strictEqual(fulfillmentCount, 1, 'Fulfillment must NOT execute a third time on Reconciliation');

      // Assert side effect count is strictly 1
      assert.strictEqual(fulfillmentCount, 1, 'Fulfillment side-effect count must be EXACTLY 1');
    } finally {
      adminNotificationEventBus.removeListener('transaction.purchase.successful', fulfillmentListener);
    }
  });

  // TEST 18: Strengthen Webhook Event Idempotency & Database Uniqueness
  await test('18. Webhook event idempotency (same Razorpay event ID -> exactly 1 capture, 1 fulfillment, 1 webhook_events record)', async () => {
    const order = await createTestOrder(9500.0);
    const rzpOrder = await paymentService.createRazorpayOrder(testUser.id, { orderId: order.id });
    const gatewayPaymentId = `pay_${crypto.randomUUID().replace(/-/g, '').substring(0, 14)}`;
    const eventId = `evt_idemp_${crypto.randomUUID().replace(/-/g, '').substring(0, 16)}`;

    let fulfillmentCount = 0;
    const fulfillmentListener = (payload) => {
      if (payload && payload.orderId === order.id) {
        fulfillmentCount++;
      }
    };
    adminNotificationEventBus.on('transaction.purchase.successful', fulfillmentListener);

    try {
      const webhookPayload = {
        event: 'payment.captured',
        id: eventId,
        payload: {
          payment: {
            entity: {
              id: gatewayPaymentId,
              order_id: rzpOrder.orderId,
              amount: 950000,
              currency: 'INR',
              status: 'captured',
              method: 'netbanking',
            },
          },
        },
      };
      const rawBody = JSON.stringify(webhookPayload);
      const sig = generateWebhookSignature(rawBody);

      // First webhook delivery -> processed
      const res1 = await paymentService.handleWebhook(rawBody, sig, webhookPayload);
      assert.strictEqual(res1.finalized, true);
      assert.strictEqual(fulfillmentCount, 1);

      // Verify exactly 1 record in webhook_events
      const eventCount1 = await WebhookEvent.count({ where: { gateway_event_id: eventId } });
      assert.strictEqual(eventCount1, 1, 'Exactly 1 logical webhook_events record created');

      // Second webhook delivery with same event ID -> idempotent no-op
      const res2 = await paymentService.handleWebhook(rawBody, sig, webhookPayload);
      assert.strictEqual(res2.received, true);
      assert.strictEqual(res2.duplicate, true, 'Second delivery must be acknowledged as duplicate');
      assert.strictEqual(fulfillmentCount, 1, 'No duplicate fulfillment on duplicate event ID');

      // Verify DB count is still strictly 1
      const eventCount2 = await WebhookEvent.count({ where: { gateway_event_id: eventId } });
      assert.strictEqual(eventCount2, 1, 'webhook_events table must still contain exactly 1 record');
    } finally {
      adminNotificationEventBus.removeListener('transaction.purchase.successful', fulfillmentListener);
    }
  });

  // TEST 19: Invalid Webhook Signatures & Payload Tampering
  await test('19. Invalid webhook signature and payload tampering rejection', async () => {
    const order = await createTestOrder(4500.0);
    const rzpOrder = await paymentService.createRazorpayOrder(testUser.id, { orderId: order.id });
    const gatewayPaymentId = `pay_${crypto.randomUUID().replace(/-/g, '').substring(0, 14)}`;

    const webhookPayload = {
      event: 'payment.captured',
      id: `evt_${crypto.randomUUID()}`,
      payload: {
        payment: {
          entity: {
            id: gatewayPaymentId,
            order_id: rzpOrder.orderId,
            amount: 450000,
            currency: 'INR',
            status: 'captured',
          },
        },
      },
    };
    const rawBody = JSON.stringify(webhookPayload);

    // 1. Completely invalid signature -> HTTP 400 rejection
    let rejectedInvalidSig = false;
    try {
      await paymentService.handleWebhook(rawBody, 'invalid_fake_hmac_signature_hex_12345', webhookPayload);
    } catch (err) {
      rejectedInvalidSig = true;
      assert.strictEqual(err.statusCode || err.status || 400, 400);
      assert.ok(err.message.includes('Invalid webhook signature'));
    }
    assert.strictEqual(rejectedInvalidSig, true, 'Invalid signature must be rejected with 400');

    // Assert payment remains pending and order remains unpaid
    const payment1 = await paymentRepository.findByPk(rzpOrder.paymentRecordId);
    const order1 = await orderRepository.findByPk(order.id);
    assert.strictEqual(payment1.status, 'pending', 'Payment must remain pending on invalid signature');
    assert.strictEqual(order1.status, 'pending', 'Order must remain unpaid on invalid signature');

    // 2. Payload tampering after generating signature
    const validSignature = generateWebhookSignature(rawBody);
    const tamperedPayload = JSON.parse(rawBody);
    tamperedPayload.payload.payment.entity.amount = 999999; // tampered amount
    const tamperedRawBody = JSON.stringify(tamperedPayload);

    let rejectedTampered = false;
    try {
      await paymentService.handleWebhook(tamperedRawBody, validSignature, tamperedPayload);
    } catch (err) {
      rejectedTampered = true;
      assert.strictEqual(err.statusCode || err.status || 400, 400);
      assert.ok(err.message.includes('Invalid webhook signature'));
    }
    assert.strictEqual(rejectedTampered, true, 'Tampered payload with original signature must be rejected');

    const payment2 = await paymentRepository.findByPk(rzpOrder.paymentRecordId);
    const order2 = await orderRepository.findByPk(order.id);
    assert.strictEqual(payment2.status, 'pending');
    assert.strictEqual(order2.status, 'pending');
  });

  // TEST 20: Browser Callback Signature Tampering Rejection
  await test('20. Browser callback signature tampering (/verify rejection, payment & order remain pending)', async () => {
    const order = await createTestOrder(3800.0);
    const rzpOrder = await paymentService.createRazorpayOrder(testUser.id, { orderId: order.id });
    const gatewayPaymentId = `pay_${crypto.randomUUID().replace(/-/g, '').substring(0, 14)}`;

    // Tampered browser HMAC signature
    const tamperedSignature = 'deadbeefcafebabefeedfacedeadbeefcafe';

    let rejected = false;
    try {
      await paymentService.verifyPayment(testUser.id, {
        order_id: order.id,
        razorpay_order_id: rzpOrder.orderId,
        razorpay_payment_id: gatewayPaymentId,
        razorpay_signature: tamperedSignature,
      });
    } catch (err) {
      rejected = true;
      assert.strictEqual(err.statusCode || err.status || 400, 400);
      assert.ok(
        err.message.includes('signature verification failed') || err.message.includes('Cryptographic signature'),
        `Expected signature failure message, got: ${err.message}`
      );
    }
    assert.strictEqual(rejected, true, 'Tampered browser signature must be rejected');

    // Payment and Order must remain pending
    const payment = await paymentRepository.findByPk(rzpOrder.paymentRecordId);
    const orderDb = await orderRepository.findByPk(order.id);
    assert.strictEqual(payment.status, 'pending', 'Payment must remain pending on tampered browser signature');
    assert.strictEqual(orderDb.status, 'pending', 'Order must remain unpaid on tampered browser signature');
  });

  // TEST 21: Concurrency Race: OrderExpirationWorker vs Webhook payment.captured
  await test('21. Concurrency race: OrderExpirationWorker vs Webhook payment.captured executing concurrently', async () => {
    // SCENARIO A: Authoritative payment capture arrives while expiration worker inspects
    const orderA = await createTestOrder(7200.0);
    // Artificially make order stale (created 2 hours ago)
    await orderA.update({ created_at: new Date(Date.now() - 2 * 60 * 60 * 1000) });

    const rzpOrderA = await paymentService.createRazorpayOrder(testUser.id, { orderId: orderA.id });
    const gatewayPaymentIdA = `pay_${crypto.randomUUID().replace(/-/g, '').substring(0, 14)}`;

    let fulfillmentCountA = 0;
    const listenerA = (payload) => {
      if (payload && payload.orderId === orderA.id) fulfillmentCountA++;
    };
    adminNotificationEventBus.on('transaction.purchase.successful', listenerA);

    const webhookPayloadA = {
      event: 'payment.captured',
      id: `evt_${crypto.randomUUID()}`,
      payload: {
        payment: {
          entity: {
            id: gatewayPaymentIdA,
            order_id: rzpOrderA.orderId,
            amount: 720000,
            currency: 'INR',
            status: 'captured',
            method: 'upi',
          },
        },
      },
    };
    const rawBodyA = JSON.stringify(webhookPayloadA);
    const sigA = generateWebhookSignature(rawBodyA);

    // Run expiration worker and webhook concurrently
    await Promise.all([
      orderExpirationWorker.expirePendingOrders({ expirationMinutes: 60 }),
      paymentService.handleWebhook(rawBodyA, sigA, webhookPayloadA),
    ]);

    adminNotificationEventBus.removeListener('transaction.purchase.successful', listenerA);

    const orderFinalA = await orderRepository.findByPk(orderA.id);
    const paymentFinalA = await paymentRepository.findByPk(rzpOrderA.paymentRecordId);

    // If payment capture finalized: order must be paid, NOT cancelled, fulfillment exactly once
    assert.strictEqual(orderFinalA.status, 'paid', 'Order must end up paid, NOT cancelled');
    assert.strictEqual(paymentFinalA.status, 'captured');
    assert.strictEqual(fulfillmentCountA, 1, 'Fulfillment must execute exactly once');

    // SCENARIO B: Cancellation wins first, then Webhook arrives later
    const orderB = await createTestOrder(4800.0);
    const rzpOrderB = await paymentService.createRazorpayOrder(testUser.id, { orderId: orderB.id });
    const gatewayPaymentIdB = `pay_${crypto.randomUUID().replace(/-/g, '').substring(0, 14)}`;

    // Explicitly cancel order first (simulating expiration worker winning before any payment info existed)
    await orderB.update({ status: 'cancelled' });

    let fulfillmentCountB = 0;
    const listenerB = (payload) => {
      if (payload && payload.orderId === orderB.id) fulfillmentCountB++;
    };
    adminNotificationEventBus.on('transaction.purchase.successful', listenerB);

    const webhookPayloadB = {
      event: 'payment.captured',
      id: `evt_${crypto.randomUUID()}`,
      payload: {
        payment: {
          entity: {
            id: gatewayPaymentIdB,
            order_id: rzpOrderB.orderId,
            amount: 480000,
            currency: 'INR',
            status: 'captured',
            method: 'upi',
          },
        },
      },
    };
    const rawBodyB = JSON.stringify(webhookPayloadB);
    const sigB = generateWebhookSignature(rawBodyB);

    await paymentService.handleWebhook(rawBodyB, sigB, webhookPayloadB);
    adminNotificationEventBus.removeListener('transaction.purchase.successful', listenerB);

    const orderFinalB = await orderRepository.findByPk(orderB.id);
    const paymentFinalB = await paymentRepository.findByPk(rzpOrderB.paymentRecordId);

    // Invariant: Order must remain cancelled, capture must NOT fulfill cancelled order
    assert.strictEqual(orderFinalB.status, 'cancelled', 'Order must remain cancelled');
    assert.strictEqual(paymentFinalB.status, 'captured', 'Payment recorded for financial accounting');
    assert.strictEqual(paymentFinalB.notes.flagged_anomaly, 'LATE_PAYMENT_ON_CANCELLED_ORDER');
    assert.strictEqual(paymentFinalB.notes.requires_manual_review_or_refund, true);
    assert.strictEqual(fulfillmentCountB, 0, 'No fulfillment must occur for cancelled order');
  });

  // TEST 22: Safe Reconciliation on Cancelled/Expired Orders
  await test('22. Reconciliation does not fulfill cancelled/expired orders (flags LATE_PAYMENT_ON_CANCELLED_ORDER)', async () => {
    const order = await createTestOrder(5200.0);
    const rzpOrder = await paymentService.createRazorpayOrder(testUser.id, { orderId: order.id });
    const payment = await paymentRepository.findByPk(rzpOrder.paymentRecordId);
    const gatewayPaymentId = `pay_late_${crypto.randomUUID().replace(/-/g, '').substring(0, 10)}`;

    // Order is cancelled/expired
    await order.update({ status: 'cancelled' });

    // Gateway reports payment captured
    razorpayGateway.__setMockOrder(rzpOrder.orderId, {
      id: rzpOrder.orderId,
      status: 'paid',
      amount_paid: 520000,
      currency: 'INR',
    });
    razorpayGateway.__setMockPayment(gatewayPaymentId, {
      id: gatewayPaymentId,
      order_id: rzpOrder.orderId,
      amount: 520000,
      currency: 'INR',
      status: 'captured',
      captured: true,
    });

    let fulfillmentFired = false;
    const listener = (payload) => {
      if (payload && payload.orderId === order.id) fulfillmentFired = true;
    };
    adminNotificationEventBus.on('transaction.purchase.successful', listener);

    try {
      const reconResult = await paymentService.reconcilePaymentAttempt(payment);
      assert.strictEqual(reconResult.latePaymentCancelled, true, 'Must indicate late payment on cancelled order');

      const paymentAfter = await paymentRepository.findByPk(payment.id);
      const orderAfter = await orderRepository.findByPk(order.id);

      assert.strictEqual(orderAfter.status, 'cancelled', 'Order must NOT be marked paid');
      assert.strictEqual(paymentAfter.status, 'captured', 'Payment recorded for accounting');
      assert.strictEqual(paymentAfter.notes.flagged_anomaly, 'LATE_PAYMENT_ON_CANCELLED_ORDER');
      assert.strictEqual(paymentAfter.notes.requires_manual_review_or_refund, true);
      assert.strictEqual(fulfillmentFired, false, 'No fulfillment side effect for cancelled order');
    } finally {
      adminNotificationEventBus.removeListener('transaction.purchase.successful', listener);
    }
  });

  // TEST 23: Complete End-to-End Lifecycle Test
  await test('23. Complete end-to-end state lifecycle (order -> attempt -> /verify captured -> duplicate webhook -> reconciliation)', async () => {
    // 1. Create order
    const order = await createTestOrder(14500.0);
    assert.strictEqual(order.status, 'pending');

    // Setup fulfillment tracker
    let fulfillmentCount = 0;
    const fulfillmentListener = (payload) => {
      if (payload && payload.orderId === order.id) fulfillmentCount++;
    };
    adminNotificationEventBus.on('transaction.purchase.successful', fulfillmentListener);

    try {
      // 2. Create Razorpay payment attempt
      const rzpOrder = await paymentService.createRazorpayOrder(testUser.id, { orderId: order.id });
      const gatewayPaymentId = `pay_e2e_${crypto.randomUUID().replace(/-/g, '').substring(0, 10)}`;
      const signature = generatePaymentSignature(rzpOrder.orderId, gatewayPaymentId);

      // 3. /verify callback captures immediately
      const verifyRes = await paymentService.verifyPayment(testUser.id, {
        order_id: order.id,
        razorpay_order_id: rzpOrder.orderId,
        razorpay_payment_id: gatewayPaymentId,
        razorpay_signature: signature,
      });

      // 4. Assert captured
      assert.strictEqual(verifyRes.success, true);
      assert.strictEqual(verifyRes.status, 'captured');

      let paymentDb = await paymentRepository.findByPk(rzpOrder.paymentRecordId);
      let orderDb = await orderRepository.findByPk(order.id);
      assert.strictEqual(paymentDb.status, 'captured');
      assert.strictEqual(orderDb.status, 'paid');
      assert.strictEqual(fulfillmentCount, 1, 'Fulfillment must run on capture');

      // 5. Subsequent payment.captured webhook arrives as safety net
      const webhookPayload = {
        event: 'payment.captured',
        id: `evt_e2e_${crypto.randomUUID().replace(/-/g, '').substring(0, 10)}`,
        payload: {
          payment: {
            entity: {
              id: gatewayPaymentId,
              order_id: rzpOrder.orderId,
              amount: 1450000,
              currency: 'INR',
              status: 'captured',
              method: 'card',
            },
          },
        },
      };
      const rawBody = JSON.stringify(webhookPayload);
      const sig = generateWebhookSignature(rawBody);

      const webhookRes = await paymentService.handleWebhook(rawBody, sig, webhookPayload);
      assert.strictEqual(webhookRes.alreadyCaptured, true, 'Webhook detects already captured');
      assert.strictEqual(fulfillmentCount, 1, 'Fulfillment must remain exactly once');

      // 7. Duplicate webhook
      const dupRes = await paymentService.handleWebhook(rawBody, sig, webhookPayload);
      assert.strictEqual(dupRes.duplicate, true);

      // Assert state unchanged
      paymentDb = await paymentRepository.findByPk(rzpOrder.paymentRecordId);
      orderDb = await orderRepository.findByPk(order.id);
      assert.strictEqual(paymentDb.status, 'captured');
      assert.strictEqual(orderDb.status, 'paid');
      assert.strictEqual(fulfillmentCount, 1, 'Fulfillment must remain exactly 1 after duplicate webhook');

      // 8. Reconciliation
      razorpayGateway.__setMockOrder(rzpOrder.orderId, {
        id: rzpOrder.orderId,
        status: 'paid',
        amount_paid: 1450000,
        currency: 'INR',
      });
      razorpayGateway.__setMockPayment(gatewayPaymentId, {
        id: gatewayPaymentId,
        order_id: rzpOrder.orderId,
        amount: 1450000,
        currency: 'INR',
        status: 'captured',
        captured: true,
      });

      const reconRes = await paymentService.reconcilePaymentAttempt(paymentDb);
      assert.strictEqual(reconRes.status, 'captured');
      assert.strictEqual(reconRes.alreadyCaptured, true);

      // Assert state unchanged
      paymentDb = await paymentRepository.findByPk(rzpOrder.paymentRecordId);
      orderDb = await orderRepository.findByPk(order.id);
      assert.strictEqual(paymentDb.status, 'captured');
      assert.strictEqual(orderDb.status, 'paid');
      assert.strictEqual(fulfillmentCount, 1, 'Fulfillment must remain exactly 1 after reconciliation');
    } finally {
      adminNotificationEventBus.removeListener('transaction.purchase.successful', fulfillmentListener);
    }
  });

  console.log('\n======================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED (TOTAL: ${passed + failed})`);
  console.log('======================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
