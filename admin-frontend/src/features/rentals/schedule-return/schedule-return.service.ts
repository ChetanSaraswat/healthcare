import { axiosInterceptorInstanceClient } from '@/config/axios';
import { ScheduleReturnPayload, ScheduleReturnResponse } from './schedule-return.interface';

export const scheduleReturnService = async (
  payload: ScheduleReturnPayload
): Promise<ScheduleReturnResponse> => {
  try {
    const response = await axiosInterceptorInstanceClient.post(
      `/rentals/${payload.rentalId}/return`,
      {
        return_date: payload.return_date,
        return_slot: payload.return_slot,
        pickup_notes: payload.pickup_notes,
      }
    );
    return response.data;
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.message || 'Failed to schedule return pickup on server'
    );
  }
};
