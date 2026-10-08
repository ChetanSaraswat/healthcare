import { z } from 'zod';

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name cannot exceed 100 characters'),
  phone: z
    .string()
    .trim()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number (starting with 6-9)'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid clinical contact email address'),
  addressLine1: z
    .string()
    .trim()
    .min(5, 'Delivery address line must be at least 5 characters')
    .max(255, 'Address line is too long'),
  addressLine2: z.string().optional(),
  city: z
    .string()
    .trim()
    .min(2, 'City is required')
    .max(100, 'City is too long'),
  state: z
    .string()
    .trim()
    .min(2, 'State is required')
    .max(100, 'State is too long'),
  pincode: z
    .string()
    .trim()
    .regex(/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit Indian PIN code (e.g. 560001)'),
  installationNotes: z.string().optional(),
  paymentMethod: z.string().min(1, 'Please select a payment method'),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const RAZORPAY_METHOD_ONLINE = 'Razorpay Online (UPI / Cards / NetBanking)';
export const RAZORPAY_METHOD_COD = 'Payment on Biomedical Technician Arrival';
