const orderService = require('../services/order.service');
const { SUCCESS, CREATED } = require('../libs/constants');

class OrderController {
  async create(req, res, next) {
    try {
      const order = await orderService.create(req.user.id, req.body);
      res.status(CREATED).json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const isStaff = ['super_admin', 'operations_staff'].includes(req.user.role);
      const userId = isStaff ? null : req.user.id;
      const order = await orderService.getById(req.params.id, userId);
      res.status(SUCCESS).json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  }

  async getMyOrders(req, res, next) {
    try {
      const orders = await orderService.getUserOrders(req.user.id);
      res.status(SUCCESS).json({ success: true, data: orders });
    } catch (error) {
      next(error);
    }
  }

  async getAllOrders(req, res, next) {
    try {
      const orders = await orderService.getAllOrders(req.query);
      res.status(SUCCESS).json({ success: true, data: orders });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const order = await orderService.updateStatus(req.params.id, req.body);
      res.status(SUCCESS).json({
        success: true,
        message: `Order updated successfully`,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrderController();
