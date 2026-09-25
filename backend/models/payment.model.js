'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
      this.belongsTo(models.Order, {
        foreignKey: 'order_id',
        as: 'order',
      });
      this.belongsTo(models.RentalOrder, {
        foreignKey: 'rental_order_id',
        as: 'rentalOrder',
      });
    }
  }

  Payment.init(
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
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'orders',
          key: 'id',
        },
      },
      rental_order_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'rental_orders',
          key: 'id',
        },
      },
      gateway: {
        type: DataTypes.STRING,
        defaultValue: 'razorpay',
        allowNull: false,
      },
      gateway_order_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gateway_payment_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gateway_signature: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(10),
        defaultValue: 'INR',
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'captured', 'failed', 'refunded'),
        defaultValue: 'pending',
        allowNull: false,
      },
      payment_method: {
        type: DataTypes.STRING,
        allowNull: true, // e.g. upi, card, netbanking, cod
      },
      notes: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      idempotency_key: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      attempt_no: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
      confirmation_attempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      gateway_idempotency_key: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Payment',
      tableName: 'payments',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          fields: ['gateway_order_id'],
        },
        {
          fields: ['gateway_payment_id'],
        },
        {
          fields: ['user_id'],
        },
        {
          fields: ['gateway_idempotency_key'],
        },
        {
          unique: true,
          fields: ['order_id'],
          where: {
            status: 'captured',
          },
          name: 'unique_captured_order_payment',
        },
        {
          unique: true,
          fields: ['rental_order_id'],
          where: {
            status: 'captured',
          },
          name: 'unique_captured_rental_payment',
        },
        {
          unique: true,
          fields: ['order_id', 'idempotency_key'],
          name: 'unique_order_idempotency_key',
        },
        {
          unique: true,
          fields: ['rental_order_id', 'idempotency_key'],
          name: 'unique_rental_idempotency_key',
        },
      ],
    }
  );

  return Payment;
};
