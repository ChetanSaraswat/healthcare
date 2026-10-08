import { createAppSlice } from '@/store/create-app-slice';
import { PayloadAction } from '@reduxjs/toolkit';

export type Locale = 'en' | 'hi';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastData {
  id?: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface UiState {
  isCartDrawerOpen: boolean;
  selectedPincode: string;
  locale: Locale;
  toast: ToastData | null;
}

const initialState: UiState = {
  isCartDrawerOpen: false,
  selectedPincode: '',
  locale: 'en',
  toast: null,
};

export const uiSlice = createAppSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCartDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isCartDrawerOpen = action.payload;
    },
    setSelectedPincode: (state, action: PayloadAction<string>) => {
      state.selectedPincode = action.payload;
    },
    setLocale: (state, action: PayloadAction<Locale>) => {
      state.locale = action.payload;
    },
    showToast: (state, action: PayloadAction<ToastData>) => {
      state.toast = {
        id: action.payload.id || (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : 'toast-uuid'),
        type: action.payload.type,
        message: action.payload.message,
        duration: action.payload.duration || 4500,
      };
    },
    hideToast: (state) => {
      state.toast = null;
    },
  },
  selectors: {
    selectIsCartDrawerOpen: (state) => state.isCartDrawerOpen,
    selectSelectedPincode: (state) => state.selectedPincode,
    selectLocale: (state) => state.locale,
    selectToast: (state) => state.toast,
  },
});

export const { setCartDrawerOpen, setSelectedPincode, setLocale, showToast, hideToast } = uiSlice.actions;
export const { selectIsCartDrawerOpen, selectSelectedPincode, selectLocale, selectToast } = uiSlice.selectors;
export default uiSlice.reducer;
