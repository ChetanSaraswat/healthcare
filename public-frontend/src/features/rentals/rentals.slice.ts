import { createAppSlice } from '@/store/create-app-slice';
import { RentalOrder } from '@/domain/entities/rental.entity';
import { listRentals } from './list-rentals/list-rentals.action';
import { requestRental } from './request-rental/request-rental.action';
import { extendRental } from './extend-rental/extend-rental.action';
import { scheduleReturn } from './schedule-return/schedule-return.action';

export interface RentalsState {
  rentals: RentalOrder[];
  selectedRental: RentalOrder | null;
  latestPlacedRental: RentalOrder | null;
  loading: boolean;
  submitting: boolean;
  error: string | null;
}

const initialState: RentalsState = {
  rentals: [],
  selectedRental: null,
  latestPlacedRental: null,
  loading: false,
  submitting: false,
  error: null,
};

export const rentalsSlice = createAppSlice({
  name: 'rentals',
  initialState,
  reducers: (create) => ({
    setSelectedRental: create.reducer<RentalOrder | null>((state, action) => {
      state.selectedRental = action.payload;
    }),
    clearLatestPlacedRental: create.reducer((state) => {
      state.latestPlacedRental = null;
    }),
    updateRentalStatus: create.reducer<{ id: string; status: RentalOrder['status'] }>((state, action) => {
      const rental = state.rentals.find((r) => r.id === action.payload.id);
      if (rental) {
        rental.status = action.payload.status;
      }
      if (state.selectedRental && state.selectedRental.id === action.payload.id) {
        state.selectedRental.status = action.payload.status;
      }
    }),
  }),
  extraReducers: (builder) => {
    builder
      // listRentals
      .addCase(listRentals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listRentals.fulfilled, (state, action) => {
        state.loading = false;
        state.rentals = action.payload.data;
      })
      .addCase(listRentals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load rentals';
      })
      // requestRental
      .addCase(requestRental.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(requestRental.fulfilled, (state, action) => {
        state.submitting = false;
        state.latestPlacedRental = action.payload.data;
        state.rentals.unshift(action.payload.data);
      })
      .addCase(requestRental.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || 'Failed to place rental request';
      })
      // extendRental
      .addCase(extendRental.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(extendRental.fulfilled, (state, action) => {
        state.submitting = false;
        const rentalId = action.meta.arg.rentalId;
        const newEndDate = action.payload?.data?.new_end_date;
        const idx = state.rentals.findIndex((r) => r.id === rentalId);
        if (idx !== -1 && newEndDate) {
          state.rentals[idx].items = state.rentals[idx].items.map((item) => ({
            ...item,
            endDate: newEndDate,
          }));
        }
      })
      .addCase(extendRental.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || 'Failed to extend rental';
      })
      // scheduleReturn
      .addCase(scheduleReturn.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(scheduleReturn.fulfilled, (state, action) => {
        state.submitting = false;
        const rentalId = action.meta.arg.rentalId;
        const idx = state.rentals.findIndex((r) => r.id === rentalId);
        if (idx !== -1) {
          state.rentals[idx].status = 'returned';
        }
      })
      .addCase(scheduleReturn.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || 'Failed to schedule return';
      });
  },
});

export const { setSelectedRental, clearLatestPlacedRental, updateRentalStatus } = rentalsSlice.actions;
export default rentalsSlice.reducer;
