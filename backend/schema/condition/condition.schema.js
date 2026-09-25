const { z } = require('zod');

const getConditionBySlugSchema = z.object({
  params: z.object({
    slug: z.string({ required_error: 'Condition slug is required' }),
  }),
  query: z.object({
    locale: z.enum(['en', 'hi']).optional().default('en'),
  }),
});

const listConditionsSchema = z.object({
  query: z.object({
    locale: z.enum(['en', 'hi']).optional().default('en'),
  }),
});

module.exports = {
  getConditionBySlugSchema,
  listConditionsSchema,
};
