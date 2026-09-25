import { createAsyncThunk } from '@reduxjs/toolkit';
import { CREATE_PAYMENT_ORDER_ACTION_TYPE } from './create-order.type';
import { CreatePaymentOrderPayload, CreatePaymentOrderResponse } from './create-order.interface';
import { createPaymentOrderService } from './create-order.service';

export const createPaymentOrderAction = createAsyncThunk<
  CreatePaymentOrderResponse,
  CreatePaymentOrderPayload,
  { rejectValue: string }
>(CREATE_PAYMENT_ORDER_ACTION_TYPE, async (payload, { rejectWithValue }) => {
  try {
    const response = await createPaymentOrderService(payload);
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || 'Failed to initialize payment gateway order'
    );
  }
});
