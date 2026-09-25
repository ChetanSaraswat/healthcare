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

  async findRentalDetails(idOrUuid, userId = null) {
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
          model: RentalItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }],
        },
        { model: Address, as: 'address' },
        { model: User, as: 'user', attributes: ['id', 'uuid', 'name', 'email', 'phone'] },
      ],
    });
  }

  async findRentalsByUser(userId) {
    return await this.model.findAll({
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
    const where = {};
    if (filter.status) where.status = filter.status;
    if (filter.deposit_status) where.deposit_status = filter.deposit_status;

    return await this.model.findAll({
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
      order: [['created_at', 'DESC']],
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

    return await this.findRentalDetails(rentalOrder.id, null);
  }

  async updateRentalStatus(idOrUuid, { status, deposit_status }, options = {}) {
    const rental = await this.findRentalDetails(idOrUuid, null);
    if (!rental) return null;

    const updateData = {};
    if (status) updateData.status = status;
    if (deposit_status) updateData.deposit_status = deposit_status;

    await rental.update(updateData, options);
    return rental;
  }

  async extendRentalDuration(idOrUuid, { newEndDate }, options = {}) {
    const rental = await this.findRentalDetails(idOrUuid, null);
    if (!rental) return null;

    await rental.update({ end_date: newEndDate }, options);
    return rental;
  }
}

module.exports = new RentalRepository({ model: RentalOrder });
