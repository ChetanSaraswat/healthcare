'use strict';

require('dotenv').config();
const { z } = require('zod');

const rawEnv = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.APP_PORT || process.env.PORT || '8080',
  APP_FORWARD_PORT: process.env.APP_FORWARD_PORT || process.env.APP_PORT || '8080',
  CLIENT_URL: process.env.CLIENT_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000,http://localhost:3001'),

  // Database
  DB_HOST: process.env.DB_HOST || (process.env.NODE_ENV === 'production' ? '' : 'localhost'),
  DB_PORT: process.env.DB_PORT || '5432',
  DB_FORWARD_PORT: process.env.DB_FORWARD_PORT || '5434',
  DB_USER: process.env.DB_USER || (process.env.NODE_ENV === 'production' ? '' : 'postgres'),
  DB_PASSWORD: process.env.DB_PASSWORD || (process.env.NODE_ENV === 'production' ? '' : 'postgres'),
  DB_DATABASE: process.env.DB_DATABASE || (process.env.NODE_ENV === 'production' ? '' : 'aarogyamed_db'),
  DB_TEST_DATABASE: process.env.DB_TEST_DATABASE || 'aarogyamed_test_db',
  DB_POOL_MAX: process.env.DB_POOL_MAX || '25',
  DB_POOL_MIN: process.env.DB_POOL_MIN || '2',
  DB_SSL: process.env.DB_SSL || 'false',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'aarogyamed_super_secret_jwt_key_2026'),
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '7d',

  // SMTP Email
  SMTP_HOST: process.env.SMTP_HOST || 'mailpit',
  SMTP_PORT: process.env.SMTP_PORT || '1025',
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'Omkar Healthcare <care@omkarhealthcare.com>',
  ADMIN_NOTIFICATION_EMAIL: process.env.ADMIN_NOTIFICATION_EMAIL || 'care@omkarhealthcare.com',

  // Razorpay
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || (process.env.NODE_ENV === 'production' ? '' : 'rzp_test_aarogya_med_2026'),
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'secret_test_aarogya_med_key_2026'),
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'webhook_secret_aarogya_med_2026'),

  // Cloudflare Tunnel
  CLOUDFLARE_TUNNEL_URL: process.env.CLOUDFLARE_TUNNEL_URL || '',
  RAZORPAY_WEBHOOK_URL: process.env.RAZORPAY_WEBHOOK_URL || '',

  // WhatsApp
  WHATSAPP_PROVIDER: process.env.WHATSAPP_PROVIDER || 'mock',
  ADMIN_ALERT_PHONE: process.env.ADMIN_ALERT_PHONE || process.env.ADMIN_WHATSAPP_NUMBER || '',
  ADMIN_WHATSAPP_NUMBER: process.env.ADMIN_WHATSAPP_NUMBER || process.env.ADMIN_ALERT_PHONE || '',
  WHATSAPP_API_TOKEN: process.env.WHATSAPP_API_TOKEN || '',
  WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
  WHATSAPP_API_VERSION: process.env.WHATSAPP_API_VERSION || 'v18.0',
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || '',
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || '',
  TWILIO_WHATSAPP_FROM: process.env.TWILIO_WHATSAPP_FROM || '',
  TWILIO_CONTENT_SID: process.env.TWILIO_CONTENT_SID || '',

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  CLOUDINARY_UPLOAD_FOLDER: process.env.CLOUDINARY_UPLOAD_FOLDER || 'products',

  // Diagnostics & Tests
  MOCK_STORAGE: process.env.MOCK_STORAGE || 'false',
  SHOW_STACK_TRACE: process.env.SHOW_STACK_TRACE || 'false',
};

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']),
    PORT: z.coerce.number().int().positive(),
    APP_FORWARD_PORT: z.coerce.number().int().positive().optional(),
    CLIENT_URL: z.string().min(1, 'CLIENT_URL is required for CORS security'),

    // Database
    DB_HOST: z.string().min(1, 'DB_HOST is required'),
    DB_PORT: z.coerce.number().int().positive(),
    DB_FORWARD_PORT: z.coerce.number().int().positive().optional(),
    DB_USER: z.string().min(1, 'DB_USER is required'),
    DB_PASSWORD: z.string().min(1, 'DB_PASSWORD is required'),
    DB_DATABASE: z.string().min(1, 'DB_DATABASE is required'),
    DB_TEST_DATABASE: z.string().min(1),
    DB_POOL_MAX: z.coerce.number().int().positive(),
    DB_POOL_MIN: z.coerce.number().int().nonnegative(),
    DB_SSL: z.enum(['true', 'false']),

    // JWT
    JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
    JWT_EXPIRATION: z.string().min(1),

    // SMTP Email
    SMTP_HOST: z.string().min(1),
    SMTP_PORT: z.coerce.number().int().positive(),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
    EMAIL_FROM: z.string().min(1),
    ADMIN_NOTIFICATION_EMAIL: z.string().min(1),

    // Razorpay
    RAZORPAY_KEY_ID: z.string().min(1, 'RAZORPAY_KEY_ID is required'),
    RAZORPAY_KEY_SECRET: z.string().min(1, 'RAZORPAY_KEY_SECRET is required'),
    RAZORPAY_WEBHOOK_SECRET: z.string().min(1, 'RAZORPAY_WEBHOOK_SECRET is required'),

    // Cloudflare Tunnel
    CLOUDFLARE_TUNNEL_URL: z.string().optional(),
    RAZORPAY_WEBHOOK_URL: z.string().optional(),

    // WhatsApp
    WHATSAPP_PROVIDER: z.enum(['mock', 'cloud_api', 'twilio']),
    ADMIN_ALERT_PHONE: z.string().optional(),
    ADMIN_WHATSAPP_NUMBER: z.string().optional(),
    WHATSAPP_API_TOKEN: z.string().optional(),
    WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
    WHATSAPP_API_VERSION: z.string(),
    TWILIO_ACCOUNT_SID: z.string().optional(),
    TWILIO_AUTH_TOKEN: z.string().optional(),
    TWILIO_WHATSAPP_FROM: z.string().optional(),
    TWILIO_CONTENT_SID: z.string().optional(),

    // Cloudinary
    CLOUDINARY_CLOUD_NAME: z.string().optional(),
    CLOUDINARY_API_KEY: z.string().optional(),
    CLOUDINARY_API_SECRET: z.string().optional(),
    CLOUDINARY_UPLOAD_FOLDER: z.string().min(1),

    // Diagnostics & Tests
    MOCK_STORAGE: z.enum(['true', 'false']).optional(),
    SHOW_STACK_TRACE: z.enum(['true', 'false']).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.NODE_ENV === 'production') {
      const requiredProductionKeys = [
        ['JWT_SECRET', data.JWT_SECRET],
        ['DB_HOST', data.DB_HOST],
        ['DB_USER', data.DB_USER],
        ['DB_PASSWORD', data.DB_PASSWORD],
        ['DB_DATABASE', data.DB_DATABASE],
        ['CLIENT_URL', data.CLIENT_URL],
        ['RAZORPAY_KEY_ID', data.RAZORPAY_KEY_ID],
        ['RAZORPAY_KEY_SECRET', data.RAZORPAY_KEY_SECRET],
        ['RAZORPAY_WEBHOOK_SECRET', data.RAZORPAY_WEBHOOK_SECRET],
        ['CLOUDINARY_CLOUD_NAME', data.CLOUDINARY_CLOUD_NAME],
        ['CLOUDINARY_API_KEY', data.CLOUDINARY_API_KEY],
        ['CLOUDINARY_API_SECRET', data.CLOUDINARY_API_SECRET],
      ];

      for (const [key, val] of requiredProductionKeys) {
        if (!val || String(val).trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `[Production Fatal Configuration Error]: Missing required environment variable: ${key}`,
            path: [key],
          });
        }
      }
    }
  });

const parseResult = envSchema.safeParse(rawEnv);

if (!parseResult.success) {
  const errors = parseResult.error.issues
    .map((issue) => `• ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');
  console.error('\n===============================================================');
  console.error('FATAL ENVIRONMENT CONFIGURATION ERROR:');
  console.error(errors);
  console.error('===============================================================\n');
  throw new Error(`Invalid environment configuration:\n${errors}`);
}

const env = parseResult.data;

module.exports = env;
