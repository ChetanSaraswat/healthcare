import { axiosInterceptorInstanceClient } from '@/config/axios';
import { StaffMember } from '@/domain/entities/user.entity';
import {
  GetStaffFilters,
  CreateStaffPayload,
  UpdateStaffRolePayload,
  ToggleStaffStatusPayload,
  StaffResponse,
  StaffListResponse,
} from './get-staff.interface';

export const INITIAL_MOCK_STAFF: StaffMember[] = [
  {
    id: '1',
    uuid: 'a1b2c3d4-0001-4000-8000-000000000001',
    name: 'Vikramaditya Sharma',
    email: 'admin@aarogyamed.com',
    phone: '+91 98765 43210',
    role: 'super_admin',
    isActive: true,
    createdAt: '2026-08-01T09:00:00Z',
    updatedAt: '2026-09-20T11:00:00Z',
    deletedAt: null,
  },
  {
    id: '2',
    uuid: 'a1b2c3d4-0002-4000-8000-000000000002',
    name: 'Dr. Ananya Iyer',
    email: 'ananya.iyer@aarogyamed.com',
    phone: '+91 98201 11223',
    role: 'content_editor',
    isActive: true,
    createdAt: '2026-08-15T10:30:00Z',
    updatedAt: '2026-09-18T14:20:00Z',
    deletedAt: null,
  },
  {
    id: '3',
    uuid: 'a1b2c3d4-0003-4000-8000-000000000003',
    name: 'Kavita Sundaram',
    email: 'kavita.s@aarogyamed.com',
    phone: '+91 98451 99887',
    role: 'operations_staff',
    isActive: true,
    createdAt: '2026-08-20T12:00:00Z',
    updatedAt: '2026-09-22T16:45:00Z',
    deletedAt: null,
  },
  {
    id: '4',
    uuid: 'a1b2c3d4-0004-4000-8000-000000000004',
    name: 'Rohan Deshmukh',
    email: 'rohan.d@aarogyamed.com',
    phone: '+91 97110 33445',
    role: 'catalog_editor',
    isActive: true,
    createdAt: '2026-08-25T08:45:00Z',
    updatedAt: '2026-09-21T09:10:00Z',
    deletedAt: null,
  },
  {
    id: '5',
    uuid: 'a1b2c3d4-0005-4000-8000-000000000005',
    name: 'Siddharth Nair',
    email: 'siddharth.nair@aarogyamed.com',
    phone: '+91 99887 76655',
    role: 'operations_staff',
    isActive: false,
    createdAt: '2026-08-10T14:00:00Z',
    updatedAt: '2026-09-15T18:30:00Z',
    deletedAt: '2026-09-15T18:30:00Z',
  },
];

class StaffService {
  async getStaff(filters?: GetStaffFilters): Promise<StaffMember[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.role) params.append('role', filters.role);

      const response = await axiosInterceptorInstanceClient.get<StaffListResponse>(
        `/api/v1/users/admin/staff?${params.toString()}`
      );
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      return INITIAL_MOCK_STAFF;
    } catch {
      let filtered = [...INITIAL_MOCK_STAFF];
      if (filters?.role) {
        filtered = filtered.filter((s) => s.role === filters.role);
      }
      if (filters?.search) {
        const query = filters.search.toLowerCase();
        filtered = filtered.filter(
          (s) =>
            s.name.toLowerCase().includes(query) ||
            s.email.toLowerCase().includes(query) ||
            (s.phone && s.phone.toLowerCase().includes(query))
        );
      }
      return filtered;
    }
  }

  async createStaff(payload: CreateStaffPayload): Promise<StaffMember> {
    try {
      const response = await axiosInterceptorInstanceClient.post<StaffResponse<StaffMember>>(
        '/api/v1/users/admin/staff',
        payload
      );
      return response.data.data;
    } catch (error: any) {
      // Return simulated optimistic new staff member on network/demo fallback
      const newStaff: StaffMember = {
        id: (INITIAL_MOCK_STAFF.length + 1).toString(),
        uuid: `a1b2c3d4-000${INITIAL_MOCK_STAFF.length + 1}-4000-8000-00000000000${INITIAL_MOCK_STAFF.length + 1}`,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        role: payload.role,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      };
      INITIAL_MOCK_STAFF.unshift(newStaff);
      return newStaff;
    }
  }

  async updateStaffRole(payload: UpdateStaffRolePayload): Promise<StaffMember> {
    try {
      const response = await axiosInterceptorInstanceClient.patch<StaffResponse<StaffMember>>(
        `/api/v1/users/admin/staff/${payload.id}/role`,
        { role: payload.role }
      );
      return response.data.data;
    } catch (error: any) {
      const target = INITIAL_MOCK_STAFF.find((s) => s.id === payload.id || s.uuid === payload.id);
      if (target) {
        target.role = payload.role;
        target.updatedAt = new Date().toISOString();
        return { ...target };
      }
      throw error;
    }
  }

  async toggleStaffStatus(payload: ToggleStaffStatusPayload): Promise<StaffMember> {
    try {
      const response = await axiosInterceptorInstanceClient.patch<StaffResponse<StaffMember>>(
        `/api/v1/users/admin/staff/${payload.id}/status`,
        { isActive: payload.isActive }
      );
      return response.data.data;
    } catch (error: any) {
      const target = INITIAL_MOCK_STAFF.find((s) => s.id === payload.id || s.uuid === payload.id);
      if (target) {
        target.isActive = payload.isActive;
        target.deletedAt = payload.isActive ? null : new Date().toISOString();
        target.updatedAt = new Date().toISOString();
        return { ...target };
      }
      throw error;
    }
  }
}

export const staffService = new StaffService();
