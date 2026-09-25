const router = require('express').Router();
const reviewController = require('../controllers/review.controller');
const { validate } = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { createReviewSchema } = require('../schema/review/review.schema');

router.get('/product/:productId', (req, res, next) =>
  reviewController.getProductReviews(req, res, next)
);

router.post('/', authenticate, validate(createReviewSchema), (req, res, next) =>
  reviewController.create(req, res, next)
);

module.exports = router;
