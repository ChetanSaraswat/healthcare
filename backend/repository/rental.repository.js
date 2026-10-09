const { Op } = require('sequelize');
const {
  RentalOrder,
  RentalItem,
  Product,
  Address,
  User,
} = require('../models');
const BaseRepository = require('./base.repository');

class RentalRepository extends BaseRepository {
  constructor(payload) {
    super(payload);
  }

  async findRentalDetails(identifier, userId = null, options = {}) {
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
          model: RentalItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }],
        },
        { model: Address, as: 'address' },
        { model: User, as: 'user', attributes: ['id', 'uuid', 'name', 'email', 'phone'] },
      ],
      ...options,
    });
  }

  async findRentalDetailsById(id, options = {}) {
    return await this.model.findOne({
      where: { id },
      include: [
        {
          model: RentalItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }],
        },
        { model: Address, as: 'address' },
        { model: User, as: 'user', attributes: ['id', 'uuid', 'name', 'email', 'phone'] },
      ],
      ...options,
    });
  }

  async findRentalsByUser(userId, filter = {}) {
    const pageNum = Math.max(1, Number(filter.page || 1));
    const limitNum = Math.min(100, Math.max(1, Number(filter.limit || 10)));
    const offset = (pageNum - 1) * limitNum;

    return await this.model.findAndCountAll({
      where: { user_id: userId },
      include: [
        {
          model: RentalItem,
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

  async findActiveRentalsByUser(userId) {
    return await this.model.findAll({
      where: {
        user_id: userId,
        status: ['pending', 'confirmed', 'active'],
      },
      include: [
        {
          model: RentalItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }],
        },
        { model: Address, as: 'address' },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  async findActivePendingRentalsByUser(userId, thresholdMinutes = 60, options = {}) {
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
          model: RentalItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }],
        },
        { model: Address, as: 'address' },
      ],
      order: [['created_at', 'DESC']],
      ...options,
    });
  }

  async findAllRentals(filter = {}) {
    const {
      status,
      deposit_status,
      search,
      page = 1,
      limit = 10,
      sortBy = 'newest',
    } = filter;

    const where = {};
    if (status && status !== 'all') where.status = status;
    if (deposit_status && deposit_status !== 'all') where.deposit_status = deposit_status;

    if (search && search.trim()) {
      const q = search.trim();
      const numMatch = q.match(/\d+/);
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(q);

      const orClauses = [];
      if (isUuid) orClauses.push({ uuid: q });
      if (numMatch) orClauses.push({ id: parseInt(numMatch[0], 10) });
      if (orClauses.length > 0) where[Op.or] = orClauses;
    }

    let order = [['created_at', 'DESC']];
    if (sortBy === 'oldest') order = [['created_at', 'ASC']];

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const offset = (pageNum - 1) * limitNum;

    return await this.model.findAndCountAll({
      where,
      include: [
        {
          model: RentalItem,
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
    const rentalOrder = await this.model.create(orderData, opt);

    if (itemsData && itemsData.length > 0) {
      const itemsWithOrderId = itemsData.map((item) => ({
        ...item,
        rental_order_id: rentalOrder.id,
      }));
      await RentalItem.bulkCreate(itemsWithOrderId, opt);
    }

    const detailed = await this.findRentalDetails(rentalOrder.uuid, null, opt);
    return detailed || rentalOrder;
  }

  async updateRentalStatus(uuid, { status, deposit_status }, options = {}) {
    const rental = await this.findRentalDetails(uuid, null, options);
    if (!rental) return null;

    const updateData = {};
    if (status) updateData.status = status;
    if (deposit_status) updateData.deposit_status = deposit_status;

    await rental.update(updateData, options);
    return rental;
  }

  async extendRentalDuration(uuid, { newEndDate }, options = {}) {
    const rental = await this.findRentalDetails(uuid, null, options);
    if (!rental) return null;

    await rental.update({ end_date: newEndDate }, options);
    return rental;
  }
}

module.exports = new RentalRepository({ model: RentalOrder });
