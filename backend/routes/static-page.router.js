'use strict';

const router = require('express').Router();
const staticPageController = require('../controllers/static-page.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// Public routes
router.get('/', (req, res, next) => staticPageController.getAll(req, res, next));
router.get('/:slug', (req, res, next) => staticPageController.getBySlug(req, res, next));

// Admin routes: Edit policy content dynamically without frontend redeployment
router.put(
  '/:slug',
  authenticate,
  authorize('super_admin'),
  (req, res, next) => staticPageController.upsert(req, res, next)
);

module.exports = router;
