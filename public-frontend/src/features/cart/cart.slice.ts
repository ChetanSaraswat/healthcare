import { createAppSlice } from '@/store/create-app-slice';
import { CartItem, CartPricingSummary } from '@/domain/entities/cart.entity';
import { CartPricingCalculator } from '@/domain/services/cart-pricing.calculator';

export interface CartState {
  items: CartItem[];
  pricing: CartPricingSummary;
  pincode: string;
  isPincodeServiceable: boolean | null;
  serviceableCity: string | null;
}

const initialPricing = CartPricingCalculator.calculate([]);

const initialState: CartState = {
  items: [],
  pricing: initialPricing,
  pincode: '110001',
  isPincodeServiceable: true,
  serviceableCity: 'Delhi NCR',
};

export const cartSlice = createAppSlice({
  name: 'cart',
  initialState,
  reducers: (create) => ({
    addToCart: create.reducer<CartItem>((state, action) => {
      const newItem = action.payload;
      const existingIndex = state.items.findIndex(
        (i) => i.id === newItem.id && i.type === newItem.type
      );

      if (existingIndex > -1) {
        state.items[existingIndex].quantity += newItem.quantity;
      } else {
        state.items.push(newItem);
      }
      state.pricing = CartPricingCalculator.calculate(state.items);
    }),

    removeFromCart: create.reducer<string>((state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      state.pricing = CartPricingCalculator.calculate(state.items);
    }),

    updateQuantity: create.reducer<{ id: string; quantity: number }>(
      (state, action) => {
        const item = state.items.find((i) => i.id === action.payload.id);
        if (item) {
          if (action.payload.quantity <= 0) {
            state.items = state.items.filter((i) => i.id !== action.payload.id);
          } else {
            item.quantity = action.payload.quantity;
          }
        }
        state.pricing = CartPricingCalculator.calculate(state.items);
      }
    ),

    updateRentalDuration: create.reducer<{ id: string; durationDays: number }>(
      (state, action) => {
        const item = state.items.find((i) => i.id === action.payload.id);
        if (item && item.type === 'rent') {
          item.rentalDays = Math.max(1, action.payload.durationDays);
        }
        state.pricing = CartPricingCalculator.calculate(state.items);
      }
    ),

    clearCart: create.reducer((state) => {
      state.items = [];
      state.pricing = CartPricingCalculator.calculate([]);
    }),

    setPincode: create.reducer<string>((state, action) => {
      state.pincode = action.payload;
      // In India, 6 digit pincodes: validate serviceability
      if (action.payload.length === 6) {
        state.isPincodeServiceable = true;
        state.serviceableCity =
          action.payload.startsWith('11') || action.payload.startsWith('12')
            ? 'Delhi NCR'
            : action.payload.startsWith('40')
            ? 'Mumbai'
            : action.payload.startsWith('56')
            ? 'Bengaluru'
            : 'Metro Serviceable Hub';
      } else {
        state.isPincodeServiceable = null;
        state.serviceableCity = null;
      }
    }),
  }),
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  updateRentalDuration,
  clearCart,
  setPincode,
} = cartSlice.actions;

export default cartSlice.reducer;
