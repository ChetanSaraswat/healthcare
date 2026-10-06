const router = require('express').Router();
const orderController = require('../controllers/order.controller');
const { validate } = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const {
  createOrderSchema,
  updateOrderStatusSchema,
} = require('../schema/order/order.schema');

router.post('/', authenticate, validate(createOrderSchema), (req, res, next) =>
  orderController.create(req, res, next)
);

router.get('/my', authenticate, (req, res, next) =>
  orderController.getMyOrders(req, res, next)
);

router.get(
  '/all',
  authenticate,
  authorize('super_admin'),
  (req, res, next) => orderController.getAllOrders(req, res, next)
);

router.get('/:id', authenticate, (req, res, next) =>
  orderController.getById(req, res, next)
);

router.patch(
  '/:id/status',
  authenticate,
  authorize('super_admin'),
  validate(updateOrderStatusSchema),
  (req, res, next) => orderController.updateStatus(req, res, next)
);

module.exports = router;
