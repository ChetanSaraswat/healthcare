'use strict';

const env = require('./env');

module.exports = {
  // Recipient details
  adminEmail: env.ADMIN_NOTIFICATION_EMAIL,
  adminWhatsAppNumber: env.ADMIN_ALERT_PHONE || env.ADMIN_WHATSAPP_NUMBER,

  // WhatsApp provider selection: 'mock' (default for dev/testing), 'cloud_api' (Meta), or 'twilio'
  whatsappProvider: env.WHATSAPP_PROVIDER,

  // Meta WhatsApp Cloud API credentials
  meta: {
    apiToken: env.WHATSAPP_API_TOKEN,
    phoneNumberId: env.WHATSAPP_PHONE_NUMBER_ID,
    apiVersion: env.WHATSAPP_API_VERSION,
  },

  // Twilio WhatsApp credentials
  twilio: {
    accountSid: env.TWILIO_ACCOUNT_SID,
    authToken: env.TWILIO_AUTH_TOKEN,
    fromNumber: env.TWILIO_WHATSAPP_FROM,
  },
};
