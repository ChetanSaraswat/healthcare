import { RentalOrder } from '@/domain/entities/rental.entity';

export interface UpdateRentalStatusPayload {
  rentalId: string;
  status: RentalOrder['status'];
  deposit_status?: 'held' | 'refunded' | 'partially_refunded' | 'forfeited';
}

export interface UpdateRentalStatusResponse {
  success: boolean;
  message: string;
  data: any;
}
