'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class NotificationLog extends Model {
    static associate(models) {
      // Standalone audit log table — no foreign keys required
    }
  }

  NotificationLog.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull: false,
      },
      channel: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      event_key: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      transaction_type: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      transaction_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      recipient: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: 'sent',
      },
      payload: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      error_message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      sent_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'NotificationLog',
      tableName: 'notification_logs',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          unique: true,
          fields: ['channel', 'event_key'],
          name: 'unique_channel_event_key',
        },
        {
          fields: ['transaction_type', 'transaction_id'],
          name: 'idx_notification_logs_transaction',
        },
      ],
    }
  );

  return NotificationLog;
};
