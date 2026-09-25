import { Order, OrderItem, ShippingAddress } from '@/domain/entities/order.entity';

export interface CreateOrderPayload {
  items: Omit<OrderItem, 'id' | 'orderId'>[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
}

export interface CreateOrderResponse {
  success: boolean;
  data: Order;
  message?: string;
}
