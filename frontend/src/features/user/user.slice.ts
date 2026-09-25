import { createAppSlice } from '@/store/create-app-slice';
import { Address, UserEntity, CustomerSummary, CustomerCareHistory } from '@/domain/entities/user.entity';
import { getAddresses } from './get-addresses/get-addresses.action';
import { addAddress } from './add-address/add-address.action';
import { updateAddress } from './update-address/update-address.action';
import { deleteAddress } from './delete-address/delete-address.action';
import { getCustomers, getCustomerCareHistory } from './get-customers/get-customers.action';
import { INITIAL_MOCK_ADDRESSES } from './get-addresses/get-addresses.service';
import { INITIAL_MOCK_CUSTOMERS } from './get-customers/get-customers.service';

export interface UserState {
  addresses: Address[];
  selectedAddress: Address | null;
  customers: CustomerSummary[];
  selectedCustomerHistory: CustomerCareHistory | null;
  loading: boolean;
  customerLoading: boolean;
  submitting: boolean;
  error: string | null;
}

const initialState: UserState = {
  addresses: INITIAL_MOCK_ADDRESSES,
  selectedAddress: INITIAL_MOCK_ADDRESSES[0] || null,
  customers: INITIAL_MOCK_CUSTOMERS,
  selectedCustomerHistory: null,
  loading: false,
  customerLoading: false,
  submitting: false,
  error: null,
};

export const userSlice = createAppSlice({
  name: 'user',
  initialState,
  reducers: (create) => ({
    setSelectedAddress: create.reducer<Address | null>((state, action) => {
      state.selectedAddress = action.payload;
    }),
    setDefaultAddressLocally: create.reducer<string>((state, action) => {
      state.addresses = state.addresses.map((a) => ({
        ...a,
        isDefault: a.id === action.payload,
      }));
      state.addresses = UserEntity.sortAddresses(state.addresses);
      const defaultAddr = state.addresses.find((a) => a.id === action.payload);
      if (defaultAddr) {
        state.selectedAddress = defaultAddr;
      }
    }),
    setSelectedCustomerHistory: create.reducer<CustomerCareHistory | null>((state, action) => {
      state.selectedCustomerHistory = action.payload;
    }),
  }),
  extraReducers: (builder) => {
    builder
      // getAddresses
      .addCase(getAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = UserEntity.sortAddresses(action.payload.data);
        if (!state.selectedAddress && state.addresses.length > 0) {
          state.selectedAddress = UserEntity.getDefaultAddress(state.addresses) || null;
        }
      })
      .addCase(getAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch addresses';
      })

      // addAddress
      .addCase(addAddress.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.submitting = false;
        const newAddr = action.payload.data;
        if (newAddr.isDefault) {
          state.addresses = state.addresses.map((a) => ({ ...a, isDefault: false }));
        }
        state.addresses = UserEntity.sortAddresses([newAddr, ...state.addresses]);
        if (newAddr.isDefault || !state.selectedAddress) {
          state.selectedAddress = newAddr;
        }
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || 'Failed to add address';
      })

      // updateAddress
      .addCase(updateAddress.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.submitting = false;
        const updated = action.payload.data;
        state.addresses = state.addresses.map((a) => {
          if (a.id === updated.id) {
            return updated;
          }
          if (updated.isDefault) {
            return { ...a, isDefault: false };
          }
          return a;
        });
        state.addresses = UserEntity.sortAddresses(state.addresses);
        if (state.selectedAddress?.id === updated.id) {
          state.selectedAddress = updated;
        }
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || 'Failed to update address';
      })

      // deleteAddress
      .addCase(deleteAddress.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.submitting = false;
        state.addresses = state.addresses.filter((a) => a.id !== action.payload.id);
        if (state.selectedAddress?.id === action.payload.id) {
          state.selectedAddress = UserEntity.getDefaultAddress(state.addresses) || null;
        }
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || 'Failed to delete address';
      })

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

export const {
  setSelectedAddress,
  setDefaultAddressLocally,
  setSelectedCustomerHistory,
} = userSlice.actions;
export default userSlice.reducer;
