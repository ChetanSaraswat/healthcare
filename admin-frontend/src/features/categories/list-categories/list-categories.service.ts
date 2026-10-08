import { axiosInterceptorInstanceClient } from '@/config/axios';
import { Category } from '@/domain/entities/category.entity';
import { ListCategoriesResponse } from './list-categories.interface';

export const listCategoriesService = async (): Promise<ListCategoriesResponse> => {
  try {
    const response = await axiosInterceptorInstanceClient.get('/categories');
    const rawList = response.data?.data;
    if (Array.isArray(rawList)) {
      const categories: Category[] = rawList.map((c: any) => ({
        id: String(c.id),
        uuid: c.uuid,
        name: c.name,
        slug: c.slug,
        parentId: c.parent_id ? String(c.parent_id) : undefined,
        description: c.description || '',
        icon: 'HeartPulse',
        image: c.image_url || '',
        productCount: Number(c.product_count || 0),
      }));

      return {
        success: true,
        data: categories,
      };
    }

    return {
      success: true,
      data: [],
    };
  } catch (err) {
    console.warn('[Admin listCategoriesService] Error fetching categories:', err);
    throw err;
  }
};
