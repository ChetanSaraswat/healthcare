import { Order } from '@/domain/entities/order.entity';

export interface ListOrdersResponse {
  success: boolean;
  data: Order[];
}
