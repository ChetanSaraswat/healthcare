'use strict';

const WhatsAppProvider = require('./whatsapp.interface');
const env = require('../../../config/env');

/**
 * Twilio WhatsApp API Provider.
 * Integrates via Twilio Programmable Messaging REST API.
 */
class TwilioWhatsAppProvider extends WhatsAppProvider {
  constructor(config = {}) {
    super();
    this.accountSid = config.accountSid || env.TWILIO_ACCOUNT_SID;
    this.authToken = config.authToken || env.TWILIO_AUTH_TOKEN;
    this.fromNumber = config.fromNumber || env.TWILIO_WHATSAPP_FROM;
    this.contentSid = config.contentSid || env.TWILIO_CONTENT_SID;
  }

  async sendMessage({ to, message, contentVariables = null }) {
    if (!this.accountSid || !this.authToken) {
      console.warn('[TwilioWhatsAppProvider] TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN not configured.');
      return {
        success: false,
        error: 'Twilio credentials missing',
      };
    }

    if (!to) {
      return {
        success: false,
        error: 'Missing recipient phone number (to)',
      };
    }

    const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to.trim()}`;
    const formattedFrom = this.fromNumber.startsWith('whatsapp:')
      ? this.fromNumber
      : `whatsapp:${this.fromNumber.trim()}`;

    const url = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`;
    const params = new URLSearchParams();
    params.append('To', formattedTo);
    params.append('From', formattedFrom);

    if (this.contentSid) {
      params.append('ContentSid', this.contentSid);
      if (contentVariables) {
        params.append('ContentVariables', typeof contentVariables === 'string' ? contentVariables : JSON.stringify(contentVariables));
      }
    } else {
      params.append('Body', message);
    }

    const authHeader = 'Basic ' + Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const data = await response.json();
console.log("Twilio API response:", data);
      if (!response.ok) {
        const errorMsg = data.message || response.statusText;
        console.error('[TwilioWhatsAppProvider] Twilio API error:', errorMsg);

        if (errorMsg.includes('ContentSid Required')) {
          console.warn(
            `\n⚠️  [Twilio WhatsApp Rule]: Meta requires an active 24-hr session window for outbound freeform text.\n` +
            `👉 Quick Fix: Send a message (e.g. "Hi") from your WhatsApp (${formattedTo}) to your Twilio number (${formattedFrom}).\n` +
            `This immediately opens the 24-hour window allowing full transaction notifications!\n`
          );
        }

        return {
          success: false,
          error: errorMsg,
        };
      }

      return {
        success: true,
        messageId: data.sid || 'twilio_wa_ok',
      };
    } catch (err) {
      console.error('[TwilioWhatsAppProvider] HTTP dispatch error:', err.message);
      return {
        success: false,
        error: err.message,
      };
    }
  }
}

module.exports = TwilioWhatsAppProvider;
