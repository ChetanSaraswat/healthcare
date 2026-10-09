const { Op } = require('sequelize');
const { User, Address, Order, OrderItem, RentalOrder, RentalItem, Product } = require('../models');
const BaseRepository = require('./base.repository');

class UserRepository extends BaseRepository {
  constructor(payload) {
    super(payload);
  }

  async findProfile(userId) {
    return await this.model.findOne({
      where: { id: userId },
      attributes: ['id', 'uuid', 'name', 'email', 'phone', 'role', 'created_at'],
      include: [{ model: Address, as: 'addresses' }],
    });
  }

  async findByEmail(email) {
    return await this.model.findOne({
      where: { email },
      include: [{ model: Address, as: 'addresses' }],
    });
  }

  async findByPhone(phone) {
    return await this.model.findOne({
      where: { phone },
      include: [{ model: Address, as: 'addresses' }],
    });
  }

  async findAllCustomersWithMetrics(filters = {}) {
    const {
      search,
      role,
      segment,
      page = 1,
      limit = 10,
    } = filters;

    const where = {};
    if (search && search.trim()) {
      const searchPattern = `%${search.trim()}%`;
      where[Op.or] = [
        { name: { [Op.iLike]: searchPattern } },
        { email: { [Op.iLike]: searchPattern } },
        { phone: { [Op.iLike]: searchPattern } },
      ];
    }
    if (role && role !== 'all') {
      where.role = role;
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const offset = (pageNum - 1) * limitNum;

    return await this.model.findAndCountAll({
      where,
      attributes: ['id', 'uuid', 'name', 'email', 'phone', 'role', 'created_at'],
      include: [
        { model: Address, as: 'addresses' },
        {
          model: Order,
          as: 'orders',
          required: segment === 'buyers',
          attributes: ['id', 'uuid', 'total_amount', 'status', 'created_at'],
        },
        {
          model: RentalOrder,
          as: 'rentals',
          required: segment === 'rentees',
          attributes: ['id', 'uuid', 'deposit_amount', 'status', 'created_at'],
        },
      ],
      order: [['created_at', 'DESC']],
      limit: limitNum,
      offset,
      distinct: true,
    });
  }

  async findCustomerCareHistory(userUuid) {
    const where = { uuid: userUuid };

    return await this.model.findOne({
      where,
      attributes: ['id', 'uuid', 'name', 'email', 'phone', 'role', 'created_at'],
      include: [
        { model: Address, as: 'addresses' },
        {
          model: Order,
          as: 'orders',
          include: [
            {
              model: OrderItem,
              as: 'items',
              include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'slug', 'images'] }],
            },
            { model: Address, as: 'address' },
          ],
        },
        {
          model: RentalOrder,
          as: 'rentals',
          include: [
            {
              model: RentalItem,
              as: 'items',
              include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'slug', 'images'] }],
            },
            { model: Address, as: 'address' },
          ],
        },
      ],
    });
  }
}

module.exports = new UserRepository({ model: User });

