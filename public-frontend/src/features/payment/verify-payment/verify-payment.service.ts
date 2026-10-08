import { axiosInterceptorInstanceClient } from '@/config/axios';
import { VerifyPaymentPayload, VerifyPaymentResponse } from './verify-payment.interface';

export const verifyPaymentService = async (
  payload: VerifyPaymentPayload
): Promise<VerifyPaymentResponse> => {
  try {
    const response = await axiosInterceptorInstanceClient.post(
      '/payments/razorpay/verify',
      payload
    );
    if (response.data && response.data.data) {
      return response.data;
    }
    return response.data;
  } catch (err: any) {
    console.error('[verifyPaymentService] API signature verification error:', err?.message);
    throw err;
  }
};

