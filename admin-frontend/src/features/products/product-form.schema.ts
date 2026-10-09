import { z } from 'zod';

export const productFormSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  slug: z.string().optional(),
  brand: z.string().min(2, 'Brand name is required (min 2 characters)'),
  categoryId: z.string().min(1, 'Please select a valid category'),
  description: z.string().min(10, 'Clinical description must be at least 10 characters'),
  buyPrice: z.coerce.number({ invalid_type_error: 'Buy price must be a number' }).min(0, 'Price must be 0 or greater'),
  buyMrp: z.coerce.number({ invalid_type_error: 'MRP must be a number' }).min(0, 'MRP must be 0 or greater'),
  isAvailableForBuy: z.boolean(),
  isAvailableForRent: z.boolean(),
  rentalDailyRate: z.coerce.number({ invalid_type_error: 'Daily rental rate must be a number' }).min(0, 'Daily rental rate must be 0 or greater'),
  rentalSecurityDeposit: z.coerce.number({ invalid_type_error: 'Security deposit must be a number' }).min(0, 'Security deposit must be 0 or greater'),
  stock: z.coerce
    .number({ invalid_type_error: 'Stock must be a number' })
    .int('Stock must be an integer count')
    .min(0, 'Stock cannot be negative'),
  warrantyInfo: z.string().optional(),
  tagsInput: z.string().optional(),
  status: z.enum(['active', 'draft', 'out_of_stock']),

  // Hindi localization fields
  nameHi: z.string().optional(),
  descHi: z.string().optional(),
  warrantyHi: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export const stockFormSchema = z.object({
  stock: z.coerce
    .number({ invalid_type_error: 'Stock must be a valid number' })
    .int('Stock quantity must be a whole number')
    .min(0, 'Stock quantity cannot be negative'),
});

export type StockFormValues = z.infer<typeof stockFormSchema>;
