const productService = require('../services/product.service');
const { SUCCESS, CREATED } = require('../libs/constants');

class ProductController {
  async list(req, res, next) {
    try {
      const result = await productService.list(req.query);
      res.status(SUCCESS).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req, res, next) {
    try {
      const locale = req.query.locale || 'en';
      const product = await productService.getBySlug(req.params.slug, locale);
      res.status(SUCCESS).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const product = await productService.create(req.body);
      res.status(CREATED).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const product = await productService.update(req.params.id, req.body);
      res.status(SUCCESS).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await productService.delete(req.params.id);
      res.status(SUCCESS).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();
