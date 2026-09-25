'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RentalItem extends Model {
    static associate(models) {
      this.belongsTo(models.RentalOrder, {
        foreignKey: 'rental_order_id',
        as: 'rentalOrder',
      });
      this.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product',
      });
    }
  }

  RentalItem.init(
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
      rental_order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'rental_orders',
          key: 'id',
        },
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      rate_type: {
        type: DataTypes.ENUM('daily', 'weekly', 'monthly'),
        allowNull: false,
      },
      rate_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'RentalItem',
      tableName: 'rental_items',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return RentalItem;
};
