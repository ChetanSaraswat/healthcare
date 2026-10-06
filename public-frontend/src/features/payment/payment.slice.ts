import { createAppSlice } from '@/store/create-app-slice';
import { createPaymentOrderAction } from './create-order/create-order.action';
import { verifyPaymentAction } from './verify-payment/verify-payment.action';
import { CreatePaymentOrderResponse } from './create-order/create-order.interface';
import { VerifyPaymentResponse } from './verify-payment/verify-payment.interface';

export interface PaymentState {
  currentRazorpayOrder: CreatePaymentOrderResponse['data'] | null;
  lastVerifiedPayment: VerifyPaymentResponse['data'] | null;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  currentRazorpayOrder: null,
  lastVerifiedPayment: null,
  loading: false,
  error: null,
};

export const paymentSlice = createAppSlice({
  name: 'payment',
  initialState,
  reducers: (create) => ({
    resetPaymentState: create.reducer((state) => {
      state.currentRazorpayOrder = null;
      state.lastVerifiedPayment = null;
      state.loading = false;
      state.error = null;
    }),
    clearPaymentError: create.reducer((state) => {
      state.error = null;
    }),
  }),
  extraReducers: (builder) => {
    builder
      // createPaymentOrderAction
      .addCase(createPaymentOrderAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentOrderAction.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRazorpayOrder = action.payload.data;
      })
      .addCase(createPaymentOrderAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to initialize payment gateway order';
      })
      // verifyPaymentAction
      .addCase(verifyPaymentAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPaymentAction.fulfilled, (state, action) => {
        state.loading = false;
        state.lastVerifiedPayment = action.payload.data;
      })
      .addCase(verifyPaymentAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to verify payment gateway signature';
      });
  },
  selectors: {
    selectCurrentRazorpayOrder: (state) => state.currentRazorpayOrder,
    selectLastVerifiedPayment: (state) => state.lastVerifiedPayment,
    selectPaymentLoading: (state) => state.loading,
    selectPaymentError: (state) => state.error,
  },
});

export const { resetPaymentState, clearPaymentError } = paymentSlice.actions;
export const {
  selectCurrentRazorpayOrder,
  selectLastVerifiedPayment,
  selectPaymentLoading,
  selectPaymentError,
} = paymentSlice.selectors;
export default paymentSlice.reducer;
