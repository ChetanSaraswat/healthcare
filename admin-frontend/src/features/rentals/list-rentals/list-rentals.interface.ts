import { RentalOrder } from '@/domain/entities/rental.entity';

export interface ListRentalsResponse {
  success: boolean;
  data: RentalOrder[];
}
