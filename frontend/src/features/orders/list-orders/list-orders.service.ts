import { axiosInterceptorInstanceClient } from '@/config/axios';
import { Order } from '@/domain/entities/order.entity';
import { ListOrdersResponse } from './list-orders.interface';

export const INITIAL_MOCK_ORDERS: Order[] = [
  {
    id: 'ord-demo-01',
    orderNumber: 'ARM-BUY-2026-9041',
    shippingAddress: {
      fullName: 'Sunita Sharma',
      phone: '+91 98765 43210',
      email: 'sunita.sharma@example.com',
      addressLine1: 'B-402, Green Glen Layout, Bellandur',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560103',
    },
    items: [
      {
        id: 'ord-item-01',
        orderId: 'ord-demo-01',
        productId: 'prod-006',
        productName: 'Anti-Decubitus Ripple Medical Air Mattress with Pump',
        productImage: '/images/hospital_bed.png',
        unitPrice: 3200,
        quantity: 1,
        totalPrice: 3200,
      },
    ],
    subtotal: 3200,
    shippingFee: 0,
    tax: 384,
    total: 3200,
    paymentStatus: 'paid',
    paymentMethod: 'UPI (Google Pay)',
    status: 'delivered',
    createdAt: '2026-08-15T11:20:00.000Z',
    updatedAt: '2026-08-16T16:00:00.000Z',
  },
];

export const listOrdersService = async (): Promise<ListOrdersResponse> => {
  try {
    const response = await axiosInterceptorInstanceClient.get('/orders');
    if (response.data && Array.isArray(response.data.data)) {
      return response.data;
    }
  } catch (err) {
    // Return mock
  }

  return {
    success: true,
    data: INITIAL_MOCK_ORDERS,
  };
};
