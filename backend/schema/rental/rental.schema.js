const { z } = require('zod');

exports.quoteRentalSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          product_id: z.union([z.number(), z.string()]).optional(),
          productId: z.union([z.number(), z.string()]).optional(),
          quantity: z.number().int().positive().default(1),
          duration_type: z.enum(['daily', 'weekly', 'monthly']).optional().default('daily'),
          duration_count: z.number().int().positive().default(1),
          durationDays: z.number().optional(),
        })
      )
      .min(1, 'At least one rental item is required'),
  }),
});

exports.createRentalSchema = z.object({
  body: z
    .object({
      address_id: z.number().int().positive().optional(),
      delivery_address: z
        .object({
          fullName: z.string().optional(),
          phone: z.string().optional(),
          email: z.string().optional(),
          addressLine1: z.string({ required_error: 'Address line 1 is required' }),
          addressLine2: z.string().optional().nullable(),
          city: z.string({ required_error: 'City is required' }),
          state: z.string({ required_error: 'State is required' }),
          pincode: z.string({ required_error: 'Pincode is required' }),
        })
        .optional(),
      deliveryAddress: z
        .object({
          fullName: z.string().optional(),
          phone: z.string().optional(),
          email: z.string().optional(),
          addressLine1: z.string({ required_error: 'Address line 1 is required' }),
          addressLine2: z.string().optional().nullable(),
          city: z.string({ required_error: 'City is required' }),
          state: z.string({ required_error: 'State is required' }),
          pincode: z.string({ required_error: 'Pincode is required' }),
        })
        .optional(),
      start_date: z.string().optional(),
      startDate: z.string().optional(),
      end_date: z.string().optional(),
      endDate: z.string().optional(),
      payment_id: z.string().optional(),
      notes: z.string().optional(),
      items: z
        .array(
          z.object({
            product_id: z.union([z.number(), z.string()]).optional(),
            productId: z.union([z.number(), z.string()]).optional(),
            quantity: z.number().int().positive().default(1),
            duration_type: z.enum(['daily', 'weekly', 'monthly']).optional().default('daily'),
            duration_count: z.number().int().positive().optional().default(1),
            durationDays: z.number().optional(),
            dailyRate: z.number().optional(),
            securityDeposit: z.number().optional(),
            rentalCost: z.number().optional(),
            startDate: z.string().optional(),
            endDate: z.string().optional(),
          })
        )
        .min(1, 'At least one rental item is required'),
    })
    .refine((data) => data.address_id || data.delivery_address || data.deliveryAddress, {
      message: 'Either address_id or delivery_address is required',
    }),
});

exports.updateRentalStatusSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    status: z.enum(['pending', 'confirmed', 'active', 'returned', 'cancelled']),
    deposit_status: z.enum(['held', 'refunded', 'partially_refunded', 'forfeited']).optional(),
  }),
});

const { extendRentalSchema } = require('./extend-rental.schema');
const { scheduleReturnSchema } = require('./schedule-return.schema');

exports.extendRentalSchema = extendRentalSchema;
exports.scheduleReturnSchema = scheduleReturnSchema;

