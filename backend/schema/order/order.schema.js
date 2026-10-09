const { z } = require('zod');

exports.createOrderSchema = z.object({
  body: z
    .object({
      address_id: z.number().int().positive().optional(),
      shipping_address: z
        .object({
          fullName: z.string().optional(),
          phone: z.string().optional(),
          email: z.string().optional(),
          line1: z.string({ required_error: 'Address line 1 is required' }),
          line2: z.string().optional().nullable(),
          city: z.string({ required_error: 'City is required' }),
          state: z.string({ required_error: 'State is required' }),
          pincode: z.string({ required_error: 'Pincode is required' }),
        })
        .optional(),
      payment_id: z.string().optional(),
      payment_method: z.string().optional(),
      items: z
        .array(
          z.object({
            product_uuid: z.string().min(1, 'Valid product UUID or identifier is required'),
            quantity: z.number().int().positive().default(1),
            unit_price: z.number().optional(),
            total_price: z.number().optional(),
          })
        )
        .min(1, 'At least one item is required'),
    })
    .refine((data) => data.address_id || data.shipping_address, {
      message: 'Either address_id or shipping_address is required',
    }),
});

exports.updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    status: z.enum(['pending', 'confirmed', 'paid', 'shipped', 'delivered', 'cancelled']).optional(),
    payment_status: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
  }),
});

exports.listOrdersSchema = z.object({
  query: z.object({
    status: z.enum(['all', 'pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded']).optional().default('all'),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(10),
    search: z.string().optional(),
    sortBy: z.enum(['newest', 'oldest', 'amount_high', 'amount_low']).optional().default('newest'),
  }),
});
