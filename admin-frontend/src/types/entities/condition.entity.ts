import { Product } from './product.entity';

export interface ConditionSymptom {
  title: string;
  description: string;
}

export interface CaregiverTip {
  title: string;
  detail: string;
}

export interface BlockIllustration {
  imageUrl: string;
  altText: {
    en: string;
    hi: string;
  };
  sourceAttribution: string;
}

export interface ConditionContentBlockItem {
  title: string;
  description: string;
}

export interface ConditionContentBlock {
  id: string;
  slug: string;
  title: string;
  reversibilityNote?: string;
  items: ConditionContentBlockItem[];
  illustration?: BlockIllustration;
}

export interface LocalizedBlockIllustration {
  imageUrl: string;
  alt: string;
  sourceAttribution: string;
}

export interface LocalizedContentBlock {
  id: string;
  slug: string;
  title: string;
  reversibilityNote?: string;
  items: ConditionContentBlockItem[];
  illustration?: LocalizedBlockIllustration;
}

export interface ConditionTranslation {
  locale: 'en' | 'hi';
  name: string;
  shortDescription: string;
  symptoms: ConditionSymptom[];
  caregiverTips: CaregiverTip[];
  contentBlocks?: ConditionContentBlock[];
}

export interface Condition {
  id: string;
  name: string;
  slug: string;
  tag: string; // Used to cross-match with product.conditionTags
  shortDescription: string;
  heroImage?: string;
  symptoms: ConditionSymptom[];
  symptomsIllustration?: BlockIllustration;
  caregiverTips: CaregiverTip[];
  contentBlocks?: ConditionContentBlock[];
  recommendedEquipmentCategories: string[];
  recommendedProducts?: Product[];
  translations?: {
    en?: ConditionTranslation;
    hi?: ConditionTranslation;
  };
  hasHindiTranslation?: boolean;
}

export class ConditionEntity {
  static getLocalized(condition: Condition, locale: 'en' | 'hi' = 'en') {
    const hasHindi = Boolean(condition.translations?.hi && condition.translations.hi.name);
    const hi = condition.translations?.hi;
    const isHi = locale === 'hi' && hasHindi && !!hi;

    const baseBlocks = condition.contentBlocks || [];
    const hiBlocks = hi?.contentBlocks || [];

    // Localize content blocks
    const localizedBlocks: LocalizedContentBlock[] = baseBlocks.map((block) => {
      const matchingHi = isHi ? hiBlocks.find((b) => b.id === block.id || b.slug === block.slug) : null;
      const title = matchingHi?.title || block.title;
      const reversibilityNote = matchingHi?.reversibilityNote || block.reversibilityNote;
      const items = matchingHi?.items && matchingHi.items.length > 0 ? matchingHi.items : block.items;

      let illustration: LocalizedBlockIllustration | undefined;
      const rawIllustration = matchingHi?.illustration || block.illustration;
      if (rawIllustration) {
        illustration = {
          imageUrl: rawIllustration.imageUrl,
          alt: (locale === 'hi' ? rawIllustration.altText.hi : rawIllustration.altText.en) || rawIllustration.altText.en,
          sourceAttribution: rawIllustration.sourceAttribution,
        };
      }

      return {
        id: block.id,
        slug: block.slug,
        title,
        reversibilityNote,
        items,
        illustration,
      };
    });

    let localizedSymptomsIllustration: LocalizedBlockIllustration | undefined;
    if (condition.symptomsIllustration) {
      localizedSymptomsIllustration = {
        imageUrl: condition.symptomsIllustration.imageUrl,
        alt: (locale === 'hi' ? condition.symptomsIllustration.altText.hi : condition.symptomsIllustration.altText.en) || condition.symptomsIllustration.altText.en,
        sourceAttribution: condition.symptomsIllustration.sourceAttribution,
      };
    }

    if (isHi && hi) {
      return {
        name: hi.name,
        shortDescription: hi.shortDescription || condition.shortDescription,
        symptoms: hi.symptoms && hi.symptoms.length > 0 ? hi.symptoms : condition.symptoms,
        symptomsIllustration: localizedSymptomsIllustration,
        caregiverTips: hi.caregiverTips && hi.caregiverTips.length > 0 ? hi.caregiverTips : condition.caregiverTips,
        contentBlocks: localizedBlocks,
        locale: 'hi' as const,
        isFallback: false,
        hasHindiTranslation: true,
      };
    }

    return {
      name: condition.name,
      shortDescription: condition.shortDescription,
      symptoms: condition.symptoms,
      symptomsIllustration: localizedSymptomsIllustration,
      caregiverTips: condition.caregiverTips,
      contentBlocks: localizedBlocks,
      locale: 'en' as const,
      isFallback: locale === 'hi' && !hasHindi,
      hasHindiTranslation: hasHindi,
    };
  }
}
