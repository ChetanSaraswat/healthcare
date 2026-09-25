import { createAsyncThunk } from '@reduxjs/toolkit';
import { LIST_ORDERS_ACTION_TYPE } from './list-orders.type';
import { ListOrdersResponse } from './list-orders.interface';
import { listOrdersService } from './list-orders.service';

export const listOrders = createAsyncThunk<
  ListOrdersResponse,
  void,
  { rejectValue: string }
>(LIST_ORDERS_ACTION_TYPE, async (_, { rejectWithValue }) => {
  try {
    const result = await listOrdersService();
    return result;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to fetch orders');
  }
});
