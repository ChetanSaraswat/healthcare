import { axiosInterceptorInstanceClient } from '@/config/axios';
import { GetMeResponse } from './get-me.interface';

export const getMeService = async (): Promise<GetMeResponse> => {
  const response = await axiosInterceptorInstanceClient.get('/auth/me');
  return response.data;
};
