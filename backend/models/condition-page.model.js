'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ConditionPage extends Model {
    static associate(models) {
      this.belongsTo(models.Tag, {
        foreignKey: 'related_tag_id',
        as: 'tag',
      });
      this.hasMany(models.ConditionPageTranslation, {
        foreignKey: 'condition_page_id',
        as: 'translations',
      });
    }
  }

  ConditionPage.init(
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
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'Condition title is required' } },
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { notEmpty: { msg: 'Condition slug is required' } },
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
      related_tag_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'tags',
          key: 'id',
        },
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'ConditionPage',
      tableName: 'condition_pages',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return ConditionPage;
};
