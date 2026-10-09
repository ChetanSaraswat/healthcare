import { CustomerSummary, CustomerCareHistory } from '@/domain/entities/user.entity';

export interface GetCustomersFilters {
  search?: string;
  role?: string;
  segment?: string;
  page?: number;
  limit?: number;
}

export interface GetCustomersResponse {
  success: boolean;
  data: {
    customers: CustomerSummary[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetCustomerCareHistoryResponse {
  success: boolean;
  data: CustomerCareHistory;
}
