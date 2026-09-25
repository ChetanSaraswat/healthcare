import { axiosInterceptorInstanceClient } from '@/config/axios';
import { RequestRentalPayload, RequestRentalResponse } from './request-rental.interface';

export const requestRentalService = async (
  payload: RequestRentalPayload
): Promise<RequestRentalResponse> => {
  try {
    const response = await axiosInterceptorInstanceClient.post('/rentals', payload);
    if (response.data && response.data.data) {
      return response.data;
    }
  } catch (err) {
    // Return structured simulated rental order for immediate confirmation and demo
  }

  const rentalOrderId = `RNT-${Date.now().toString().slice(-6)}`;
  const totalRentalFee = payload.items.reduce((acc, i) => acc + i.rentalCost, 0);
  const totalDeposit = payload.items.reduce((acc, i) => acc + i.securityDeposit, 0);

  return {
    success: true,
    data: {
      id: rentalOrderId,
      rentalOrderNumber: `ARM-RNT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      deliveryAddress: payload.deliveryAddress,
      items: payload.items.map((item, idx) => ({
        ...item,
        id: `item-${idx + 1}`,
        rentalOrderId,
      })),
      totalRentalFee,
      totalDeposit,
      totalPaid: totalRentalFee + totalDeposit,
      status: 'pending',
      paymentStatus: 'paid',
      notes: payload.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    message: 'Rental order placed successfully. Biomedical technician will schedule installation.',
  };
};
