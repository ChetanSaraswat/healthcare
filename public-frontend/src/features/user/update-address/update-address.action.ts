import { createAsyncThunk } from '@reduxjs/toolkit';
import { UPDATE_ADDRESS_ACTION_TYPE } from './update-address.type';
import { UpdateAddressPayload, UpdateAddressResponse } from './update-address.interface';
import { updateAddressService } from './update-address.service';

export const updateAddress = createAsyncThunk<
  UpdateAddressResponse,
  UpdateAddressPayload,
  { rejectValue: string }
>(UPDATE_ADDRESS_ACTION_TYPE, async (payload, { rejectWithValue }) => {
  try {
    const result = await updateAddressService(payload);
    return result;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to update address');
  }
});
