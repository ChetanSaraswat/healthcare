const userService = require('../services/user.service');
const { SUCCESS, CREATED } = require('../libs/constants');

class UserController {
  async getProfile(req, res, next) {
    try {
      const profile = await userService.getProfile(req.user.id);
      res.status(SUCCESS).json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  }

  async getAddresses(req, res, next) {
    try {
      const addresses = await userService.getAddresses(req.user.id);
      res.status(SUCCESS).json({ success: true, data: addresses });
    } catch (error) {
      next(error);
    }
  }

  async createAddress(req, res, next) {
    try {
      const address = await userService.createAddress(req.user.id, req.body);
      res.status(CREATED).json({ success: true, data: address });
    } catch (error) {
      next(error);
    }
  }

  async updateAddress(req, res, next) {
    try {
      const address = await userService.updateAddress(req.user.id, req.params.id, req.body);
      res.status(SUCCESS).json({ success: true, data: address });
    } catch (error) {
      next(error);
    }
  }

  async deleteAddress(req, res, next) {
    try {
      const result = await userService.deleteAddress(req.user.id, req.params.id);
      res.status(SUCCESS).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getAllCustomers(req, res, next) {
    try {
      const customers = await userService.getAllCustomers(req.query);
      res.status(SUCCESS).json({ success: true, data: customers });
    } catch (error) {
      next(error);
    }
  }

  async getCustomerCareHistory(req, res, next) {
    try {
      const customer = await userService.getCustomerCareHistory(req.params.id);
      res.status(SUCCESS).json({ success: true, data: customer });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();

