import { createAsyncThunk } from '@reduxjs/toolkit';
import { ADD_ADDRESS_ACTION_TYPE } from './add-address.type';
import { AddAddressPayload, AddAddressResponse } from './add-address.interface';
import { addAddressService } from './add-address.service';

export const addAddress = createAsyncThunk<
  AddAddressResponse,
  AddAddressPayload,
  { rejectValue: string }
>(ADD_ADDRESS_ACTION_TYPE, async (payload, { rejectWithValue }) => {
  try {
    const result = await addAddressService(payload);
    return result;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to add address');
  }
});
