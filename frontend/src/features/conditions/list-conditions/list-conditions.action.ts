import { createAsyncThunk } from '@reduxjs/toolkit';
import { LIST_CONDITIONS_ACTION_TYPE } from './list-conditions.type';
import { ListConditionsResponse } from './list-conditions.interface';
import { listConditionsService } from './list-conditions.service';

export const listConditions = createAsyncThunk<
  ListConditionsResponse,
  void,
  { rejectValue: string }
>(LIST_CONDITIONS_ACTION_TYPE, async (_, { rejectWithValue }) => {
  try {
    const result = await listConditionsService();
    return result;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to fetch condition guides');
  }
});
