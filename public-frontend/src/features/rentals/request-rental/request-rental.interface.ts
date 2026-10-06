import { RentalOrder } from '@/domain/entities/rental.entity';

export interface DeliveryAddressPayload {
  fullName?: string;
  phone?: string;
  email?: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  pincode: string;
}

export interface RequestRentalItemPayload {
  product_uuid: string;
  quantity: number;
  duration_type?: 'daily' | 'weekly' | 'monthly';
  duration_count?: number;
  productName?: string;
  productImage?: string;
  dailyRate?: number;
  securityDeposit?: number;
  rentalCost?: number;
  start_date?: string;
  end_date?: string;
}

export interface RequestRentalPayload {
  items: RequestRentalItemPayload[];
  delivery_address: DeliveryAddressPayload;
  payment_method?: string;
  payment_id?: string;
  start_date?: string;
  end_date?: string;
  notes?: string;
}

export interface RequestRentalResponse {
  success: boolean;
  data: RentalOrder;
  message?: string;
}

