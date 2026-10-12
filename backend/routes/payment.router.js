'use strict';

const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const paymentController = require('../controllers/payment.controller');
const { validate } = require('../middlewares/validate.middleware');
const { authMiddleware } = require('../middlewares');
const { createRazorpayOrderSchema } = require('../schema/payment/create-razorpay-order.schema');
const { verifyRazorpayPaymentSchema } = require('../schema/payment/verify-razorpay-payment.schema');

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60, // Max 60 payment creation requests per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many payment creation requests from this IP, please try again shortly',
    error: 'Payment rate limit exceeded',
  },
  skip: () => process.env.NODE_ENV === 'test',
});

// 1. Create Razorpay order
router.post(
  '/razorpay/create-order',
  paymentLimiter,
  authMiddleware.optionalAuthenticate,
  validate(createRazorpayOrderSchema),
  paymentController.createRazorpayOrder
);

// 2. Verify Razorpay checkout signature (non-authoritative browser callback notification)
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
router.get('/:id', authMiddleware.authenticate, paymentController.getById);

module.exports = router;
