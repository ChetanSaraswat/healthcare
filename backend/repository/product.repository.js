const { Op } = require('sequelize');
const { Product, Category, Tag, Review, ProductTag, ProductTranslation } = require('../models');
const BaseRepository = require('./base.repository');

class ProductRepository extends BaseRepository {
  constructor(payload) {
    super(payload);
  }

  async findBySlug(slug) {
    return await this.model.findOne({
      where: { slug, status: 'active' },
      include: [
        { model: Category, as: 'category' },
        { model: Category, as: 'subcategory' },
        { model: Tag, as: 'tags', through: { attributes: [] } },
        {
          model: Review,
          as: 'reviews',
          where: { status: 'approved' },
          required: false,
        },
        { model: ProductTranslation, as: 'translations' },
      ],
    });
  }

  async checkSlugExists(slug, excludeId = null) {
    const where = { slug };
    if (excludeId) {
      where.id = { [Op.ne]: excludeId };
    }
    const count = await this.model.count({ where });
    return count > 0;
  }

  async findWithFilters(filters = {}) {
    const {
      category,
      brand,
      buyRent,
      search,
      tag,
      minPrice,
      maxPrice,
      page = 1,
      limit = 20,
      sortBy = 'newest',
    } = filters;

    const where = { status: 'active' };

    if (brand) {
      where.brand = { [Op.iLike]: `%${brand}%` };
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { brand: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (buyRent === 'buy') {
      where.buy_available = true;
    } else if (buyRent === 'rent') {
      where.rent_available = true;
    } else if (buyRent === 'both') {
      where.buy_available = true;
      where.rent_available = true;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceFilter = {};
      if (minPrice !== undefined) priceFilter[Op.gte] = minPrice;
      if (maxPrice !== undefined) priceFilter[Op.lte] = maxPrice;

      if (buyRent === 'rent') {
        where.rent_price_monthly = priceFilter;
      } else {
        where.buy_price = priceFilter;
      }
    }

    const include = [
      {
        model: Category,
        as: 'category',
      },
      {
        model: Category,
        as: 'subcategory',
      },
      {
        model: Tag,
        as: 'tags',
        through: { attributes: [] },
      },
      {
        model: ProductTranslation,
        as: 'translations',
      },
    ];

    if (category) {
      const isNum = !isNaN(Number(category));
      include[0].where = isNum ? { id: Number(category) } : { slug: category };
    }

    if (tag) {
      include[2].where = { slug: tag };
    }

    let order = [['created_at', 'DESC']];
    if (sortBy === 'price_asc') {
      order = [['buy_price', 'ASC']];
    } else if (sortBy === 'price_desc') {
      order = [['buy_price', 'DESC']];
    } else if (sortBy === 'popular') {
      order = [['rating_avg', 'DESC']];
    }

    const offset = (Number(page) - 1) * Number(limit);

    return await this.model.findAndCountAll({
      where,
      include,
      order,
      limit: Number(limit),
      offset,
      distinct: true,
    });
  }

  async createWithAssociations(data, transaction = null) {
    const { tag_ids = [], translations = [], ...productData } = data;

    const opt = transaction ? { transaction } : {};
    const product = await this.model.create(productData, opt);

    if (tag_ids.length > 0) {
      const tagRecords = tag_ids.map((tag_id) => ({
        product_id: product.id,
        tag_id,
      }));
      await ProductTag.bulkCreate(tagRecords, opt);
    }

    if (translations.length > 0) {
      const translationRecords = translations.map((t) => ({
        ...t,
        product_id: product.id,
      }));
      await ProductTranslation.bulkCreate(translationRecords, opt);
    }

    return product;
  }

  async updateWithAssociations(id, data, transaction = null) {
    const product = await this.model.findByPk(id, transaction ? { transaction } : {});
    if (!product) return null;

    const { tag_ids, translations, ...productData } = data;
    const opt = transaction ? { transaction } : {};

    await product.update(productData, opt);

    if (tag_ids && Array.isArray(tag_ids)) {
      await ProductTag.destroy({ where: { product_id: product.id }, ...opt });
      if (tag_ids.length > 0) {
        const tagRecords = tag_ids.map((tag_id) => ({
          product_id: product.id,
          tag_id,
        }));
        await ProductTag.bulkCreate(tagRecords, opt);
      }
    }

    if (translations && Array.isArray(translations)) {
      for (const t of translations) {
        const existingTrans = await ProductTranslation.findOne({
          where: { product_id: product.id, locale: t.locale },
          ...opt,
        });
        if (existingTrans) {
          await existingTrans.update(t, opt);
        } else {
          await ProductTranslation.create({ ...t, product_id: product.id }, opt);
        }
      }
    }

    return product;
  }

  async deleteById(id) {
    const product = await this.model.findByPk(id);
    if (!product) return null;
    await product.destroy();
    return true;
  }
}

module.exports = new ProductRepository({ model: Product });
