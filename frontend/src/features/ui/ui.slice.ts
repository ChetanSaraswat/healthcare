import { createAppSlice } from '@/store/create-app-slice';
import { PayloadAction } from '@reduxjs/toolkit';

export type Locale = 'en' | 'hi';

interface UiState {
  isCartDrawerOpen: boolean;
  selectedPincode: string;
  locale: Locale;
}

const initialState: UiState = {
  isCartDrawerOpen: false,
  selectedPincode: '',
  locale: 'en',
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
  },
  selectors: {
    selectIsCartDrawerOpen: (state) => state.isCartDrawerOpen,
    selectSelectedPincode: (state) => state.selectedPincode,
    selectLocale: (state) => state.locale,
  },
});

export const { setCartDrawerOpen, setSelectedPincode, setLocale } = uiSlice.actions;
export const { selectIsCartDrawerOpen, selectSelectedPincode, selectLocale } = uiSlice.selectors;
export default uiSlice.reducer;
