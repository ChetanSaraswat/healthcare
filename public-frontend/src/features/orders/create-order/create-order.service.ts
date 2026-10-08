import { axiosInterceptorInstanceClient } from '@/config/axios';
import { CreateOrderPayload, CreateOrderResponse } from './create-order.interface';

export const createOrderService = async (
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> => {
  const response = await axiosInterceptorInstanceClient.post('/orders', payload);
  return response.data;
};
