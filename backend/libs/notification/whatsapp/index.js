'use strict';

const MockWhatsAppProvider = require('./mock-whatsapp.provider');
const MetaWhatsAppCloudProvider = require('./meta-cloud.provider');
const TwilioWhatsAppProvider = require('./twilio.provider');
const notificationConfig = require('../../../config/notification.config');

let activeProviderInstance = null;

function getWhatsAppProvider(customConfig = null) {
  if (activeProviderInstance && !customConfig) {
    return activeProviderInstance;
  }

  const providerType = (
    (customConfig && customConfig.provider) ||
    notificationConfig.whatsappProvider ||
    'mock'
  ).toLowerCase();

  let provider;
  switch (providerType) {
    case 'cloud_api':
    case 'meta':
      provider = new MetaWhatsAppCloudProvider(
        (customConfig && customConfig.meta) || notificationConfig.meta
      );
      break;
    case 'twilio':
      provider = new TwilioWhatsAppProvider(
        (customConfig && customConfig.twilio) || notificationConfig.twilio
      );
      break;
    case 'mock':
    default:
      provider = new MockWhatsAppProvider();
      break;
  }

  if (!customConfig) {
    activeProviderInstance = provider;
  }

  return provider;
}

module.exports = {
  getWhatsAppProvider,
  MockWhatsAppProvider,
  MetaWhatsAppCloudProvider,
  TwilioWhatsAppProvider,
};
