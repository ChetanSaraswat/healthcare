'use strict';

/**
 * Base abstract interface for WhatsApp delivery providers.
 */
class WhatsAppProvider {
  /**
   * Send WhatsApp text message.
   * @param {Object} options
   * @param {string} options.to - Recipient phone number (e.g. +919876543210)
   * @param {string} options.message - The text message body
   * @returns {Promise<{ success: boolean, messageId?: string, error?: string }>}
   */
  async sendMessage({ to, message }) {
    throw new Error('sendMessage() must be implemented by concrete WhatsAppProvider');
  }
}

module.exports = WhatsAppProvider;
