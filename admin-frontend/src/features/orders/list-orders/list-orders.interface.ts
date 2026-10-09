import { Order } from '@/domain/entities/order.entity';

export interface ListOrdersFilterParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sortBy?: string;
}

export interface ListOrdersResponse {
  success: boolean;
  data: {
    orders: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
