import { createAsyncThunk } from '@reduxjs/toolkit';
import { UPDATE_RENTAL_STATUS_ACTION_TYPE } from './update-rental-status.type';
import { UpdateRentalStatusPayload, UpdateRentalStatusResponse } from './update-rental-status.interface';
import { updateRentalStatusService } from './update-rental-status.service';

export const updateRentalStatusAction = createAsyncThunk<
  UpdateRentalStatusResponse,
  UpdateRentalStatusPayload,
  { rejectValue: string }
>(UPDATE_RENTAL_STATUS_ACTION_TYPE, async (payload, { rejectWithValue }) => {
  try {
    return await updateRentalStatusService(payload);
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || 'Failed to update rental status on server'
    );
  }
});
