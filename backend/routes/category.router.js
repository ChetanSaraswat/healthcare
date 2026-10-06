const router = require('express').Router();
const categoryController = require('../controllers/category.controller');
const { validate } = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const {
  createCategorySchema,
  updateCategorySchema,
} = require('../schema/category/category.schema');

// Public routes
router.get('/tree', (req, res, next) => categoryController.getTree(req, res, next));
router.get('/', (req, res, next) => categoryController.getAll(req, res, next));
router.get('/slug/:slug', (req, res, next) => categoryController.getBySlug(req, res, next));
router.get('/:id', (req, res, next) => categoryController.getById(req, res, next));

// Admin routes
router.post(
  '/',
  authenticate,
  authorize('super_admin'),
  validate(createCategorySchema),
  (req, res, next) => categoryController.create(req, res, next)
);

router.patch(
  '/:id',
  authenticate,
  authorize('super_admin'),
  validate(updateCategorySchema),
  (req, res, next) => categoryController.update(req, res, next)
);

router.delete(
  '/:id',
  authenticate,
  authorize('super_admin'),
  (req, res, next) => categoryController.delete(req, res, next)
);

module.exports = router;
