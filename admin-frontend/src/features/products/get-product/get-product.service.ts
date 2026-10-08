import { axiosInterceptorInstanceClient, extractApiErrorMessage } from '@/config/axios';
import { Product, mapRawProductToEntity } from '@/domain/entities/product.entity';
import { GetProductResponse } from './get-product.interface';

export const getProductService = async (slugOrId: string): Promise<GetProductResponse> => {
  try {
    const response = await axiosInterceptorInstanceClient.get(`/products/${slugOrId}`);
    if (response.data && response.data.data) {
      const mapped: Product = mapRawProductToEntity(response.data.data);
      return {
        success: true,
        data: mapped,
      };
    }
    throw new Error(`Product not found: ${slugOrId}`);
  } catch (err: any) {
    const message = extractApiErrorMessage(err, `Product not found: ${slugOrId}`);
    throw new Error(message);
  }
};
