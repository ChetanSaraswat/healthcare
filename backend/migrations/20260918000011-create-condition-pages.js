'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('condition_pages', {
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
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
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
      related_tag_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'tags',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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

    await queryInterface.addIndex('condition_pages', ['slug']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('condition_pages');
  },
};
