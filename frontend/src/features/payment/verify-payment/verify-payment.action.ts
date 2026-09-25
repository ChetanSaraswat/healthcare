import { createAsyncThunk } from '@reduxjs/toolkit';
import { VERIFY_PAYMENT_ACTION_TYPE } from './verify-payment.type';
import { VerifyPaymentPayload, VerifyPaymentResponse } from './verify-payment.interface';
import { verifyPaymentService } from './verify-payment.service';

export const verifyPaymentAction = createAsyncThunk<
  VerifyPaymentResponse,
  VerifyPaymentPayload,
  { rejectValue: string }
>(VERIFY_PAYMENT_ACTION_TYPE, async (payload, { rejectWithValue }) => {
  try {
    const response = await verifyPaymentService(payload);
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || 'Failed to verify payment gateway signature'
    );
  }
});
