import { axiosInterceptorInstanceClient } from '@/config/axios';
import { RentalOrder } from '@/domain/entities/rental.entity';
import { ListRentalsResponse } from './list-rentals.interface';

// Dynamic database-driven rentals - no fake mock data
export const INITIAL_MOCK_RENTALS: RentalOrder[] = [];

export const listRentalsService = async (): Promise<ListRentalsResponse> => {
  try {
    const response = await axiosInterceptorInstanceClient.get('/rentals/my');
    const rawList = response.data?.data;
    if (Array.isArray(rawList)) {
      const rentals: RentalOrder[] = rawList.map((r: any) => ({
        id: String(r.id),
        rentalOrderNumber: `ARM-RNT-${String(r.id).padStart(4, '0')}`,
        deliveryAddress: {
          fullName: r.user?.name || r.address?.label || '',
          phone: r.user?.phone || '',
          email: r.user?.email || '',
          addressLine1: r.address?.line1 || '',
          city: r.address?.city || '',
          state: r.address?.state || '',
          pincode: r.address?.pincode || '',
        },
        items: Array.isArray(r.items)
          ? r.items.map((it: any) => ({
              id: String(it.id),
              rentalOrderId: String(r.id),
              productId: String(it.product_id),
              productName: it.product?.name || '',
              productImage: (Array.isArray(it.product?.images) && it.product.images[0]) || '/images/hospital_bed.png',
              dailyRate: parseFloat(it.rate_amount) || 0,
              durationDays: Number(it.duration_days) || 0,
              securityDeposit: parseFloat(it.deposit_amount) || 0,
              rentalCost: parseFloat(it.subtotal) || 0,
              startDate: it.start_date
                ? new Date(it.start_date).toISOString().split('T')[0]
                : (r.start_date ? new Date(r.start_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
              endDate: it.end_date
                ? new Date(it.end_date).toISOString().split('T')[0]
                : (r.end_date ? new Date(r.end_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
              quantity: Number(it.quantity) || 1,
            }))
          : [],
        totalRentalFee: parseFloat(r.total_rental_fee) || 0,
        totalDeposit: parseFloat(r.deposit_amount) || 0,
        totalPaid: (parseFloat(r.total_rental_fee) || 0) + (parseFloat(r.deposit_amount) || 0),
        status: r.status || 'pending',
        paymentStatus: r.payment_id ? 'paid' : (r.status === 'confirmed' || r.status === 'active' ? 'paid' : 'pending'),
        notes: '',
        createdAt: r.created_at || new Date().toISOString(),
        updatedAt: r.updated_at || new Date().toISOString(),
      }));

      return {
        success: true,
        data: rentals,
      };
    }
  } catch (err) {
    console.warn('[listRentalsService] Error fetching customer rentals:', err);
  }

  return {
    success: true,
    data: [],
  };
};
