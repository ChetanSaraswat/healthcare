import { createAppSlice } from '@/store/create-app-slice';
import { Product } from '@/domain/entities/product.entity';
import { ListProductsFilterParams } from './list-products/list-products.interface';
import { listProducts } from './list-products/list-products.action';
import { getProduct } from './get-product/get-product.action';

export interface ProductsState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  filters: ListProductsFilterParams;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const initialState: ProductsState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
  filters: {
    mode: 'all',
    sort: 'popular',
  },
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
};

export const productsSlice = createAppSlice({
  name: 'products',
  initialState,
  reducers: (create) => ({
    setFilters: create.reducer<Partial<ListProductsFilterParams>>((state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    }),
    clearSelectedProduct: create.reducer((state) => {
      state.selectedProduct = null;
    }),
    addProduct: create.reducer<Product>((state, action) => {
      state.products.unshift(action.payload);
      state.total += 1;
    }),
    updateProduct: create.reducer<Product>((state, action) => {
      const idx = state.products.findIndex(
        (p) =>
          p.id === action.payload.id ||
          (p.uuid && p.uuid === action.payload.uuid) ||
          p.slug === action.payload.slug
      );
      if (idx !== -1) {
        state.products[idx] = action.payload;
      }
      if (
        state.selectedProduct &&
        (state.selectedProduct.id === action.payload.id ||
          (state.selectedProduct.uuid && state.selectedProduct.uuid === action.payload.uuid) ||
          state.selectedProduct.slug === action.payload.slug)
      ) {
        state.selectedProduct = action.payload;
      }
    }),
    deleteProduct: create.reducer<string>((state, action) => {
      state.products = state.products.filter(
        (p) => p.id !== action.payload && p.uuid !== action.payload && p.slug !== action.payload
      );
      state.total = Math.max(0, state.total - 1);
    }),
  }),
  extraReducers: (builder) => {
    builder
      // listProducts
      .addCase(listProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data.products;
        state.total = action.payload.data.total;
        state.page = action.payload.data.page;
        state.totalPages = action.payload.data.totalPages;
      })
      .addCase(listProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load products';
      })
      // getProduct
      .addCase(getProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload.data;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Product not found';
      });
  },
});

export const {
  setFilters,
  clearSelectedProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} = productsSlice.actions;
export default productsSlice.reducer;
