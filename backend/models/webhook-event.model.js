'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class WebhookEvent extends Model {
    static associate(models) {
      // Standalone audit log table — no foreign key constraints required
    }
  }

  WebhookEvent.init(
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
      gateway_event_id: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      event_type: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      payload: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      received_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      processed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'WebhookEvent',
      tableName: 'webhook_events',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          unique: true,
          fields: ['gateway_event_id'],
          name: 'unique_gateway_event_id',
        },
      ],
    }
  );

  return WebhookEvent;
};
