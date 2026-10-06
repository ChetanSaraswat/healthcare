import { ShippingAddress } from './order.entity';

export type RentalStatus = 'pending' | 'confirmed' | 'active' | 'returned' | 'cancelled';
export type RentalPaymentStatus = 'pending' | 'paid' | 'deposit_refunded' | 'failed';

export interface RentalItem {
  id: string;
  rentalOrderId: string;
  productId: string;
  productName: string;
  productImage: string;
  dailyRate: number;
  durationDays: number;
  securityDeposit: number;
  rentalCost: number;
  startDate: string;
  endDate: string;
  quantity: number;
}

export interface RentalOrder {
  id: string;
  uuid?: string;
  rentalOrderNumber: string;
  userId?: string;
  deliveryAddress: ShippingAddress;
  items: RentalItem[];
  totalRentalFee: number;
  totalDeposit: number;
  totalPaid: number;
  status: RentalStatus;
  paymentStatus: RentalPaymentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export class RentalEntity {
  /**
   * Calculates days remaining in the active rental period.
   */
  static getDaysRemaining(endDate: string): number {
    if (!endDate) return 0;
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 0);
  }

  /**
   * Checks whether the rental is overdue and past the return date.
   */
  static isOverdue(endDate: string, status: RentalStatus): boolean {
    if (status !== 'active' || !endDate) return false;
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    return now > end;
  }

  /**
   * Checks whether the patient/caregiver can schedule a return pickup.
   */
  static canScheduleReturn(status: RentalStatus): boolean {
    return status === 'active' || status === 'confirmed';
  }

  /**
   * Checks whether the customer is eligible to request a rental extension.
   */
  static canExtend(status: RentalStatus): boolean {
    return status === 'active';
  }

  /**
   * Returns Warm Clinical Trust color tokens and labels for rental status badges.
   */
  static getStatusBadge(status: RentalStatus): { bg: string; color: string; label: string } {
    switch (status) {
      case 'active':
        return { bg: '#eaf8f6', color: '#005c55', label: 'Active on Rent' };
      case 'pending':
        return { bg: '#fff0eb', color: '#ea580c', label: 'Dispatch Scheduled' };
      case 'confirmed':
        return { bg: '#e6f4fe', color: '#006398', label: 'Booking Confirmed' };
      case 'returned':
        return { bg: '#f2f3ff', color: '#006398', label: 'Returned & Inspected' };
      case 'cancelled':
        return { bg: '#fef2f2', color: '#b91c1c', label: 'Cancelled' };
      default:
        return { bg: '#f8fafc', color: '#6e7977', label: status };
    }
  }
}
