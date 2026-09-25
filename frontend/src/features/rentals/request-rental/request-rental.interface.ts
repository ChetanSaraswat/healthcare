import { RentalOrder, RentalItem } from '@/domain/entities/rental.entity';
import { ShippingAddress } from '@/domain/entities/order.entity';

export interface RequestRentalPayload {
  items: Omit<RentalItem, 'id' | 'rentalOrderId'>[];
  deliveryAddress: ShippingAddress;
  notes?: string;
}

export interface RequestRentalResponse {
  success: boolean;
  data: RentalOrder;
  message?: string;
}
