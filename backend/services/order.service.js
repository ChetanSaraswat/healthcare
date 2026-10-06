const { orderRepository, addressRepository } = require('../repository');
const orderValidationService = require('./order-validation.service');
const { adminNotificationEventBus } = require('../libs/notification');
const { BadRequest, NotFound } = require('../libs/error');

class OrderService {
  async create(userId, data) {
    const { address_id, payment_id, items } = data;
    const shipping = data.shipping_address;

    let address = null;
    if (address_id) {
      address = await addressRepository.findUserAddress(userId, address_id);
    } else if (shipping) {
      address = await addressRepository.findOrCreateAddress(userId, {
        label: 'Home',
        line1: shipping.line1,
        line2: shipping.line2 || null,
        city: shipping.city,
        state: shipping.state,
        pincode: shipping.pincode,
      });
    }

    if (!address) {
      throw new BadRequest('Invalid or missing delivery address');
    }

    // 1. Pending order deduplication
    const existingOrder = await orderRepository.findMatchingPendingOrder(userId, items);
    if (existingOrder) {
      return existingOrder;
    }

    // 2. Validate items, availability, stock, and calculate pricing
    const validatedItems = await orderValidationService.validatePurchaseItems(items);
    const totalAmount = validatedItems.totalAmount ?? validatedItems.reduce((sum, item) => sum + item.subtotal, 0);

    // 3. Create order and decrement stock atomically within transaction
    const createdOrder = await orderRepository.handleManagedTransaction(async (transaction) => {
      const orderData = {
        user_id: userId,
        address_id: address.id,
        total_amount: totalAmount,
        status: 'pending',
        payment_status: payment_id ? 'paid' : 'pending',
        payment_id: payment_id || null,
      };

      const orderItemsData = validatedItems.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.subtotal,
      }));

      const newOrder = await orderRepository.createWithItems(orderData, orderItemsData, transaction);

      // Decrement stock
      for (const item of validatedItems) {
        await item.product.decrement('stock_quantity', {
          by: item.quantity,
          transaction,
        });
      }

      return newOrder;
    });

    // 4. Emit event for decoupled notification handling (Customer Email, Admin Email, Admin WhatsApp)
    const rawMethod = (data.payment_method || '').toLowerCase();
    const isOnlineAttempt =
      rawMethod.includes('online') ||
      rawMethod.includes('upi') ||
      rawMethod.includes('card') ||
      rawMethod.includes('netbanking') ||
      rawMethod.includes('razorpay');
    const isConfirmedTransaction = Boolean(payment_id) || !isOnlineAttempt;

    if (isConfirmedTransaction && createdOrder) {
      adminNotificationEventBus.emitAsync('transaction.purchase.successful', {
        orderId: createdOrder.id,
        paymentId: payment_id || null,
        paymentMethod: payment_id ? 'Online Payment' : 'Cash on Delivery (COD)',
      });
    }

    return createdOrder;
  }

  async getById(uuid, userId = null) {
    const order = await orderRepository.findOrderDetails(uuid, userId);
    if (!order) {
      throw new NotFound('Order not found');
    }
    return order;
  }

  async getUserOrders(userId) {
    return await orderRepository.findOrdersByUser(userId);
  }

  async getAllOrders(filter = {}) {
    return await orderRepository.findAllOrders(filter);
  }

  async updateStatus(uuid, updateData) {
    const order = await orderRepository.updateStatus(uuid, updateData.status);
    if (!order) {
      throw new NotFound('Order not found');
    }

    if (updateData.payment_status) {
      await order.update({ payment_status: updateData.payment_status });
    }

    return order;
  }
}

module.exports = new OrderService();
