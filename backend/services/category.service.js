const { categoryRepository } = require('../repository');
const { NotFound, Conflict, BadRequest } = require('../libs/error');

class CategoryService {
  slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-');
  }

  async getTree() {
    return await categoryRepository.getCategoryTree();
  }

  async getAll() {
    return await categoryRepository.findAll({
      where: { is_active: true },
      order: [['display_order', 'ASC']],
    });
  }

  async getById(id) {
    const category = await categoryRepository.findOne({
      where: { id },
    });
    if (!category) {
      throw new NotFound('Category not found');
    }
    return category;
  }

  async getBySlug(slug) {
    const category = await categoryRepository.findOne({
      where: { slug, is_active: true },
    });
    if (!category) {
      throw new NotFound('Category not found');
    }
    return category;
  }

  async create(data) {
    const slug = data.slug || this.slugify(data.name);
    const existing = await categoryRepository.findOne({ where: { slug } });
    if (existing) {
      throw new Conflict(`Category with slug '${slug}' already exists`);
    }

    return await categoryRepository.create({
      ...data,
      slug,
    });
  }

  async update(id, data) {
    const category = await this.getById(id);
    if (data.slug && data.slug !== category.slug) {
      const existing = await categoryRepository.findOne({ where: { slug: data.slug } });
      if (existing && existing.id !== category.id) {
        throw new Conflict(`Category with slug '${data.slug}' already exists`);
      }
    }

    return await categoryRepository.update(data, {
      where: { id },
      returning: true,
    });
  }

  async delete(id) {
    await this.getById(id);
    return await categoryRepository.update(
      { is_active: false },
      { where: { id } }
    );
  }
}

module.exports = new CategoryService();
