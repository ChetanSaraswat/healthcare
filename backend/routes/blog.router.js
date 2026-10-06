const router = require('express').Router();
const blogController = require('../controllers/blog.controller');
const { validate } = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const {
  listBlogPostsSchema,
  getBlogPostBySlugSchema,
  createBlogPostSchema,
  updateBlogPostSchema,
  toggleBlogPostStatusSchema,
} = require('../schema/blog/blog.schema');

// Admin Routes (Placed before /:slug to avoid slug collisions)
router.get(
  '/admin/all',
  authenticate,
  authorize('super_admin'),
  (req, res, next) => blogController.getAllAdmin(req, res, next)
);

router.get(
  '/admin/:id',
  authenticate,
  authorize('super_admin'),
  (req, res, next) => blogController.getById(req, res, next)
);

router.post(
  '/admin',
  authenticate,
  authorize('super_admin'),
  validate(createBlogPostSchema),
  (req, res, next) => blogController.create(req, res, next)
);

router.put(
  '/admin/:id',
  authenticate,
  authorize('super_admin'),
  validate(updateBlogPostSchema),
  (req, res, next) => blogController.update(req, res, next)
);

router.patch(
  '/admin/:id/status',
  authenticate,
  authorize('super_admin'),
  validate(toggleBlogPostStatusSchema),
  (req, res, next) => blogController.toggleStatus(req, res, next)
);

router.delete(
  '/admin/:id',
  authenticate,
  authorize('super_admin'),
  (req, res, next) => blogController.delete(req, res, next)
);

// Public Routes
router.get(
  '/',
  validate(listBlogPostsSchema),
  (req, res, next) => blogController.getAllPublished(req, res, next)
);

router.get(
  '/:slug',
  validate(getBlogPostBySlugSchema),
  (req, res, next) => blogController.getBySlug(req, res, next)
);

module.exports = router;
