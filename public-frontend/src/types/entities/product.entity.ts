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
  uuid?: string;
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

export function mapRawProductToEntity(p: any): Product {
  const productImages: string[] = Array.isArray(p.images) && p.images.length > 0
    ? p.images
        .map((img: any) => (typeof img === 'string' ? img : img?.url || ''))
        .filter(Boolean)
    : [];
  const primaryImg = productImages[0] || '';

  return {
    id: String(p.id),
    uuid: p.uuid,
    name: p.name || '',
    slug: p.slug,
    sku: p.sku || '',
    brand: p.brand || '',
    categoryId: p.category_id ? String(p.category_id) : '',
    categoryName: p.category?.name || '',
    description: p.description || '',
    primaryImage: primaryImg,
    images: productImages,
    buyPrice: parseFloat(p.buy_price) || 0,
    mrp: parseFloat(p.buy_mrp) || 0,
    stock: Number(p.stock_quantity) || 0,
    isAvailableForBuy: Boolean(p.buy_available),
    isAvailableForRent: Boolean(p.rent_available),
    rentalDailyRate: parseFloat(p.rent_price_daily) || 0,
    rentalWeeklyRate: parseFloat(p.rent_price_weekly) || 0,
    rentalMonthlyRate: parseFloat(p.rent_price_monthly) || 0,
    rentalSecurityDeposit: parseFloat(p.rent_deposit) || 0,
    rentalMinDays: Number(p.rent_min_period_days) || 1,
    specifications: Array.isArray(p.specifications) ? p.specifications : [],
    warrantyInfo: p.warranty_info || '',
    conditionTags: Array.isArray(p.tags) ? p.tags.map((t: any) => t.name || t) : [],
    rating: Number(p.rating) || 0,
    reviewsCount: Number(p.reviews_count) || 0,
    translations: p.translations || undefined,
  };
}
