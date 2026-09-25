'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
      this.hasMany(models.Order, {
        foreignKey: 'address_id',
        as: 'orders',
      });
      this.hasMany(models.RentalOrder, {
        foreignKey: 'address_id',
        as: 'rentalOrders',
      });
    }
  }

  Address.init(
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
      label: {
        type: DataTypes.STRING,
        defaultValue: 'Home',
      },
      line1: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'Address line 1 is required' } },
      },
      line2: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'City is required' } },
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'State is required' } },
      },
      pincode: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: { notEmpty: { msg: 'Pincode is required' } },
      },
      is_default: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Address',
      tableName: 'addresses',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Address;
};
