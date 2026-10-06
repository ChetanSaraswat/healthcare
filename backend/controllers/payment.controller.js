'use strict';

const paymentService = require('../services/payment.service');
const { SUCCESS, CREATED } = require('../libs/constants');

class PaymentController {
  async createRazorpayOrder(req, res, next) {
    try {
      const userId = req.user ? req.user.id : null;
      const order = await paymentService.createRazorpayOrder(userId, req.body);
      res.status(CREATED).json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  }

  async verifyPayment(req, res, next) {
    try {
      const userId = req.user ? req.user.id : null;
      const result = await paymentService.verifyPayment(userId, req.body);
      res.status(SUCCESS).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async webhook(req, res, next) {
    try {
      const signature = req.headers['x-razorpay-signature'];
      const rawBody = req.rawBody || JSON.stringify(req.body);
      const result = await paymentService.handleWebhook(rawBody, signature, req.body);
      res.status(SUCCESS).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const isAdmin = req.user && req.user.role === 'super_admin';
      const userId = isAdmin ? null : req.user.id;
      const payment = await paymentService.getPaymentById(req.params.id, userId);
      res.status(SUCCESS).json({ success: true, data: payment });
    } catch (error) {
      next(error);
    }
  }

  async getMyPayments(req, res, next) {
    try {
      const payments = await paymentService.getUserPayments(req.user.id);
      res.status(SUCCESS).json({ success: true, data: payments });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PaymentController();
