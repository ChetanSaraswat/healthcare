'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      this.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category',
      });
      this.belongsTo(models.Category, {
        foreignKey: 'subcategory_id',
        as: 'subcategory',
      });
      this.belongsToMany(models.Tag, {
        through: models.ProductTag,
        foreignKey: 'product_id',
        otherKey: 'tag_id',
        as: 'tags',
      });
      this.hasMany(models.Review, {
        foreignKey: 'product_id',
        as: 'reviews',
      });
      this.hasMany(models.ProductTranslation, {
        foreignKey: 'product_id',
        as: 'translations',
      });
    }
  }

  Product.init(
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'Product name is required' } },
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { notEmpty: { msg: 'Product slug is required' } },
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id',
        },
      },
      subcategory_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'categories',
          key: 'id',
        },
      },
      brand: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      images: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
      videos: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
      // Fixed Generic Schema: specifications stored as JSONB array of { label, value }
      specifications: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
      // Purchase Fields
      buy_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      buy_mrp: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      buy_available: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      // Rental Fields (Equal-Weight)
      rent_price_daily: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      rent_price_weekly: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      rent_price_monthly: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      rent_deposit: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      rent_min_period_days: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      rent_available: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      stock_quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      warranty_info: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('active', 'draft', 'out_of_stock'),
        defaultValue: 'active',
        allowNull: false,
      },
      related_product_ids: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
    },
    {
      sequelize,
      modelName: 'Product',
      tableName: 'products',
      paranoid: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
    }
  );

  return Product;
};
