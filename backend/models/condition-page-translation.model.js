'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ConditionPageTranslation extends Model {
    static associate(models) {
      this.belongsTo(models.ConditionPage, {
        foreignKey: 'condition_page_id',
        as: 'conditionPage',
      });
    }
  }

  ConditionPageTranslation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      condition_page_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'condition_pages',
          key: 'id',
        },
      },
      locale: {
        type: DataTypes.ENUM('en', 'hi'),
        allowNull: false,
        defaultValue: 'en',
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subtitle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      symptoms: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
      content_blocks: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
      treatments: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
    },
    {
      sequelize,
      modelName: 'ConditionPageTranslation',
      tableName: 'condition_page_translations',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          unique: true,
          fields: ['condition_page_id', 'locale'],
        },
      ],
    }
  );

  return ConditionPageTranslation;
};
