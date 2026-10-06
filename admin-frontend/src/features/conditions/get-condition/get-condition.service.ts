import { axiosInterceptorInstanceClient } from '@/config/axios';
import { Condition } from '@/domain/entities/condition.entity';
import { GetConditionResponse } from './get-condition.interface';
import { INITIAL_MOCK_CONDITIONS } from '../list-conditions/list-conditions.service';

export const getConditionService = async (slug: string): Promise<GetConditionResponse> => {
  try {
    const response = await axiosInterceptorInstanceClient.get(`/conditions/${slug}`);
    if (response.data && response.data.data) {
      return response.data;
    }
  } catch (err) {
    // Fallback to local
  }

  const found = INITIAL_MOCK_CONDITIONS.find(
    (c) => c.slug === slug || c.tag === slug || c.id === slug
  );

  if (found) {
    return {
      success: true,
      data: found,
    };
  }

  throw new Error(`Condition guide not found for: ${slug}`);
};
