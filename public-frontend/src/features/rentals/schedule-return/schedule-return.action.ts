import { createAsyncThunk } from '@reduxjs/toolkit';
import { SCHEDULE_RETURN_ACTION_TYPE } from './schedule-return.type';
import { ScheduleReturnPayload, ScheduleReturnResponse } from './schedule-return.interface';
import { scheduleReturnService } from './schedule-return.service';

export const scheduleReturn = createAsyncThunk<
  ScheduleReturnResponse,
  ScheduleReturnPayload,
  { rejectValue: string }
>(SCHEDULE_RETURN_ACTION_TYPE, async (payload, { rejectWithValue }) => {
  try {
    return await scheduleReturnService(payload);
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || 'Failed to schedule return pickup'
    );
  }
});
