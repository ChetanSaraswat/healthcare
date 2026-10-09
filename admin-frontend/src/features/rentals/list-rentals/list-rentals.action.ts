import { createAsyncThunk } from '@reduxjs/toolkit';
import { LIST_RENTALS_ACTION_TYPE } from './list-rentals.type';
import { ListRentalsFilterParams, ListRentalsResponse } from './list-rentals.interface';
import { listRentalsService } from './list-rentals.service';

export const listRentals = createAsyncThunk<
  ListRentalsResponse,
  ListRentalsFilterParams | void,
  { rejectValue: string }
>(LIST_RENTALS_ACTION_TYPE, async (params, { rejectWithValue }) => {
  try {
    const result = await listRentalsService(params || undefined);
    return result;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to fetch rentals');
  }
});
