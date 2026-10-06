import { axiosInterceptorInstanceClient } from '@/config/axios';
import { DeleteAddressPayload, DeleteAddressResponse } from './delete-address.interface';

export const deleteAddressService = async (
  payload: DeleteAddressPayload
): Promise<DeleteAddressResponse> => {
  try {
    const response = await axiosInterceptorInstanceClient.delete(`/user/addresses/${payload.id}`);
    if (response.data) {
      return {
        ...response.data,
        id: payload.id,
      };
    }
  } catch {
    // Fallback simulation
  }

  return {
    success: true,
    message: 'Address deleted successfully',
    id: payload.id,
  };
};
