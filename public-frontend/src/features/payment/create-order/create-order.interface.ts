export interface CreatePaymentOrderPayload {
  amount: number; // in INR
  currency?: string;
  orderId?: number;
  rentalOrderId?: number;
  idempotency_key?: string;
  notes?: Record<string, any>;
}

export interface CreatePaymentOrderResponse {
  success: boolean;
  data: {
    keyId: string;
    orderId: string;
    amount: number; // in paise
    amountInInr: number;
    currency: string;
    paymentRecordId: number;
    receipt: string;
    status?: string;
    alreadyCaptured?: boolean;
    isExisting?: boolean;
    idempotencyKey?: string;
  };
}
