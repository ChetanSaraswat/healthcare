import { axiosInterceptorInstanceClient } from '@/config/axios';
import { LoginPayload, LoginResponse } from './login.interface';

export const loginService = async (payload: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await axiosInterceptorInstanceClient.post('/auth/login', payload);
    if (response.data && response.data.data) {
      if (typeof window !== 'undefined' && response.data.data.token) {
        localStorage.setItem('omkar_auth_token', response.data.data.token);
      }
      return response.data;
    }
    return response.data;
  } catch (err: any) {
    const message =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.message ||
      'Invalid email/phone or password';
    throw new Error(message);
  }
};

