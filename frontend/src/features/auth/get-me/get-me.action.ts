import { createAsyncThunk } from '@reduxjs/toolkit';
import { GET_ME_ACTION_TYPE } from './get-me.type';
import { GetMeResponse } from './get-me.interface';
import { getMeService } from './get-me.service';

export const getCurrentUser = createAsyncThunk<
  GetMeResponse,
  void,
  { rejectValue: string }
>(GET_ME_ACTION_TYPE, async (_, { rejectWithValue }) => {
  try {
    const result = await getMeService();
    return result;
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.error || error?.message || 'Failed to fetch user session');
  }
});
