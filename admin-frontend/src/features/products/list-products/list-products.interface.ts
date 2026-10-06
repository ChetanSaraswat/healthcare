import { Product } from '@/domain/entities/product.entity';

export interface ListProductsFilterParams {
  category?: string;
  condition?: string;
  mode?: 'all' | 'buy' | 'rent';
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'popular' | 'price_low' | 'price_high' | 'newest';
  page?: number;
  limit?: number;
}

export interface ListProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
  };
}
