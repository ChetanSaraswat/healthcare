'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Add attempt_no, confirmation_attempts, gateway_idempotency_key to payments table
    await queryInterface.addColumn('payments', 'attempt_no', {
      type: Sequelize.INTEGER,
      defaultValue: 1,
      allowNull: false,
    });

    await queryInterface.addColumn('payments', 'confirmation_attempts', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    });

    await queryInterface.addColumn('payments', 'gateway_idempotency_key', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    await queryInterface.addIndex('payments', ['gateway_idempotency_key']);

    // 2. Create webhook_events table for durable, append-only webhook audit trail
    await queryInterface.createTable('webhook_events', {
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
      gateway_event_id: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      event_type: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      payload: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      received_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      processed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('webhook_events', ['gateway_event_id'], {
      unique: true,
      name: 'unique_gateway_event_id',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('webhook_events');
    await queryInterface.removeIndex('payments', ['gateway_idempotency_key']);
    await queryInterface.removeColumn('payments', 'gateway_idempotency_key');
    await queryInterface.removeColumn('payments', 'confirmation_attempts');
    await queryInterface.removeColumn('payments', 'attempt_no');
  },
};
