import { createAppSlice } from '@/store/create-app-slice';
import { RentalOrder } from '@/domain/entities/rental.entity';
import { listRentals } from './list-rentals/list-rentals.action';
import { requestRental } from './request-rental/request-rental.action';
import { extendRental } from './extend-rental/extend-rental.action';
import { scheduleReturn } from './schedule-return/schedule-return.action';
import { updateRentalStatusAction } from './update-rental-status/update-rental-status.action';

export interface RentalsState {
  rentals: RentalOrder[];
  selectedRental: RentalOrder | null;
  latestPlacedRental: RentalOrder | null;
  loading: boolean;
  submitting: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const initialState: RentalsState = {
  rentals: [],
  selectedRental: null,
  latestPlacedRental: null,
  loading: false,
  submitting: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
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
        state.rentals = action.payload.data.rentals;
        state.total = action.payload.data.total;
        state.page = action.payload.data.page;
        state.limit = action.payload.data.limit;
        state.totalPages = action.payload.data.totalPages;
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
      })
      // updateRentalStatusAction
      .addCase(updateRentalStatusAction.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateRentalStatusAction.fulfilled, (state, action) => {
        state.submitting = false;
        const rentalId = action.meta.arg.rentalId;
        const newStatus = action.meta.arg.status;
        const target = state.rentals.find((r) => r.id === rentalId);
        if (target) {
          target.status = newStatus;
        }
        if (state.selectedRental && state.selectedRental.id === rentalId) {
          state.selectedRental.status = newStatus;
        }
      })
      .addCase(updateRentalStatusAction.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || 'Failed to update rental status';
      });
  },
});

export const { setSelectedRental, clearLatestPlacedRental, updateRentalStatus } = rentalsSlice.actions;
export default rentalsSlice.reducer;
