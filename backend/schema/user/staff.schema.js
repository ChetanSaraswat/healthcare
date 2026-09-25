const { z } = require('zod');

exports.createStaffSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Staff member name is required' })
      .min(2, 'Name must be at least 2 characters'),
    email: z
      .string({ required_error: 'Valid email is required' })
      .email('Must be a valid email address'),
    phone: z.string().optional().nullable(),
    role: z.enum(['super_admin', 'catalog_editor', 'operations_staff', 'content_editor'], {
      required_error: 'Staff role is required',
    }),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Temporary password must be at least 8 characters'),
  }),
});

exports.updateStaffRoleSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Staff ID is required' }),
  }),
  body: z.object({
    role: z.enum(['super_admin', 'catalog_editor', 'operations_staff', 'content_editor'], {
      required_error: 'Staff role is required',
    }),
  }),
});

exports.toggleStaffStatusSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Staff ID is required' }),
  }),
  body: z.object({
    isActive: z.boolean({ required_error: 'isActive status flag is required' }),
  }),
});
