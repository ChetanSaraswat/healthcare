import { UserProfile } from '../login/login.interface';

export interface RegisterPayload {
  name: string;
  email: string;
  phone?: string;
  password?: string;
}

export interface RegisterResponse {
  success: boolean;
  data: {
    user: UserProfile;
    token: string;
  };
}
