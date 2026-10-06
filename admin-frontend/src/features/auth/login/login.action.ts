import { createAsyncThunk } from '@reduxjs/toolkit';
import { LOGIN_ACTION_TYPE } from './login.type';
import { LoginPayload, LoginResponse } from './login.interface';
import { loginService } from './login.service';

export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: string }
>(LOGIN_ACTION_TYPE, async (payload, { rejectWithValue }) => {
  try {
    const result = await loginService(payload);
    return result;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Login failed');
  }
});
