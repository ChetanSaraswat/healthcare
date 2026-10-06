export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductRentalOption {
  enabled: boolean;
  dailyRate: number;
  weeklyRate?: number;
  monthlyRate?: number;
  securityDeposit: number;
  minimumDays: number;
}

export interface ProductTranslation {
  locale: 'en' | 'hi';
  name: string;
  shortDescription?: string;
  description: string;
  specifications: ProductSpecification[];
  warrantyInfo?: string;
}

export interface Product {
  id: string;
  name: string; // Base English name
  slug: string;
  sku: string;
  shortDescription?: string;
  description: string;
  categoryId: string;
  categoryName?: string;
  brand?: string;
  images: string[];
  primaryImage: string;
  
  // Purchase pricing
  buyPrice: number;
  mrp: number;
  stock: number;
  isAvailableForBuy: boolean;

  // Rental pricing & terms
  isAvailableForRent: boolean;
  rentalDailyRate: number;
  rentalWeeklyRate?: number;
  rentalMonthlyRate?: number;
  rentalSecurityDeposit: number;
  rentalMinDays: number;

  // Medical certifications & tags
  certifications?: string[]; // e.g. ['CDSCO Approved', 'CE Certified', 'ISO 13485']
  conditionTags?: string[];  // e.g. ['sleep-apnea', 'respiratory-care', 'post-icu']
  sanitizationLevel?: string; // e.g. 'Hospital-Grade 10-Step Sterilized'

  // Generic flexible specifications (Default/English)
  specifications: ProductSpecification[];

  // Bilingual Translations mapping
  translations?: {
    en?: ProductTranslation;
    hi?: ProductTranslation;
  };
  hasHindiTranslation?: boolean;

  // Warranty and delivery
  warrantyMonths?: number;
  warrantyInfo?: string;
  estimatedDeliveryHours?: number;
  featured?: boolean;
  rating?: number;
  reviewsCount?: number;
}

export class ProductEntity {
  static getDiscountPercentage(buyPrice: number, mrp: number): number {
    if (!mrp || mrp <= buyPrice) return 0;
    return Math.round(((mrp - buyPrice) / mrp) * 100);
  }

  static calculateRentalEstimate(
    dailyRate: number,
    days: number,
    deposit: number
  ): { rentalCost: number; deposit: number; totalDueNow: number } {
    const validDays = Math.max(days, 1);
    const rentalCost = validDays * dailyRate;
    return {
      rentalCost,
      deposit,
      totalDueNow: rentalCost + deposit,
    };
  }

  /**
   * Resolves localized content for a product based on requested locale.
   * If Hindi is requested and available, returns Hindi text and specs.
   * If Hindi is missing, gracefully falls back to English without crashing or showing blank.
   */
  static getLocalized(product: Product, locale: 'en' | 'hi' = 'en') {
    const hasHindi = Boolean(product.translations?.hi && product.translations.hi.name);

    if (locale === 'hi' && hasHindi && product.translations?.hi) {
      const hi = product.translations.hi;
      return {
        name: hi.name,
        shortDescription: hi.shortDescription || product.shortDescription,
        description: hi.description,
        specifications: hi.specifications && hi.specifications.length > 0 ? hi.specifications : product.specifications,
        warrantyInfo: hi.warrantyInfo || product.warrantyInfo,
        locale: 'hi' as const,
        isFallback: false,
        hasHindiTranslation: true,
      };
    }

    return {
      name: product.name,
      shortDescription: product.shortDescription,
      description: product.description,
      specifications: product.specifications,
      warrantyInfo: product.warrantyInfo,
      locale: 'en' as const,
      isFallback: locale === 'hi' && !hasHindi,
      hasHindiTranslation: hasHindi,
    };
  }
}
