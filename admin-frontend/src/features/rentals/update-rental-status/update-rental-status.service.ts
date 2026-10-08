import { axiosInterceptorInstanceClient } from '@/config/axios';
import { UpdateRentalStatusPayload, UpdateRentalStatusResponse } from './update-rental-status.interface';

export const updateRentalStatusService = async (
  payload: UpdateRentalStatusPayload
): Promise<UpdateRentalStatusResponse> => {
  const body: Record<string, any> = { status: payload.status };
  if (payload.deposit_status) {
    body.deposit_status = payload.deposit_status;
  }

  const response = await axiosInterceptorInstanceClient.patch(
    `/rentals/${payload.rentalId}/status`,
    body
  );
  return response.data;
};
