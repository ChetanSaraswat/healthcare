/**
 * Domain Entity: Payment
 * Pure TypeScript domain model with zero framework dependencies.
 * Encapsulates financial transactions, clinical deposit separation, and gateway status.
 */

export type PaymentStatus = 'pending' | 'captured' | 'failed' | 'refunded';
export type PaymentGateway = 'razorpay' | 'cod';

export interface RazorpayVerificationPayload {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface PaymentBreakdown {
  buySubtotal: number;
  rentalFeeTotal: number;
  securityDepositTotal: number;
  totalPayable: number;
}

export interface Payment {
  id?: number;
  uuid?: string;
  userId?: number;
  orderId?: number | null;
  rentalOrderId?: number | null;
  gateway: PaymentGateway;
  gatewayOrderId?: string | null;
  gatewayPaymentId?: string | null;
  gatewaySignature?: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod?: string | null;
  notes?: Record<string, any> | null;
  createdAt?: string;
  updatedAt?: string;
}

export class PaymentCalculator {
  /**
   * Computes clinical payment breakdown separating buy items, rental fees, and refundable deposits
   */
  public static calculateBreakdown(
    buyItems: Array<{ price: number; quantity: number }>,
    rentItems: Array<{ dailyRate: number; rentalDays: number; rentalDeposit: number; quantity: number }>
  ): PaymentBreakdown {
    const buySubtotal = buyItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const rentalFeeTotal = rentItems.reduce(
      (acc, item) => acc + item.dailyRate * item.rentalDays * item.quantity,
      0
    );

    const securityDepositTotal = rentItems.reduce(
      (acc, item) => acc + item.rentalDeposit * item.quantity,
      0
    );

    const totalPayable = buySubtotal + rentalFeeTotal + securityDepositTotal;

    return {
      buySubtotal,
      rentalFeeTotal,
      securityDepositTotal,
      totalPayable,
    };
  }

  /**
   * Converts INR amount to paise (integer) required by Razorpay gateway
   */
  public static toPaise(amountInInr: number): number {
    return Math.round(amountInInr * 100);
  }

  /**
   * Converts paise to INR amount
   */
  public static toInr(amountInPaise: number): number {
    return amountInPaise / 100;
  }
}
