import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore, Persistor } from 'redux-persist';
import uiSlice from '@/features/ui/ui.slice';
import productsSlice from '@/features/products/products.slice';
import categoriesSlice from '@/features/categories/categories.slice';
import rentalsSlice from '@/features/rentals/rentals.slice';
import ordersSlice from '@/features/orders/orders.slice';
import conditionsSlice from '@/features/conditions/conditions.slice';
import authSlice from '@/features/auth/auth.slice';
import userSlice from '@/features/user/user.slice';
import blogSlice from '@/features/blog/blog.slice';

const createNoopStorage = () => ({
  getItem() {
    return Promise.resolve(null);
  },
  setItem(_key: string, value: any) {
    return Promise.resolve(value);
  },
  removeItem() {
    return Promise.resolve();
  },
});

const storage =
  typeof window !== 'undefined'
    ? require('redux-persist/lib/storage').default
    : createNoopStorage();

const rootReducer = combineSlices({
  ui: uiSlice,
  products: productsSlice,
  categories: categoriesSlice,
  rentals: rentalsSlice,
  orders: ordersSlice,
  conditions: conditionsSlice,
  auth: authSlice,
  user: userSlice,
  blog: blogSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

const persistConfig = {
  key: 'omkar_admin_root',
  storage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () =>
  configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

export const store = makeStore();
export const persistor: Persistor = persistStore(store);

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
