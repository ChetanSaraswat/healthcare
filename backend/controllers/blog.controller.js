const blogService = require('../services/blog.service');
const { SUCCESS, CREATED } = require('../libs/constants');

class BlogController {
  async getAllPublished(req, res, next) {
    try {
      const { locale = 'en', page = 1, limit = 10, search = '' } = req.query;
      const result = await blogService.getAllPublished({ locale, page, limit, search });
      res.status(SUCCESS).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const { locale = 'en' } = req.query;
      const post = await blogService.getBySlug(slug, locale);
      res.status(SUCCESS).json({ success: true, data: post });
    } catch (error) {
      next(error);
    }
  }

  async getAllAdmin(req, res, next) {
    try {
      const { status = 'all', page = 1, limit = 20, search = '' } = req.query;
      const result = await blogService.getAllAdmin({ status, page, limit, search });
      res.status(SUCCESS).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const post = await blogService.getById(id);
      res.status(SUCCESS).json({ success: true, data: post });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const post = await blogService.create(req.body);
      res.status(CREATED).json({ success: true, data: post });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const post = await blogService.update(id, req.body);
      res.status(SUCCESS).json({ success: true, data: post });
    } catch (error) {
      next(error);
    }
  }

  async toggleStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const post = await blogService.toggleStatus(id, status);
      res.status(SUCCESS).json({ success: true, data: post });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const result = await blogService.delete(id);
      res.status(SUCCESS).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BlogController();
