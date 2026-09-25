import { createAppSlice } from '@/store/create-app-slice';
import { Category } from '@/domain/entities/category.entity';
import { listCategories } from './list-categories/list-categories.action';
import { INITIAL_MOCK_CATEGORIES } from './list-categories/list-categories.service';

export interface CategoriesState {
  categories: Category[];
  selectedCategory: Category | null;
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: INITIAL_MOCK_CATEGORIES,
  selectedCategory: null,
  loading: false,
  error: null,
};

export const categoriesSlice = createAppSlice({
  name: 'categories',
  initialState,
  reducers: (create) => ({
    setSelectedCategory: create.reducer<Category | null>((state, action) => {
      state.selectedCategory = action.payload;
    }),
    addCategory: create.reducer<Category>((state, action) => {
      state.categories.push(action.payload);
    }),
    updateCategory: create.reducer<Category>((state, action) => {
      const idx = state.categories.findIndex((c) => c.id === action.payload.id);
      if (idx > -1) {
        state.categories[idx] = action.payload;
      }
    }),
    deleteCategory: create.reducer<string>((state, action) => {
      state.categories = state.categories.filter((c) => c.id !== action.payload && c.parentId !== action.payload);
    }),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(listCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.data;
      })
      .addCase(listCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load categories';
      });
  },
});

export const { setSelectedCategory, addCategory, updateCategory, deleteCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
