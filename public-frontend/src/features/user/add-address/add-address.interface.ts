import { Address } from '@/domain/entities/user.entity';

export interface AddAddressPayload {
  label?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  is_default?: boolean;
}

export interface AddAddressResponse {
  success: boolean;
  data: Address;
}
