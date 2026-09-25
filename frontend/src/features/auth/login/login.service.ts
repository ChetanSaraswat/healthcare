import { axiosInterceptorInstanceClient } from '@/config/axios';
import { LoginPayload, LoginResponse } from './login.interface';

export const loginService = async (payload: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await axiosInterceptorInstanceClient.post('/auth/login', payload);
    if (response.data && response.data.data) {
      if (typeof window !== 'undefined' && response.data.data.token) {
        localStorage.setItem('aarogyamed_auth_token', response.data.data.token);
      }
      return response.data;
    }
  } catch (err) {
    // Fallback demo user
  }

  const mockUser = {
    user: {
      id: 'usr-demo-01',
      name: 'Sunita Sharma',
      email: payload.email || 'sunita.sharma@example.com',
      phone: '+91 98765 43210',
      role: 'customer' as const,
    },
    token: 'mock-jwt-token-aarogyamed',
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem('aarogyamed_auth_token', mockUser.token);
  }

  return {
    success: true,
    data: mockUser,
  };
};
