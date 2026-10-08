import { axiosInterceptorInstanceClient } from '@/config/axios';
import { Product, mapRawProductToEntity } from '@/domain/entities/product.entity';
import { ListProductsFilterParams, ListProductsResponse } from './list-products.interface';

export const listProductsService = async (
  params?: ListProductsFilterParams
): Promise<ListProductsResponse> => {
  try {
    const buyRentParam =
      params?.mode === 'buy' ? 'buy' : params?.mode === 'rent' ? 'rent' : undefined;

    const response = await axiosInterceptorInstanceClient.get('/products', {
      params: {
        category: params?.category && params.category !== 'all' ? params.category : undefined,
        buyRent: buyRentParam,
        tag: params?.condition || undefined,
        search: params?.search || undefined,
        sortBy: params?.sort || undefined,
        page: params?.page || 1,
        limit: params?.limit || 100,
      },
    });

    if (response.data && response.data.data) {
      const rawItems = Array.isArray(response.data.data.items)
        ? response.data.data.items
        : Array.isArray(response.data.data)
        ? response.data.data
        : [];

      const products: Product[] = rawItems.map(mapRawProductToEntity);
      const pagination = response.data.data.pagination;

      return {
        success: true,
        data: {
          products,
          total: pagination?.total ?? products.length,
          page: pagination?.page ?? 1,
          totalPages: pagination?.totalPages ?? 1,
        },
      };
    }

    return {
      success: true,
      data: {
        products: [],
        total: 0,
        page: 1,
        totalPages: 1,
      },
    };
  } catch (err: any) {
    console.error('[listProductsService] API Error:', err.message);
    throw err;
  }
};
