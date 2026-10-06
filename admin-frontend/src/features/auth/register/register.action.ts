import { createAsyncThunk } from '@reduxjs/toolkit';
import { REGISTER_ACTION_TYPE } from './register.type';
import { RegisterPayload, RegisterResponse } from './register.interface';
import { registerService } from './register.service';

export const registerUser = createAsyncThunk<
  RegisterResponse,
  RegisterPayload,
  { rejectValue: string }
>(REGISTER_ACTION_TYPE, async (payload, { rejectWithValue }) => {
  try {
    const result = await registerService(payload);
    return result;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Registration failed');
  }
});
