import { axiosInterceptorInstanceClient } from '@/config/axios';
import { Product } from '@/domain/entities/product.entity';
import { GetProductResponse } from './get-product.interface';
import { INITIAL_MOCK_PRODUCTS } from '../list-products/list-products.service';

export const getProductService = async (slugOrId: string): Promise<GetProductResponse> => {
  try {
    const response = await axiosInterceptorInstanceClient.get(`/products/${slugOrId}`);
    if (response.data && response.data.data) {
      return response.data;
    }
  } catch (err) {
    // Fallback to local catalog
  }

  const found = INITIAL_MOCK_PRODUCTS.find(
    (p) => p.slug === slugOrId || p.id === slugOrId
  );

  if (found) {
    return {
      success: true,
      data: found,
    };
  }

  throw new Error(`Product not found: ${slugOrId}`);
};
