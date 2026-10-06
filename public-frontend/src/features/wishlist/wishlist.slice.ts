import { createAppSlice } from '@/store/create-app-slice';
import { WishlistItem, WishlistEntity } from '@/domain/entities/wishlist.entity';
import { WishlistState } from './wishlist.interface';

const initialState: WishlistState = {
  items: [],
  lastUpdated: null,
};

export const wishlistSlice = createAppSlice({
  name: 'wishlist',
  initialState,
  reducers: (create) => ({
    addItem: create.reducer<WishlistItem>((state, action) => {
      state.items = WishlistEntity.addItem(state.items, action.payload);
      state.lastUpdated = new Date().toISOString();
    }),

    removeItem: create.reducer<string>((state, action) => {
      state.items = WishlistEntity.removeItem(state.items, action.payload);
      state.lastUpdated = new Date().toISOString();
    }),

    toggleItem: create.reducer<WishlistItem>((state, action) => {
      const exists = WishlistEntity.isInWishlist(state.items, action.payload.productId);
      if (exists) {
        state.items = WishlistEntity.removeItem(state.items, action.payload.productId);
      } else {
        state.items = WishlistEntity.addItem(state.items, action.payload);
      }
      state.lastUpdated = new Date().toISOString();
    }),

    clearWishlist: create.reducer((state) => {
      state.items = [];
      state.lastUpdated = new Date().toISOString();
    }),
  }),
});

export const { addItem, removeItem, toggleItem, clearWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
