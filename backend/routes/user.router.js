const router = require('express').Router();
const userController = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const {
  createAddressSchema,
  updateAddressSchema,
  addressIdParamSchema,
} = require('../schema/user/address.schema');

router.get('/profile', authenticate, (req, res, next) =>
  userController.getProfile(req, res, next)
);

router.get('/addresses', authenticate, (req, res, next) =>
  userController.getAddresses(req, res, next)
);

router.post(
  '/addresses',
  authenticate,
  validate(createAddressSchema),
  (req, res, next) => userController.createAddress(req, res, next)
);

router.patch(
  '/addresses/:id',
  authenticate,
  validate(updateAddressSchema),
  (req, res, next) => userController.updateAddress(req, res, next)
);

router.delete(
  '/addresses/:id',
  authenticate,
  validate(addressIdParamSchema),
  (req, res, next) => userController.deleteAddress(req, res, next)
);

// Admin Customer Directory Routes
router.get(
  '/admin/customers',
  authenticate,
  authorize('super_admin'),
  (req, res, next) => userController.getAllCustomers(req, res, next)
);

router.get(
  '/admin/customers/:id',
  authenticate,
  authorize('super_admin'),
  (req, res, next) => userController.getCustomerCareHistory(req, res, next)
);

module.exports = router;

