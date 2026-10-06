import { Condition } from '@/domain/entities/condition.entity';

export interface GetConditionResponse {
  success: boolean;
  data: Condition;
}
