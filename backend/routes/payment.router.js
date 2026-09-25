'use strict';

const router = require('express').Router();
const paymentController = require('../controllers/payment.controller');
const { validate } = require('../middlewares/validate.middleware');
const { authMiddleware } = require('../middlewares');
const { createRazorpayOrderSchema } = require('../schema/payment/create-razorpay-order.schema');
const { verifyRazorpayPaymentSchema } = require('../schema/payment/verify-razorpay-payment.schema');

// 1. Create Razorpay order
router.post(
  '/razorpay/create-order',
  authMiddleware.optionalAuthenticate,
  validate(createRazorpayOrderSchema),
  paymentController.createRazorpayOrder
);

// 2. Verify Razorpay checkout signature and update order/rental
router.post(
  '/razorpay/verify',
  authMiddleware.optionalAuthenticate,
  validate(verifyRazorpayPaymentSchema),
  paymentController.verifyPayment
);

// 3. Razorpay server-to-server webhook endpoint
router.post('/razorpay/webhook', paymentController.webhook);

// 4. Authenticated user's payment history
router.get('/my-payments', authMiddleware.authenticate, paymentController.getMyPayments);

// 5. Payment details by ID
router.get('/:id', authMiddleware.optionalAuthenticate, paymentController.getById);

module.exports = router;
