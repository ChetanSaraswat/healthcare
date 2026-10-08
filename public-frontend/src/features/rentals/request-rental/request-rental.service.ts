import { axiosInterceptorInstanceClient } from '@/config/axios';
import { RequestRentalPayload, RequestRentalResponse } from './request-rental.interface';

export const requestRentalService = async (
  payload: RequestRentalPayload
): Promise<RequestRentalResponse> => {
  const response = await axiosInterceptorInstanceClient.post('/rentals', payload);
  return response.data;
};
