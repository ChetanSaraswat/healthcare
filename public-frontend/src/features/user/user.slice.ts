import { createAppSlice } from '@/store/create-app-slice';
import { Address, UserEntity } from '@aarogyamed/types';
import { getAddresses } from './get-addresses/get-addresses.action';
import { addAddress } from './add-address/add-address.action';
import { updateAddress } from './update-address/update-address.action';
import { deleteAddress } from './delete-address/delete-address.action';
import { INITIAL_MOCK_ADDRESSES } from './get-addresses/get-addresses.service';

export interface UserState {
  addresses: Address[];
  selectedAddress: Address | null;
  loading: boolean;
  submitting: boolean;
  error: string | null;
}

const initialState: UserState = {
  addresses: INITIAL_MOCK_ADDRESSES,
  selectedAddress: INITIAL_MOCK_ADDRESSES[0] || null,
  loading: false,
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
      });
  },
});

export const {
  setSelectedAddress,
  setDefaultAddressLocally,
} = userSlice.actions;
export default userSlice.reducer;
