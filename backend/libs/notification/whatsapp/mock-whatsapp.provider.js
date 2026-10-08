'use strict';

const WhatsAppProvider = require('./whatsapp.interface');

/**
 * Mock WhatsApp Provider for local development and automated testing.
 * Records messages in an internal array for test verification and logs to console.
 */
class MockWhatsAppProvider extends WhatsAppProvider {
  constructor() {
    super();
    this.sentMessages = [];
  }

  async sendMessage({ to, message }) {
    if (!to) {
      return {
        success: false,
        error: 'Missing recipient phone number (to)',
      };
    }

    const crypto = require('crypto');
    const messageId = `wa_${crypto.randomUUID()}`;
    const record = {
      messageId,
      to,
      message,
      sentAt: new Date(),
    };

    this.sentMessages.push(record);

    if (process.env.NODE_ENV !== 'test') {
      console.log(`\n[MockWhatsAppProvider] Message sent to ${to} (${messageId}):\n${message}\n`);
    }

    return {
      success: true,
      messageId,
      sentAt: record.sentAt,
    };
  }

  getSentMessages() {
    return [...this.sentMessages];
  }

  clearSentMessages() {
    this.sentMessages = [];
  }
}

module.exports = MockWhatsAppProvider;
