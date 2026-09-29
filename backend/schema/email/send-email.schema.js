'use strict';

const { z } = require('zod');

exports.sendTestEmailSchema = z.object({
  body: z.object({
    to: z.string({ required_error: 'Recipient email is required' }).trim().email('Invalid email address'),
    name: z.string().trim().optional(),
    template: z.enum(['welcome', 'order_confirmation', 'rental_agreement', 'rental_return'], {
      required_error: 'Template must be one of: welcome, order_confirmation, rental_agreement, rental_return',
    }),
    orderNumber: z.union([z.string(), z.number()]).optional(),
    rentalNumber: z.union([z.string(), z.number()]).optional(),
    totalAmount: z.number().optional(),
    depositAmount: z.number().optional(),
    returnDate: z.string().optional(),
    returnSlot: z.enum(['morning', 'evening']).optional(),
  }),
});
