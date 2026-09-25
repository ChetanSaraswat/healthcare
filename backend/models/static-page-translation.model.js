'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class StaticPageTranslation extends Model {
    static associate(models) {
      this.belongsTo(models.StaticPage, {
        foreignKey: 'static_page_id',
        as: 'staticPage',
      });
    }
  }

  StaticPageTranslation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      static_page_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'static_pages',
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
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'StaticPageTranslation',
      tableName: 'static_page_translations',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          unique: true,
          fields: ['static_page_id', 'locale'],
        },
      ],
    }
  );

  return StaticPageTranslation;
};
