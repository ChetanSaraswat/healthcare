const reviewService = require('../services/review.service');
const { SUCCESS, CREATED } = require('../libs/constants');

class ReviewController {
  async getProductReviews(req, res, next) {
    try {
      const reviews = await reviewService.getProductReviews(req.params.productId);
      res.status(SUCCESS).json({ success: true, data: reviews });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const review = await reviewService.create(req.user.id, req.body);
      res.status(CREATED).json({
        success: true,
        message: 'Review submitted successfully',
        data: review,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReviewController();
