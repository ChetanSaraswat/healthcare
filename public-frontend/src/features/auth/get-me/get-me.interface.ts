import { UserProfile } from '../login/login.interface';

export interface GetMeResponse {
  success: boolean;
  data: UserProfile;
}
