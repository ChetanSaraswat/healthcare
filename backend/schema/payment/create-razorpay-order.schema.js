'use strict';

const { z } = require('zod');

const createRazorpayOrderSchema = z.object({
  body: z.object({
    // UNTRUSTED CLIENT INPUT: Stored order total is always used server-side.
    // Client-supplied amount is accepted for backward-compatibility only and ignored by payment service.
    amount: z.union([z.number(), z.string()]).transform((val) => Number(val)).optional(),
    currency: z.string().default('INR').optional(),
    orderId: z.union([z.string().uuid(), z.string(), z.number()]).optional(),
    rentalOrderId: z.union([z.string().uuid(), z.string(), z.number()]).optional(),
    idempotency_key: z.string().min(1).max(100).optional(),
    idempotencyKey: z.string().min(1).max(100).optional(),
    notes: z.record(z.any()).optional(),
  }),
});

module.exports = {
  createRazorpayOrderSchema,
};
