'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductTranslation extends Model {
    static associate(models) {
      this.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product',
      });
    }
  }

  ProductTranslation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
      },
      locale: {
        type: DataTypes.ENUM('en', 'hi'),
        allowNull: false,
        defaultValue: 'en',
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'Localized product name is required' } },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      specifications: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
      warranty_info: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'ProductTranslation',
      tableName: 'product_translations',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          unique: true,
          fields: ['product_id', 'locale'],
        },
      ],
    }
  );

  return ProductTranslation;
};
