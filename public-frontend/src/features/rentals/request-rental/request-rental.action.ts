import { createAsyncThunk } from '@reduxjs/toolkit';
import { REQUEST_RENTAL_ACTION_TYPE } from './request-rental.type';
import { RequestRentalPayload, RequestRentalResponse } from './request-rental.interface';
import { requestRentalService } from './request-rental.service';

export const requestRental = createAsyncThunk<
  RequestRentalResponse,
  RequestRentalPayload,
  { rejectValue: string }
>(REQUEST_RENTAL_ACTION_TYPE, async (payload, { rejectWithValue }) => {
  try {
    const result = await requestRentalService(payload);
    return result;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to place rental order');
  }
});
