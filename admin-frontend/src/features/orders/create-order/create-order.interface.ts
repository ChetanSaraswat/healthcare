import { Order } from '@/domain/entities/order.entity';

export interface ShippingAddressPayload {
  fullName?: string;
  phone?: string;
  email?: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  pincode: string;
}

export interface CreateOrderItemPayload {
  product_uuid: string;
  quantity: number;
  unit_price?: number;
  total_price?: number;
  productName?: string;
  productImage?: string;
}

export interface CreateOrderPayload {
  items: CreateOrderItemPayload[];
  shipping_address: ShippingAddressPayload;
  payment_method?: string;
  payment_id?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  data: Order;
  message?: string;
}

