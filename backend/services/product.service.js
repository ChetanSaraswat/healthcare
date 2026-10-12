const { productRepository } = require('../repository');
const { NotFound, Conflict } = require('../libs/error');
const { slugify } = require('../libs/utils');
const storageService = require('./storage/storage.service');

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

    // Synchronize image_public_ids with any Cloudinary URLs in images array
    if (data.images && Array.isArray(data.images)) {
      const publicIds = Array.isArray(data.image_public_ids) ? [...data.image_public_ids] : [];
      for (const img of data.images) {
        if (typeof img === 'string') {
          const pid = storageService.extractPublicId(img);
          if (pid && !publicIds.includes(pid)) {
            publicIds.push(pid);
          }
        }
      }
      data.image_public_ids = publicIds;
    }

    return await productRepository.handleManagedTransaction(async (transaction) => {
      return await productRepository.createWithAssociations({ ...data, slug }, transaction);
    });
  }

  async update(id, data) {
    const isNum = !isNaN(Number(id));
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const where = isNum ? { id: Number(id) } : isUuid ? { uuid: id } : { id };

    const product = await productRepository.model.findOne({ where });
    if (!product) {
      throw new NotFound('Product not found');
    }

    if (data.slug && data.slug !== product.slug) {
      const exists = await productRepository.checkSlugExists(data.slug, product.id);
      if (exists) {
        throw new Conflict(`Product with slug '${data.slug}' already exists`);
      }
    }

    // Handle image replacement/deletion
    if (data.images && Array.isArray(data.images)) {
      const oldPublicIds = Array.isArray(product.image_public_ids) ? [...product.image_public_ids] : [];
      if (Array.isArray(product.images)) {
        for (const img of product.images) {
          if (typeof img === 'string') {
            const pid = storageService.extractPublicId(img);
            if (pid && !oldPublicIds.includes(pid)) oldPublicIds.push(pid);
          }
        }
      }

      const newPublicIds = Array.isArray(data.image_public_ids) ? [...data.image_public_ids] : [];
      for (const img of data.images) {
        if (typeof img === 'string') {
          const pid = storageService.extractPublicId(img);
          if (pid && !newPublicIds.includes(pid)) {
            newPublicIds.push(pid);
          }
        }
      }

      // Purge removed assets from Cloudinary gracefully
      const removedPublicIds = oldPublicIds.filter((pid) => !newPublicIds.includes(pid));
      if (removedPublicIds.length > 0) {
        for (const pid of removedPublicIds) {
          storageService.delete(pid).catch((err) => {
            console.error(`[ProductService] Error deleting replaced Cloudinary asset '${pid}':`, err.message);
          });
        }
      }

      data.image_public_ids = newPublicIds;
    }

    return await productRepository.handleManagedTransaction(async (transaction) => {
      return await productRepository.updateWithAssociations(product.id, data, transaction);
    });
  }

  async delete(id) {
    const isNum = !isNaN(Number(id));
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const where = isNum ? { id: Number(id) } : isUuid ? { uuid: id } : { id };

    const product = await productRepository.model.findOne({ where });
    if (!product) {
      throw new NotFound('Product not found');
    }

    // Collect all public IDs to delete from Cloudinary
    const publicIdsToDelete = Array.isArray(product.image_public_ids) ? [...product.image_public_ids] : [];
    if (Array.isArray(product.images)) {
      for (const img of product.images) {
        if (typeof img === 'string') {
          const pid = storageService.extractPublicId(img);
          if (pid && !publicIdsToDelete.includes(pid)) {
            publicIdsToDelete.push(pid);
          }
        }
      }
    }

    await productRepository.deleteById(product.id);

    // Purge assets from Cloudinary asynchronously; log and continue, never crash
    for (const pid of publicIdsToDelete) {
      storageService.delete(pid).catch((err) => {
        console.error(`[ProductService] Error deleting Cloudinary asset '${pid}' on product deletion:`, err.message);
      });
    }

    return { message: 'Product deleted successfully' };
  }
}

module.exports = new ProductService();
