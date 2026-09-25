const { z } = require('zod');

exports.createCategorySchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Category name is required' }).min(1, 'Category name cannot be empty'),
    slug: z.string().min(1).optional(),
    description: z.string().optional(),
    parent_id: z.number().int().positive().nullable().optional(),
    image_url: z.string().url().nullable().optional(),
    display_order: z.number().int().optional().default(0),
    is_active: z.boolean().optional().default(true),
  }),
});

exports.updateCategorySchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Category ID is required' }),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
    description: z.string().optional(),
    parent_id: z.number().int().positive().nullable().optional(),
    image_url: z.string().url().nullable().optional(),
    display_order: z.number().int().optional(),
    is_active: z.boolean().optional(),
  }),
});
