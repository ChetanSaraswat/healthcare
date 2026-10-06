import { createAsyncThunk } from '@reduxjs/toolkit';
import { DELETE_ADDRESS_ACTION_TYPE } from './delete-address.type';
import { DeleteAddressPayload, DeleteAddressResponse } from './delete-address.interface';
import { deleteAddressService } from './delete-address.service';

export const deleteAddress = createAsyncThunk<
  DeleteAddressResponse,
  DeleteAddressPayload,
  { rejectValue: string }
>(DELETE_ADDRESS_ACTION_TYPE, async (payload, { rejectWithValue }) => {
  try {
    const result = await deleteAddressService(payload);
    return result;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to delete address');
  }
});
