import { Condition } from '@/domain/entities/condition.entity';
import { ListConditionsResponse } from './list-conditions.interface';
import { STATIC_LEARN_CONDITIONS } from '@/content/learn/conditions';

// Clinical Learn conditions are intentional, permanent frontend static content per Requirement 4 & 5
export const INITIAL_MOCK_CONDITIONS: Condition[] = STATIC_LEARN_CONDITIONS;

export const listConditionsService = async (): Promise<ListConditionsResponse> => {
  return {
    success: true,
    data: STATIC_LEARN_CONDITIONS,
  };
};
