'use strict';

const { Op } = require('sequelize');
const { Order, OrderItem, Product, RentalOrder } = require('../models');
const { orderRepository, paymentRepository } = require('../repository');
const paymentService = require('../services/payment.service');

/**
 * Background worker to expire stale pending orders and restitute inventory stock.
 * Coordinates with the payment reconciliation system to ensure no order is ever
 * expired while an unconfirmed-but-actually-successful payment is waiting on reconciliation.
 */
class OrderExpirationWorker {
  /**
   * Scans and expires pending orders older than expirationMinutes (default: 60)
   * @param {Object} options
   * @param {number} options.expirationMinutes - Expiration threshold in minutes (default: 60)
   */
  async expirePendingOrders({ expirationMinutes = 60 } = {}) {
    const expirationDate = new Date(Date.now() - expirationMinutes * 60 * 1000);

    const stats = {
      inspectedOrders: 0,
      expiredOrders: 0,
      savedByReconciliation: 0,
      inspectedRentals: 0,
      expiredRentals: 0,
    };

    // 1. Find stale purchase orders
    const pendingOrders = await Order.findAll({
      where: {
        status: 'pending',
        created_at: { [Op.lte]: expirationDate },
      },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }],
        },
      ],
    });

    stats.inspectedOrders = pendingOrders.length;

    for (const order of pendingOrders) {
      await orderRepository.handleManagedTransaction(async (transaction) => {
        // Re-fetch inside transaction with row lock
        const lockedOrder = await Order.findByPk(order.id, {
          transaction,
          lock: transaction.LOCK.UPDATE,
        });

        if (!lockedOrder || lockedOrder.status !== 'pending') {
          return;
        }

        // Check if there is already a captured payment
        const capturedPayment = await paymentRepository.findCapturedByOrderId(lockedOrder.id, { transaction });
        if (capturedPayment) {
          console.info(`[OrderExpirationWorker] Order #${lockedOrder.id} already paid via payment #${capturedPayment.id}. Marking PAID instead of expiring.`);
          await lockedOrder.update({ status: 'paid', payment_id: capturedPayment.gateway_payment_id }, { transaction });
          stats.savedByReconciliation += 1;
          return;
        }

        // Coordinate with Razorpay: Check pending payment attempts on-demand before expiring!
        const pendingPayments = await paymentRepository.findAllPendingByOrderId(lockedOrder.id, { transaction });
        let paymentWasCapturedAtGateway = false;

        for (const payment of pendingPayments) {
          const recon = await paymentService.reconcilePaymentAttempt(payment, { transaction });
          if (recon.reconciled && recon.status === 'captured') {
            paymentWasCapturedAtGateway = true;
            console.info(`[OrderExpirationWorker] Order #${lockedOrder.id} saved by active reconciliation. Razorpay confirmed capture.`);
            break;
          }
        }

        if (paymentWasCapturedAtGateway) {
          await lockedOrder.update({ status: 'paid' }, { transaction });
          stats.savedByReconciliation += 1;
          return;
        }

        // If genuinely unpaid past timeout: mark cancelled and restitute product inventory
        await lockedOrder.update({ status: 'cancelled' }, { transaction });
        stats.expiredOrders += 1;

        if (order.items && order.items.length > 0) {
          for (const item of order.items) {
            if (item.product) {
              await item.product.increment('stock_quantity', {
                by: item.quantity,
                transaction,
              });
              console.info(`[OrderExpirationWorker] Restituted ${item.quantity} units for product #${item.product_id} from expired order #${lockedOrder.id}`);
            }
          }
        }
      });
    }

    // 2. Find stale rental orders
    const pendingRentals = await RentalOrder.findAll({
      where: {
        status: 'pending',
        created_at: { [Op.lte]: expirationDate },
      },
    });

    stats.inspectedRentals = pendingRentals.length;

    for (const rental of pendingRentals) {
      await orderRepository.handleManagedTransaction(async (transaction) => {
        const lockedRental = await RentalOrder.findByPk(rental.id, {
          transaction,
          lock: transaction.LOCK.UPDATE,
        });

        if (!lockedRental || lockedRental.status !== 'pending') {
          return;
        }

        const capturedPayment = await paymentRepository.findCapturedByRentalOrderId(lockedRental.id, { transaction });
        if (capturedPayment) {
          await lockedRental.update({ status: 'confirmed', payment_id: capturedPayment.gateway_payment_id }, { transaction });
          return;
        }

        // Mark cancelled
        await lockedRental.update({ status: 'cancelled' }, { transaction });
        stats.expiredRentals += 1;
      });
    }

    return stats;
  }
}

module.exports = new OrderExpirationWorker();
