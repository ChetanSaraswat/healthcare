import { axiosInterceptorInstanceClient } from '@/config/axios';
import { RentalOrder } from '@/domain/entities/rental.entity';
import { ListRentalsResponse } from './list-rentals.interface';

export const INITIAL_MOCK_RENTALS: RentalOrder[] = [
  {
    id: 'rnt-demo-01',
    rentalOrderNumber: 'ARM-RNT-2026-8812',
    deliveryAddress: {
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
        id: 'rnt-item-01',
        rentalOrderId: 'rnt-demo-01',
        productId: 'prod-001',
        productName: 'ResMed AirSense 10 AutoSet CPAP Machine',
        productImage: '/images/oxygen_concentrator.png',
        dailyRate: 350,
        durationDays: 30,
        securityDeposit: 12000,
        rentalCost: 7560,
        startDate: '2026-09-01',
        endDate: '2026-10-01',
        quantity: 1,
      },
    ],
    totalRentalFee: 7560,
    totalDeposit: 12000,
    totalPaid: 19560,
    status: 'active',
    paymentStatus: 'paid',
    notes: 'Biomedical technician installed on Sep 1. Sanitization protocol verified.',
    createdAt: '2026-08-30T10:00:00.000Z',
    updatedAt: '2026-09-01T14:30:00.000Z',
  },
  {
    id: 'rnt-demo-02',
    rentalOrderNumber: 'ARM-RNT-2026-5421',
    deliveryAddress: {
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
        id: 'rnt-item-02',
        rentalOrderId: 'rnt-demo-02',
        productId: 'prod-003',
        productName: '5-Function Motorized ICU Electric Hospital Bed',
        productImage: '/images/hospital_bed.png',
        dailyRate: 650,
        durationDays: 15,
        securityDeposit: 20000,
        rentalCost: 7995,
        startDate: '2026-08-10',
        endDate: '2026-08-25',
        quantity: 1,
      },
    ],
    totalRentalFee: 7995,
    totalDeposit: 20000,
    totalPaid: 27995,
    status: 'returned',
    paymentStatus: 'deposit_refunded',
    notes: 'Equipment returned and inspected. Full security deposit of ₹20,000 refunded.',
    createdAt: '2026-08-08T09:15:00.000Z',
    updatedAt: '2026-08-26T11:00:00.000Z',
  },
];

export const listRentalsService = async (): Promise<ListRentalsResponse> => {
  try {
    const response = await axiosInterceptorInstanceClient.get('/rentals');
    if (response.data && Array.isArray(response.data.data)) {
      return response.data;
    }
  } catch (err) {
    // Return fallback
  }

  return {
    success: true,
    data: INITIAL_MOCK_RENTALS,
  };
};
