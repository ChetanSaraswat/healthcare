import { Condition } from '@/domain/entities/condition.entity';

export interface ListConditionsResponse {
  success: boolean;
  data: Condition[];
}
