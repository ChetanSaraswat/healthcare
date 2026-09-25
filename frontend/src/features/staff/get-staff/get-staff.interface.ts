import { StaffMember, StaffRole } from '@/domain/entities/user.entity';

export interface GetStaffFilters {
  search?: string;
  role?: StaffRole;
}

export interface CreateStaffPayload {
  name: string;
  email: string;
  phone?: string;
  role: StaffRole;
  password: string;
}

export interface UpdateStaffRolePayload {
  id: string;
  role: StaffRole;
}

export interface ToggleStaffStatusPayload {
  id: string;
  isActive: boolean;
}

export interface StaffResponse<T = StaffMember> {
  success: boolean;
  message?: string;
  data: T;
}

export interface StaffListResponse {
  success: boolean;
  data: StaffMember[];
}
