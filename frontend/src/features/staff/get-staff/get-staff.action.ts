import { createAsyncThunk } from '@reduxjs/toolkit';
import { staffService } from './get-staff.service';
import {
  GET_STAFF_ACTION_TYPE,
  CREATE_STAFF_ACTION_TYPE,
  UPDATE_STAFF_ROLE_ACTION_TYPE,
  TOGGLE_STAFF_STATUS_ACTION_TYPE,
} from './get-staff.type';
import {
  GetStaffFilters,
  CreateStaffPayload,
  UpdateStaffRolePayload,
  ToggleStaffStatusPayload,
} from './get-staff.interface';
import { StaffMember } from '@/domain/entities/user.entity';

export const getStaff = createAsyncThunk<StaffMember[], GetStaffFilters | undefined>(
  GET_STAFF_ACTION_TYPE,
  async (filters, { rejectWithValue }) => {
    try {
      return await staffService.getStaff(filters);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch staff directory');
    }
  }
);

export const createStaff = createAsyncThunk<StaffMember, CreateStaffPayload>(
  CREATE_STAFF_ACTION_TYPE,
  async (payload, { rejectWithValue }) => {
    try {
      return await staffService.createStaff(payload);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create staff member');
    }
  }
);

export const updateStaffRole = createAsyncThunk<StaffMember, UpdateStaffRolePayload>(
  UPDATE_STAFF_ROLE_ACTION_TYPE,
  async (payload, { rejectWithValue }) => {
    try {
      return await staffService.updateStaffRole(payload);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update staff role');
    }
  }
);

export const toggleStaffStatus = createAsyncThunk<StaffMember, ToggleStaffStatusPayload>(
  TOGGLE_STAFF_STATUS_ACTION_TYPE,
  async (payload, { rejectWithValue }) => {
    try {
      return await staffService.toggleStaffStatus(payload);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update staff status');
    }
  }
);
