import { Product } from '@/domain/entities/product.entity';

export interface GetProductResponse {
  success: boolean;
  data: Product;
}
