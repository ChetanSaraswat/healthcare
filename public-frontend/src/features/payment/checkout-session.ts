/**
 * AarogyaMed Frontend - Checkout Session Persistence
 *
 * Provides durable session state in browser sessionStorage so that
 * page refreshes, remounts, or network retry attempts reuse the exact
 * same idempotencyKey and pre-created order IDs, preventing duplicate
 * orders or payments.
 */

export const CHECKOUT_SESSION_KEY = 'aarogyamed_checkout_session';

export interface DurableCheckoutSession {
  idempotencyKey: string;
  buyOrderId?: number | string;
  rentalOrderId?: number | string;
  cartFingerprint: string;
}

export interface CartItemLike {
  productId: number | string;
  quantity: number;
  type: string;
}

/**
 * Computes a deterministic fingerprint of cart items.
 * If items change (different products, quantities, or types),
 * the fingerprint changes, invalidating any stale checkout session.
 */
export function computeCartFingerprint(items: CartItemLike[]): string {
  if (!items || items.length === 0) return '';
  return items
    .map((i) => `${i.productId}:${i.quantity}:${i.type}`)
    .sort()
    .join('|');
}

/**
 * Generates a standard cryptographically random UUID idempotency key
 */
export function generateIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return require('crypto').randomUUID();
}

export function isValidOrderIdentifier(val: any): boolean {
  if (!val) return false;
  if (typeof val === 'number' && Number.isInteger(val) && val > 0) return true;
  if (typeof val === 'string') {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
    const isInt = /^\d+$/.test(val);
    return isUuid || isInt;
  }
  return false;
}

/**
 * Loads the existing checkout session from sessionStorage if valid and matching
 * current cart fingerprint. If invalid, missing, or cart changed, initializes a fresh session.
 */
export function loadCheckoutSession(
  currentFingerprint: string,
  storage?: Storage
): DurableCheckoutSession {
  const activeStorage =
    storage !== undefined
      ? storage
      : typeof window !== 'undefined'
      ? window.sessionStorage
      : undefined;

  if (activeStorage) {
    try {
      const stored = activeStorage.getItem(CHECKOUT_SESSION_KEY);
      if (stored) {
        const parsed: DurableCheckoutSession = JSON.parse(stored);
        if (parsed && parsed.idempotencyKey && parsed.cartFingerprint === currentFingerprint) {
          if (parsed.buyOrderId && !isValidOrderIdentifier(parsed.buyOrderId)) {
            delete parsed.buyOrderId;
          }
          if (parsed.rentalOrderId && !isValidOrderIdentifier(parsed.rentalOrderId)) {
            delete parsed.rentalOrderId;
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[loadCheckoutSession] Could not read checkout session from sessionStorage:', e);
    }
  }

  const freshSession: DurableCheckoutSession = {
    idempotencyKey: generateIdempotencyKey(),
    cartFingerprint: currentFingerprint,
  };

  if (activeStorage) {
    try {
      activeStorage.setItem(CHECKOUT_SESSION_KEY, JSON.stringify(freshSession));
    } catch (e) {
      console.warn('[loadCheckoutSession] Could not write fresh checkout session to sessionStorage:', e);
    }
  }

  return freshSession;
}

/**
 * Persists an active checkout session (e.g. after buyOrderId or rentalOrderId is created)
 * into sessionStorage.
 */
export function persistCheckoutSession(
  session: DurableCheckoutSession,
  storage?: Storage
): void {
  const activeStorage =
    storage !== undefined
      ? storage
      : typeof window !== 'undefined'
      ? window.sessionStorage
      : undefined;

  if (activeStorage) {
    try {
      const cleanSession = { ...session };
      if (cleanSession.buyOrderId && !isValidOrderIdentifier(cleanSession.buyOrderId)) {
        delete cleanSession.buyOrderId;
      }
      if (cleanSession.rentalOrderId && !isValidOrderIdentifier(cleanSession.rentalOrderId)) {
        delete cleanSession.rentalOrderId;
      }
      activeStorage.setItem(CHECKOUT_SESSION_KEY, JSON.stringify(cleanSession));
    } catch (e) {
      console.warn('[persistCheckoutSession] Could not persist checkout session to sessionStorage:', e);
    }
  }
}

/**
 * Purges the checkout session from sessionStorage (upon successful payment or COD completion).
 */
export function clearCheckoutSession(storage?: Storage): void {
  const activeStorage =
    storage !== undefined
      ? storage
      : typeof window !== 'undefined'
      ? window.sessionStorage
      : undefined;

  if (activeStorage) {
    try {
      activeStorage.removeItem(CHECKOUT_SESSION_KEY);
    } catch (e) {
      console.warn('[clearCheckoutSession] Could not clear checkout session from sessionStorage:', e);
    }
  }
}
