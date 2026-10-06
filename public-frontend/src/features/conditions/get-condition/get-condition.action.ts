import { createAsyncThunk } from '@reduxjs/toolkit';
import { GET_CONDITION_ACTION_TYPE } from './get-condition.type';
import { GetConditionResponse } from './get-condition.interface';
import { getConditionService } from './get-condition.service';

export const getCondition = createAsyncThunk<
  GetConditionResponse,
  string,
  { rejectValue: string }
>(GET_CONDITION_ACTION_TYPE, async (slug, { rejectWithValue }) => {
  try {
    const result = await getConditionService(slug);
    return result;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to fetch condition guide');
  }
});
