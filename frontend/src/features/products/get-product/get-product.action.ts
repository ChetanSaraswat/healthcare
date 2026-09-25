import { createAsyncThunk } from '@reduxjs/toolkit';
import { GET_PRODUCT_ACTION_TYPE } from './get-product.type';
import { GetProductResponse } from './get-product.interface';
import { getProductService } from './get-product.service';

export const getProduct = createAsyncThunk<
  GetProductResponse,
  string,
  { rejectValue: string }
>(GET_PRODUCT_ACTION_TYPE, async (slugOrId, { rejectWithValue }) => {
  try {
    const result = await getProductService(slugOrId);
    return result;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to fetch product');
  }
});
