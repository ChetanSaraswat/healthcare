'use strict';

module.exports = {
  // Recipient details
  adminEmail: process.env.ADMIN_NOTIFICATION_EMAIL || 'care@aarogyamed.com',
  adminWhatsAppNumber: process.env.ADMIN_WHATSAPP_NUMBER || '+919876543210',

  // WhatsApp provider selection: 'mock' (default for dev/testing), 'cloud_api' (Meta), or 'twilio'
  whatsappProvider: process.env.WHATSAPP_PROVIDER,

  // Meta WhatsApp Cloud API credentials
  meta: {
    apiToken: process.env.WHATSAPP_API_TOKEN || '',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
    apiVersion: process.env.WHATSAPP_API_VERSION || 'v18.0',
  },

  // Twilio WhatsApp credentials
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    fromNumber: process.env.TWILIO_WHATSAPP_FROM,
  },
};
