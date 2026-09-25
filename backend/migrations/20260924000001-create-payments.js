'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'orders',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      rental_order_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'rental_orders',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      gateway: {
        type: Sequelize.STRING,
        defaultValue: 'razorpay',
        allowNull: false,
      },
      gateway_order_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gateway_payment_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gateway_signature: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING(10),
        defaultValue: 'INR',
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'captured', 'failed', 'refunded'),
        defaultValue: 'pending',
        allowNull: false,
      },
      payment_method: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      notes: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex('payments', ['gateway_order_id']);
    await queryInterface.addIndex('payments', ['gateway_payment_id']);
    await queryInterface.addIndex('payments', ['user_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('payments');
  },
};
