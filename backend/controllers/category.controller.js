const categoryService = require('../services/category.service');
const { SUCCESS, CREATED } = require('../libs/constants');

class CategoryController {
  async getTree(req, res, next) {
    try {
      const tree = await categoryService.getTree();
      res.status(SUCCESS).json({ success: true, data: tree });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const categories = await categoryService.getAll();
      res.status(SUCCESS).json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const category = await categoryService.getById(req.params.id);
      res.status(SUCCESS).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req, res, next) {
    try {
      const category = await categoryService.getBySlug(req.params.slug);
      res.status(SUCCESS).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const category = await categoryService.create(req.body);
      res.status(CREATED).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const category = await categoryService.update(req.params.id, req.body);
      res.status(SUCCESS).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await categoryService.delete(req.params.id);
      res.status(SUCCESS).json({ success: true, message: 'Category deactivated successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CategoryController();
