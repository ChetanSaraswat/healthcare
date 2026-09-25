const { conditionPageRepository } = require('../repository');
const { NotFound } = require('../libs/error');

class ConditionService {
  resolveLocalizedCondition(plainCondition, locale = 'en') {
    const translations = plainCondition.translations || [];
    const requested = translations.find((t) => t.locale === locale);
    const english = translations.find((t) => t.locale === 'en');
    const effective = requested || english;

    return {
      ...plainCondition,
      title: effective?.title || plainCondition.title,
      subtitle: effective?.subtitle || plainCondition.subtitle,
      body: effective?.body || plainCondition.body,
      symptoms:
        effective?.symptoms && effective.symptoms.length > 0
          ? effective.symptoms
          : plainCondition.symptoms,
      treatments:
        effective?.treatments && effective.treatments.length > 0
          ? effective.treatments
          : plainCondition.treatments,
      content_blocks:
        effective?.content_blocks && effective.content_blocks.length > 0
          ? effective.content_blocks
          : plainCondition.content_blocks || [],
      locale: effective?.locale || 'en',
      is_fallback: Boolean(!requested && locale !== 'en'),
      has_hindi_translation: translations.some((t) => t.locale === 'hi'),
    };
  }

  async getAll(locale = 'en') {
    const conditions = await conditionPageRepository.findAllActive();
    return conditions.map((c) => {
      const plain = c.toJSON ? c.toJSON() : c;
      return this.resolveLocalizedCondition(plain, locale);
    });
  }

  async getBySlug(slug, locale = 'en') {
    const condition = await conditionPageRepository.findBySlugWithTranslations(slug);

    if (!condition) {
      throw new NotFound(`Condition page '${slug}' not found`);
    }

    const plainCondition = condition.toJSON ? condition.toJSON() : condition;

    let recommendedProducts = [];
    if (plainCondition.related_tag_id) {
      const prods = await conditionPageRepository.findRecommendedProductsByTagId(
        plainCondition.related_tag_id,
        8
      );

      recommendedProducts = prods.map((p) => {
        const plain = p.toJSON ? p.toJSON() : p;
        const trs = plain.translations || [];
        const req = trs.find((t) => t.locale === locale);
        const eng = trs.find((t) => t.locale === 'en');
        const eff = req || eng;
        return {
          ...plain,
          name: eff?.name || plain.name,
          description: eff?.description || plain.description,
          specifications: eff?.specifications || plain.specifications,
        };
      });
    }

    return {
      condition: this.resolveLocalizedCondition(plainCondition, locale),
      recommendedProducts,
    };
  }
}

module.exports = new ConditionService();
