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
        payment_status: 'pending',
        payment_id: null,
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

    // 4. Emit event for decoupled notification handling ONLY for authentic Cash on Delivery orders
    // Online payments (Razorpay) are emitted authoritatively by PaymentService upon capture webhook/reconciliation.
    const rawMethod = (data.payment_method || '').toLowerCase();
    const isOnlineAttempt =
      rawMethod.includes('online') ||
      rawMethod.includes('upi') ||
      rawMethod.includes('card') ||
      rawMethod.includes('netbanking') ||
      rawMethod.includes('razorpay');

    if (!isOnlineAttempt && createdOrder) {
      adminNotificationEventBus.emitAsync('transaction.purchase.successful', {
        orderId: createdOrder.id,
        paymentId: null,
        paymentMethod: 'Cash on Delivery (COD)',
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

  async getUserOrders(userId, filter = {}) {
    const { count, rows } = await orderRepository.findOrdersByUser(userId, filter);
    const page = Math.max(1, Number(filter.page || 1));
    const limit = Math.min(100, Math.max(1, Number(filter.limit || 10)));
    return {
      items: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit) || 1,
      },
    };
  }

  async getAllOrders(filter = {}) {
    const { count, rows } = await orderRepository.findAllOrders(filter);
    const page = Math.max(1, Number(filter.page || 1));
    const limit = Math.min(100, Math.max(1, Number(filter.limit || 10)));
    return {
      items: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit) || 1,
      },
    };
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
