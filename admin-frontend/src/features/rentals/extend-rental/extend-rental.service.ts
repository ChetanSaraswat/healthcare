import { axiosInterceptorInstanceClient } from '@/config/axios';
import { ExtendRentalPayload, ExtendRentalResponse } from './extend-rental.interface';

export const extendRentalService = async (
  payload: ExtendRentalPayload
): Promise<ExtendRentalResponse> => {
  try {
    const response = await axiosInterceptorInstanceClient.post(
      `/rentals/${payload.rentalId}/extend`,
      { days: payload.days, notes: payload.notes }
    );
    return response.data;
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.message || 'Failed to extend rental agreement on server'
    );
  }
};
