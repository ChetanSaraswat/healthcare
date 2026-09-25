const { z } = require('zod');

exports.createAddressSchema = z.object({
  body: z.object({
    label: z.string().optional().default('Home'),
    line1: z.string({ required_error: 'Address line 1 is required' }).min(3, 'Address line 1 must be at least 3 characters'),
    line2: z.string().optional().nullable(),
    city: z.string({ required_error: 'City is required' }).min(2, 'City is required'),
    state: z.string({ required_error: 'State is required' }).min(2, 'State is required'),
    pincode: z
      .string({ required_error: 'Pincode is required' })
      .regex(/^\d{6}$/, 'Pincode must be a 6-digit Indian postal code'),
    is_default: z.boolean().optional().default(false),
  }),
});

exports.updateAddressSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Address ID is required' }),
  }),
  body: z.object({
    label: z.string().optional(),
    line1: z.string().min(3).optional(),
    line2: z.string().optional().nullable(),
    city: z.string().min(2).optional(),
    state: z.string().min(2).optional(),
    pincode: z.string().regex(/^\d{6}$/, 'Pincode must be a 6-digit Indian postal code').optional(),
    is_default: z.boolean().optional(),
  }),
});

exports.addressIdParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Address ID is required' }),
  }),
});
