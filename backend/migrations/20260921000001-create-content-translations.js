'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. product_translations
    await queryInterface.createTable('product_translations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      locale: {
        type: Sequelize.ENUM('en', 'hi'),
        allowNull: false,
        defaultValue: 'en',
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      specifications: {
        type: Sequelize.JSONB,
        defaultValue: [],
      },
      warranty_info: {
        type: Sequelize.TEXT,
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

    await queryInterface.addIndex('product_translations', ['product_id', 'locale'], {
      unique: true,
      name: 'product_translations_product_id_locale_unique',
    });

    // 2. condition_page_translations
    await queryInterface.createTable('condition_page_translations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      condition_page_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'condition_pages',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      locale: {
        type: Sequelize.ENUM('en', 'hi'),
        allowNull: false,
        defaultValue: 'en',
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      subtitle: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      body: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      symptoms: {
        type: Sequelize.JSONB,
        defaultValue: [],
      },
      treatments: {
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
    });

    await queryInterface.addIndex('condition_page_translations', ['condition_page_id', 'locale'], {
      unique: true,
      name: 'condition_translations_page_id_locale_unique',
    });

    // 3. blog_post_translations
    await queryInterface.createTable('blog_post_translations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      blog_post_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'blog_posts',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      locale: {
        type: Sequelize.ENUM('en', 'hi'),
        allowNull: false,
        defaultValue: 'en',
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      summary: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      body: {
        type: Sequelize.TEXT,
        allowNull: false,
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

    await queryInterface.addIndex('blog_post_translations', ['blog_post_id', 'locale'], {
      unique: true,
      name: 'blog_post_translations_post_id_locale_unique',
    });

    // 4. static_pages
    await queryInterface.createTable('static_pages', {
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
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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

    // 5. static_page_translations
    await queryInterface.createTable('static_page_translations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      static_page_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'static_pages',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      locale: {
        type: Sequelize.ENUM('en', 'hi'),
        allowNull: false,
        defaultValue: 'en',
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      body: {
        type: Sequelize.TEXT,
        allowNull: false,
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

    await queryInterface.addIndex('static_page_translations', ['static_page_id', 'locale'], {
      unique: true,
      name: 'static_page_translations_page_id_locale_unique',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('static_page_translations');
    await queryInterface.dropTable('static_pages');
    await queryInterface.dropTable('blog_post_translations');
    await queryInterface.dropTable('condition_page_translations');
    await queryInterface.dropTable('product_translations');
  },
};
