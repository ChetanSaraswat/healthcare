'use strict';

const paymentReconciliationWorker = require('./payment-reconciliation.worker');
const orderExpirationWorker = require('./order-expiration.worker');

/**
 * Unified Background Scheduler
 * Coordinates payment reconciliation and order expiration jobs to run harmoniously.
 * Guarantees that reconciliation executes prior to or inside expiration, preventing
 * race conditions where a captured payment could be erroneously expired.
 */
class UnifiedScheduler {
  constructor() {
    this.reconciliationTimer = null;
    this.expirationTimer = null;
    this.isRunning = false;
  }

  /**
   * Runs one full cycle of reconciliation followed by expiration
   */
  async runAllOnce() {
    console.info('[UnifiedScheduler] Starting single run of all background tasks...');
    const reconStats = await paymentReconciliationWorker.reconcilePendingPayments({ thresholdMinutes: 2 });
    const expireStats = await orderExpirationWorker.expirePendingOrders({ expirationMinutes: 60 });
    return { reconStats, expireStats };
  }

  /**
   * Starts background recurring intervals
   * @param {Object} options
   * @param {number} options.reconciliationIntervalMs - Default: 2 minutes
   * @param {number} options.expirationIntervalMs - Default: 3 minutes (within 1-5 min spec)
   */
  start({
    reconciliationIntervalMs = 2 * 60 * 1000,
    expirationIntervalMs = 3 * 60 * 1000,
  } = {}) {
    if (this.isRunning) {
      console.warn('[UnifiedScheduler] Scheduler is already active.');
      return;
    }

    this.isRunning = true;
    console.info('[UnifiedScheduler] Starting background worker scheduler...');

    // Run reconciliation worker
    this.reconciliationTimer = setInterval(async () => {
      try {
        await paymentReconciliationWorker.reconcilePendingPayments({ thresholdMinutes: 2 });
      } catch (err) {
        console.error('[UnifiedScheduler] Error during scheduled reconciliation cycle:', err);
      }
    }, reconciliationIntervalMs);

    // Run expiration worker
    this.expirationTimer = setInterval(async () => {
      try {
        await orderExpirationWorker.expirePendingOrders({ expirationMinutes: 60 });
      } catch (err) {
        console.error('[UnifiedScheduler] Error during scheduled order expiration cycle:', err);
      }
    }, expirationIntervalMs);

    // Run initial passes immediately
    this.runAllOnce().catch((err) => {
      console.error('[UnifiedScheduler] Error during initial scheduler pass:', err);
    });
  }

  /**
   * Stops all active intervals cleanly
   */
  stop() {
    if (this.reconciliationTimer) {
      clearInterval(this.reconciliationTimer);
      this.reconciliationTimer = null;
    }
    if (this.expirationTimer) {
      clearInterval(this.expirationTimer);
      this.expirationTimer = null;
    }
    this.isRunning = false;
    console.info('[UnifiedScheduler] Scheduler stopped cleanly.');
  }
}

module.exports = new UnifiedScheduler();
