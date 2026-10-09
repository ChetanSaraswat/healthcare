import { axiosInterceptorInstanceClient } from '@/config/axios';
import { Order } from '@/domain/entities/order.entity';
import { ListOrdersFilterParams, ListOrdersResponse } from './list-orders.interface';

// Dynamic database-driven orders - no fake mock data
export const INITIAL_MOCK_ORDERS: Order[] = [];

function mapBackendOrder(raw: any): Order {
  const address = raw.address || {};
  const user = raw.user || {};
  return {
    id: String(raw.id),
    uuid: raw.uuid,
    orderNumber: `ARM-BUY-2026-${String(raw.id).padStart(4, '0')}`,
    userId: raw.user_id ? String(raw.user_id) : undefined,
    shippingAddress: {
      fullName: user.name || address.label || '',
      phone: user.phone || '',
      email: user.email || '',
      addressLine1: address.line1 || '',
      addressLine2: address.line2 || '',
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || '',
    },
    items: (raw.items || []).map((it: any) => ({
      id: String(it.id),
      orderId: String(raw.id),
      productId: String(it.product_id),
      productName: it.product?.name || '',
      productImage: (Array.isArray(it.product?.images) && it.product.images[0]) || '/images/oxygen_concentrator.png',
      unitPrice: parseFloat(it.unit_price) || 0,
      quantity: Number(it.quantity) || 1,
      totalPrice: (parseFloat(it.unit_price) || 0) * (Number(it.quantity) || 1),
    })),
    subtotal: parseFloat(raw.total_amount) || 0,
    shippingFee: 0,
    tax: Math.round((parseFloat(raw.total_amount) || 0) * 0.12),
    total: parseFloat(raw.total_amount) || 0,
    paymentStatus: raw.status === 'paid' ? 'paid' : 'pending',
    paymentMethod: raw.payment_id ? 'Online (Razorpay)' : 'Cash on Delivery',
    status: raw.status || 'pending',
    createdAt: raw.created_at || new Date().toISOString(),
    updatedAt: raw.updated_at || new Date().toISOString(),
  };
}

export const listOrdersService = async (params?: ListOrdersFilterParams): Promise<ListOrdersResponse> => {
  const queryParams: Record<string, any> = {
    page: params?.page || 1,
    limit: params?.limit || 10,
  };
  if (params?.status && params.status !== 'all') queryParams.status = params.status;
  if (params?.search) queryParams.search = params.search;
  if (params?.sortBy) queryParams.sortBy = params.sortBy;

  try {
    const response = await axiosInterceptorInstanceClient.get('/orders/all', { params: queryParams });
    if (response.data && response.data.data) {
      const rawPayload = response.data.data;
      const rawItems = Array.isArray(rawPayload.items)
        ? rawPayload.items
        : Array.isArray(rawPayload)
        ? rawPayload
        : [];
      const orders = rawItems.map(mapBackendOrder);
      const pagination = rawPayload.pagination;

      return {
        success: true,
        data: {
          orders,
          total: pagination?.total ?? orders.length,
          page: pagination?.page ?? (params?.page || 1),
          limit: pagination?.limit ?? (params?.limit || 10),
          totalPages: pagination?.totalPages ?? 1,
        },
      };
    }
  } catch (err) {
    try {
      const fallbackRes = await axiosInterceptorInstanceClient.get('/orders', { params: queryParams });
      if (fallbackRes.data && fallbackRes.data.data) {
        const rawPayload = fallbackRes.data.data;
        const rawItems = Array.isArray(rawPayload.items)
          ? rawPayload.items
          : Array.isArray(rawPayload)
          ? rawPayload
          : [];
        const orders = rawItems.map(mapBackendOrder);
        const pagination = rawPayload.pagination;

        return {
          success: true,
          data: {
            orders,
            total: pagination?.total ?? orders.length,
            page: pagination?.page ?? (params?.page || 1),
            limit: pagination?.limit ?? (params?.limit || 10),
            totalPages: pagination?.totalPages ?? 1,
          },
        };
      }
    } catch (e) {
      console.warn('[listOrdersService] Fallback error:', e);
    }
  }

  return {
    success: true,
    data: {
      orders: [],
      total: 0,
      page: params?.page || 1,
      limit: params?.limit || 10,
      totalPages: 1,
    },
  };
};
