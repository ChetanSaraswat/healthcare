const router = require('express').Router();
const conditionController = require('../controllers/condition.controller');
const { validate } = require('../middlewares/validate.middleware');
const {
  listConditionsSchema,
  getConditionBySlugSchema,
} = require('../schema/condition/condition.schema');

router.get('/', validate(listConditionsSchema), (req, res, next) =>
  conditionController.getAll(req, res, next)
);

router.get('/:slug', validate(getConditionBySlugSchema), (req, res, next) =>
  conditionController.getBySlug(req, res, next)
);

module.exports = router;
