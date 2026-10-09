const { Category } = require('../models');
const BaseRepository = require('./base.repository');

class CategoryRepository extends BaseRepository {
  constructor(payload) {
    super(payload);
  }

  async getCategoryTree() {
    return await this.model.findAll({
      where: { parent_id: null, is_active: true },
      include: [
        {
          model: Category,
          as: 'subcategories',
          where: { is_active: true },
          required: false,
        },
      ],
      order: [
        ['display_order', 'ASC'],
        [{ model: Category, as: 'subcategories' }, 'display_order', 'ASC'],
      ],
    });
  }

  async findAllWithProductCount() {
    const { sequelize } = this.model;
    return await this.model.findAll({
      where: { is_active: true },
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)::int
              FROM products AS p
              WHERE (p.category_id = "Category"."id" OR p.subcategory_id = "Category"."id")
                AND p.deleted_at IS NULL
                AND p.status = 'active'
            )`),
            'product_count',
          ],
        ],
      },
      order: [['display_order', 'ASC']],
    });
  }
}

module.exports = new CategoryRepository({ model: Category });
