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
          addressLine1: z.string({ required_error: 'Address line 1 is required' }),
          addressLine2: z.string().optional().nullable(),
          city: z.string({ required_error: 'City is required' }),
          state: z.string({ required_error: 'State is required' }),
          pincode: z.string({ required_error: 'Pincode is required' }),
        })
        .optional(),
      shippingAddress: z
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
      payment_id: z.string().optional(),
      paymentMethod: z.string().optional(),
      items: z
        .array(
          z.object({
            product_id: z.union([z.number(), z.string()]).optional(),
            productId: z.union([z.number(), z.string()]).optional(),
            quantity: z.number().int().positive().default(1),
            unitPrice: z.number().optional(),
            totalPrice: z.number().optional(),
          })
        )
        .min(1, 'At least one item is required'),
    })
    .refine((data) => data.address_id || data.shipping_address || data.shippingAddress, {
      message: 'Either address_id or shipping_address is required',
    }),
});

exports.updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']).optional(),
    payment_status: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
  }),
});
