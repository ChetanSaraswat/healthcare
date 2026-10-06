'use strict';

const { NotificationLog } = require('../models');
const BaseRepository = require('./base.repository');

class NotificationLogRepository extends BaseRepository {
  constructor() {
    super(NotificationLog);
  }

  async findSentNotification(channel, eventKey) {
    if (!this.model) return null;
    return await this.model.findOne({
      where: {
        channel,
        event_key: eventKey,
        status: 'sent',
      },
    });
  }

  async recordNotification({
    channel,
    eventKey,
    transactionType,
    transactionId,
    recipient,
    status = 'sent',
    payload = null,
    errorMessage = null,
    sentAt = new Date(),
  }) {
    if (!this.model) return null;
    return await this.model.create({
      channel,
      event_key: eventKey,
      transaction_type: transactionType,
      transaction_id: transactionId,
      recipient,
      status,
      payload,
      error_message: errorMessage,
      sent_at: status === 'sent' ? sentAt : null,
    });
  }
}

module.exports = new NotificationLogRepository();
