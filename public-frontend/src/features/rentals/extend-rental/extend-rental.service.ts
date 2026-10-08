import { axiosInterceptorInstanceClient } from '@/config/axios';
import { ExtendRentalPayload, ExtendRentalResponse } from './extend-rental.interface';

export const extendRentalService = async (
  payload: ExtendRentalPayload
): Promise<ExtendRentalResponse> => {
  const response = await axiosInterceptorInstanceClient.post(
    `/rentals/${payload.rentalId}/extend`,
    { days: payload.days, notes: payload.notes }
  );

  if (response.data && response.data.data) {
    return response.data;
  }

  throw new Error(response.data?.message || 'Failed to extend rental agreement');
};
