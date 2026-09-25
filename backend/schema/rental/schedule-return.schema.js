const { z } = require('zod');

const scheduleReturnSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Rental ID is required' }),
  }),
  body: z.object({
    return_date: z.string({ required_error: 'Return date is required' }),
    return_slot: z.enum(['morning', 'evening'], { required_error: 'Return slot must be morning or evening' }),
    pickup_notes: z.string().optional(),
  }),
});

module.exports = {
  scheduleReturnSchema,
};
