'use strict';

/**
 * End-to-End API Integration & Security Test Suite
 *
 * Verifies core application journeys, access controls, input validations,
 * security protections, and error handling.
 */

process.env.NODE_ENV = 'test';
process.env.WHATSAPP_PROVIDER = 'mock';
if (!process.env.DB_PORT) process.env.DB_PORT = '5434';
if (!process.env.DB_TEST_PORT) process.env.DB_TEST_PORT = process.env.DB_PORT || '5434';
if (!process.env.DB_HOST) process.env.DB_HOST = 'localhost';
if (!process.env.DB_TEST_HOST) process.env.DB_TEST_HOST = process.env.DB_HOST || 'localhost';

const http = require('http');
const assert = require('assert');
const app = require('../index');
const { sequelize, User, Address, Category, Product, Order, RentalOrder } = require('../models');

let server;
let baseUrl;
let rootUrl;

let customerUser;
let customerToken;
let customer2User;
let customer2Token;
let adminUser;
let adminToken;
let testCategory;
let testProduct;

async function request(path, options = {}) {
  const url = path.startsWith('http') ? path : `${baseUrl}${path}`;
  const headers = { ...(options.headers || {}) };
  let body = options.body;
  if (body !== undefined && typeof body !== 'string' && !(body instanceof Buffer)) {
    if (!headers['Content-Type']) headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  } else if (body !== undefined && typeof body === 'string' && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  const response = await fetch(url, {
    ...options,
    headers,
    body,
  });
  let data = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }
  return { status: response.status, headers: response.headers, data };
}

async function setup() {
  await sequelize.authenticate();

  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  baseUrl = `http://localhost:${port}/api/v1`;
  rootUrl = `http://localhost:${port}`;

  // Create test category and product
  [testCategory] = await Category.findOrCreate({
    where: { slug: 'test-qa-integration-category' },
    defaults: {
      name: 'Test QA Integration Category',
      slug: 'test-qa-integration-category',
      is_active: true,
    },
  });

  [testProduct] = await Product.findOrCreate({
    where: { slug: 'test-qa-concentrator-pro' },
    defaults: {
      name: 'Test QA Oxygen Concentrator Pro',
      slug: 'test-qa-concentrator-pro',
      category_id: testCategory.id,
      brand: 'Omkar Test Labs',
      description: 'Reliable test unit for integration suite',
      buy_price: 35000,
      buy_mrp: 42000,
      buy_available: true,
      rent_price_daily: 250,
      rent_price_weekly: 1500,
      rent_price_monthly: 4500,
      rent_deposit: 8000,
      rent_available: true,
      stock_quantity: 50,
      status: 'active',
    },
  });
}

async function teardown() {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  try {
    await sequelize.close();
  } catch (_) {}
}

async function runTests() {
  console.log('\n--- STARTING E2E API INTEGRATION & SECURITY TEST SUITE ---\n');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    process.stdout.write(`• ${name} ... `);
    try {
      await fn();
      console.log('PASSED');
      passed++;
    } catch (err) {
      console.log('FAILED');
      console.error(err);
      failed++;
    }
  }

  // --- HEALTH & DEVOPS ---
  await test('1. GET /health returns 200 with uptime and service info', async () => {
    const res = await request(`${rootUrl}/health`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.status, 'ok');
    assert.strictEqual(res.data.service, 'omkar-healthcare-backend');
    assert(typeof res.data.uptime === 'number');
  });

  await test('2. GET /health/ready returns 200 with connected database', async () => {
    const res = await request(`${rootUrl}/health/ready`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.status, 'ready');
    assert.strictEqual(res.data.database, 'connected');
  });

  // --- AUTHENTICATION & ACCESS CONTROL ---
  await test('3. POST /auth/register creates new customer and returns JWT', async () => {
    const uniqueEmail = `qa.test.${Date.now()}@omkarhealthcare.test`;
    const res = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'QA Patient One',
        email: uniqueEmail,
        password: 'Password@1234',
        phone: `+9199${Math.floor(10000000 + Math.random() * 90000000)}`,
      },
    });

    assert.strictEqual(res.status, 201);
    assert(res.data.data.token, 'Expected JWT token');
    assert.strictEqual(res.data.data.user.email, uniqueEmail);
    assert.strictEqual(res.data.data.user.role, 'customer');

    customerUser = res.data.data.user;
    customerToken = res.data.data.token;
  });

  await test('4. POST /auth/register rejects duplicate email with 409 Conflict', async () => {
    const res = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'Duplicate Patient',
        email: customerUser.email,
        password: 'Password@1234',
      },
    });
    assert.strictEqual(res.status, 409);
    assert.strictEqual(res.data.success, false);
  });

  await test('5. POST /auth/login with valid credentials authenticates user', async () => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: {
        email: customerUser.email,
        password: 'Password@1234',
      },
    });
    assert.strictEqual(res.status, 200);
    assert(res.data.data.token);
    assert.strictEqual(res.data.data.user.id, customerUser.id);
  });

  await test('6. POST /auth/login with invalid password rejects with 401', async () => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: {
        email: customerUser.email,
        password: 'WrongPassword999',
      },
    });
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.data.success, false);
  });

  await test('7. POST /auth/login with non-existent account rejects with 401 (no enumeration)', async () => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: {
        email: 'does.not.exist@omkarhealthcare.test',
        password: 'AnyPassword123',
      },
    });
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.data.message, 'Invalid email/phone or password');
  });

  await test('8. GET /auth/me returns authenticated user profile', async () => {
    const res = await request('/auth/me', {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.data.id, customerUser.id);
    assert.strictEqual(res.data.data.password_hash, undefined, 'password_hash must never be leaked');
  });

  await test('9. GET /auth/me without token rejects with 401 Unauthorized', async () => {
    const res = await request('/auth/me');
    assert.strictEqual(res.status, 401);
  });

  // Setup second customer for IDOR checks
  await test('10. Setup secondary customer for authorization isolation testing', async () => {
    const res = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'QA Patient Two',
        email: `qa.user2.${Date.now()}@omkarhealthcare.test`,
        password: 'Password@1234',
      },
    });
    assert.strictEqual(res.status, 201);
    customer2User = res.data.data.user;
    customer2Token = res.data.data.token;
  });

  // Setup super_admin user
  await test('11. Setup super_admin user credentials for administrative tests', async () => {
    const adminEmail = `admin.qa.${Date.now()}@omkarhealthcare.test`;
    const user = await User.create({
      name: 'QA Super Admin',
      email: adminEmail,
      password_hash: '$2a$10$wT0E2sKq1rP.hA3lq8yZke7KkRz7yqL9DqD7F7gX7c4z2t0a8r0K6', // hashed 'Admin@12345'
      role: 'super_admin',
    });
    const authService = require('../services/auth.service');
    adminToken = authService.generateToken(user);
    adminUser = user;
    assert(adminToken);
  });

  // --- CATALOG & PRODUCTS ---
  await test('12. GET /products returns catalog with pagination metadata', async () => {
    const res = await request('/products?limit=5');
    assert.strictEqual(res.status, 200);
    assert(Array.isArray(res.data.data.items));
    assert(res.data.data.pagination);
    assert.strictEqual(res.data.data.pagination.limit, 5);
  });

  await test('13. GET /products/:slug returns product details', async () => {
    const res = await request(`/products/${testProduct.slug}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.data.slug, testProduct.slug);
    assert.strictEqual(res.data.data.name, testProduct.name);
  });

  await test('14. GET /products/:slug with non-existent slug returns 404', async () => {
    const res = await request('/products/non-existent-medical-device-xyz');
    assert.strictEqual(res.status, 404);
  });

  await test('15. POST /products requires super_admin authorization', async () => {
    // Unauthenticated
    const resUnauth = await request('/products', {
      method: 'POST',
      body: { name: 'Unauthorized Device' },
    });
    assert.strictEqual(resUnauth.status, 401);

    // Customer role
    const resCust = await request('/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: { name: 'Customer Attempt' },
    });
    assert.strictEqual(resCust.status, 403);
  });

  // --- USER ADDRESSES & IDOR PROTECTION ---
  let user1AddressId;
  await test('16. POST /user/addresses creates user shipping address', async () => {
    const res = await request('/user/addresses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: {
        label: 'Home',
        line1: 'Flat 402, Lotus Towers',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122001',
      },
    });
    assert.strictEqual(res.status, 201);
    assert(res.data.data.id);
    user1AddressId = res.data.data.id;
  });

  await test('17. IDOR: User 2 cannot delete User 1 address', async () => {
    const res = await request(`/user/addresses/${user1AddressId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${customer2Token}` },
    });
    assert.strictEqual(res.status, 404, 'User 2 must receive 404 when attempting to access User 1 address');
  });

  // --- ORDERS & PURCHASES ---
  let createdOrderId;
  await test('18. POST /orders creates purchase order with server-calculated totals', async () => {
    const res = await request('/orders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: {
        address_id: user1AddressId,
        payment_method: 'Cash on Delivery (COD)',
        items: [
          {
            product_uuid: testProduct.uuid,
            quantity: 2,
          },
        ],
      },
    });
    assert.strictEqual(res.status, 201);
    assert(res.data.data.id);
    assert.strictEqual(res.data.data.status, 'pending');
    assert.strictEqual(parseFloat(res.data.data.total_amount), 70000); // 35,000 * 2
    createdOrderId = res.data.data.id;
  });

  await test('19. GET /orders/my lists only authenticated user orders', async () => {
    const res = await request('/orders/my', {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert(res.data.data.items.length >= 1);
    assert.strictEqual(res.data.data.items[0].user_id, customerUser.id);
  });

  await test('20. IDOR: User 2 cannot access User 1 order details', async () => {
    const res = await request(`/orders/${createdOrderId}`, {
      headers: { Authorization: `Bearer ${customer2Token}` },
    });
    assert.strictEqual(res.status, 404, 'User 2 must receive 404 when querying User 1 order');
  });

  // --- RENTALS ---
  await test('21. POST /rentals/quote calculates rental fees and deposits with tiered discount', async () => {
    const res = await request('/rentals/quote', {
      method: 'POST',
      body: {
        items: [
          {
            product_uuid: testProduct.uuid,
            duration_days: 30, // 30 days qualifies for 28% discount
            quantity: 1,
          },
        ],
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.data.total_deposit_amount, 8000);
    assert(res.data.data.total_rental_amount > 0);
  });

  let createdRentalId;
  await test('22. POST /rentals creates rental agreement with held deposit', async () => {
    const res = await request('/rentals', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: {
        address_id: user1AddressId,
        payment_method: 'Cash on Delivery (COD)',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
        items: [
          {
            product_uuid: testProduct.uuid,
            duration_days: 15,
            duration_type: 'daily',
            quantity: 1,
          },
        ],
      },
    });
    assert.strictEqual(res.status, 201);
    assert(res.data.data.id);
    assert.strictEqual(res.data.data.deposit_status, 'held');
    createdRentalId = res.data.data.id;
  });

  await test('23. IDOR: User 2 cannot view User 1 rental agreement', async () => {
    const res = await request(`/rentals/${createdRentalId}`, {
      headers: { Authorization: `Bearer ${customer2Token}` },
    });
    assert.strictEqual(res.status, 404, 'User 2 must receive 404 when querying User 1 rental');
  });

  // --- UPLOAD SECURITY ---
  await test('24. POST /uploads rejects unauthenticated upload attempts with 401', async () => {
    const res = await request('/uploads', {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data; boundary=---boundary' },
      body: '---boundary--',
    });
    assert.strictEqual(res.status, 401);
  });

  await test('25. POST /uploads rejects customer upload attempts with 403 Forbidden', async () => {
    const res = await request('/uploads', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${customerToken}`,
        'Content-Type': 'multipart/form-data; boundary=---boundary',
      },
      body: '---boundary--',
    });
    assert.strictEqual(res.status, 403);
  });

  // --- PAYMENTS SECURITY ---
  await test('26. GET /payments/:id rejects unauthenticated access with 401 Unauthorized', async () => {
    const res = await request('/payments/1');
    assert.strictEqual(res.status, 401);
  });

  console.log(`\n======================================================`);
  console.log(`INTEGRATION TEST SUMMARY: ${passed} PASSED, ${failed} FAILED (TOTAL: ${passed + failed})`);
  console.log(`======================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

async function main() {
  try {
    await setup();
    await runTests();
  } catch (err) {
    console.error('Fatal test runner error:', err);
    process.exit(1);
  } finally {
    await teardown();
    process.exit(0);
  }
}

main();
