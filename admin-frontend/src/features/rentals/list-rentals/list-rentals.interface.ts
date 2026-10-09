import { RentalOrder } from '@/domain/entities/rental.entity';

export interface ListRentalsFilterParams {
  page?: number;
  limit?: number;
  status?: string;
  deposit_status?: string;
  search?: string;
  sortBy?: string;
}

export interface ListRentalsResponse {
  success: boolean;
  data: {
    rentals: RentalOrder[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
