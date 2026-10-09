import { z } from 'zod';

export const categoryFormSchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  slug: z.string().min(1, 'Slug is required'),
  parentId: z.string().optional(),
  description: z.string().optional(),
  displayOrder: z.coerce.number().int().min(0, 'Display order must be 0 or greater'),
  isActive: z.boolean(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
