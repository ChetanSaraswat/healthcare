import { GetConditionResponse } from './get-condition.interface';
import { getStaticConditionBySlug } from '@/content/learn/conditions';

// Clinical Learn conditions are intentional, permanent frontend static content per Requirement 4 & 5
export const getConditionService = async (slug: string): Promise<GetConditionResponse> => {
  const found = getStaticConditionBySlug(slug);

  if (found) {
    return {
      success: true,
      data: found,
    };
  }

  throw new Error(`Condition guide not found for: ${slug}`);
};
