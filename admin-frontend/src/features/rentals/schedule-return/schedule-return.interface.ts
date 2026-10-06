import { RentalOrder } from '@/domain/entities/rental.entity';

export interface ScheduleReturnPayload {
  rentalId: string;
  return_date: string;
  return_slot: 'morning' | 'evening';
  pickup_notes?: string;
}

export interface ScheduleReturnResponse {
  success: boolean;
  message: string;
  data: {
    message: string;
    return_date: string;
    return_slot: string;
    rental: RentalOrder;
  };
}
