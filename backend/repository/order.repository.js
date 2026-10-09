const { Op } = require('sequelize');
const { Order, OrderItem, Product, Address, User } = require('../models');
const BaseRepository = require('./base.repository');

class OrderRepository extends BaseRepository {
  constructor(payload) {
    super(payload);
  }

  async findOrderDetails(identifier, userId = null, options = {}) {
    if (!identifier) return null;
    const isUuid = typeof identifier === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
    const isInteger = Number.isInteger(identifier) || (typeof identifier === 'string' && /^\d+$/.test(identifier));

    if (!isUuid && !isInteger) {
      return null;
    }

    const where = isUuid
      ? { uuid: identifier }
      : { id: typeof identifier === 'string' ? parseInt(identifier, 10) : identifier };

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
      ...options,
    });
  }

  async findOrdersByUser(userId, filter = {}) {
    const pageNum = Math.max(1, Number(filter.page || 1));
    const limitNum = Math.min(100, Math.max(1, Number(filter.limit || 10)));
    const offset = (pageNum - 1) * limitNum;

    return await this.model.findAndCountAll({
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
      limit: limitNum,
      offset,
      distinct: true,
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

  async findOrderDetailsById(id, options = {}) {
    return await this.model.findOne({
      where: { id },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }],
        },
        { model: Address, as: 'address' },
        { model: User, as: 'user', attributes: ['id', 'uuid', 'name', 'email', 'phone'] },
      ],
      ...options,
    });
  }

  async findMatchingPendingOrder(userId, items, thresholdMinutes = 60) {
    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return null;
    }

    const activePendingOrders = await this.findActivePendingOrdersByUser(userId, thresholdMinutes);
    if (!activePendingOrders || activePendingOrders.length === 0) {
      return null;
    }

    for (const pendingOrder of activePendingOrders) {
      if (pendingOrder.items && pendingOrder.items.length === items.length) {
        const pendingItemMap = new Map();
        for (const it of pendingOrder.items) {
          const qty = Number(it.quantity);
          if (it.product && it.product.uuid) {
            pendingItemMap.set(it.product.uuid, qty);
          }
        }

        let allMatch = true;
        for (const reqItem of items) {
          const productUuid = reqItem.product_uuid;
          const reqQty = Number(reqItem.quantity);
          if (!productUuid || !pendingItemMap.has(productUuid) || pendingItemMap.get(productUuid) !== reqQty) {
            allMatch = false;
            break;
          }
        }

        if (allMatch) {
          return pendingOrder;
        }
      }
    }

    return null;
  }

  async findAllOrders(filter = {}) {
    const {
      status,
      search,
      page = 1,
      limit = 10,
      sortBy = 'newest',
    } = filter;

    const where = {};
    if (status && status !== 'all') {
      where.status = status;
    }

    if (search && search.trim()) {
      const q = search.trim();
      const numMatch = q.match(/\d+/);
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(q);

      const orClauses = [];
      if (isUuid) {
        orClauses.push({ uuid: q });
      }
      if (numMatch) {
        orClauses.push({ id: parseInt(numMatch[0], 10) });
      }
      if (orClauses.length > 0) {
        where[Op.or] = orClauses;
      }
    }

    let order = [['created_at', 'DESC']];
    if (sortBy === 'oldest') {
      order = [['created_at', 'ASC']];
    } else if (sortBy === 'amount_high') {
      order = [['total_amount', 'DESC']];
    } else if (sortBy === 'amount_low') {
      order = [['total_amount', 'ASC']];
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const offset = (pageNum - 1) * limitNum;

    return await this.model.findAndCountAll({
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
      order,
      limit: limitNum,
      offset,
      distinct: true,
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

    const detailed = await this.findOrderDetails(order.uuid, null, opt);
    return detailed || order;
  }

  async updateStatus(uuid, status, options = {}) {
    const order = await this.findOrderDetails(uuid, null, options);
    if (!order) return null;

    await order.update({ status }, options);
    return order;
  }
}

module.exports = new OrderRepository({ model: Order });
