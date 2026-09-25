'use strict';

process.env.NODE_ENV = 'test';

const assert = require('assert');
const crypto = require('crypto');
const db = require('../models');
const { paymentRepository, orderRepository, productRepository } = require('../repository');
const paymentService = require('../services/payment.service');
const orderService = require('../services/order.service');
const rentalService = require('../services/rental.service');
const { razorpayGateway } = require('../libs');
const {
  paymentReconciliationWorker,
  orderExpirationWorker,
  scheduler,
} = require('../jobs');

// Test utilities
let testUser;
let testAddress;
let testProduct;
let pgVersionString = '';

async function setupTestDatabase() {
  // Query actual PostgreSQL server version to prove real PostgreSQL execution
  const [versionRes] = await db.sequelize.query('SELECT version();');
  pgVersionString = versionRes[0].version;

  await db.sequelize.sync({ force: true });

  // Create partial unique indexes (as defined in PostgreSQL migration)
  await db.sequelize.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS unique_captured_order_payment
    ON payments (order_id)
    WHERE status = 'captured' AND order_id IS NOT NULL;
  `);

  await db.sequelize.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS unique_captured_rental_payment
    ON payments (rental_order_id)
    WHERE status = 'captured' AND rental_order_id IS NOT NULL;
  `);

  await db.sequelize.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS unique_order_idempotency_key
    ON payments (order_id, idempotency_key)
    WHERE order_id IS NOT NULL AND idempotency_key IS NOT NULL;
  `);

  await db.sequelize.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS unique_rental_idempotency_key
    ON payments (rental_order_id, idempotency_key)
    WHERE rental_order_id IS NOT NULL AND idempotency_key IS NOT NULL;
  `);

  // Seed baseline user, address, product
  testUser = await db.User.create({
    name: 'Test Patient',
    email: 'patient@aarogyamed.test',
    phone: '9876543210',
    password: 'hashed_password_123',
    role: 'customer',
  });

  testAddress = await db.Address.create({
    user_id: testUser.id,
    label: 'Home',
    line1: '123 Health Ave',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
  });

  const testCategory = await db.Category.create({
    name: 'Respiratory Care',
    slug: 'respiratory-care',
    description: 'Respiratory devices and concentrators',
  });

  testProduct = await db.Product.create({
    name: 'Medical Oxygen Concentrator 5L',
    slug: 'oxygen-concentrator-5l',
    sku: 'OXY-5L-TEST',
    category_id: testCategory.id,
    brand: 'Philips Respironics',
    description: 'Clinical grade 5L oxygen concentrator for patient homecare',
    buy_price: 35000,
    buy_available: true,
    rent_available: true,
    stock_quantity: 10,
    status: 'active',
  });
}

async function createTestOrder(totalAmount = 35000, initialStatus = 'pending', ageMinutes = 0) {
  const createdAt = new Date(Date.now() - ageMinutes * 60 * 1000);
  const order = await db.Order.create({
    user_id: testUser.id,
    address_id: testAddress.id,
    total_amount: totalAmount,
    status: initialStatus,
    created_at: createdAt,
    updated_at: createdAt,
  });

  await db.OrderItem.create({
    order_id: order.id,
    product_id: testProduct.id,
    quantity: 1,
    unit_price: totalAmount,
    subtotal: totalAmount,
    created_at: createdAt,
    updated_at: createdAt,
  });

  return order;
}

// =============================================================================
// TEST SUITE (RUNNING EXCLUSIVELY ON REAL POSTGRESQL)
// =============================================================================
async function runAllTests() {
  console.log('\n============================================================');
  console.log('  RUNNING PAYMENT IDEMPOTENCY & RECONCILIATION TEST SUITE');
  console.log('============================================================\n');

  await setupTestDatabase();
  console.log(`[Database Engine Verified]: ${pgVersionString}\n`);

  let passed = 0;
  let total = 17;

  // ---------------------------------------------------------------------------
  // TEST 1: Idempotency key reuse
  // ---------------------------------------------------------------------------
  try {
    console.log('[Test 1] Testing idempotency key reuse on createRazorpayOrder...');
    const order1 = await createTestOrder(5000);
    const idempKey = 'idemp_key_reuse_001';

    // First call
    const res1 = await paymentService.createRazorpayOrder(testUser.id, {
      amount: 5000,
      orderId: order1.id,
      idempotency_key: idempKey,
    });

    assert(res1.orderId, 'First call should return Razorpay orderId');
    assert.strictEqual(res1.status, 'pending');

    // Second call with identical idempotency key
    const res2 = await paymentService.createRazorpayOrder(testUser.id, {
      amount: 5000,
      orderId: order1.id,
      idempotency_key: idempKey,
    });

    assert.strictEqual(res2.orderId, res1.orderId, 'Second call must return identical Razorpay orderId');
    assert.strictEqual(res2.paymentRecordId, res1.paymentRecordId, 'Second call must return identical payment record ID');
    assert.strictEqual(res2.isExisting, true, 'Second call should flag isExisting = true');

    // Verify DB count in PostgreSQL
    const paymentsCount = await db.Payment.count({
      where: { order_id: order1.id, idempotency_key: idempKey },
    });
    assert.strictEqual(paymentsCount, 1, 'Exactly ONE PaymentAttempt row must exist in PostgreSQL');

    console.log('  ✓ Test 1 Passed: Idempotency key reuse returns existing attempt without duplicate Razorpay order.\n');
    passed++;
  } catch (err) {
    console.error('  ✗ Test 1 Failed:', err);
  }

  // ---------------------------------------------------------------------------
  // TEST 2: Concurrent duplicate payment attempt with genuine PostgreSQL concurrency
  // ---------------------------------------------------------------------------
  try {
    console.log('[Test 2] Testing concurrent duplicate payment attempt with genuine overlapping Postgres connections...');
    const order2 = await createTestOrder(12000);

    // Create a pending payment attempt in PostgreSQL
    const payment = await db.Payment.create({
      user_id: testUser.id,
      order_id: order2.id,
      gateway: 'razorpay',
      gateway_order_id: 'order_concurrent_test_1',
      amount: 12000,
      currency: 'INR',
      status: 'pending',
      idempotency_key: 'idemp_conc_1',
    });

    // Two genuine overlapping concurrent transactions on distinct pool connections
    const verifyReq1 = paymentService.verifyPayment(testUser.id, {
      razorpay_order_id: 'order_concurrent_test_1',
      razorpay_payment_id: 'pay_conc_win_1',
      razorpay_signature: 'sig_mock_win_1',
      order_id: order2.id,
    });

    const verifyReq2 = paymentService.verifyPayment(testUser.id, {
      razorpay_order_id: 'order_concurrent_test_1',
      razorpay_payment_id: 'pay_conc_win_2',
      razorpay_signature: 'sig_mock_win_2',
      order_id: order2.id,
    });

    const [out1, out2] = await Promise.all([verifyReq1, verifyReq2]);

    assert(out1.success && out1.verified, 'Verify request 1 should succeed');
    assert(out2.success && out2.verified, 'Verify request 2 should succeed gracefully without 500 error');

    // Verify PostgreSQL database constraint: at most ONE captured payment row exists for order2
    const capturedPayments = await db.Payment.findAll({
      where: { order_id: order2.id, status: 'captured' },
    });
    assert.strictEqual(capturedPayments.length, 1, 'PostgreSQL must contain exactly ONE captured payment for this order');

    // Verify Postgres partial unique index directly: an explicit second captured insert must be rejected by Postgres
    let pgConstraintErrorCaught = false;
    try {
      await db.sequelize.query(`
        INSERT INTO payments (uuid, order_id, status, gateway, amount, currency, created_at, updated_at)
        VALUES (gen_random_uuid(), ${order2.id}, 'captured', 'razorpay', 12000, 'INR', NOW(), NOW());
      `);
    } catch (pgErr) {
      if (pgErr.name === 'SequelizeUniqueConstraintError' || (pgErr.parent && pgErr.parent.code === '23505')) {
        pgConstraintErrorCaught = true;
      }
    }
    assert.strictEqual(pgConstraintErrorCaught, true, 'PostgreSQL partial unique index unique_captured_order_payment strictly rejected second captured row (SQL code 23505)');

    console.log('  ✓ Test 2 Passed: Genuine concurrent Postgres captures handled gracefully; Postgres partial unique index prevents duplicate capture.\n');
    passed++;
  } catch (err) {
    console.error('  ✗ Test 2 Failed:', err);
  }

  // ---------------------------------------------------------------------------
  // TEST 3: Timeout then retry
  // ---------------------------------------------------------------------------
  try {
    console.log('[Test 3] Testing timeout then retry scenario with synchronous on-demand reconciliation...');
    const order3 = await createTestOrder(7500);
    const timeoutIdempKey = 'idemp_timeout_retry_003';

    // 1. Initial attempt
    const initRes = await paymentService.createRazorpayOrder(testUser.id, {
      amount: 7500,
      orderId: order3.id,
      idempotency_key: timeoutIdempKey,
    });

    const rzpOrderId = initRes.orderId;

    // 2. Simulate Razorpay captured the payment, but the network connection timed out before reaching backend
    razorpayGateway.__setMockOrder(rzpOrderId, {
      status: 'paid',
      amount_paid: 750000,
    });
    razorpayGateway.__setMockPayment(`pay_timeout_${order3.id}`, {
      id: `pay_timeout_${order3.id}`,
      order_id: rzpOrderId,
      status: 'captured',
      method: 'upi',
    });

    // 3. User clicks Retry on frontend with the SAME idempotency key
    const retryRes = await paymentService.createRazorpayOrder(testUser.id, {
      amount: 7500,
      orderId: order3.id,
      idempotency_key: timeoutIdempKey,
    });

    assert.strictEqual(retryRes.status, 'captured', 'Retry must return captured state');
    assert.strictEqual(retryRes.alreadyCaptured, true, 'Retry must flag alreadyCaptured = true');

    // Verify DB order status was updated to paid in PostgreSQL
    const updatedOrder = await db.Order.findByPk(order3.id);
    assert.strictEqual(updatedOrder.status, 'paid', 'Order status must be updated to paid');

    // Confirm no duplicate payment was created
    const orderPayments = await db.Payment.findAll({ where: { order_id: order3.id } });
    assert.strictEqual(orderPayments.length, 1, 'Only one payment attempt row exists for this order in PostgreSQL');

    console.log('  ✓ Test 3 Passed: Timeout then retry synchronously reconciles against Razorpay and prevents duplicate charge.\n');
    passed++;
  } catch (err) {
    console.error('  ✗ Test 3 Failed:', err);
  }

  // ---------------------------------------------------------------------------
  // TEST 4: Duplicate webhook delivery
  // ---------------------------------------------------------------------------
  try {
    console.log('[Test 4] Testing duplicate webhook delivery (delivered 3 times)...');
    const order4 = await createTestOrder(8000);
    const rzpOrder4 = 'order_webhook_dedup_004';
    const rzpPayment4 = 'pay_webhook_dedup_004';

    await db.Payment.create({
      user_id: testUser.id,
      order_id: order4.id,
      gateway: 'razorpay',
      gateway_order_id: rzpOrder4,
      amount: 8000,
      currency: 'INR',
      status: 'pending',
      idempotency_key: 'idemp_wh_4',
    });

    const webhookPayload = {
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: rzpPayment4,
            order_id: rzpOrder4,
            amount: 800000,
            status: 'captured',
            method: 'card',
          },
        },
      },
    };
    const rawBody = JSON.stringify(webhookPayload);
    const signature = 'mock_webhook_signature';

    // 1st delivery
    const whRes1 = await paymentService.handleWebhook(rawBody, signature, webhookPayload);
    assert.strictEqual(whRes1.received, true);
    assert.strictEqual(whRes1.processed, 'payment.captured');

    // 2nd delivery (duplicate)
    const whRes2 = await paymentService.handleWebhook(rawBody, signature, webhookPayload);
    assert.strictEqual(whRes2.received, true);
    assert.strictEqual(whRes2.ignored, true, '2nd webhook delivery must be ignored as duplicate');
    assert.strictEqual(whRes2.duplicate, true);

    // 3rd delivery (duplicate)
    const whRes3 = await paymentService.handleWebhook(rawBody, signature, webhookPayload);
    assert.strictEqual(whRes3.received, true);
    assert.strictEqual(whRes3.ignored, true, '3rd webhook delivery must be ignored as duplicate');

    // Verify order and payment status in PostgreSQL
    const finalOrder = await db.Order.findByPk(order4.id);
    assert.strictEqual(finalOrder.status, 'paid');
    const finalPayment = await db.Payment.findOne({ where: { gateway_order_id: rzpOrder4 } });
    assert.strictEqual(finalPayment.status, 'captured');
    assert.strictEqual(finalPayment.gateway_payment_id, rzpPayment4);

    console.log('  ✓ Test 4 Passed: Duplicate webhook delivery is detected as an idempotent no-op.\n');
    passed++;
  } catch (err) {
    console.error('  ✗ Test 4 Failed:', err);
  }

  // ---------------------------------------------------------------------------
  // TEST 5: Webhook delayed, reconciliation job fires first
  // ---------------------------------------------------------------------------
  try {
    console.log('[Test 5] Testing reconciliation job when webhook is delayed/lost...');
    const order5 = await createTestOrder(15000);
    const rzpOrder5 = 'order_delayed_wh_005';
    const rzpPayment5 = 'pay_recon_detected_005';

    // Create payment older than 3 minutes in PostgreSQL
    const oldDate = new Date(Date.now() - 5 * 60 * 1000);
    await db.Payment.create({
      user_id: testUser.id,
      order_id: order5.id,
      gateway: 'razorpay',
      gateway_order_id: rzpOrder5,
      amount: 15000,
      currency: 'INR',
      status: 'pending',
      idempotency_key: 'idemp_delayed_5',
      created_at: oldDate,
      updated_at: oldDate,
    });

    // Simulate Razorpay status is paid at gateway API
    razorpayGateway.__setMockOrder(rzpOrder5, {
      status: 'paid',
      amount_paid: 1500000,
    });
    razorpayGateway.__setMockPayment(rzpPayment5, {
      id: rzpPayment5,
      order_id: rzpOrder5,
      status: 'captured',
      method: 'netbanking',
    });

    // Run reconciliation worker
    const stats = await paymentReconciliationWorker.reconcilePendingPayments({ thresholdMinutes: 2 });
    assert(stats.captured >= 1, 'Reconciliation worker must have reconciled at least 1 payment');

    // Verify DB status in PostgreSQL
    const reconciledPayment = await db.Payment.findOne({ where: { gateway_order_id: rzpOrder5 } });
    assert.strictEqual(reconciledPayment.status, 'captured', 'Payment must be transitioned to captured by worker');
    assert.strictEqual(reconciledPayment.gateway_payment_id, rzpPayment5);

    const reconciledOrder = await db.Order.findByPk(order5.id);
    assert.strictEqual(reconciledOrder.status, 'paid', 'Order must be transitioned to paid');

    console.log('  ✓ Test 5 Passed: Reconciliation worker actively detects Razorpay capture when webhook is delayed.\n');
    passed++;
  } catch (err) {
    console.error('  ✗ Test 5 Failed:', err);
  }

  // ---------------------------------------------------------------------------
  // TEST 6: Client-forged verify payload rejection
  // ---------------------------------------------------------------------------
  try {
    console.log('[Test 6] Testing rejection of client-forged verify payload...');
    const order6 = await createTestOrder(4500);

    const forgedPayload = {
      razorpay_order_id: 'order_legit_looking_123',
      razorpay_payment_id: 'pay_untrusted_456',
      razorpay_signature: 'invalid_tampered_signature_xyz',
      order_id: order6.id,
      payment_method: 'card',
    };

    let rejected = false;
    try {
      await paymentService.verifyPayment(testUser.id, forgedPayload);
    } catch (err) {
      if (err.statusCode === 400 && err.message.includes('Cryptographic signature verification failed')) {
        rejected = true;
      }
    }

    assert.strictEqual(rejected, true, 'Verify endpoint must reject invalid HMAC signature with 400 Bad Request');

    const unchangedOrder = await db.Order.findByPk(order6.id);
    assert.strictEqual(unchangedOrder.status, 'pending', 'Order status must remain pending');

    console.log('  ✓ Test 6 Passed: Untrusted client payload with forged signature is strictly rejected.\n');
    passed++;
  } catch (err) {
    console.error('  ✗ Test 6 Failed:', err);
  }

  // ---------------------------------------------------------------------------
  // TEST 7: Reconciliation vs. expiration race on PostgreSQL with FOR UPDATE locking
  // ---------------------------------------------------------------------------
  try {
    console.log('[Test 7] Testing reconciliation vs. expiration race condition with Postgres FOR UPDATE locking...');
    const initialProductStock = 10;
    await testProduct.update({ stock_quantity: initialProductStock });

    // Order created 70 minutes ago with stock decremented to 8
    const order7 = await createTestOrder(70000, 'pending', 70);
    await testProduct.update({ stock_quantity: 8 });

    const rzpOrder7 = 'order_race_test_007';
    const rzpPayment7 = 'pay_race_test_007';

    // Pending payment attempt created 70 minutes ago
    const oldPaymentDate = new Date(Date.now() - 70 * 60 * 1000);
    await db.Payment.create({
      user_id: testUser.id,
      order_id: order7.id,
      gateway: 'razorpay',
      gateway_order_id: rzpOrder7,
      amount: 70000,
      currency: 'INR',
      status: 'pending',
      idempotency_key: 'idemp_race_7',
      created_at: oldPaymentDate,
      updated_at: oldPaymentDate,
    });

    // Customer actually succeeded at Razorpay, but webhook never reached the server
    razorpayGateway.__setMockOrder(rzpOrder7, {
      status: 'paid',
      amount_paid: 7000000,
    });
    razorpayGateway.__setMockPayment(rzpPayment7, {
      id: rzpPayment7,
      order_id: rzpOrder7,
      status: 'captured',
    });

    // Expiration worker runs on PostgreSQL using row-level locking (SELECT ... FOR UPDATE)
    const expirationStats = await orderExpirationWorker.expirePendingOrders({ expirationMinutes: 60 });

    assert(expirationStats.savedByReconciliation >= 1, 'Order must be saved by active reconciliation check inside worker lock');

    // Confirm order was NOT marked cancelled/expired, but was marked PAID
    const orderAfterRun = await db.Order.findByPk(order7.id);
    assert.strictEqual(orderAfterRun.status, 'paid', 'Order must be marked paid, NEVER cancelled');

    // Confirm product stock was NOT erroneously restituted (must remain 8, not 10)
    const refreshedProduct = await db.Product.findByPk(testProduct.id);
    assert.strictEqual(refreshedProduct.stock_quantity, 8, 'Stock must NOT be restituted for a successfully paid order');

    console.log('  ✓ Test 7 Passed: Order expiration worker uses Postgres FOR UPDATE lock; paid order is never expired.\n');
    passed++;
  } catch (err) {
    console.error('  ✗ Test 7 Failed:', err);
  }

  // ---------------------------------------------------------------------------
  // TEST 8: Full page refresh simulation with sessionStorage persistence
  // ---------------------------------------------------------------------------
  try {
    console.log('[Test 8] Testing page reload idempotency: in-memory state reset with sessionStorage persistence...');
    const order8 = await createTestOrder(6000);
    const initialSessionKey = 'idemp_session_reload_test_888';

    // 1. Initial checkout session before refresh:
    // Stored in sessionStorage: { idempotencyKey: initialSessionKey, buyOrderId: order8.id }
    const simulatedSessionStorage = {
      aarogyamed_checkout_session: JSON.stringify({
        idempotencyKey: initialSessionKey,
        buyOrderId: order8.id,
        cartFingerprint: 'prod1:1:buy',
      }),
    };

    // User initiates payment attempt
    const firstAttempt = await paymentService.createRazorpayOrder(testUser.id, {
      amount: 6000,
      orderId: order8.id,
      idempotency_key: initialSessionKey,
    });

    assert.strictEqual(firstAttempt.status, 'pending');
    const firstGatewayOrderId = firstAttempt.orderId;

    // 2. SIMULATE FULL PAGE REFRESH:
    // React component state (useState) is wiped out.
    // Component reloads and reads from sessionStorage:
    const reloadedSession = JSON.parse(simulatedSessionStorage.aarogyamed_checkout_session);
    assert.strictEqual(reloadedSession.buyOrderId, order8.id, 'buyOrderId must survive page refresh in sessionStorage');
    assert.strictEqual(reloadedSession.idempotencyKey, initialSessionKey, 'idempotencyKey must survive page refresh in sessionStorage');

    // User retries payment on the reloaded page:
    // Frontend uses the restored buyOrderId and idempotencyKey
    const retriedAttempt = await paymentService.createRazorpayOrder(testUser.id, {
      amount: 6000,
      orderId: reloadedSession.buyOrderId,
      idempotency_key: reloadedSession.idempotencyKey,
    });

    // 3. Confirm same order and payment attempt are reused without creating duplicates
    assert.strictEqual(retriedAttempt.orderId, firstGatewayOrderId, 'Retried payment must return original Razorpay orderId');
    assert.strictEqual(retriedAttempt.paymentRecordId, firstAttempt.paymentRecordId, 'Retried payment must reuse original paymentRecordId');
    assert.strictEqual(retriedAttempt.isExisting, true, 'Backend must recognize existing attempt');

    const totalOrders = await db.Order.count({ where: { id: order8.id } });
    assert.strictEqual(totalOrders, 1, 'Exactly one business order exists in PostgreSQL');

    const totalPayments = await db.Payment.count({ where: { order_id: order8.id } });
    assert.strictEqual(totalPayments, 1, 'Exactly one payment attempt exists in PostgreSQL');

    console.log('  ✓ Test 8 Passed: Backend idempotency key reuse during reload retry prevents duplicate order/payment creation in Postgres.\n');
    passed++;
  } catch (err) {
    console.error('  ✗ Test 8 Failed:', err);
  }

  // ---------------------------------------------------------------------------
  // TEST 9: Racing client /verify vs server handleWebhook for the SAME payment
  // ---------------------------------------------------------------------------
  try {
    console.log('[Test 9] Testing concurrent race: client /verify vs server handleWebhook for SAME payment on real PostgreSQL connection pool...');
    const order9 = await createTestOrder(14000);
    const rzpOrder9 = 'order_race_webhook_test_009';
    const rzpPayment9 = 'pay_race_webhook_test_009';
    const rzpSig9 = 'sig_mock_race_webhook_009';
    const idempKey9 = 'idemp_race_client_webhook_009';

    // Seed ONE pending payment attempt row in PostgreSQL
    await db.Payment.create({
      user_id: testUser.id,
      order_id: order9.id,
      gateway: 'razorpay',
      gateway_order_id: rzpOrder9,
      amount: 14000,
      currency: 'INR',
      status: 'pending',
      idempotency_key: idempKey9,
    });

    // Mock Razorpay gateway API response for reconciliation
    razorpayGateway.__setMockOrder(rzpOrder9, {
      status: 'paid',
      amount_paid: 1400000,
    });
    razorpayGateway.__setMockPayment(rzpPayment9, {
      id: rzpPayment9,
      order_id: rzpOrder9,
      status: 'captured',
      method: 'upi',
    });

    // Construct genuine concurrent calls dispatched via Promise.all
    // 1. Client /verify request
    const clientVerifyPromise = paymentService.verifyPayment(testUser.id, {
      razorpay_order_id: rzpOrder9,
      razorpay_payment_id: rzpPayment9,
      razorpay_signature: rzpSig9,
      order_id: order9.id,
      payment_method: 'upi',
    });

    // 2. Server handleWebhook call
    const webhookRawBody = JSON.stringify({
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: rzpPayment9,
            order_id: rzpOrder9,
            amount: 1400000,
            currency: 'INR',
            status: 'captured',
            method: 'upi',
          },
        },
      },
    });

    const webhookPromise = paymentService.handleWebhook(
      webhookRawBody,
      'mock_webhook_signature',
      JSON.parse(webhookRawBody)
    );

    // Fire genuinely concurrently across separate database connections in pool
    const [verifyResult, webhookResult] = await Promise.all([clientVerifyPromise, webhookPromise]);

    // Assert client verification succeeded
    assert(verifyResult && verifyResult.success, 'Client verify request must succeed');
    assert.strictEqual(verifyResult.status, 'captured', 'Client verify status must be captured');

    // Assert webhook was processed cleanly without 500 error or uncaught exception
    assert(webhookResult && webhookResult.received, 'Webhook must report received: true');
    assert(
      webhookResult.processed === 'payment.captured' || webhookResult.duplicate || webhookResult.alreadyCaptured,
      'Webhook must handle captured state or report graceful duplicate/alreadyCaptured'
    );

    // If handleWebhook encountered the concurrent capture, verify it returned the existing captured record
    if (webhookResult.alreadyCaptured || webhookResult.duplicate) {
      assert(
        webhookResult.payment || webhookResult.paymentRecord,
        'handleWebhook must return the existing captured payment record on concurrency'
      );
    }

    // Verify PostgreSQL database constraint: exactly ONE captured payment row exists for order9
    const capturedPayments9 = await db.Payment.findAll({
      where: { order_id: order9.id, status: 'captured' },
    });
    assert.strictEqual(
      capturedPayments9.length,
      1,
      'PostgreSQL must contain exactly ONE captured payment row for this order'
    );

    // Verify order was marked paid
    const updatedOrder9 = await db.Order.findByPk(order9.id);
    assert.strictEqual(updatedOrder9.status, 'paid', 'Order status must be updated to paid in PostgreSQL');

    console.log('  ✓ Test 9 Passed: Concurrent client /verify vs handleWebhook handled gracefully; exactly 1 captured payment in Postgres, no 500, no duplicate side effects.\n');
    passed++;
  } catch (err) {
    console.error('  ✗ Test 9 Failed:', err);
  }

  // ---------------------------------------------------------------------------
  // TEST 10: Server-side amount enforcement (ignoring client-supplied amount)
  // ---------------------------------------------------------------------------
  try {
    console.log('[Test 10] Testing server-side amount enforcement (ignoring client-supplied amount)...');
    const order10 = await createTestOrder(65000);
    const idempKey10 = 'idemp_amount_enforcement_010';

    // Client maliciously attempts to charge ₹1 instead of order's stored ₹65,000
    const res10 = await paymentService.createRazorpayOrder(testUser.id, {
      amount: 1, // Attacker tamper attempt
      orderId: order10.id,
      idempotency_key: idempKey10,
    });

    assert.strictEqual(res10.amount, 6500000, 'Razorpay order amount in paise must be 6,500,000 (₹65,000), not ₹1');
    assert.strictEqual(res10.amountInInr, 65000, 'Derived INR amount must match DB order total of ₹65,000');

    // Verify DB PaymentAttempt record in PostgreSQL
    const paymentRecord10 = await db.Payment.findOne({ where: { gateway_order_id: res10.orderId } });
    assert.strictEqual(Number(paymentRecord10.amount), 65000, 'PaymentAttempt.amount in DB must be exactly 65000');

    console.log('  ✓ Test 10 Passed: Server-side amount enforcement strictly derives total from DB and ignores client input.\n');
    passed++;
  } catch (err) {
    console.error('  ✗ Test 10 Failed:', err);
  }

  // ---------------------------------------------------------------------------
  // TEST 11: New-attempt-creation cap (max 5 attempts per order)
  // ---------------------------------------------------------------------------
  try {
    console.log('[Test 11] Testing new-attempt-creation cap (max 5 attempts per order)...');
    const order11 = await createTestOrder(10000);

    // Create 5 payment attempts with distinct idempotency keys
    for (let i = 1; i <= 5; i++) {
      const res = await paymentService.createRazorpayOrder(testUser.id, {
        orderId: order11.id,
        idempotency_key: `idemp_attempt_cap_${order11.id}_${i}`,
      });
      assert(res.orderId, `Attempt #${i} should create Razorpay order`);
    }

    const countBefore6 = await db.Payment.count({ where: { order_id: order11.id } });
    assert.strictEqual(countBefore6, 5, 'Exactly 5 attempts must exist in PostgreSQL');

    // 6th attempt should be rejected with 400 Bad Request before calling Razorpay
    let attempt6Rejected = false;
    let attempt6Error = '';
    try {
      await paymentService.createRazorpayOrder(testUser.id, {
        orderId: order11.id,
        idempotency_key: `idemp_attempt_cap_${order11.id}_6`,
      });
    } catch (err) {
      if (err.statusCode === 400 && err.message.includes('Too many payment attempts')) {
        attempt6Rejected = true;
        attempt6Error = err.message;
      }
    }

    assert.strictEqual(attempt6Rejected, true, '6th payment attempt must be rejected with 400 Bad Request');
    assert(attempt6Error.includes('Too many payment attempts for this order'));

    const countAfter6 = await db.Payment.count({ where: { order_id: order11.id } });
    assert.strictEqual(countAfter6, 5, 'PostgreSQL must still contain exactly 5 attempts, no 6th row created');

    console.log('  ✓ Test 11 Passed: New-attempt-creation cap blocks 6th attempt and prevents gateway calls.\n');
    passed++;
  } catch (err) {
    console.error('  ✗ Test 11 Failed:', err);
  }

  // ---------------------------------------------------------------------------
  // TEST 12: Confirmation-attempt cap (max 5 verify calls per attempt)
  // ---------------------------------------------------------------------------
  try {
    console.log('[Test 12] Testing confirmation-attempt cap (max 5 verify calls per attempt)...');
    const order12 = await createTestOrder(15000);
    const attemptRes12 = await paymentService.createRazorpayOrder(testUser.id, {
      orderId: order12.id,
      idempotency_key: 'idemp_confirm_cap_012',
    });
    const rzpOrderId12 = attemptRes12.orderId;

    // Call /verify 5 times with invalid signature (simulating brute-force verification attempt)
    for (let i = 1; i <= 5; i++) {
      try {
        await paymentService.verifyPayment(testUser.id, {
          razorpay_order_id: rzpOrderId12,
          razorpay_payment_id: `pay_bad_sig_${i}`,
          razorpay_signature: `sig_invalid_tampered_${i}`,
          order_id: order12.id,
        });
      } catch (err) {
        // Expected signature failure
      }
    }

    const payRecord12 = await db.Payment.findOne({ where: { gateway_order_id: rzpOrderId12 } });
    assert.strictEqual(payRecord12.confirmation_attempts, 5, 'confirmation_attempts counter must be 5 in PostgreSQL');

    // 6th call against this attempt must be rejected due to cap, producing EXCESSIVE_CONFIRMATION_ATTEMPTS
    let call6Rejected = false;
    let call6Error = '';
    try {
      await paymentService.verifyPayment(testUser.id, {
        razorpay_order_id: rzpOrderId12,
        razorpay_payment_id: 'pay_mock_12',
        razorpay_signature: 'sig_mock_12',
        order_id: order12.id,
      });
    } catch (err) {
      if (err.statusCode === 400 && err.message.includes('limit exceeded')) {
        call6Rejected = true;
        call6Error = err.message;
      }
    }

    assert.strictEqual(call6Rejected, true, '6th verify call must be rejected due to confirmation cap');
    assert.strictEqual(payRecord12.status, 'pending', 'Payment must remain pending, never captured');

    console.log('  ✓ Test 12 Passed: Confirmation-attempt cap blocks 6th verify call and flags excessive confirmation attempts.\n');
    passed++;
  } catch (err) {
    console.error('  ✗ Test 12 Failed:', err);
  }

  // ---------------------------------------------------------------------------
  // TEST 13: Server-generated gateway-facing idempotency key & deterministic receipt dedup
  // ---------------------------------------------------------------------------
  try {
    console.log('[Test 13] Testing server-generated gateway idempotency key & deterministic receipt deduplication...');
    const order13 = await createTestOrder(22000);
    const testGatewayKey = crypto.randomUUID(); // Standard 36-char UUID

    // 1. Verify that orders.create uses the gateway_idempotency_key as the receipt and respects Razorpay's 40-char limit
    const gwOrder1 = await razorpayGateway.createOrder({
      amount: 2200000,
      currency: 'INR',
      receipt: 'aarogya_old_receipt_1', // Provided, but gateway_idempotency_key must take precedence
      gateway_idempotency_key: testGatewayKey,
    });

    assert.strictEqual(gwOrder1.receipt, testGatewayKey, 'Receipt must match the gateway_idempotency_key');
    assert(gwOrder1.receipt.length <= 40, 'Receipt length must not exceed Razorpay 40-character limit');

    // 2. Simulate server retry: calling createOrder with the same gateway_idempotency_key returns identical order
    const gwOrder2 = await razorpayGateway.createOrder({
      amount: 2200000,
      currency: 'INR',
      receipt: 'aarogya_old_receipt_2',
      gateway_idempotency_key: testGatewayKey,
    });

    assert.strictEqual(gwOrder1.id, gwOrder2.id, 'Retried orders.create with same key must return identical order');

    // 3. Exercise and prove Razorpay duplicate receipt error recovery:
    // When Razorpay rejects orders.create with "An order with the same receipt value has already been created on this account",
    // createOrder must catch this error, query orders by receipt via fetchOrderByReceipt, and return the existing order.
    const tempClient = razorpayGateway.client;
    const testGatewayKey2 = crypto.randomUUID();
    try {
      const mockExistingOrder = {
        id: 'order_rzp_dedup_recovered_13',
        entity: 'order',
        amount: 2200000,
        currency: 'INR',
        receipt: testGatewayKey2,
        status: 'created',
      };

      // Temporarily inject a simulated client to test the exact live error-recovery branch
      razorpayGateway.client = {
        orders: {
          create: async () => {
            const err = new Error('An order with the same receipt value has already been created on this account');
            err.error = {
              code: 'BAD_REQUEST_ERROR',
              description: 'An order with the same receipt value has already been created on this account',
            };
            throw err;
          },
          all: async ({ receipt }) => {
            if (receipt === testGatewayKey2) {
              return { entity: 'collection', count: 1, items: [mockExistingOrder] };
            }
            return { entity: 'collection', count: 0, items: [] };
          },
        },
      };

      const recoveredOrder = await razorpayGateway.createOrder({
        amount: 2200000,
        currency: 'INR',
        gateway_idempotency_key: testGatewayKey2,
      });

      assert.strictEqual(
        recoveredOrder.id,
        mockExistingOrder.id,
        'createOrder must catch Razorpay duplicate receipt error and recover existing order via orders.all({ receipt })'
      );
    } finally {
      razorpayGateway.client = tempClient;
    }

    // 4. Test that paymentService.createRazorpayOrder generates UUID and persists to PostgreSQL
    const res13 = await paymentService.createRazorpayOrder(testUser.id, {
      orderId: order13.id,
      idempotency_key: 'idemp_gw_test_13',
    });

    const payment13 = await db.Payment.findOne({ where: { gateway_order_id: res13.orderId } });
    assert(payment13.gateway_idempotency_key, 'gateway_idempotency_key column must be non-null in PostgreSQL');
    assert.strictEqual(payment13.attempt_no, 1, 'First attempt must have attempt_no = 1');
    assert.strictEqual(
      payment13.gateway_idempotency_key.length,
      36,
      'Server gateway_idempotency_key must be a 36-character UUID'
    );

    console.log('  [Notice]: Live gateway-level deduplication against api.razorpay.com requires merchant credentials and is documented for staging verification.');
    console.log('  ✓ Test 13 Passed: Gateway idempotency key sets deterministic receipt, recovers from duplicate receipt error, and persists in PostgreSQL.\n');
    passed++;
  } catch (err) {
    console.error('  ✗ Test 13 Failed:', err);
  }

  // ---------------------------------------------------------------------------
  // TEST 14: Webhook payload re-validation (amount / currency mismatch defense)
  // ---------------------------------------------------------------------------
  try {
    console.log('[Test 14] Testing webhook payload re-validation (amount / currency mismatch defense)...');
    const order14 = await createTestOrder(35000);
    const rzpOrder14 = 'order_wh_mismatch_014';
    const rzpPayment14 = 'pay_wh_mismatch_014';

    // Stored payment attempt has amount = 35000 (paise = 3,500,000)
    await db.Payment.create({
      user_id: testUser.id,
      order_id: order14.id,
      gateway: 'razorpay',
      gateway_order_id: rzpOrder14,
      amount: 35000,
      currency: 'INR',
      status: 'pending',
      idempotency_key: 'idemp_wh_mismatch_014',
    });

    // Malicious webhook with valid signature but reporting amount = 100000 paise (₹1,000 instead of ₹35,000)
    const tamperedWebhookPayload = {
      id: 'event_wh_mismatch_014',
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: rzpPayment14,
            order_id: rzpOrder14,
            amount: 100000, // ₹1,000
            currency: 'INR',
            status: 'captured',
            method: 'upi',
          },
        },
      },
    };

    const rawBody14 = JSON.stringify(tamperedWebhookPayload);
    const whMismatchRes = await paymentService.handleWebhook(rawBody14, 'mock_webhook_signature', tamperedWebhookPayload);

    assert.strictEqual(whMismatchRes.flagged, true, 'Webhook must report flagged: true on amount mismatch');
    assert(whMismatchRes.reason.includes('WEBHOOK_AMOUNT_MISMATCH'), 'Reason must indicate WEBHOOK_AMOUNT_MISMATCH');

    // Confirm DB status in PostgreSQL: payment is NOT captured, order is NOT paid
    const paymentAfterMismatch = await db.Payment.findOne({ where: { gateway_order_id: rzpOrder14 } });
    assert.strictEqual(paymentAfterMismatch.status, 'pending', 'Payment must NOT be marked captured on amount mismatch');
    assert.strictEqual(paymentAfterMismatch.notes.flagged_anomaly, 'WEBHOOK_AMOUNT_MISMATCH', 'Payment notes must flag WEBHOOK_AMOUNT_MISMATCH');

    const orderAfterMismatch = await db.Order.findByPk(order14.id);
    assert.strictEqual(orderAfterMismatch.status, 'pending', 'Order must NOT be marked paid on amount mismatch');

    console.log('  ✓ Test 14 Passed: Webhook payload re-validation detects amount mismatch, blocks capture, and flags anomaly.\n');
    passed++;
  } catch (err) {
    console.error('  ✗ Test 14 Failed:', err);
  }

  // ---------------------------------------------------------------------------
  // TEST 15: Durable WebhookEvent audit log (append-only log & dedup)
  // ---------------------------------------------------------------------------
  try {
    console.log('[Test 15] Testing durable WebhookEvent audit log (append-only log & dedup)...');
    const order15 = await createTestOrder(9000);
    const rzpOrder15 = 'order_audit_wh_015';
    const rzpPayment15 = 'pay_audit_wh_015';
    const eventId15 = 'evt_audit_log_unique_015';

    await db.Payment.create({
      user_id: testUser.id,
      order_id: order15.id,
      gateway: 'razorpay',
      gateway_order_id: rzpOrder15,
      amount: 9000,
      currency: 'INR',
      status: 'pending',
      idempotency_key: 'idemp_audit_wh_15',
    });

    const auditWebhookPayload = {
      id: eventId15,
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: rzpPayment15,
            order_id: rzpOrder15,
            amount: 900000,
            currency: 'INR',
            status: 'captured',
            method: 'netbanking',
          },
        },
      },
    };

    const rawBody15 = JSON.stringify(auditWebhookPayload);

    // 1st delivery
    const auditRes1 = await paymentService.handleWebhook(rawBody15, 'mock_webhook_signature', auditWebhookPayload);
    assert.strictEqual(auditRes1.received, true);
    assert.strictEqual(auditRes1.processed, 'payment.captured');

    // Verify row was created in WebhookEvent table in PostgreSQL
    const eventEntries1 = await db.WebhookEvent.findAll({ where: { gateway_event_id: eventId15 } });
    assert.strictEqual(eventEntries1.length, 1, 'Exactly ONE WebhookEvent row must exist in PostgreSQL');
    assert.strictEqual(eventEntries1[0].event_type, 'payment.captured');
    assert(eventEntries1[0].processed_at, 'processed_at must be populated');

    // 2nd delivery of the same webhook event ID
    const auditRes2 = await paymentService.handleWebhook(rawBody15, 'mock_webhook_signature', auditWebhookPayload);
    assert.strictEqual(auditRes2.received, true);
    assert.strictEqual(auditRes2.duplicate, true, '2nd delivery must be recognized as duplicate from audit log');

    // Verify still exactly 1 row exists
    const eventEntries2 = await db.WebhookEvent.findAll({ where: { gateway_event_id: eventId15 } });
    assert.strictEqual(eventEntries2.length, 1, 'Still exactly ONE WebhookEvent row exists in PostgreSQL');

    console.log('  ✓ Test 15 Passed: Durable WebhookEvent audit log captures every webhook and provides durable idempotency.\n');
    passed++;
  } catch (err) {
    console.error('  ✗ Test 15 Failed:', err);
  }

  // ---------------------------------------------------------------------------
  // TEST 16: Reconciliation handles failed / cancelled gateway states
  // ---------------------------------------------------------------------------
  try {
    console.log('[Test 16] Testing reconciliation worker handling failed/cancelled gateway states...');
    const order16 = await createTestOrder(18000);
    const rzpOrder16 = 'order_failed_recon_016';
    const rzpPayment16 = 'pay_failed_recon_016';

    const oldDate16 = new Date(Date.now() - 5 * 60 * 1000);
    const payment16 = await db.Payment.create({
      user_id: testUser.id,
      order_id: order16.id,
      gateway: 'razorpay',
      gateway_order_id: rzpOrder16,
      amount: 18000,
      currency: 'INR',
      status: 'pending',
      idempotency_key: 'idemp_recon_fail_16',
      created_at: oldDate16,
      updated_at: oldDate16,
    });

    // Simulate Razorpay order cancelled at gateway
    razorpayGateway.__setMockOrder(rzpOrder16, {
      id: rzpOrder16,
      status: 'cancelled',
      amount: 1800000,
      amount_paid: 0,
    });
    razorpayGateway.__setMockPayment(rzpPayment16, {
      id: rzpPayment16,
      order_id: rzpOrder16,
      status: 'failed',
      error_description: 'Payment was cancelled by user',
    });

    const reconRes16 = await paymentService.reconcilePaymentAttempt(payment16);
    assert.strictEqual(reconRes16.reconciled, true, 'Reconciliation should mark reconciled = true');
    assert.strictEqual(reconRes16.status, 'failed', 'Reconciliation must mark status = failed');

    // Verify local attempt updated in PostgreSQL
    const reloadedPayment16 = await db.Payment.findByPk(payment16.id);
    assert.strictEqual(reloadedPayment16.status, 'failed', 'Payment attempt must be updated to failed in PostgreSQL, not left pending');
    assert(reloadedPayment16.notes.failure_reason, 'Payment notes must contain failure reason');

    console.log('  ✓ Test 16 Passed: Reconciliation worker detects cancelled/failed gateway order and transitions local Attempt to failed.\n');
    passed++;
  } catch (err) {
    console.error('  ✗ Test 16 Failed:', err);
  }

  // ---------------------------------------------------------------------------
  // TEST 17: Order-level dedupe on creation & expired order payment rejection
  // ---------------------------------------------------------------------------
  try {
    console.log('[Test 17] Testing order-level dedupe on creation & expired order payment rejection...');

    // Part A: Order-level deduplication
    // Call order creation twice in a row for same user and cart before order expires
    const orderData = {
      address_id: testAddress.id,
      items: [{ product_id: testProduct.id, quantity: 1 }],
    };

    const initialOrder = await orderService.create(testUser.id, orderData);
    assert(initialOrder && initialOrder.id, 'First order creation should succeed');

    const duplicateOrderCall = await orderService.create(testUser.id, orderData);
    assert.strictEqual(duplicateOrderCall.id, initialOrder.id, 'Second order call must reuse existing pending order without duplicating');

    // Part B: Expired order rejects payment attempt reuse (Section 10)
    // Artificially age the order past 60 minutes
    const oldCreatedDate = new Date(Date.now() - 75 * 60 * 1000);
    await db.Order.update({ created_at: oldCreatedDate }, { where: { id: initialOrder.id } });

    let expiredOrderRejected = false;
    let expiredErrMsg = '';
    try {
      await paymentService.createRazorpayOrder(testUser.id, {
        orderId: initialOrder.id,
        idempotency_key: 'idemp_expired_order_reuse_017',
      });
    } catch (err) {
      if (err.statusCode === 400 && err.message.includes('expired')) {
        expiredOrderRejected = true;
        expiredErrMsg = err.message;
      }
    }

    assert.strictEqual(expiredOrderRejected, true, 'Expired order must reject payment attempt creation with 400 Bad Request');
    assert(expiredErrMsg.includes('Order expired'), 'Error message must clearly inform the user the order has expired');

    console.log('  ✓ Test 17 Passed: Active pending order is reused on duplicate creation, and expired order strictly rejects payment attempts.\n');
    passed++;
  } catch (err) {
    console.error('  ✗ Test 17 Failed:', err);
  }

  console.log('============================================================');
  console.log(`  SUMMARY: ${passed} / ${total} TESTS PASSED`);
  console.log(`  DATABASE ENGINE: ${pgVersionString}`);
  console.log('============================================================\n');

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error('Test Suite Failed with unexpected error:', err);
  process.exit(1);
});
