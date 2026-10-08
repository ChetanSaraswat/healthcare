const { Op, Sequelize } = require('sequelize');
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
    if (!id) return null;

    const include = [
      { model: Order, as: 'order' },
      { model: RentalOrder, as: 'rentalOrder' },
      { model: User, as: 'user', attributes: ['id', 'email', 'name', 'phone'] },
    ];

    let payment = null;
    if (typeof id === 'number' || (typeof id === 'string' && /^\d+$/.test(id))) {
      payment = await this.findByPk(Number(id), { include, ...options });
    } else if (typeof id === 'string') {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (isUuid) {
        payment = await this.findByPk(id, { include, ...options });
      }
      if (!payment) {
        payment = await this.model.findOne({
          where: {
            [Op.or]: [
              { gateway_order_id: id },
              { gateway_payment_id: id },
              Sequelize.where(
                Sequelize.cast(Sequelize.json("notes.browser_payment_id"), 'text'),
                id
              ),
            ],
          },
          include,
          ...options,
        });
      }
    }
    return payment;
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

  async lockForUpdate(id, options = {}) {
    if (!id) return null;
    return await this.model.findByPk(id, {
      ...options,
      lock: options.transaction ? (options.transaction.LOCK ? options.transaction.LOCK.UPDATE : true) : undefined,
    });
  }

  async findByGatewayOrderIdForUpdate(gatewayOrderId, options = {}) {
    if (!gatewayOrderId) return null;
    return await this.model.findOne({
      where: { gateway_order_id: gatewayOrderId },
      ...options,
      lock: options.transaction ? (options.transaction.LOCK ? options.transaction.LOCK.UPDATE : true) : undefined,
    });
  }

  async markCaptured(id, updateData = {}, options = {}) {
    return await this.model.update(
      {
        status: 'captured',
        ...updateData,
      },
      {
        where: { id },
        ...options,
      }
    );
  }

  async markFailed(id, updateData = {}, options = {}) {
    return await this.model.update(
      {
        status: 'failed',
        ...updateData,
      },
      {
        where: { id },
        ...options,
      }
    );
  }
}

module.exports = new PaymentRepository();
