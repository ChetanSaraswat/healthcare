'use strict';

const { orderRepository, rentalRepository } = require('../repository');
const { email } = require('../libs');
const notificationConfig = require('../config/notification.config');
const {
  TransactionNotificationData,
  TransactionNotificationFormatter,
  notificationIdempotencyStore,
  adminNotificationEventBus,
  getWhatsAppProvider,
} = require('../libs/notification');

class AdminNotificationService {
  constructor() {
    this.whatsAppProvider = getWhatsAppProvider();
    this._subscribed = false;
    this.subscribeToEvents();
  }

  /**
   * Subscribe to transaction events for decoupled async notifications.
   */
  subscribeToEvents() {
    if (this._subscribed) return;
    this._subscribed = true;

    adminNotificationEventBus.on('transaction.purchase.successful', async (payload) => {
      try {
        await this.notifyPurchase(payload.orderId, payload);
      } catch (err) {
        console.warn(`[AdminNotificationService] Purchase notification event handling failed:`, err.message);
      }
    });

    adminNotificationEventBus.on('transaction.rental.successful', async (payload) => {
      try {
        await this.notifyRental(payload.rentalId, payload);
      } catch (err) {
        console.warn(`[AdminNotificationService] Rental notification event handling failed:`, err.message);
      }
    });
  }

  /**
   * Dispatches admin notifications for a verified successful BUY order.
   */
  async notifyPurchase(orderId, paymentDetails = {}) {
    if (!orderId) {
      console.warn('[AdminNotificationService] notifyPurchase called without orderId');
      return null;
    }

    const order = await orderRepository.findOrderDetails(orderId);
    if (!order) {
      console.warn(`[AdminNotificationService] Order #${orderId} not found in database. Aborting notification.`);
      return null;
    }

    // Build pure domain value object with backend-verified data
    const notificationData = TransactionNotificationData.fromOrder(order, paymentDetails);

    const whatsappKey = `buy_order_${order.id}_whatsapp`;
    const emailKey = `buy_order_${order.id}_email`;

    return await this._dispatchIndependentChannels(notificationData, {
      whatsappKey,
      emailKey,
      order,
      paymentDetails,
    });
  }

  /**
   * Dispatches admin notifications for a verified successful RENT order.
   */
  async notifyRental(rentalId, paymentDetails = {}) {
    if (!rentalId) {
      console.warn('[AdminNotificationService] notifyRental called without rentalId');
      return null;
    }

    const rental = await rentalRepository.findRentalDetails(rentalId);
    if (!rental) {
      console.warn(`[AdminNotificationService] Rental Order #${rentalId} not found in database. Aborting notification.`);
      return null;
    }

    // Build pure domain value object with backend-verified data
    const notificationData = TransactionNotificationData.fromRental(rental, paymentDetails);

    const whatsappKey = `rent_order_${rental.id}_whatsapp`;
    const emailKey = `rent_order_${rental.id}_email`;

    return await this._dispatchIndependentChannels(notificationData, {
      whatsappKey,
      emailKey,
      rental,
      paymentDetails,
    });
  }

  /**
   * Independent, resilient dispatch across WhatsApp, Admin Email, and Customer Email channels.
   */
  async _dispatchIndependentChannels(data, { whatsappKey, emailKey, order = null, rental = null, paymentDetails = {} }) {
    const adminWhatsAppNumber = notificationConfig.adminWhatsAppNumber;
    const adminEmail = notificationConfig.adminEmail;

    // 1. WhatsApp Dispatch Task (Admin)
    const sendWhatsAppTask = async () => {
      if (!adminWhatsAppNumber) {
        return { channel: 'whatsapp', skipped: true, reason: 'ADMIN_WHATSAPP_NUMBER not configured' };
      }

      // Check idempotency
      const alreadySent = await notificationIdempotencyStore.isProcessed('whatsapp', whatsappKey);
      if (alreadySent) {
        return {
          channel: 'whatsapp',
          skipped: true,
          duplicate: true,
          reason: `WhatsApp notification for ${whatsappKey} already sent.`,
        };
      }

      // Acquire lock
      if (!notificationIdempotencyStore.acquireLock('whatsapp', whatsappKey)) {
        return { channel: 'whatsapp', skipped: true, reason: 'In-flight send in progress' };
      }

      try {
        const messageText = TransactionNotificationFormatter.formatWhatsApp(data);
        const result = await this.whatsAppProvider.sendMessage({
          to: adminWhatsAppNumber,
          message: messageText,
        });

        if (result.success) {
          await notificationIdempotencyStore.markProcessed('whatsapp', whatsappKey, {
            transactionType: data.transactionType,
            transactionId: data.transactionId,
            recipient: adminWhatsAppNumber,
            status: 'sent',
            payload: { message: messageText, messageId: result.messageId },
          });
          return { channel: 'whatsapp', success: true, messageId: result.messageId };
        } else {
          notificationIdempotencyStore.releaseLock('whatsapp', whatsappKey);
          console.warn(`[AdminNotificationService] WhatsApp delivery failed: ${result.error}`);
          return { channel: 'whatsapp', success: false, error: result.error };
        }
      } catch (err) {
        notificationIdempotencyStore.releaseLock('whatsapp', whatsappKey);
        console.warn(`[AdminNotificationService] WhatsApp delivery exception: ${err.message}`);
        return { channel: 'whatsapp', success: false, error: err.message };
      }
    };

    // 2. Email Dispatch Task (Admin)
    const sendEmailTask = async () => {
      if (!adminEmail) {
        return { channel: 'email', skipped: true, reason: 'ADMIN_NOTIFICATION_EMAIL not configured' };
      }

      // Check idempotency
      const alreadySent = await notificationIdempotencyStore.isProcessed('email', emailKey);
      if (alreadySent) {
        return {
          channel: 'email',
          skipped: true,
          duplicate: true,
          reason: `Email notification for ${emailKey} already sent.`,
        };
      }

      // Acquire lock
      if (!notificationIdempotencyStore.acquireLock('email', emailKey)) {
        return { channel: 'email', skipped: true, reason: 'In-flight send in progress' };
      }

      try {
        const subject = TransactionNotificationFormatter.formatEmailSubject(data);
        const html = TransactionNotificationFormatter.formatEmailHtml(data);
        const text = TransactionNotificationFormatter.formatWhatsApp(data);

        const result = await email.sendAdminNotificationEmail({
          to: adminEmail,
          subject,
          html,
          text,
        });

        if (result.success) {
          await notificationIdempotencyStore.markProcessed('email', emailKey, {
            transactionType: data.transactionType,
            transactionId: data.transactionId,
            recipient: adminEmail,
            status: 'sent',
            payload: { subject, messageId: result.messageId },
          });
          return { channel: 'email', success: true, messageId: result.messageId };
        } else {
          notificationIdempotencyStore.releaseLock('email', emailKey);
          console.warn(`[AdminNotificationService] Email delivery failed: ${result.error}`);
          return { channel: 'email', success: false, error: result.error };
        }
      } catch (err) {
        notificationIdempotencyStore.releaseLock('email', emailKey);
        console.warn(`[AdminNotificationService] Email delivery exception: ${err.message}`);
        return { channel: 'email', success: false, error: err.message };
      }
    };

    // 3. Customer Email Dispatch Task (Customer Order Confirmation)
    const sendCustomerEmailTask = async () => {
      if (!order) {
        return { channel: 'customer_email', skipped: true, reason: 'Order details not provided' };
      }

      const customerEmail =
        (order.user && order.user.email) ||
        (order.address && order.address.email) ||
        paymentDetails.customerEmail;

      if (!customerEmail) {
        return { channel: 'customer_email', skipped: true, reason: 'No customer email address' };
      }

      const customerEmailKey = `buy_order_${order.id}_customer_email`;
      const alreadySent = await notificationIdempotencyStore.isProcessed('customer_email', customerEmailKey);
      if (alreadySent) {
        return {
          channel: 'customer_email',
          skipped: true,
          duplicate: true,
          reason: `Customer confirmation email for ${customerEmailKey} already sent.`,
        };
      }

      if (!notificationIdempotencyStore.acquireLock('customer_email', customerEmailKey)) {
        return { channel: 'customer_email', skipped: true, reason: 'In-flight customer email send in progress' };
      }

      try {
        const customerName =
          (order.user && order.user.name) ||
          (order.address && order.address.name) ||
          paymentDetails.customerName ||
          'Valued Patient';

        const items = (order.items || []).map((vi) => ({
          name: vi.product ? vi.product.name : 'Medical Equipment',
          quantity: vi.quantity,
          price: vi.unit_price,
        }));

        const result = await email.sendOrderConfirmationEmail({
          to: customerEmail,
          name: customerName,
          orderNumber: order.id,
          items,
          totalAmount: order.total_amount,
          deliveryAddress: order.address,
          paymentMethod: paymentDetails.paymentMethod || (order.payment_id ? 'Online Payment' : 'Cash on Delivery (COD)'),
          transactionId: paymentDetails.paymentId || order.payment_id || '',
        });

        if (result && result.success !== false) {
          await notificationIdempotencyStore.markProcessed('customer_email', customerEmailKey, {
            transactionType: 'buy_order',
            transactionId: order.id,
            recipient: customerEmail,
            status: 'sent',
            payload: { messageId: result.messageId },
          });
          return { channel: 'customer_email', success: true, messageId: result.messageId };
        } else {
          notificationIdempotencyStore.releaseLock('customer_email', customerEmailKey);
          console.warn(`[AdminNotificationService] Customer confirmation email failed: ${result?.error}`);
          return { channel: 'customer_email', success: false, error: result?.error };
        }
      } catch (err) {
        notificationIdempotencyStore.releaseLock('customer_email', customerEmailKey);
        console.warn(`[AdminNotificationService] Customer confirmation email exception: ${err.message}`);
        return { channel: 'customer_email', success: false, error: err.message };
      }
    };

    // Execute all configured channels in parallel with Promise.allSettled
    const [waSettled, emailSettled, customerSettled] = await Promise.allSettled([
      sendWhatsAppTask(),
      sendEmailTask(),
      sendCustomerEmailTask(),
    ]);

    return {
      whatsapp: waSettled.status === 'fulfilled' ? waSettled.value : { success: false, error: waSettled.reason?.message },
      email: emailSettled.status === 'fulfilled' ? emailSettled.value : { success: false, error: emailSettled.reason?.message },
      customerEmail: customerSettled.status === 'fulfilled' ? customerSettled.value : { success: false, error: customerSettled.reason?.message },
    };
  }
}

module.exports = new AdminNotificationService();
