'use strict';

const WhatsAppProvider = require('./whatsapp.interface');
const env = require('../../../config/env');

/**
 * Meta WhatsApp Cloud API Provider.
 * Integrates directly with Meta Graph API for official WhatsApp Business messaging.
 */
class MetaWhatsAppCloudProvider extends WhatsAppProvider {
  constructor(config = {}) {
    super();
    this.apiToken = config.apiToken || env.WHATSAPP_API_TOKEN;
    this.phoneNumberId = config.phoneNumberId || env.WHATSAPP_PHONE_NUMBER_ID;
    this.apiVersion = config.apiVersion || env.WHATSAPP_API_VERSION;
  }

  async sendMessage({ to, message }) {
    if (!this.apiToken || !this.phoneNumberId) {
      console.warn('[MetaWhatsAppCloudProvider] WHATSAPP_API_TOKEN or WHATSAPP_PHONE_NUMBER_ID not configured.');
      return {
        success: false,
        error: 'Meta WhatsApp Cloud API credentials missing',
      };
    }

    if (!to) {
      return {
        success: false,
        error: 'Missing recipient phone number (to)',
      };
    }

    // Clean phone number: remove +, spaces, dashes
    const cleanNumber = to.replace(/[^\d]/g, '');

    const url = `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`;
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: cleanNumber,
      type: 'text',
      text: {
        preview_url: false,
        body: message,
      },
    };

    try {
      // Use native global fetch available in Node.js 18+
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error ? data.error.message : response.statusText;
        console.error('[MetaWhatsAppCloudProvider] Graph API error:', errorMsg);
        return {
          success: false,
          error: errorMsg,
        };
      }

      const messageId = (data.messages && data.messages[0] && data.messages[0].id) || 'meta_wa_ok';
      return {
        success: true,
        messageId,
      };
    } catch (err) {
      console.error('[MetaWhatsAppCloudProvider] Network/HTTP dispatch error:', err.message);
      return {
        success: false,
        error: err.message,
      };
    }
  }
}

module.exports = MetaWhatsAppCloudProvider;
