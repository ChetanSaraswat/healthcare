const { RentalItem } = require('../models');
const BaseRepository = require('./base.repository');

class RentalItemRepository extends BaseRepository {
  constructor(payload) {
    super(payload);
  }
}

module.exports = new RentalItemRepository({ model: RentalItem });
