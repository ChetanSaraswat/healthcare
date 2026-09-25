'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RentalOrder extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
      this.belongsTo(models.Address, {
        foreignKey: 'address_id',
        as: 'address',
      });
      this.hasMany(models.RentalItem, {
        foreignKey: 'rental_order_id',
        as: 'items',
      });
      this.hasMany(models.Payment, {
        foreignKey: 'rental_order_id',
        as: 'payments',
      });
    }
  }

  RentalOrder.init(
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
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      address_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'addresses',
          key: 'id',
        },
      },
      // Simplified manual rental status
      status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'active', 'returned', 'cancelled'),
        defaultValue: 'pending',
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      deposit_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      deposit_status: {
        type: DataTypes.ENUM('held', 'refunded', 'partially_refunded', 'forfeited'),
        defaultValue: 'held',
        allowNull: false,
      },
      payment_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'RentalOrder',
      tableName: 'rental_orders',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return RentalOrder;
};
