'use strict';

const staticPageService = require('../services/static-page.service');
const { SUCCESS, NOT_FOUND } = require('../libs/constants');

class StaticPageController {
  async getAll(req, res, next) {
    try {
      const pages = await staticPageService.getAllPages();
      res.status(SUCCESS).json({ success: true, data: pages });
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req, res, next) {
    try {
      const slug = req.params.slug;
      const locale = req.query.locale || 'en';
      const page = await staticPageService.getPageBySlug(slug, locale);

      if (!page) {
        return res.status(NOT_FOUND).json({
          success: false,
          message: `Policy or page "${slug}" not found`,
        });
      }

      res.status(SUCCESS).json({ success: true, data: page });
    } catch (error) {
      next(error);
    }
  }

  async upsert(req, res, next) {
    try {
      const slug = req.params.slug;
      const page = await staticPageService.upsertPage(slug, req.body);
      res.status(SUCCESS).json({
        success: true,
        message: `Policy "${slug}" updated successfully`,
        data: page,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StaticPageController();
