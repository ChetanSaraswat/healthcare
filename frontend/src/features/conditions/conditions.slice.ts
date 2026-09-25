import { createAppSlice } from '@/store/create-app-slice';
import { Condition } from '@/domain/entities/condition.entity';
import { listConditions } from './list-conditions/list-conditions.action';
import { getCondition } from './get-condition/get-condition.action';
import { INITIAL_MOCK_CONDITIONS } from './list-conditions/list-conditions.service';

export interface ConditionsState {
  conditions: Condition[];
  selectedCondition: Condition | null;
  loading: boolean;
  error: string | null;
}

const initialState: ConditionsState = {
  conditions: INITIAL_MOCK_CONDITIONS,
  selectedCondition: null,
  loading: false,
  error: null,
};

export const conditionsSlice = createAppSlice({
  name: 'conditions',
  initialState,
  reducers: (create) => ({
    setSelectedCondition: create.reducer<Condition | null>((state, action) => {
      state.selectedCondition = action.payload;
    }),
    updateCondition: create.reducer<Condition>((state, action) => {
      const idx = state.conditions.findIndex((c) => c.id === action.payload.id || c.slug === action.payload.slug);
      if (idx !== -1) {
        state.conditions[idx] = action.payload;
      } else {
        state.conditions.push(action.payload);
      }
      if (state.selectedCondition?.id === action.payload.id) {
        state.selectedCondition = action.payload;
      }
    }),
    addCondition: create.reducer<Condition>((state, action) => {
      state.conditions.unshift(action.payload);
    }),
  }),
  extraReducers: (builder) => {
    builder
      // listConditions
      .addCase(listConditions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listConditions.fulfilled, (state, action) => {
        state.loading = false;
        state.conditions = action.payload.data;
      })
      .addCase(listConditions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load conditions';
      })
      // getCondition
      .addCase(getCondition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCondition.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCondition = action.payload.data;
      })
      .addCase(getCondition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load condition guide';
      });
  },
});

export const { setSelectedCondition, updateCondition, addCondition } = conditionsSlice.actions;
export default conditionsSlice.reducer;
