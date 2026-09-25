export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export class OrderEntity {
  /**
   * Determines if the order is eligible for customer cancellation.
   */
  static canCancel(status: OrderStatus): boolean {
    return ['pending', 'processing'].includes(status);
  }

  /**
   * Checks whether the equipment has reached the patient doorstep.
   */
  static isDelivered(status: OrderStatus): boolean {
    return status === 'delivered';
  }

  /**
   * Returns Warm Clinical Trust color tokens and labels for status badges.
   */
  static getStatusBadge(status: OrderStatus): { bg: string; color: string; label: string } {
    switch (status) {
      case 'delivered':
        return { bg: '#eaf8f6', color: '#005c55', label: 'Delivered' };
      case 'shipped':
        return { bg: '#e6f4fe', color: '#006398', label: 'Out for Delivery' };
      case 'processing':
        return { bg: '#fff0eb', color: '#ea580c', label: 'Processing & Sterilizing' };
      case 'cancelled':
        return { bg: '#fef2f2', color: '#b91c1c', label: 'Cancelled' };
      default:
        return { bg: '#f8fafc', color: '#6e7977', label: 'Order Confirmed' };
    }
  }

  /**
   * Formats ISO timestamp to human-friendly Indian locale date.
   */
  static formatDate(isoString: string): string {
    if (!isoString) return '';
    try {
      return new Date(isoString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  }
}
