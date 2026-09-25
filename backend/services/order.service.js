const { orderRepository, productRepository, addressRepository } = require('../repository');
const { BadRequest, NotFound } = require('../libs/error');

class OrderService {
  async create(userId, data) {
    const { address_id, payment_id, items } = data;
    const shipping = data.shipping_address || data.shippingAddress;

    let address = null;
    if (address_id) {
      address = await addressRepository.findUserAddress(userId, address_id);
    } else if (shipping) {
      address = await addressRepository.findOrCreateAddress(userId, {
        label: 'Home',
        line1: shipping.addressLine1 || shipping.line1,
        line2: shipping.addressLine2 || shipping.line2 || null,
        city: shipping.city,
        state: shipping.state,
        pincode: shipping.pincode,
      });
    }

    if (!address) {
      throw new BadRequest('Invalid or missing delivery address');
    }

    // SECTION 3: Order-level dedupe check on creation
    // Check whether an active PENDING order already exists for this user with matching cart contents.
    // If found and not expired (< 60 minutes), reuse the existing order instead of duplicating.
    if (userId && items && items.length > 0) {
      const activePendingOrders = await orderRepository.findActivePendingOrdersByUser(userId, 60);
      for (const pendingOrder of activePendingOrders) {
        if (pendingOrder.items && pendingOrder.items.length === items.length) {
          const pendingItemMap = new Map();
          for (const it of pendingOrder.items) {
            pendingItemMap.set(Number(it.product_id), Number(it.quantity));
          }
          let allMatch = true;
          for (const reqItem of items) {
            const rawPid = reqItem.product_id || reqItem.productId;
            let numericPid = Number(rawPid);
            if (isNaN(numericPid)) {
              const p = await productRepository.findOneInstance({ uuid: rawPid });
              numericPid = p ? p.id : null;
            }
            const reqQty = Number(reqItem.quantity);
            if (!numericPid || !pendingItemMap.has(numericPid) || pendingItemMap.get(numericPid) !== reqQty) {
              allMatch = false;
              break;
            }
          }
          if (allMatch) {
            return pendingOrder;
          }
        }
      }
    }

    // Verify stock and price
    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const pid = item.product_id || item.productId;
      const where = isNaN(Number(pid))
        ? { uuid: pid, buy_available: true, status: 'active' }
        : { id: Number(pid), buy_available: true, status: 'active' };

      const product = await productRepository.findOneInstance(where);

      if (!product) {
        throw new BadRequest(`Product #${pid} is not available for purchase`);
      }

      if (product.stock_quantity < item.quantity) {
        throw new BadRequest(
          `Insufficient stock for '${product.name}'. Only ${product.stock_quantity} units available.`
        );
      }

      const unitPrice = parseFloat(product.buy_price) || 0;
      const subtotal = unitPrice * item.quantity;
      totalAmount += subtotal;

      validatedItems.push({
        product,
        quantity: item.quantity,
        unit_price: unitPrice,
        subtotal,
      });
    }

    return await orderRepository.handleManagedTransaction(async (transaction) => {
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

      const createdOrder = await orderRepository.createWithItems(orderData, orderItemsData, transaction);

      // Decrement stock
      for (const item of validatedItems) {
        await item.product.decrement('stock_quantity', {
          by: item.quantity,
          transaction,
        });
      }

      return createdOrder;
    });
  }

  async getById(id, userId = null) {
    const order = await orderRepository.findOrderDetails(id, userId);
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

  async updateStatus(id, updateData) {
    const order = await orderRepository.updateStatus(id, updateData.status);
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
