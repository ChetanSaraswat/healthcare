const { z } = require('zod');

const createReviewSchema = z.object({
  body: z.object({
    product_id: z.number().int().positive({ message: 'Product ID is required' }),
    rating: z.number().int().min(1).max(5, { message: 'Rating must be between 1 and 5' }),
    title: z.string().optional(),
    body: z.string().optional(),
  }),
});

module.exports = {
  createReviewSchema,
};
