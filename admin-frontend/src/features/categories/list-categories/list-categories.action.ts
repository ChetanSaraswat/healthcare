import { createAsyncThunk } from '@reduxjs/toolkit';
import { LIST_CATEGORIES_ACTION_TYPE } from './list-categories.type';
import { ListCategoriesResponse } from './list-categories.interface';
import { listCategoriesService } from './list-categories.service';

export const listCategories = createAsyncThunk<
  ListCategoriesResponse,
  void,
  { rejectValue: string }
>(LIST_CATEGORIES_ACTION_TYPE, async (_, { rejectWithValue }) => {
  try {
    const result = await listCategoriesService();
    return result;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to fetch categories');
  }
});
