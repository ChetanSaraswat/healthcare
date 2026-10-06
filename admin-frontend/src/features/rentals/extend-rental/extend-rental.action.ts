import { createAsyncThunk } from '@reduxjs/toolkit';
import { EXTEND_RENTAL_ACTION_TYPE } from './extend-rental.type';
import { ExtendRentalPayload, ExtendRentalResponse } from './extend-rental.interface';
import { extendRentalService } from './extend-rental.service';

export const extendRental = createAsyncThunk<
  ExtendRentalResponse,
  ExtendRentalPayload,
  { rejectValue: string }
>(EXTEND_RENTAL_ACTION_TYPE, async (payload, { rejectWithValue }) => {
  try {
    return await extendRentalService(payload);
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || 'Failed to extend rental agreement'
    );
  }
});
