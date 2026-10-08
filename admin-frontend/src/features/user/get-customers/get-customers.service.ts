import { axiosInterceptorInstanceClient } from '@/config/axios';
import { CustomerSummary, CustomerCareHistory } from '@/domain/entities/user.entity';
import {
  GetCustomersFilters,
  GetCustomersResponse,
  GetCustomerCareHistoryResponse,
} from './get-customers.interface';

// Dynamic database-driven customers - no fake mock data
export const INITIAL_MOCK_CUSTOMERS: CustomerSummary[] = [];

export const getCustomersService = async (
  filters?: GetCustomersFilters
): Promise<GetCustomersResponse> => {
  try {
    const response = await axiosInterceptorInstanceClient.get('/users/admin/customers', {
      params: filters,
    });
    if (response.data && response.data.data) {
      return response.data;
    }
  } catch (err) {
    console.warn('[getCustomersService] Error fetching customers:', err);
  }

  return {
    success: true,
    data: [],
  };
};

export const getCustomerCareHistoryService = async (
  customerId: string
): Promise<GetCustomerCareHistoryResponse> => {
  try {
    const response = await axiosInterceptorInstanceClient.get(
      `/users/admin/customers/${customerId}`
    );
    if (response.data && response.data.data) {
      return response.data;
    }
  } catch (err) {
    console.warn('[getCustomerCareHistoryService] Error fetching care history:', err);
  }

  throw new Error(`Customer care history not found for ID: ${customerId}`);
};
