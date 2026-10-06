import { Address } from '@/domain/entities/user.entity';

export interface GetAddressesResponse {
  success: boolean;
  data: Address[];
}
