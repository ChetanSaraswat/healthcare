import { axiosInterceptorInstanceClient } from '@/config/axios';
import { RentalItem, RentalOrder } from '@/types/entities/rental.entity';
import { ListRentalsResponse } from './list-rentals.interface';
import { RentalPricingCalculator } from '@/types/services/rental-pricing.calculator';

export function calculateRentalDays(startDateStr?: string, endDateStr?: string, fallbackDays = 0): number {
  if (!startDateStr || !endDateStr) return fallbackDays;
  const sStr = String(startDateStr).split('T')[0];
  const eStr = String(endDateStr).split('T')[0];
  const sParts = sStr.split('-').map(Number);
  const eParts = eStr.split('-').map(Number);
  if (sParts.length !== 3 || eParts.length !== 3) return fallbackDays;

  const startUtc = Date.UTC(sParts[0], sParts[1] - 1, sParts[2]);
  const endUtc = Date.UTC(eParts[0], eParts[1] - 1, eParts[2]);
  const diffDays = Math.round((endUtc - startUtc) / 86400000);
  return diffDays > 0 ? diffDays : fallbackDays;
}

function mapBackendRental(raw: any): RentalOrder {
  const address = raw.address || {};
  const user = raw.user || {};

  const orderDurationDays = raw.duration_days !== undefined && raw.duration_days !== null
    ? Number(raw.duration_days)
    : calculateRentalDays(raw.start_date, raw.end_date, 0);

  const rawItems = Array.isArray(raw.items) && raw.items.length > 0 ? raw.items : [];

  const items: RentalItem[] = rawItems.map((it: any, idx: number) => {
    const prod = it.product || {};
    const itemDailyRate = parseFloat(it.rate_amount) || parseFloat(prod.rent_price_daily) || 0;
    const itemQty = Number(it.quantity) || 1;
    const itemDeposit = parseFloat(it.deposit_amount) || parseFloat(prod.rent_deposit) || 0;
    const itemDuration = it.duration_days !== undefined && it.duration_days !== null
      ? Number(it.duration_days)
      : (orderDurationDays || calculateRentalDays(it.start_date || raw.start_date, it.end_date || raw.end_date, 0));

    const calc = RentalPricingCalculator.calculate({
      dailyRate: itemDailyRate,
      durationDays: itemDuration,
      depositPerUnit: itemDeposit,
      quantity: itemQty,
    });

    return {
      id: String(it.id || `rnt-item-${raw.id}-${idx}`),
      rentalOrderId: String(raw.id),
      productId: String(it.product_id || prod.id || ''),
      productName: prod.name || '',
      productImage: (Array.isArray(prod.images) && prod.images[0]) || '/images/hospital_bed.png',
      dailyRate: itemDailyRate,
      effectiveDailyRate: it.effective_daily_rate ? Number(it.effective_daily_rate) : calc.effectiveDailyRate,
      durationDays: itemDuration,
      securityDeposit: it.deposit_amount !== undefined ? Number(it.deposit_amount) : calc.securityDeposit,
      rentalCost: it.subtotal !== undefined ? Number(it.subtotal) : calc.rentalFee,
      startDate: it.start_date ? String(it.start_date).split('T')[0] : (raw.start_date ? String(raw.start_date).split('T')[0] : ''),
      endDate: it.end_date ? String(it.end_date).split('T')[0] : (raw.end_date ? String(raw.end_date).split('T')[0] : ''),
      quantity: itemQty,
    };
  });

  const calculatedRentalTotal = raw.total_rental_fee !== undefined
    ? Number(raw.total_rental_fee)
    : items.reduce((acc: number, i: RentalItem) => acc + i.rentalCost, 0);

  const calculatedDepositTotal =
    raw.total_deposit !== undefined
      ? Number(raw.total_deposit)
      : (raw.deposit_amount !== undefined
          ? Number(raw.deposit_amount)
          : items.reduce((acc: number, i: RentalItem) => acc + i.securityDeposit, 0));

  const totalPaid = Number(raw.total_amount || (calculatedRentalTotal + calculatedDepositTotal));

  return {
    id: String(raw.id),
    uuid: raw.uuid,
    rentalOrderNumber: `ARM-RNT-2026-${String(raw.id).padStart(4, '0')}`,
    userId: raw.user_id ? String(raw.user_id) : undefined,
    deliveryAddress: {
      fullName: user.name || address.label || '',
      phone: user.phone || '',
      email: user.email || '',
      addressLine1: address.line1 || '',
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || '',
    },
    items,
    totalRentalFee: calculatedRentalTotal,
    totalDeposit: calculatedDepositTotal,
    totalPaid,
    status: raw.status || 'pending',
    paymentStatus: raw.payment_id ? 'paid' : (raw.status === 'confirmed' || raw.status === 'active' ? 'paid' : 'pending'),
    notes: typeof raw.notes === 'string' ? raw.notes : (raw.notes?.notes || ''),
    createdAt: raw.created_at || new Date().toISOString(),
    updatedAt: raw.updated_at || new Date().toISOString(),
  };
}

export const listRentalsService = async (): Promise<ListRentalsResponse> => {
  try {
    const response = await axiosInterceptorInstanceClient.get('/rentals/all');
    if (response.data && Array.isArray(response.data.data)) {
      return {
        success: true,
        data: response.data.data.map(mapBackendRental),
      };
    }
  } catch (err) {
    try {
      const fallbackRes = await axiosInterceptorInstanceClient.get('/rentals');
      if (fallbackRes.data && Array.isArray(fallbackRes.data.data)) {
        return {
          success: true,
          data: fallbackRes.data.data.map(mapBackendRental),
        };
      }
    } catch (e) {
      console.warn('[listRentalsService] Fallback error:', e);
    }
  }

  return {
    success: true,
    data: [],
  };
};

export const INITIAL_MOCK_RENTALS: RentalOrder[] = [];
