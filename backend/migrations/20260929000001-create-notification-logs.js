'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notification_logs', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        allowNull: false,
      },
      channel: {
        type: Sequelize.STRING(30), // 'whatsapp' or 'email'
        allowNull: false,
      },
      event_key: {
        type: Sequelize.STRING(150), // e.g. 'order_123_whatsapp', 'rental_456_email'
        allowNull: false,
      },
      transaction_type: {
        type: Sequelize.STRING(20), // 'BUY' or 'RENT'
        allowNull: false,
      },
      transaction_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      recipient: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(30), // 'sent', 'failed', 'skipped'
        allowNull: false,
        defaultValue: 'sent',
      },
      payload: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      error_message: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      sent_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Unique index on (channel, event_key) to enforce database-level notification idempotency
    await queryInterface.addIndex('notification_logs', ['channel', 'event_key'], {
      unique: true,
      name: 'unique_channel_event_key',
    });

    // Index for quick queries by transaction
    await queryInterface.addIndex('notification_logs', ['transaction_type', 'transaction_id'], {
      name: 'idx_notification_logs_transaction',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('notification_logs');
  },
};
