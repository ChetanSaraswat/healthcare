const { z } = require('zod');

exports.createProductSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Product name is required' }).min(1),
    slug: z.string().min(1).optional(),
    category_id: z.number({ required_error: 'Category ID is required' }).int().positive(),
    subcategory_id: z.number().int().positive().nullable().optional(),
    brand: z.string({ required_error: 'Brand is required' }).min(1),
    description: z.string({ required_error: 'Description is required' }).min(1),
    images: z.array(z.string()).default([]),
    videos: z.array(z.string()).optional().default([]),
    specifications: z
      .array(
        z.object({
          label: z.string().min(1),
          value: z.string().min(1),
        })
      )
      .optional()
      .default([]),
    buy_price: z.number().nonnegative().nullable().optional(),
    buy_mrp: z.number().nonnegative().nullable().optional(),
    buy_available: z.boolean().optional().default(false),
    rent_price_daily: z.number().nonnegative().nullable().optional(),
    rent_price_weekly: z.number().nonnegative().nullable().optional(),
    rent_price_monthly: z.number().nonnegative().nullable().optional(),
    rent_deposit: z.number().nonnegative().nullable().optional(),
    rent_min_period_days: z.number().int().positive().optional().default(1),
    rent_available: z.boolean().optional().default(false),
    stock_quantity: z.number().int().nonnegative().optional().default(0),
    warranty_info: z.string().nullable().optional(),
    status: z.enum(['active', 'draft', 'out_of_stock']).optional().default('active'),
    tag_ids: z.array(z.number().int().positive()).optional().default([]),
  }),
});

exports.listProductSchema = z.object({
  query: z.object({
    category: z.string().optional(),
    brand: z.string().optional(),
    buyRent: z.enum(['buy', 'rent', 'both']).optional(),
    search: z.string().optional(),
    tag: z.string().optional(),
    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().nonnegative().optional(),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(20),
    sortBy: z.enum(['price_asc', 'price_desc', 'newest', 'name']).optional().default('newest'),
  }),
});
