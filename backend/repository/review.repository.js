const { Review, Product, User } = require('../models');
const BaseRepository = require('./base.repository');

class ReviewRepository extends BaseRepository {
  constructor(payload) {
    super(payload);
  }

  async findApprovedByProduct(productId) {
    return await this.model.findAll({
      where: { product_id: productId, status: 'approved' },
      include: [
        { model: User, as: 'user', attributes: ['id', 'name'] },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  async findSiteReviews(limit = 10) {
    return await this.model.findAll({
      where: { status: 'approved' },
      limit,
      include: [
        { model: User, as: 'user', attributes: ['id', 'name'] },
        { model: Product, as: 'product', attributes: ['id', 'name', 'slug'] },
      ],
      order: [['rating', 'DESC'], ['created_at', 'DESC']],
    });
  }

  async createReview(data) {
    return await this.model.create(data);
  }
}

module.exports = new ReviewRepository({ model: Review });
