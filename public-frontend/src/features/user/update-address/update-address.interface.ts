import { Address } from '@/domain/entities/user.entity';

export interface UpdateAddressPayload {
  id: string;
  data: {
    label?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    is_default?: boolean;
  };
}

export interface UpdateAddressResponse {
  success: boolean;
  data: Address;
}
