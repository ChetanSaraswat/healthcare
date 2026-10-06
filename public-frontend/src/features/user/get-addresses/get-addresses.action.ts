import { createAsyncThunk } from '@reduxjs/toolkit';
import { GET_ADDRESSES_ACTION_TYPE } from './get-addresses.type';
import { GetAddressesResponse } from './get-addresses.interface';
import { getAddressesService } from './get-addresses.service';

export const getAddresses = createAsyncThunk<
  GetAddressesResponse,
  void,
  { rejectValue: string }
>(GET_ADDRESSES_ACTION_TYPE, async (_, { rejectWithValue }) => {
  try {
    const result = await getAddressesService();
    return result;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to fetch addresses');
  }
});
