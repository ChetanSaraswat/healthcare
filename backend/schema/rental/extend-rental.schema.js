const { z } = require('zod');

const extendRentalSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Rental ID is required' }),
  }),
  body: z.object({
    days: z.number().int().positive({ message: 'Extension days must be a positive integer' }),
    notes: z.string().optional(),
  }),
});

module.exports = {
  extendRentalSchema,
};
