const {
  ConditionPage,
  ConditionPageTranslation,
  Tag,
  Product,
  ProductTranslation,
  Category,
} = require('../models');
const BaseRepository = require('./base.repository');

class ConditionPageRepository extends BaseRepository {
  constructor(payload) {
    super(payload);
  }

  async findAllActive() {
    return await this.model.findAll({
      where: { is_active: true },
      include: [
        { model: Tag, as: 'tag' },
        { model: ConditionPageTranslation, as: 'translations' },
      ],
      order: [['created_at', 'ASC']],
    });
  }

  async findBySlugWithTranslations(slug) {
    return await this.model.findOne({
      where: { slug, is_active: true },
      include: [
        { model: Tag, as: 'tag' },
        { model: ConditionPageTranslation, as: 'translations' },
      ],
    });
  }

  async findRecommendedProductsByTagId(tagId, limit = 8) {
    return await Product.findAll({
      where: { status: 'active' },
      include: [
        {
          model: Tag,
          as: 'tags',
          where: { id: tagId },
          through: { attributes: [] },
        },
        { model: Category, as: 'category' },
        { model: ProductTranslation, as: 'translations' },
      ],
      limit,
    });
  }
}

module.exports = new ConditionPageRepository({ model: ConditionPage });
