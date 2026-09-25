'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
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
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      subcategory_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'categories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      brand: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      images: {
        type: Sequelize.JSONB,
        defaultValue: [],
      },
      videos: {
        type: Sequelize.JSONB,
        defaultValue: [],
      },
      specifications: {
        type: Sequelize.JSONB,
        defaultValue: [],
      },
      buy_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      buy_mrp: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      buy_available: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      rent_price_daily: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      rent_price_weekly: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      rent_price_monthly: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      rent_deposit: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      rent_min_period_days: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      rent_available: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      stock_quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      warranty_info: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('active', 'draft', 'out_of_stock'),
        defaultValue: 'active',
        allowNull: false,
      },
      related_product_ids: {
        type: Sequelize.JSONB,
        defaultValue: [],
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex('products', ['slug']);
    await queryInterface.addIndex('products', ['category_id']);
    await queryInterface.addIndex('products', ['brand']);
    await queryInterface.addIndex('products', ['status']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  },
};
