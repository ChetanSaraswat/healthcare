import { axiosInterceptorInstanceClient } from '@/config/axios';
import { Category } from '@/domain/entities/category.entity';
import { ListCategoriesResponse } from './list-categories.interface';

export const listCategoriesService = async (): Promise<ListCategoriesResponse> => {
  try {
    const response = await axiosInterceptorInstanceClient.get('/categories');
    if (response.data && Array.isArray(response.data.data)) {
      const mapped: Category[] = response.data.data.map((c: any) => ({
        id: String(c.id),
        uuid: c.uuid,
        name: c.name,
        slug: c.slug,
        parentId: c.parent_id ? String(c.parent_id) : undefined,
        description: c.description || '',
        icon: c.slug.includes('respiratory')
          ? 'Wind'
          : c.slug.includes('mobility')
          ? 'Accessibility'
          : c.slug.includes('clinical') || c.slug.includes('monitor')
          ? 'Activity'
          : 'HeartPulse',
        image: c.image_url || '',
        productCount: Number(c.product_count || 0),
      }));

      return {
        success: true,
        data: mapped,
      };
    }

    return {
      success: true,
      data: [],
    };
  } catch (err: any) {
    console.error('[listCategoriesService] API Error:', err.message);
    throw err;
  }
};
