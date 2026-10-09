import { axiosInterceptorInstanceClient } from '@/config/axios';
import { Order } from '@/domain/entities/order.entity';
import { ListOrdersResponse } from './list-orders.interface';

// Dynamic database-driven orders - no fake mock data
export const INITIAL_MOCK_ORDERS: Order[] = [];

export const listOrdersService = async (): Promise<ListOrdersResponse> => {
  try {
    const response = await axiosInterceptorInstanceClient.get('/orders/my');
    const rawPayload = response.data?.data;
    const rawList = Array.isArray(rawPayload?.items)
      ? rawPayload.items
      : Array.isArray(rawPayload)
      ? rawPayload
      : [];
    if (rawList.length > 0 || Array.isArray(rawPayload?.items) || Array.isArray(rawPayload)) {
      const orders: Order[] = rawList.map((o: any) => ({
        id: String(o.id),
        orderNumber: `ARM-BUY-${String(o.id).padStart(4, '0')}`,
        shippingAddress: {
          fullName: o.user?.name || o.address?.label || '',
          phone: o.user?.phone || '',
          email: o.user?.email || '',
          addressLine1: o.address?.line1 || '',
          city: o.address?.city || '',
          state: o.address?.state || '',
          pincode: o.address?.pincode || '',
        },
        items: Array.isArray(o.items)
          ? o.items.map((it: any) => ({
              id: String(it.id),
              orderId: String(o.id),
              productId: String(it.product_id),
              productName: it.product?.name || '',
              productImage: (Array.isArray(it.product?.images) && it.product.images[0]) || '/images/oxygen_concentrator.png',
              unitPrice: parseFloat(it.unit_price) || 0,
              quantity: Number(it.quantity) || 1,
              totalPrice: (parseFloat(it.unit_price) || 0) * (Number(it.quantity) || 1),
            }))
          : [],
        subtotal: parseFloat(o.total_amount) || 0,
        shippingFee: 0,
        tax: Math.round((parseFloat(o.total_amount) || 0) * 0.12),
        total: parseFloat(o.total_amount) || 0,
        paymentStatus: o.status === 'paid' ? 'paid' : 'pending',
        paymentMethod: o.payment_id ? 'Razorpay Online' : 'Cash on Delivery',
        status: o.status || 'pending',
        createdAt: o.created_at || new Date().toISOString(),
        updatedAt: o.updated_at || new Date().toISOString(),
      }));

      return {
        success: true,
        data: orders,
      };
    }
  } catch (err) {
    console.warn('[listOrdersService] Error fetching customer orders:', err);
  }

  return {
    success: true,
    data: [],
  };
};
