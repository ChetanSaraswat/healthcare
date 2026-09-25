import { createAppSlice } from '@/store/create-app-slice';
import { StaffMember } from '@/domain/entities/user.entity';
import {
  getStaff,
  createStaff,
  updateStaffRole,
  toggleStaffStatus,
} from './get-staff/get-staff.action';
import { INITIAL_MOCK_STAFF } from './get-staff/get-staff.service';

export interface StaffState {
  staffMembers: StaffMember[];
  selectedStaff: StaffMember | null;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
}

const initialState: StaffState = {
  staffMembers: INITIAL_MOCK_STAFF,
  selectedStaff: null,
  loading: false,
  actionLoading: false,
  error: null,
};

export const staffSlice = createAppSlice({
  name: 'staff',
  initialState,
  reducers: (create) => ({
    setSelectedStaff: create.reducer<StaffMember | null>((state, action) => {
      state.selectedStaff = action.payload;
    }),
    clearStaffError: create.reducer((state) => {
      state.error = null;
    }),
  }),
  extraReducers: (builder) => {
    builder
      // getStaff
      .addCase(getStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staffMembers = action.payload;
      })
      .addCase(getStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to load staff directory';
      })
      // createStaff
      .addCase(createStaff.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createStaff.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.staffMembers.unshift(action.payload);
      })
      .addCase(createStaff.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = (action.payload as string) || 'Failed to create staff member';
      })
      // updateStaffRole
      .addCase(updateStaffRole.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateStaffRole.fulfilled, (state, action) => {
        state.actionLoading = false;
        const idx = state.staffMembers.findIndex(
          (s) => s.id === action.payload.id || s.uuid === action.payload.uuid
        );
        if (idx !== -1) {
          state.staffMembers[idx] = action.payload;
        }
      })
      .addCase(updateStaffRole.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = (action.payload as string) || 'Failed to update staff role';
      })
      // toggleStaffStatus
      .addCase(toggleStaffStatus.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(toggleStaffStatus.fulfilled, (state, action) => {
        state.actionLoading = false;
        const idx = state.staffMembers.findIndex(
          (s) => s.id === action.payload.id || s.uuid === action.payload.uuid
        );
        if (idx !== -1) {
          state.staffMembers[idx] = action.payload;
        }
      })
      .addCase(toggleStaffStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = (action.payload as string) || 'Failed to update staff status';
      });
  },
});

export const { setSelectedStaff, clearStaffError } = staffSlice.actions;
export default staffSlice.reducer;
