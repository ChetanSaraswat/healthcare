import { createAsyncThunk } from '@reduxjs/toolkit';
import { LIST_PRODUCTS_ACTION_TYPE } from './list-products.type';
import { ListProductsFilterParams, ListProductsResponse } from './list-products.interface';
import { listProductsService } from './list-products.service';

export const listProducts = createAsyncThunk<
  ListProductsResponse,
  ListProductsFilterParams | undefined,
  { rejectValue: string }
>(LIST_PRODUCTS_ACTION_TYPE, async (params, { rejectWithValue }) => {
  try {
    const result = await listProductsService(params);
    return result;
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.message || 'Failed to fetch products');
  }
});
