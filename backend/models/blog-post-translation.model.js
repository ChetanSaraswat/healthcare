'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BlogPostTranslation extends Model {
    static associate(models) {
      this.belongsTo(models.BlogPost, {
        foreignKey: 'blog_post_id',
        as: 'blogPost',
      });
    }
  }

  BlogPostTranslation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      blog_post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'blog_posts',
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
      summary: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'BlogPostTranslation',
      tableName: 'blog_post_translations',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          unique: true,
          fields: ['blog_post_id', 'locale'],
        },
      ],
    }
  );

  return BlogPostTranslation;
};
