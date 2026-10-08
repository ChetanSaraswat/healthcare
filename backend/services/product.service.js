const { productRepository } = require('../repository');
const { NotFound, Conflict } = require('../libs/error');
const { slugify } = require('../libs/utils');

class ProductService {
  slugify(text) {
    return slugify(text);
  }

  resolveLocalized(plainProduct, locale = 'en') {
    const translations = plainProduct.translations || [];
    const requestedTrans = translations.find((t) => t.locale === locale);
    const englishTrans = translations.find((t) => t.locale === 'en');
    const effective = requestedTrans || englishTrans;

    return {
      ...plainProduct,
      name: effective?.name || plainProduct.name,
      description: effective?.description || plainProduct.description,
      specifications:
        effective?.specifications && effective.specifications.length > 0
          ? effective.specifications
          : plainProduct.specifications,
      warranty_info: effective?.warranty_info || plainProduct.warranty_info,
      locale: effective?.locale || 'en',
      is_fallback: Boolean(!requestedTrans && locale !== 'en'),
      has_hindi_translation: translations.some((t) => t.locale === 'hi'),
    };
  }

  async list(filters = {}) {
    const { locale = 'en', page = 1, limit = 20 } = filters;

    const { count, rows } = await productRepository.findWithFilters(filters);

    const items = rows.map((p) => {
      const plain = p.toJSON ? p.toJSON() : p;
      return this.resolveLocalized(plain, locale);
    });

    return {
      items,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit)),
      },
    };
  }

  async getBySlug(slug, locale = 'en') {
    const product = await productRepository.findBySlug(slug);

    if (!product) {
      throw new NotFound(`Product with slug '${slug}' not found`);
    }

    const plain = product.toJSON ? product.toJSON() : product;
    return this.resolveLocalized(plain, locale);
  }

  async create(data) {
    const slug = data.slug || this.slugify(data.name);
    const exists = await productRepository.checkSlugExists(slug);
    if (exists) {
      throw new Conflict(`Product with slug '${slug}' already exists`);
    }

    return await productRepository.handleManagedTransaction(async (transaction) => {
      return await productRepository.createWithAssociations({ ...data, slug }, transaction);
    });
  }

  async update(id, data) {
    const product = await productRepository.findByPk(id);
    if (!product) {
      throw new NotFound('Product not found');
    }

    if (data.slug && data.slug !== product.slug) {
      const exists = await productRepository.checkSlugExists(data.slug, id);
      if (exists) {
        throw new Conflict(`Product with slug '${data.slug}' already exists`);
      }
    }

    return await productRepository.handleManagedTransaction(async (transaction) => {
      return await productRepository.updateWithAssociations(id, data, transaction);
    });
  }

  async delete(id) {
    const deleted = await productRepository.deleteById(id);
    if (!deleted) {
      throw new NotFound('Product not found');
    }
    return { message: 'Product deleted successfully' };
  }
}

module.exports = new ProductService();
