import { axiosInterceptorInstanceClient } from '@/config/axios';
import { RegisterPayload, RegisterResponse } from './register.interface';

export const registerService = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  try {
    const response = await axiosInterceptorInstanceClient.post('/auth/register', payload);
    if (response.data && response.data.data) {
      if (typeof window !== 'undefined' && response.data.data.token) {
        localStorage.setItem('aarogyamed_auth_token', response.data.data.token);
      }
      return response.data;
    }
    return response.data;
  } catch (err: any) {
    const message =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.message ||
      'Registration failed. Please check your details.';
    throw new Error(message);
  }
};
