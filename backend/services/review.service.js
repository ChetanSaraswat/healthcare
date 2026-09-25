const { reviewRepository, productRepository } = require('../repository');
const { BadRequest } = require('../libs/error');

class ReviewService {
  async getProductReviews(productId) {
    return await reviewRepository.findApprovedByProduct(productId);
  }

  async create(userId, data) {
    const { product_id, rating, title, body } = data;

    const product = await productRepository.findByPk(product_id);
    if (!product) {
      throw new BadRequest('Product not found');
    }

    return await reviewRepository.createReview({
      product_id,
      user_id: userId,
      rating,
      title: title || null,
      body: body || null,
      status: 'approved',
    });
  }
}

module.exports = new ReviewService();
