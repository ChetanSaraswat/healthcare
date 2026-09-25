'use strict';

const { paymentRepository } = require('../repository');
const paymentService = require('../services/payment.service');

/**
 * Background worker to actively reconcile pending payment attempts against Razorpay's API.
 * Ensures payment status is confirmed even if the webhook never arrived or was delayed.
 */
class PaymentReconciliationWorker {
  /**
   * Scans and reconciles pending payments older than threshold
   * @param {Object} options
   * @param {number} options.thresholdMinutes - Minimum age in minutes to reconcile (default: 2)
   */
  async reconcilePendingPayments({ thresholdMinutes = 2 } = {}) {
    const thresholdDate = new Date(Date.now() - thresholdMinutes * 60 * 1000);

    const pendingPayments = await paymentRepository.findPendingForReconciliation(thresholdDate);

    const stats = {
      inspected: pendingPayments.length,
      captured: 0,
      unchanged: 0,
      failed: 0,
    };

    if (pendingPayments.length === 0) {
      return stats;
    }

    console.info(`[PaymentReconciliationWorker] Found ${pendingPayments.length} pending payments for reconciliation`);

    for (const payment of pendingPayments) {
      try {
        const result = await paymentService.reconcilePaymentAttempt(payment);
        if (result.reconciled && result.status === 'captured') {
          stats.captured += 1;
          console.info(`[PaymentReconciliationWorker] Reconciled payment #${payment.id} (Order #${payment.order_id || payment.rental_order_id}) -> CAPTURED`);
        } else if (result.reconciled && result.status === 'failed') {
          stats.failed += 1;
          console.info(`[PaymentReconciliationWorker] Reconciled payment #${payment.id} (Order #${payment.order_id || payment.rental_order_id}) -> FAILED (${result.reason})`);
        } else {
          stats.unchanged += 1;
        }
      } catch (err) {
        stats.failed += 1;
        console.error(`[PaymentReconciliationWorker] Failed to reconcile payment #${payment.id}:`, err.message);
      }
    }

    return stats;
  }
}

module.exports = new PaymentReconciliationWorker();
