'use strict';

const router = require('express').Router();
const emailController = require('../controllers/email.controller');
const { validate } = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { sendTestEmailSchema } = require('../schema/email/send-email.schema');

router.get('/templates', (req, res) => emailController.listTemplates(req, res));

router.post(
  '/send-test',
  authenticate,
  authorize('super_admin'),
  validate(sendTestEmailSchema),
  (req, res, next) => emailController.sendTestEmail(req, res, next)
);

module.exports = router;
