import { UserRole } from '@/domain/entities/user.entity';

export interface UserProfile {
  id: string;
  uuid?: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: UserProfile;
    token: string;
  };
}

