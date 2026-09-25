const { Address } = require('../models');
const BaseRepository = require('./base.repository');

class AddressRepository extends BaseRepository {
  constructor(payload) {
    super(payload);
  }

  async findByUserId(userId) {
    return await this.model.findAll({
      where: { user_id: userId },
      order: [
        ['is_default', 'DESC'],
        ['created_at', 'DESC'],
      ],
    });
  }

  async findDefaultByUserId(userId) {
    return await this.model.findOne({
      where: { user_id: userId, is_default: true },
    });
  }

  async clearDefaults(userId, options = {}) {
    return await this.model.update(
      { is_default: false },
      { where: { user_id: userId }, ...options }
    );
  }

  async findUserAddress(userId, addressId, options = {}) {
    const where = isNaN(Number(addressId))
      ? { uuid: addressId, user_id: userId }
      : { id: Number(addressId), user_id: userId };

    return await this.model.findOne({ where, ...options });
  }

  async findOrCreateAddress(userId, addressData, options = {}) {
    // Check if an identical address already exists for this user
    const existing = await this.model.findOne({
      where: {
        user_id: userId,
        line1: addressData.line1,
        pincode: addressData.pincode,
      },
      ...options,
    });

    if (existing) {
      return existing;
    }

    return await this.model.create(
      {
        ...addressData,
        user_id: userId,
      },
      options
    );
  }
}

module.exports = new AddressRepository({ model: Address });
