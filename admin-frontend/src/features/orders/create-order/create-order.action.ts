import { createAsyncThunk } from '@reduxjs/toolkit';
import { CREATE_ORDER_ACTION_TYPE } from './create-order.type';
import { CreateOrderPayload, CreateOrderResponse } from './create-order.interface';
import { createOrderService } from './create-order.service';

export const createOrder = createAsyncThunk<
  CreateOrderResponse,
  CreateOrderPayload,
  { rejectValue: string }
>(CREATE_ORDER_ACTION_TYPE, async (payload, { rejectWithValue }) => {
  try {
    const result = await createOrderService(payload);
    return result;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to place order');
  }
});
