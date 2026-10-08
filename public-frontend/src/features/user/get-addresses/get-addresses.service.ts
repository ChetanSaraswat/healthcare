import { axiosInterceptorInstanceClient } from '@/config/axios';
import { Address } from '@/domain/entities/user.entity';
import { GetAddressesResponse } from './get-addresses.interface';

// Dynamic database-driven addresses - no fake mock data
export const INITIAL_MOCK_ADDRESSES: Address[] = [];

export const getAddressesService = async (): Promise<GetAddressesResponse> => {
  try {
    const response = await axiosInterceptorInstanceClient.get('/user/addresses');
    if (response.data && Array.isArray(response.data.data)) {
      return response.data;
    }
  } catch (err) {
    console.warn('[getAddressesService] Error fetching user addresses:', err);
  }

  return {
    success: true,
    data: [],
  };
};
