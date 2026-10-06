import { RentalOrder } from '@/domain/entities/rental.entity';

export interface ExtendRentalPayload {
  rentalId: string;
  days: number;
  notes?: string;
}

export interface ExtendRentalResponse {
  success: boolean;
  message: string;
  data: {
    message: string;
    new_end_date: string;
    rental: RentalOrder;
  };
}
