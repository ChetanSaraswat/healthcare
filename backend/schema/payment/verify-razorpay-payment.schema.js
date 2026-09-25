'use strict';

const { z } = require('zod');

const verifyRazorpayPaymentSchema = z.object({
  body: z.object({
    razorpay_order_id: z.string().min(1, 'Razorpay order ID is required'),
    razorpay_payment_id: z.string().min(1, 'Razorpay payment ID is required'),
    razorpay_signature: z.string().min(1, 'Razorpay signature is required'),
    order_id: z.number().int().positive().optional(),
    rental_order_id: z.number().int().positive().optional(),
    payment_method: z.string().optional(),
  }),
});

module.exports = {
  verifyRazorpayPaymentSchema,
};
