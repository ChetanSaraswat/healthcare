const router = require('express').Router();
const rentalController = require('../controllers/rental.controller');
const { validate } = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const {
  quoteRentalSchema,
  createRentalSchema,
  updateRentalStatusSchema,
  extendRentalSchema,
  scheduleReturnSchema,
  listRentalsSchema,
} = require('../schema/rental/rental.schema');

// Public quotation calculation
router.post('/quote', validate(quoteRentalSchema), (req, res, next) =>
  rentalController.quote(req, res, next)
);

// Authenticated customer routes
router.post('/', authenticate, validate(createRentalSchema), (req, res, next) =>
  rentalController.create(req, res, next)
);

router.get('/my', authenticate, validate(listRentalsSchema), (req, res, next) =>
  rentalController.getMyRentals(req, res, next)
);

// Active rental extensions & return pickup scheduling
router.post('/:id/extend', authenticate, validate(extendRentalSchema), (req, res, next) =>
  rentalController.extendRental(req, res, next)
);

router.post('/:id/return', authenticate, validate(scheduleReturnSchema), (req, res, next) =>
  rentalController.scheduleReturn(req, res, next)
);

// Operations / Admin routes
router.get(
  '/all',
  authenticate,
  authorize('super_admin'),
  validate(listRentalsSchema),
  (req, res, next) => rentalController.getAllRentals(req, res, next)
);

router.get(
  '/',
  authenticate,
  authorize('super_admin'),
  validate(listRentalsSchema),
  (req, res, next) => rentalController.getAllRentals(req, res, next)
);

router.get('/:id', authenticate, (req, res, next) =>
  rentalController.getById(req, res, next)
);

router.patch(
  '/:id/status',
  authenticate,
  authorize('super_admin'),
  validate(updateRentalStatusSchema),
  (req, res, next) => rentalController.updateStatus(req, res, next)
);

module.exports = router;
