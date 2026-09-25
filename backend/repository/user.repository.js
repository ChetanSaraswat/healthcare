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
    const where = {};
    if (filters.search) {
      const searchPattern = `%${filters.search}%`;
      where[Op.or] = [
        { name: { [Op.iLike]: searchPattern } },
        { email: { [Op.iLike]: searchPattern } },
        { phone: { [Op.iLike]: searchPattern } },
      ];
    }
    if (filters.role) {
      where.role = filters.role;
    }

    return await this.model.findAll({
      where,
      attributes: ['id', 'uuid', 'name', 'email', 'phone', 'role', 'created_at'],
      include: [
        { model: Address, as: 'addresses' },
        {
          model: Order,
          as: 'orders',
          attributes: ['id', 'uuid', 'total_amount', 'status', 'created_at'],
        },
        {
          model: RentalOrder,
          as: 'rentals',
          attributes: ['id', 'uuid', 'total_amount', 'status', 'created_at'],
        },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  async findCustomerCareHistory(userId) {
    const isNumeric = !isNaN(userId) && !isNaN(parseFloat(userId));
    const where = isNumeric ? { id: userId } : { uuid: userId };

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

  async findAllStaff(options = {}) {
    const where = {
      role: { [Op.ne]: 'customer' },
    };
    if (options.role) {
      where.role = options.role;
    }
    if (options.search) {
      const searchPattern = `%${options.search}%`;
      where[Op.and] = [
        {
          [Op.or]: [
            { name: { [Op.iLike]: searchPattern } },
            { email: { [Op.iLike]: searchPattern } },
            { phone: { [Op.iLike]: searchPattern } },
          ],
        },
      ];
    }

    return await this.model.findAll({
      where,
      paranoid: false,
      attributes: ['id', 'uuid', 'name', 'email', 'phone', 'role', 'created_at', 'updated_at', 'deleted_at'],
      order: [['created_at', 'DESC']],
    });
  }

  async countActiveSuperAdmins() {
    return await this.model.count({
      where: {
        role: 'super_admin',
        deleted_at: null,
      },
      paranoid: true,
    });
  }

  async findStaffById(staffId) {
    const isNumeric = !isNaN(staffId) && !isNaN(parseFloat(staffId));
    const where = isNumeric ? { id: staffId } : { uuid: staffId };
    return await this.model.findOne({
      where,
      paranoid: false,
      attributes: ['id', 'uuid', 'name', 'email', 'phone', 'role', 'created_at', 'updated_at', 'deleted_at'],
    });
  }

  async updateStaffRole(staffId, role) {
    const isNumeric = !isNaN(staffId) && !isNaN(parseFloat(staffId));
    const where = isNumeric ? { id: staffId } : { uuid: staffId };
    const staff = await this.model.findOne({ where, paranoid: false });
    if (!staff) return null;
    staff.role = role;
    await staff.save();
    return staff;
  }

  async setStaffStatus(staffId, isActive) {
    const isNumeric = !isNaN(staffId) && !isNaN(parseFloat(staffId));
    const where = isNumeric ? { id: staffId } : { uuid: staffId };
    const staff = await this.model.findOne({ where, paranoid: false });
    if (!staff) return null;

    if (isActive) {
      await staff.restore();
    } else {
      await staff.destroy();
    }
    return await this.model.findOne({ where, paranoid: false });
  }
}

module.exports = new UserRepository({ model: User });

