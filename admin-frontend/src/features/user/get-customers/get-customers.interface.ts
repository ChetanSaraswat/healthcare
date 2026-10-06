import { CustomerSummary, CustomerCareHistory } from '@/domain/entities/user.entity';

export interface GetCustomersFilters {
  search?: string;
  role?: string;
}

export interface GetCustomersResponse {
  success: boolean;
  data: CustomerSummary[];
}

export interface GetCustomerCareHistoryResponse {
  success: boolean;
  data: CustomerCareHistory;
}
