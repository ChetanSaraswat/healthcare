const { Op } = require('sequelize');
const BaseRepository = require('./base.repository');
const { Payment, Order, RentalOrder, User } = require('../models');

class PaymentRepository extends BaseRepository {
  constructor() {
    super({ model: Payment });
  }

  async findByGatewayOrderId(gatewayOrderId, options = {}) {
    return await this.findOneInstance({ gateway_order_id: gatewayOrderId }, [], options);
  }

  async findByGatewayPaymentId(gatewayPaymentId, options = {}) {
    return await this.findOneInstance({ gateway_payment_id: gatewayPaymentId }, [], options);
  }

  async findByOrderId(orderId, options = {}) {
    return await this.findOneInstance({ order_id: orderId }, [], options);
  }

  async findByRentalOrderId(rentalOrderId, options = {}) {
    return await this.findOneInstance({ rental_order_id: rentalOrderId }, [], options);
  }

  async findCapturedByOrderId(orderId, options = {}) {
    return await this.findOneInstance({ order_id: orderId, status: 'captured' }, [], options);
  }

  async findCapturedByRentalOrderId(rentalOrderId, options = {}) {
    return await this.findOneInstance({ rental_order_id: rentalOrderId, status: 'captured' }, [], options);
  }

  async findByOrderIdAndIdempotencyKey(orderId, idempotencyKey, options = {}) {
    if (!orderId || !idempotencyKey) return null;
    return await this.findOneInstance({ order_id: orderId, idempotency_key: idempotencyKey }, [], options);
  }

  async findByRentalOrderIdAndIdempotencyKey(rentalOrderId, idempotencyKey, options = {}) {
    if (!rentalOrderId || !idempotencyKey) return null;
    return await this.findOneInstance({ rental_order_id: rentalOrderId, idempotency_key: idempotencyKey }, [], options);
  }

  async findPendingForReconciliation(thresholdDate, options = {}) {
    return await this.getAll({
      where: {
        status: 'pending',
        gateway: 'razorpay',
        created_at: { [Op.lte]: thresholdDate },
      },
      order: [['created_at', 'ASC']],
      ...options,
    });
  }

  async findAllPendingByOrderId(orderId, options = {}) {
    return await this.getAll({
      where: {
        order_id: orderId,
        status: 'pending',
      },
      ...options,
    });
  }

  async findUserPayments(userId, options = {}) {
    return await this.getAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      include: [
        { model: Order, as: 'order' },
        { model: RentalOrder, as: 'rentalOrder' },
      ],
      ...options,
    });
  }

  async findPaymentDetails(id, options = {}) {
    return await this.findByPk(id, {
      include: [
        { model: Order, as: 'order' },
        { model: RentalOrder, as: 'rentalOrder' },
        { model: User, as: 'user', attributes: ['id', 'email', 'name', 'phone'] },
      ],
      ...options,
    });
  }

  async countAttemptsByOrderId(orderId, options = {}) {
    if (!orderId) return 0;
    return await this.model.count({
      where: { order_id: orderId },
      ...options,
    });
  }

  async countAttemptsByRentalOrderId(rentalOrderId, options = {}) {
    if (!rentalOrderId) return 0;
    return await this.model.count({
      where: { rental_order_id: rentalOrderId },
      ...options,
    });
  }

  async findByGatewayIdempotencyKey(gatewayIdempotencyKey, options = {}) {
    if (!gatewayIdempotencyKey) return null;
    return await this.findOneInstance({ gateway_idempotency_key: gatewayIdempotencyKey }, [], options);
  }
}

module.exports = new PaymentRepository();
