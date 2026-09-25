const { Op } = require('sequelize');
const { BlogPost, BlogPostTranslation } = require('../models');
const BaseRepository = require('./base.repository');

class BlogPostRepository extends BaseRepository {
  constructor(payload) {
    super(payload);
  }

  async findBySlug(slug) {
    return await this.model.findOne({
      where: { slug, status: 'published' },
      include: [{ model: BlogPostTranslation, as: 'translations' }],
    });
  }

  async findByIdWithTranslations(id) {
    return await this.model.findByPk(id, {
      include: [{ model: BlogPostTranslation, as: 'translations' }],
    });
  }

  async findAllPublished({ page = 1, limit = 10, search = '' } = {}) {
    const offset = (page - 1) * limit;
    const where = { status: 'published' };

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { summary: { [Op.iLike]: `%${search}%` } },
      ];
    }

    return await this.model.findAndCountAll({
      where,
      include: [{ model: BlogPostTranslation, as: 'translations' }],
      order: [['published_at', 'DESC']],
      limit,
      offset,
      distinct: true,
    });
  }

  async findAllAdmin({ status, page = 1, limit = 20, search = '' } = {}) {
    const offset = (page - 1) * limit;
    const where = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { summary: { [Op.iLike]: `%${search}%` } },
        { author_name: { [Op.iLike]: `%${search}%` } },
      ];
    }

    return await this.model.findAndCountAll({
      where,
      include: [{ model: BlogPostTranslation, as: 'translations' }],
      order: [['created_at', 'DESC']],
      limit,
      offset,
      distinct: true,
    });
  }

  async createWithTranslations(postData, translations = []) {
    const post = await this.model.create(postData);

    if (translations && translations.length > 0) {
      const translationRecords = translations.map((tr) => ({
        ...tr,
        blog_post_id: post.id,
      }));
      await BlogPostTranslation.bulkCreate(translationRecords);
    }

    return await this.findByIdWithTranslations(post.id);
  }

  async updateWithTranslations(id, postData, translations = []) {
    const post = await this.model.findByPk(id);
    if (!post) return null;

    await post.update(postData);

    if (translations && translations.length > 0) {
      for (const tr of translations) {
        const existing = await BlogPostTranslation.findOne({
          where: { blog_post_id: id, locale: tr.locale },
        });

        if (existing) {
          await existing.update(tr);
        } else {
          await BlogPostTranslation.create({
            ...tr,
            blog_post_id: id,
          });
        }
      }
    }

    return await this.findByIdWithTranslations(id);
  }

  async deleteWithTranslations(id) {
    const post = await this.model.findByPk(id);
    if (!post) return false;

    await BlogPostTranslation.destroy({ where: { blog_post_id: id } });
    await post.destroy();
    return true;
  }
}

module.exports = new BlogPostRepository({ model: BlogPost });
