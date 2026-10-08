import { axiosInterceptorInstanceClient } from '@/config/axios';
import { ScheduleReturnPayload, ScheduleReturnResponse } from './schedule-return.interface';

export const scheduleReturnService = async (
  payload: ScheduleReturnPayload
): Promise<ScheduleReturnResponse> => {
  const response = await axiosInterceptorInstanceClient.post(
    `/rentals/${payload.rentalId}/return`,
    {
      return_date: payload.return_date,
      return_slot: payload.return_slot,
      pickup_notes: payload.pickup_notes,
    }
  );

  if (response.data && response.data.data) {
    return response.data;
  }

  throw new Error(response.data?.message || 'Failed to schedule return pickup');
};
