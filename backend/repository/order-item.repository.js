const { OrderItem } = require('../models');
const BaseRepository = require('./base.repository');

class OrderItemRepository extends BaseRepository {
  constructor(payload) {
    super(payload);
  }
}

module.exports = new OrderItemRepository({ model: OrderItem });
