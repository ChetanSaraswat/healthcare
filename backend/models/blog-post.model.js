'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BlogPost extends Model {
    static associate(models) {
      this.hasMany(models.BlogPostTranslation, {
        foreignKey: 'blog_post_id',
        as: 'translations',
      });
    }
  }

  BlogPost.init(
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
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      summary: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      cover_image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      author_name: {
        type: DataTypes.STRING,
        defaultValue: 'Omkar Healthcare Editorial Team',
      },
      status: {
        type: DataTypes.ENUM('draft', 'published'),
        defaultValue: 'published',
      },
      published_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'BlogPost',
      tableName: 'blog_posts',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return BlogPost;
};
