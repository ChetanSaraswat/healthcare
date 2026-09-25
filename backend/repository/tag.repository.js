const { Tag } = require('../models');
const BaseRepository = require('./base.repository');

class TagRepository extends BaseRepository {
  constructor(payload) {
    super(payload);
  }
}

module.exports = new TagRepository({ model: Tag });
