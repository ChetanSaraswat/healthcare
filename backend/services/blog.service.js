const { blogPostRepository } = require('../repository');
const { NotFound, Conflict } = require('../libs/error');

class BlogService {
  slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  resolveLocalizedPost(plainPost, locale = 'en') {
    const translations = plainPost.translations || [];
    const requested = translations.find((t) => t.locale === locale);
    const english = translations.find((t) => t.locale === 'en');
    const effective = requested || english;

    const hiTranslation = translations.find((t) => t.locale === 'hi');

    return {
      ...plainPost,
      title: effective?.title || plainPost.title,
      summary: effective?.summary || plainPost.summary,
      body: effective?.body || plainPost.body,
      locale: effective?.locale || 'en',
      is_fallback: Boolean(!requested && locale !== 'en'),
      has_hindi_translation: Boolean(hiTranslation && hiTranslation.title),
      translations: {
        hi: hiTranslation
          ? {
              id: hiTranslation.id,
              locale: 'hi',
              title: hiTranslation.title,
              summary: hiTranslation.summary,
              body: hiTranslation.body,
            }
          : null,
      },
    };
  }

  async getAllPublished({ locale = 'en', page = 1, limit = 10, search = '' } = {}) {
    const { count, rows } = await blogPostRepository.findAllPublished({ page, limit, search });

    const posts = rows.map((post) => {
      const plain = post.toJSON ? post.toJSON() : post;
      return this.resolveLocalizedPost(plain, locale);
    });

    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit) || 1,
      posts,
    };
  }

  async getBySlug(slug, locale = 'en') {
    const post = await blogPostRepository.findBySlug(slug);
    if (!post) {
      throw new NotFound(`Blog article with slug '${slug}' not found`);
    }

    const plain = post.toJSON ? post.toJSON() : post;
    return this.resolveLocalizedPost(plain, locale);
  }

  async getAllAdmin({ status, page = 1, limit = 20, search = '' } = {}) {
    const { count, rows } = await blogPostRepository.findAllAdmin({ status, page, limit, search });

    const posts = rows.map((post) => {
      const plain = post.toJSON ? post.toJSON() : post;
      const hiTranslation = (plain.translations || []).find((t) => t.locale === 'hi');
      return {
        ...plain,
        has_hindi_translation: Boolean(hiTranslation && hiTranslation.title),
      };
    });

    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit) || 1,
      posts,
    };
  }

  async getById(id) {
    const post = await blogPostRepository.findByIdWithTranslations(id);
    if (!post) {
      throw new NotFound(`Blog article with ID ${id} not found`);
    }
    const plain = post.toJSON ? post.toJSON() : post;
    const hiTranslation = (plain.translations || []).find((t) => t.locale === 'hi');
    return {
      ...plain,
      has_hindi_translation: Boolean(hiTranslation && hiTranslation.title),
      translations: {
        hi: hiTranslation || null,
      },
    };
  }

  async create(data) {
    const slug = data.slug || this.slugify(data.title);
    const existing = await blogPostRepository.findOne({ where: { slug } });
    if (existing) {
      throw new Conflict(`Blog article with slug '${slug}' already exists`);
    }

    const { translations = [], ...postData } = data;
    postData.slug = slug;
    postData.published_at = postData.status === 'published' ? new Date() : null;

    const created = await blogPostRepository.createWithTranslations(postData, translations);
    return created;
  }

  async update(id, data) {
    const post = await blogPostRepository.findByIdWithTranslations(id);
    if (!post) {
      throw new NotFound(`Blog article with ID ${id} not found`);
    }

    if (data.slug && data.slug !== post.slug) {
      const existing = await blogPostRepository.findOne({ where: { slug: data.slug } });
      if (existing && existing.id !== Number(id)) {
        throw new Conflict(`Blog article with slug '${data.slug}' already exists`);
      }
    }

    const { translations = [], ...postData } = data;

    if (postData.status === 'published' && post.status !== 'published') {
      postData.published_at = new Date();
    }

    const updated = await blogPostRepository.updateWithTranslations(id, postData, translations);
    return updated;
  }

  async toggleStatus(id, status) {
    const post = await blogPostRepository.findByIdWithTranslations(id);
    if (!post) {
      throw new NotFound(`Blog article with ID ${id} not found`);
    }

    const updatePayload = { status };
    if (status === 'published' && !post.published_at) {
      updatePayload.published_at = new Date();
    }

    await post.update(updatePayload);
    return post;
  }

  async delete(id) {
    const post = await blogPostRepository.findByIdWithTranslations(id);
    if (!post) {
      throw new NotFound(`Blog article with ID ${id} not found`);
    }

    await blogPostRepository.deleteWithTranslations(id);
    return { id, deleted: true };
  }
}

module.exports = new BlogService();
