const assert = require('assert');

// Mock sessionStorage implementation
class MockStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

// Inlined logic matching checkout-session.ts
const CHECKOUT_SESSION_KEY = 'aarogyamed_checkout_session';

function computeCartFingerprint(items) {
  if (!items || items.length === 0) return '';
  return items
    .map((i) => `${i.productId}:${i.quantity}:${i.type}`)
    .sort()
    .join('|');
}

const crypto = require('crypto');

function generateIdempotencyKey() {
  return crypto.randomUUID();
}

function loadCheckoutSession(currentFingerprint, storage) {
  if (storage) {
    try {
      const stored = storage.getItem(CHECKOUT_SESSION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.idempotencyKey && parsed.cartFingerprint === currentFingerprint) {
          return parsed;
        }
      }
    } catch (e) {
      // ignore
    }
  }

  const freshSession = {
    idempotencyKey: generateIdempotencyKey(),
    cartFingerprint: currentFingerprint,
  };

  if (storage) {
    try {
      storage.setItem(CHECKOUT_SESSION_KEY, JSON.stringify(freshSession));
    } catch (e) {
      // ignore
    }
  }

  return freshSession;
}

function persistCheckoutSession(session, storage) {
  if (storage) {
    storage.setItem(CHECKOUT_SESSION_KEY, JSON.stringify(session));
  }
}

function clearCheckoutSession(storage) {
  if (storage) {
    storage.removeItem(CHECKOUT_SESSION_KEY);
  }
}

// TEST RUNNER
async function runTests() {
  console.log('--- Running Checkout Session Persistence Tests ---');

  // Test 1: computeCartFingerprint
  const items1 = [
    { productId: 1, quantity: 2, type: 'buy' },
    { productId: 4, quantity: 1, type: 'rent' },
  ];
  const items2 = [
    { productId: 4, quantity: 1, type: 'rent' },
    { productId: 1, quantity: 2, type: 'buy' },
  ];
  const fp1 = computeCartFingerprint(items1);
  const fp2 = computeCartFingerprint(items2);
  assert.strictEqual(fp1, fp2, 'Fingerprints should be order-independent');
  assert.strictEqual(fp1, '1:2:buy|4:1:rent', 'Fingerprint should match expected format');
  console.log('✓ Test 1: computeCartFingerprint passed');

  // Test 2: Fresh session generation
  const storage = new MockStorage();
  const session1 = loadCheckoutSession(fp1, storage);
  assert.ok(session1.idempotencyKey, 'Should generate idempotencyKey');
  assert.strictEqual(session1.cartFingerprint, fp1);
  console.log('✓ Test 2: Fresh session generation passed');

  // Test 3: Session reuse with matching fingerprint
  const session2 = loadCheckoutSession(fp1, storage);
  assert.strictEqual(session2.idempotencyKey, session1.idempotencyKey, 'Should reuse identical session');
  console.log('✓ Test 3: Session reuse passed');

  // Test 4: Invalidation when cart changes
  const itemsChanged = [{ productId: 1, quantity: 3, type: 'buy' }];
  const fpChanged = computeCartFingerprint(itemsChanged);
  const session3 = loadCheckoutSession(fpChanged, storage);
  assert.notStrictEqual(session3.idempotencyKey, session1.idempotencyKey, 'Should generate new key when cart changes');
  assert.strictEqual(session3.cartFingerprint, fpChanged);
  console.log('✓ Test 4: Session invalidation passed');

  // Test 5: Persist order IDs in session
  session3.buyOrderId = 42;
  session3.rentalOrderId = 99;
  persistCheckoutSession(session3, storage);
  const reloaded = loadCheckoutSession(fpChanged, storage);
  assert.strictEqual(reloaded.buyOrderId, 42, 'buyOrderId should persist');
  assert.strictEqual(reloaded.rentalOrderId, 99, 'rentalOrderId should persist');
  console.log('✓ Test 5: Order ID persistence passed');

  // Test 6: Clear session
  clearCheckoutSession(storage);
  assert.strictEqual(storage.getItem(CHECKOUT_SESSION_KEY), null, 'Storage should be empty');
  console.log('✓ Test 6: Clear session passed');

  console.log('--- All 6/6 Checkout Persistence Tests Passed Successfully! ---');
}

runTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
