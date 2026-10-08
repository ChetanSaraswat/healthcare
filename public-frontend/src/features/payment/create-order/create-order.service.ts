import { axiosInterceptorInstanceClient } from '@/config/axios';
import { CreatePaymentOrderPayload, CreatePaymentOrderResponse } from './create-order.interface';

export const createPaymentOrderService = async (
  payload: CreatePaymentOrderPayload
): Promise<CreatePaymentOrderResponse> => {
  const response = await axiosInterceptorInstanceClient.post(
    '/payments/razorpay/create-order',
    payload
  );

  if (response.data && response.data.data) {
    return response.data;
  }

  throw new Error(response.data?.message || 'Failed to initialize payment transaction');
};
