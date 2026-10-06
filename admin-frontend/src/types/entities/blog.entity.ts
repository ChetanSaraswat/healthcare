export interface BlogPostTranslation {
  id?: number;
  locale: 'en' | 'hi';
  title: string;
  summary?: string;
  body: string;
}

export interface BlogPost {
  id: number | string;
  uuid?: string;
  title: string;
  slug: string;
  summary?: string;
  body: string;
  coverImage?: string;
  authorName?: string;
  status: 'draft' | 'published';
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  category?: string;
  equipmentTag?: string;
  shopLink?: string;
  readTime?: string;
  readTimeMinutes?: number;
  translations?: {
    hi?: BlogPostTranslation;
    en?: BlogPostTranslation;
  };
  hasHindiTranslation?: boolean;
}
