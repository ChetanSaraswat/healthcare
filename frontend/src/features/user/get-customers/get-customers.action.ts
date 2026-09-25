import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  GET_CUSTOMERS_ACTION_TYPE,
  GET_CUSTOMER_CARE_HISTORY_ACTION_TYPE,
} from './get-customers.type';
import {
  GetCustomersFilters,
  GetCustomersResponse,
  GetCustomerCareHistoryResponse,
} from './get-customers.interface';
import {
  getCustomersService,
  getCustomerCareHistoryService,
} from './get-customers.service';

export const getCustomers = createAsyncThunk<
  GetCustomersResponse,
  GetCustomersFilters | undefined,
  { rejectValue: string }
>(GET_CUSTOMERS_ACTION_TYPE, async (filters, { rejectWithValue }) => {
  try {
    const result = await getCustomersService(filters);
    return result;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to fetch customers');
  }
});

export const getCustomerCareHistory = createAsyncThunk<
  GetCustomerCareHistoryResponse,
  string,
  { rejectValue: string }
>(GET_CUSTOMER_CARE_HISTORY_ACTION_TYPE, async (customerId, { rejectWithValue }) => {
  try {
    const result = await getCustomerCareHistoryService(customerId);
    return result;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to fetch customer care history');
  }
});
