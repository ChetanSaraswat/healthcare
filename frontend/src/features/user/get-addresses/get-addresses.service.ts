import { axiosInterceptorInstanceClient } from '@/config/axios';
import { Address } from '@/domain/entities/user.entity';
import { GetAddressesResponse } from './get-addresses.interface';

export const INITIAL_MOCK_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    label: 'Home',
    line1: 'B-402, Green Glen Layout, Outer Ring Road, Bellandur',
    line2: 'Opposite Cloudnine Hospital, 4th Floor (Lift available)',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560103',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Elderly Care / Clinic',
    line1: 'Flat 101, Aashirwad Senior Living, Whitefield Main Road',
    line2: 'Near Columbia Asia Hospital',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560066',
    isDefault: false,
  },
];

export const getAddressesService = async (): Promise<GetAddressesResponse> => {
  try {
    const response = await axiosInterceptorInstanceClient.get('/user/addresses');
    if (response.data && response.data.data) {
      return response.data;
    }
  } catch {
    // Fallback gracefully to demo mock addresses if API is unreachable
  }

  return {
    success: true,
    data: INITIAL_MOCK_ADDRESSES,
  };
};
