const { Op } = require('sequelize');
const { Order, OrderItem, Product, Address, User } = require('../models');
const BaseRepository = require('./base.repository');

class OrderRepository extends BaseRepository {
  constructor(payload) {
    super(payload);
  }

  async findOrderDetails(idOrUuid, userId = null) {
    const where = isNaN(Number(idOrUuid))
      ? { uuid: idOrUuid }
      : { id: Number(idOrUuid) };

    if (userId) {
      where.user_id = userId;
    }

    return await this.model.findOne({
      where,
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }],
        },
        { model: Address, as: 'address' },
        { model: User, as: 'user', attributes: ['id', 'uuid', 'name', 'email', 'phone'] },
      ],
    });
  }

  async findOrdersByUser(userId) {
    return await this.model.findAll({
      where: { user_id: userId },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }],
        },
        { model: Address, as: 'address' },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  async findActivePendingOrdersByUser(userId, thresholdMinutes = 60, options = {}) {
    if (!userId) return [];
    const thresholdDate = new Date(Date.now() - thresholdMinutes * 60 * 1000);
    return await this.model.findAll({
      where: {
        user_id: userId,
        status: 'pending',
        created_at: { [Op.gte]: thresholdDate },
      },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }],
        },
        { model: Address, as: 'address' },
      ],
      order: [['created_at', 'DESC']],
      ...options,
    });
  }

  async findAllOrders(filter = {}) {
    const where = {};
    if (filter.status) where.status = filter.status;

    return await this.model.findAll({
      where,
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }],
        },
        { model: Address, as: 'address' },
        { model: User, as: 'user', attributes: ['id', 'uuid', 'name', 'email', 'phone'] },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  async createWithItems(orderData, itemsData, transaction = null) {
    const opt = transaction ? { transaction } : {};
    const order = await this.model.create(orderData, opt);

    if (itemsData && itemsData.length > 0) {
      const itemsWithOrderId = itemsData.map((item) => ({
        ...item,
        order_id: order.id,
      }));
      await OrderItem.bulkCreate(itemsWithOrderId, opt);
    }

    return await this.findOrderDetails(order.id, null);
  }

  async updateStatus(idOrUuid, status, options = {}) {
    const order = await this.findOrderDetails(idOrUuid, null);
    if (!order) return null;

    await order.update({ status }, options);
    return order;
  }
}

module.exports = new OrderRepository({ model: Order });
