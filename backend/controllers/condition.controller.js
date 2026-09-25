const conditionService = require('../services/condition.service');
const { SUCCESS } = require('../libs/constants');

class ConditionController {
  async getAll(req, res, next) {
    try {
      const locale = req.query.locale || 'en';
      const conditions = await conditionService.getAll(locale);
      res.status(SUCCESS).json({ success: true, data: conditions });
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req, res, next) {
    try {
      const locale = req.query.locale || 'en';
      const result = await conditionService.getBySlug(req.params.slug, locale);
      res.status(SUCCESS).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ConditionController();
