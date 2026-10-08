export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  order_id?: number | string;
  rental_order_id?: number | string;
  payment_method?: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  data: {
    success: boolean;
    paymentId: string;
    orderId?: number | null;
    rentalOrderId?: number | null;
    status: 'captured' | 'pending' | 'failed';
    message?: string;
  };
}
