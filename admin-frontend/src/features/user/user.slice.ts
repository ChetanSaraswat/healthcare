import { createAppSlice } from '@/store/create-app-slice';
import { CustomerSummary, CustomerCareHistory } from '@aarogyamed/types';
import { getCustomers, getCustomerCareHistory } from './get-customers/get-customers.action';
import { INITIAL_MOCK_CUSTOMERS } from './get-customers/get-customers.service';

export interface AdminUserState {
  customers: CustomerSummary[];
  selectedCustomerHistory: CustomerCareHistory | null;
  customerLoading: boolean;
  error: string | null;
}

const initialState: AdminUserState = {
  customers: INITIAL_MOCK_CUSTOMERS,
  selectedCustomerHistory: null,
  customerLoading: false,
  error: null,
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
        state.customers = action.payload.data;
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
