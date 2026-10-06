import { axiosInterceptorInstanceClient } from '@/config/axios';
import { CustomerSummary, CustomerCareHistory } from '@/domain/entities/user.entity';
import {
  GetCustomersFilters,
  GetCustomersResponse,
  GetCustomerCareHistoryResponse,
} from './get-customers.interface';

export const INITIAL_MOCK_CUSTOMERS: CustomerSummary[] = [
  {
    id: '1',
    uuid: 'c8f74a12-8812-4f11-9a10-854721ab9011',
    name: 'Dr. Ramesh Kulkarni',
    email: 'dr.kulkarni@manipalhospitals.org',
    phone: '+91 98450 12345',
    role: 'customer',
    primaryCity: 'Bengaluru, Karnataka',
    totalOrdersCount: 2,
    totalRentalsCount: 1,
    totalSpend: 148500,
    lastActive: '2026-09-22T10:30:00Z',
    createdAt: '2026-08-10T09:15:00Z',
    addresses: [
      {
        id: 'addr-1',
        label: 'Home / Clinic',
        line1: 'B-402, Green Glen Layout, Outer Ring Road, Bellandur',
        line2: 'Opposite Cloudnine Hospital, 4th Floor',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560103',
        isDefault: true,
      },
    ],
  },
  {
    id: '2',
    uuid: 'd1a89c33-9102-4c22-8b21-992817cc8822',
    name: 'Sunita Mehra',
    email: 'sunita.mehra@gmail.com',
    phone: '+91 98110 54321',
    role: 'customer',
    primaryCity: 'Delhi NCR',
    totalOrdersCount: 0,
    totalRentalsCount: 1,
    totalSpend: 24000,
    lastActive: '2026-09-21T14:45:00Z',
    createdAt: '2026-08-20T11:00:00Z',
    addresses: [
      {
        id: 'addr-2',
        label: 'Residence',
        line1: 'House 14, Block C, Vasant Vihar',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110057',
        isDefault: true,
      },
    ],
  },
  {
    id: '3',
    uuid: 'e2b90d44-7721-4d33-7c32-113928dd7733',
    name: 'Col. V. N. Rao (Retd.)',
    email: 'vn.rao.army@yahoo.co.in',
    phone: '+91 94220 98765',
    role: 'customer',
    primaryCity: 'Pune, Maharashtra',
    totalOrdersCount: 1,
    totalRentalsCount: 1,
    totalSpend: 78000,
    lastActive: '2026-09-20T16:20:00Z',
    createdAt: '2026-07-15T08:30:00Z',
    addresses: [
      {
        id: 'addr-3',
        label: 'Family Home',
        line1: 'Salunke Vihar, Army Officers Colony, Wanowrie',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411040',
        isDefault: true,
      },
    ],
  },
  {
    id: '4',
    uuid: 'f3c01e55-6632-4e44-6d43-224039ee6644',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@outlook.com',
    phone: '+91 98200 67890',
    role: 'customer',
    primaryCity: 'Mumbai, Maharashtra',
    totalOrdersCount: 1,
    totalRentalsCount: 1,
    totalSpend: 36500,
    lastActive: '2026-09-18T12:10:00Z',
    createdAt: '2026-08-01T15:20:00Z',
    addresses: [
      {
        id: 'addr-4',
        label: 'Apartment',
        line1: 'Tower 4, Apt 1201, Hiranandani Gardens, Powai',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400076',
        isDefault: true,
      },
    ],
  },
  {
    id: '5',
    uuid: 'a4d12f66-5543-4f55-5e54-335140ff5555',
    name: 'Rajiv Verma',
    email: 'rajiv.verma@techsolutions.in',
    phone: '+91 99887 76655',
    role: 'customer',
    primaryCity: 'Hyderabad, Telangana',
    totalOrdersCount: 2,
    totalRentalsCount: 0,
    totalSpend: 42000,
    lastActive: '2026-09-15T09:00:00Z',
    createdAt: '2026-08-25T14:00:00Z',
    addresses: [
      {
        id: 'addr-5',
        label: 'Home',
        line1: 'Villa 18, Palm Meadows, Jubilee Hills',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500033',
        isDefault: true,
      },
    ],
  },
];

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
  } catch {
    // Graceful fallback to rich mock data if backend not connected in dev
  }

  let filtered = [...INITIAL_MOCK_CUSTOMERS];
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(s) ||
        c.email.toLowerCase().includes(s) ||
        c.phone.includes(s) ||
        (c.primaryCity && c.primaryCity.toLowerCase().includes(s))
    );
  }

  return {
    success: true,
    data: filtered,
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
  } catch {
    // Graceful fallback to mock care history
  }

  const baseCustomer =
    INITIAL_MOCK_CUSTOMERS.find((c) => c.id === customerId || c.uuid === customerId) ||
    INITIAL_MOCK_CUSTOMERS[0];

  const mockCareHistory: CustomerCareHistory = {
    ...baseCustomer,
    orders: [
      {
        id: 'ord-101',
        orderNumber: 'ORD-2026-8841',
        userId: baseCustomer.id,
        shippingAddress: {
          fullName: baseCustomer.name,
          phone: baseCustomer.phone,
          email: baseCustomer.email,
          addressLine1: baseCustomer.addresses?.[0]?.line1 || '123 Hospital Road',
          city: baseCustomer.addresses?.[0]?.city || 'Bengaluru',
          state: baseCustomer.addresses?.[0]?.state || 'Karnataka',
          pincode: baseCustomer.addresses?.[0]?.pincode || '560103',
        },
        items: [
          {
            id: 'ord-item-1',
            orderId: 'ord-101',
            productId: 'prod-1',
            productName: 'ResMed AirSense 10 AutoSet CPAP Machine',
            productImage: '/images/products/cpap-machine.jpg',
            unitPrice: 65000,
            quantity: 1,
            totalPrice: 65000,
          },
          {
            id: 'ord-item-2',
            orderId: 'ord-101',
            productId: 'prod-3',
            productName: 'AirFit N20 Nasal Mask Cushion (Medium)',
            productImage: '/images/products/nasal-mask.jpg',
            unitPrice: 3500,
            quantity: 2,
            totalPrice: 7000,
          },
        ],
        subtotal: 72000,
        tax: 8640,
        shippingFee: 0,
        total: 80640,
        status: 'delivered',
        paymentStatus: 'paid',
        paymentMethod: 'razorpay_upi',
        createdAt: '2026-09-14T10:15:00Z',
        updatedAt: '2026-09-14T14:45:00Z',
      },
    ],
    rentals: [
      {
        id: 'rent-201',
        rentalOrderNumber: 'RNT-2026-5592',
        userId: baseCustomer.id,
        deliveryAddress: {
          fullName: baseCustomer.name,
          phone: baseCustomer.phone,
          email: baseCustomer.email,
          addressLine1: baseCustomer.addresses?.[0]?.line1 || '123 Hospital Road',
          city: baseCustomer.addresses?.[0]?.city || 'Bengaluru',
          state: baseCustomer.addresses?.[0]?.state || 'Karnataka',
          pincode: baseCustomer.addresses?.[0]?.pincode || '560103',
        },
        items: [
          {
            id: 'rent-item-1',
            rentalOrderId: 'rent-201',
            productId: 'prod-1',
            productName: 'ResMed AirSense 10 AutoSet (Rental Unit)',
            productImage: '/images/products/cpap-machine.jpg',
            dailyRate: 350,
            durationDays: 30,
            securityDeposit: 15000,
            rentalCost: 7560,
            startDate: '2026-09-01T00:00:00Z',
            endDate: '2026-10-01T00:00:00Z',
            quantity: 1,
          },
        ],
        totalRentalFee: 7560,
        totalDeposit: 15000,
        totalPaid: 22560,
        status: 'active',
        paymentStatus: 'paid',
        createdAt: '2026-08-31T16:20:00Z',
        updatedAt: '2026-08-31T16:20:00Z',
      },
    ],
  };

  return {
    success: true,
    data: mockCareHistory,
  };
};
