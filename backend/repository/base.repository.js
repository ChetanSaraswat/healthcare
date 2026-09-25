const { sequelize } = require('../config/db/db-connection');
const { BadRequest } = require('../libs/error');

class BaseRepository {
  constructor({ model }) {
    this.model = model;
  }

  _normalizeQueryArgs(criteria, include = [], attributes = undefined, options = {}) {
    let whereClause = criteria;
    let includeClause = include;
    let attributesClause = attributes;
    let extraOptions = { ...options };

    if (criteria && typeof criteria === 'object' && criteria.where !== undefined) {
      whereClause = criteria.where;
      if (criteria.include && (!include || include.length === 0)) {
        includeClause = criteria.include;
      }
      if (criteria.attributes && attributes === undefined) {
        attributesClause = criteria.attributes;
      }
      const { where, include: _inc, attributes: _attr, ...rest } = criteria;
      extraOptions = { ...rest, ...options };
    }

    return {
      where: whereClause,
      include: includeClause,
      ...(attributesClause && { attributes: attributesClause }),
      ...extraOptions,
    };
  }

  async create(payload, options = {}) {
    const instance = await this.model.create(payload, options);
    return instance && instance.toJSON ? instance.toJSON() : instance;
  }

  async count(options = {}) {
    const whereClause = options.where !== undefined ? options.where : options;
    return await this.model.count({ where: whereClause, ...(options.where !== undefined ? options : {}) });
  }

  async getAll(options = {}) {
    return await this.model.findAll(options);
  }

  async findByPk(id, options = {}) {
    return await this.model.findByPk(id, options);
  }

  async update({ payload, criteria, where, options = {} }) {
    const whereClause = where !== undefined ? where : criteria;
    return await this.model.update(payload, { where: whereClause, ...options });
  }

  async findOne(criteria, include = [], attributes = undefined, options = {}) {
    const queryOptions = this._normalizeQueryArgs(criteria, include, attributes, options);
    const res = await this.model.findOne(queryOptions);
    return res && res.toJSON ? res.toJSON() : res;
  }

  async findOneInstance(criteria, include = [], options = {}) {
    const queryOptions = this._normalizeQueryArgs(criteria, include, undefined, options);
    return await this.model.findOne(queryOptions);
  }

  async findAll(args = {}) {
    const {
      criteria,
      where,
      include = [],
      order,
      attributes,
      offset = 0,
      limit = null,
      transaction = null,
      lock = null,
      raw = false,
      subQuery = false,
      ...rest
    } = args;

    const whereClause = where !== undefined ? where : (criteria !== undefined ? criteria : {});
    const findQuery = {
      where: whereClause,
      include,
      offset,
      order,
      subQuery,
      raw,
      ...(attributes && { attributes }),
      ...rest,
    };
    if (transaction) findQuery.transaction = transaction;
    if (limit) findQuery.limit = limit;
    if (lock) findQuery.lock = lock;

    return await this.model.findAll(findQuery);
  }

  async findAndCountAll(args = {}) {
    const {
      criteria,
      where,
      include = [],
      order,
      attributes,
      offset = 0,
      limit = 10,
      distinct = true,
      subQuery = false,
      transaction = null,
      ...rest
    } = args;

    const whereClause = where !== undefined ? where : (criteria !== undefined ? criteria : {});
    const query = {
      where: whereClause,
      include,
      offset,
      order,
      limit,
      distinct,
      subQuery,
      ...(attributes && { attributes }),
      ...rest,
    };
    if (transaction) query.transaction = transaction;

    return await this.model.findAndCountAll(query);
  }

  async createBulk(payload, options = {}) {
    return await this.model.bulkCreate(payload, options);
  }

  async softDelete(criteria, options = {}) {
    const whereClause = (criteria && criteria.where !== undefined) ? criteria.where : criteria;
    return await this.model.destroy({ where: whereClause, ...options });
  }

  async delete(criteria, options = {}) {
    return await this.softDelete(criteria, options);
  }

  async startTransaction() {
    return sequelize.transaction();
  }

  async commitTransaction(transaction) {
    return transaction.commit();
  }

  async rollbackTransaction(transaction) {
    return transaction.rollback();
  }

  async handleManagedTransaction(callback) {
    return await sequelize.transaction(callback);
  }

  async getId(uuid) {
    const resp = await this.model.findOne({ where: { uuid } });
    if (!resp) throw new BadRequest('Invalid UUID');
    return resp.toJSON().id;
  }
}

module.exports = BaseRepository;
