'use strict';

const http = require('http');
const express = require('express');
const assert = require('assert');

// Create test app with JSON parser and email router
const app = express();
app.use(express.json());
app.use('/email', require('../routes/email.router'));
app.use(require('../middlewares/error.middleware'));

async function testEmailApi() {
  console.log('--- Testing Email API Endpoints ---');

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/email`;

  try {
    // 1. Test GET /email/templates
    console.log('\n[API Test 1] GET /email/templates...');
    const resTemplates = await fetch(`${baseUrl}/templates`);
    const dataTemplates = await resTemplates.json();
    assert.strictEqual(resTemplates.status, 200);
    assert.strictEqual(dataTemplates.success, true);
    assert.strictEqual(dataTemplates.templates.length, 4);
    console.log(`✓ Retrieved ${dataTemplates.templates.length} email templates metadata successfully.`);

    // 2. Test POST /email/send-test with template 'welcome'
    console.log('\n[API Test 2] POST /email/send-test (welcome)...');
    const resSend = await fetch(`${baseUrl}/send-test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'sunita.sharma@example.com',
        name: 'Sunita Sharma',
        template: 'welcome',
      }),
    });
    const dataSend = await resSend.json();
    assert.strictEqual(resSend.status, 200);
    assert.strictEqual(dataSend.success, true);
    assert.strictEqual(dataSend.deliveryResult.to, 'sunita.sharma@example.com');
    console.log('✓ Successfully processed send-test for template "welcome".');

    // 3. Test POST /email/send-test with validation error (invalid email)
    console.log('\n[API Test 3] POST /email/send-test (validation rejection)...');
    const resBad = await fetch(`${baseUrl}/send-test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'not-an-email',
        template: 'welcome',
      }),
    });
    assert.strictEqual(resBad.status, 400);
    console.log('✓ Correctly rejected invalid email format via Zod schema.');

    console.log('\n🎉 ALL EMAIL API ENDPOINT TESTS PASSED! 🎉\n');
  } finally {
    server.close();
  }
}

testEmailApi().catch((err) => {
  console.error('Email API Test Failed:', err);
  process.exit(1);
});
