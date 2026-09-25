const router = require('express').Router();
const userController = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const {
  createAddressSchema,
  updateAddressSchema,
  addressIdParamSchema,
} = require('../schema/user/address.schema');
const {
  createStaffSchema,
  updateStaffRoleSchema,
  toggleStaffStatusSchema,
} = require('../schema/user/staff.schema');

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
  authorize('super_admin', 'operations_staff'),
  (req, res, next) => userController.getAllCustomers(req, res, next)
);

router.get(
  '/admin/customers/:id',
  authenticate,
  authorize('super_admin', 'operations_staff'),
  (req, res, next) => userController.getCustomerCareHistory(req, res, next)
);

// Admin Staff & Role-Based Access Control Routes (Strictly super_admin)
router.get(
  '/admin/staff',
  authenticate,
  authorize('super_admin'),
  (req, res, next) => userController.getAllStaff(req, res, next)
);

router.post(
  '/admin/staff',
  authenticate,
  authorize('super_admin'),
  validate(createStaffSchema),
  (req, res, next) => userController.createStaff(req, res, next)
);

router.patch(
  '/admin/staff/:id/role',
  authenticate,
  authorize('super_admin'),
  validate(updateStaffRoleSchema),
  (req, res, next) => userController.updateStaffRole(req, res, next)
);

router.patch(
  '/admin/staff/:id/status',
  authenticate,
  authorize('super_admin'),
  validate(toggleStaffStatusSchema),
  (req, res, next) => userController.toggleStaffStatus(req, res, next)
);

module.exports = router;

