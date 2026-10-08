'use strict';

const { StaticPage, StaticPageTranslation } = require('../models');
const BaseRepository = require('./base.repository');

class StaticPageRepository extends BaseRepository {
  constructor(payload) {
    super(payload);
  }

  async findAllActive() {
    return await this.model.findAll({
      where: { is_active: true },
      include: [{ model: StaticPageTranslation, as: 'translations' }],
      order: [['created_at', 'ASC']],
    });
  }

  async findBySlugWithTranslations(slug) {
    return await this.model.findOne({
      where: { slug },
      include: [{ model: StaticPageTranslation, as: 'translations' }],
    });
  }

  async upsertPageWithTranslations(slug, payload) {
    let page = await this.model.findOne({ where: { slug } });
    if (!page) {
      page = await this.model.create({
        slug,
        is_active: payload.is_active !== undefined ? payload.is_active : true,
      });
    } else if (payload.is_active !== undefined) {
      await page.update({ is_active: payload.is_active, updated_at: new Date() });
    } else {
      await page.update({ updated_at: new Date() });
    }

    if (payload.titleEn || payload.bodyEn) {
      const [transEn] = await StaticPageTranslation.findOrCreate({
        where: { static_page_id: page.id, locale: 'en' },
        defaults: {
          title: payload.titleEn || slug,
          body: payload.bodyEn || '',
        },
      });
      await transEn.update({
        title: payload.titleEn !== undefined ? payload.titleEn : transEn.title,
        body: payload.bodyEn !== undefined ? payload.bodyEn : transEn.body,
        updated_at: new Date(),
      });
    }

    if (payload.titleHi || payload.bodyHi) {
      const [transHi] = await StaticPageTranslation.findOrCreate({
        where: { static_page_id: page.id, locale: 'hi' },
        defaults: {
          title: payload.titleHi || slug,
          body: payload.bodyHi || '',
        },
      });
      await transHi.update({
        title: payload.titleHi !== undefined ? payload.titleHi : transHi.title,
        body: payload.bodyHi !== undefined ? payload.bodyHi : transHi.body,
        updated_at: new Date(),
      });
    }

    return await this.findBySlugWithTranslations(slug);
  }
}

module.exports = new StaticPageRepository({ model: StaticPage });
