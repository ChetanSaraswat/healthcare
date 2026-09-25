const rentalService = require('../services/rental.service');
const { SUCCESS, CREATED } = require('../libs/constants');

class RentalController {
  async quote(req, res, next) {
    try {
      const result = await rentalService.quote(req.body.items);
      res.status(SUCCESS).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const rental = await rentalService.createRentalOrder(req.user.id, req.body);
      res.status(CREATED).json({ success: true, data: rental });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const isStaff = ['super_admin', 'operations_staff'].includes(req.user.role);
      const userId = isStaff ? null : req.user.id;
      const rental = await rentalService.getById(req.params.id, userId);
      res.status(SUCCESS).json({ success: true, data: rental });
    } catch (error) {
      next(error);
    }
  }

  async getMyRentals(req, res, next) {
    try {
      const rentals = await rentalService.getUserRentals(req.user.id);
      res.status(SUCCESS).json({ success: true, data: rentals });
    } catch (error) {
      next(error);
    }
  }

  async getAllRentals(req, res, next) {
    try {
      const rentals = await rentalService.getAllRentals(req.query);
      res.status(SUCCESS).json({ success: true, data: rentals });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const rental = await rentalService.updateStatus(req.params.id, req.body);
      res.status(SUCCESS).json({
        success: true,
        message: `Rental status updated to '${rental.status}'`,
        data: rental,
      });
    } catch (error) {
      next(error);
    }
  }

  async extendRental(req, res, next) {
    try {
      const isStaff = ['super_admin', 'operations_staff'].includes(req.user.role);
      const userId = isStaff ? null : req.user.id;
      const result = await rentalService.extendRental(req.params.id, userId, req.body);
      res.status(SUCCESS).json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async scheduleReturn(req, res, next) {
    try {
      const isStaff = ['super_admin', 'operations_staff'].includes(req.user.role);
      const userId = isStaff ? null : req.user.id;
      const result = await rentalService.scheduleReturn(req.params.id, userId, req.body);
      res.status(SUCCESS).json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RentalController();
