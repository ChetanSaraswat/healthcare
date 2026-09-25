const { Banner } = require('../models');
const BaseRepository = require('./base.repository');

class BannerRepository extends BaseRepository {
  constructor(payload) {
    super(payload);
  }

  async findActiveBanners() {
    return await this.model.findAll({
      where: { is_active: true },
      order: [['display_order', 'ASC']],
    });
  }
}

module.exports = new BannerRepository({ model: Banner });
