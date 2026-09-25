'use strict';

const BaseRepository = require('./base.repository');
const { WebhookEvent } = require('../models');

class WebhookEventRepository extends BaseRepository {
  constructor() {
    super({ model: WebhookEvent });
  }

  async findByGatewayEventId(gatewayEventId, options = {}) {
    if (!gatewayEventId) return null;
    return await this.findOneInstance({ gateway_event_id: gatewayEventId }, [], options);
  }

  async recordEvent({ gateway_event_id, event_type, payload, processed_at = null }, options = {}) {
    return await this.create(
      {
        gateway_event_id,
        event_type,
        payload,
        received_at: new Date(),
        processed_at,
      },
      options
    );
  }
}

module.exports = new WebhookEventRepository();
