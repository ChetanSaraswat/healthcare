import { createAppSlice } from '@/store/create-app-slice';
import { CustomerSummary, CustomerCareHistory } from '@aarogyamed/types';
import { getCustomers, getCustomerCareHistory } from './get-customers/get-customers.action';

export interface AdminUserState {
  customers: CustomerSummary[];
  selectedCustomerHistory: CustomerCareHistory | null;
  customerLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const initialState: AdminUserState = {
  customers: [],
  selectedCustomerHistory: null,
  customerLoading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
};

export const userSlice = createAppSlice({
  name: 'user',
  initialState,
  reducers: (create) => ({
    setSelectedCustomerHistory: create.reducer<CustomerCareHistory | null>((state, action) => {
      state.selectedCustomerHistory = action.payload;
    }),
  }),
  extraReducers: (builder) => {
    builder
      // getCustomers
      .addCase(getCustomers.pending, (state) => {
        state.customerLoading = true;
        state.error = null;
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.customerLoading = false;
        state.customers = action.payload.data.customers;
        state.total = action.payload.data.total;
        state.page = action.payload.data.page;
        state.limit = action.payload.data.limit;
        state.totalPages = action.payload.data.totalPages;
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.customerLoading = false;
        state.error = action.payload || 'Failed to fetch customers';
      })

      // getCustomerCareHistory
      .addCase(getCustomerCareHistory.pending, (state) => {
        state.customerLoading = true;
        state.error = null;
      })
      .addCase(getCustomerCareHistory.fulfilled, (state, action) => {
        state.customerLoading = false;
        state.selectedCustomerHistory = action.payload.data;
      })
      .addCase(getCustomerCareHistory.rejected, (state, action) => {
        state.customerLoading = false;
        state.error = action.payload || 'Failed to fetch customer care history';
      });
  },
});

export const { setSelectedCustomerHistory } = userSlice.actions;
export default userSlice.reducer;
