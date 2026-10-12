'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('products');
    if (!tableInfo.image_public_ids) {
      await queryInterface.addColumn('products', 'image_public_ids', {
        type: Sequelize.JSONB,
        defaultValue: [],
        allowNull: false,
      });
    }
  },

  async down(queryInterface) {
    const tableInfo = await queryInterface.describeTable('products');
    if (tableInfo.image_public_ids) {
      await queryInterface.removeColumn('products', 'image_public_ids');
    }
  },
};
