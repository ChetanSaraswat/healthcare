const router = require('express').Router();
const productController = require('../controllers/product.controller');
const { validate } = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const {
  createProductSchema,
  listProductSchema,
} = require('../schema/product/product.schema');

// Public routes
router.get('/', validate(listProductSchema), (req, res, next) =>
  productController.list(req, res, next)
);

router.get('/:slug', (req, res, next) =>
  productController.getBySlug(req, res, next)
);

// Admin routes
router.post(
  '/',
  authenticate,
  authorize('super_admin'),
  validate(createProductSchema),
  (req, res, next) => productController.create(req, res, next)
);

router.patch(
  '/:id',
  authenticate,
  authorize('super_admin'),
  (req, res, next) => productController.update(req, res, next)
);

router.delete(
  '/:id',
  authenticate,
  authorize('super_admin'),
  (req, res, next) => productController.delete(req, res, next)
);

module.exports = router;
