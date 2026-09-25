import { CartItem, CartPricingSummary } from '../entities/cart.entity';
import { RentalPricingCalculator } from './rental-pricing.calculator';

export class CartPricingCalculator {
  static readonly FREE_SHIPPING_THRESHOLD = 2000;
  static readonly STANDARD_SHIPPING_FEE = 150;

  static calculate(items: CartItem[]): CartPricingSummary {
    let buySubtotal = 0;
    let rentSubtotal = 0;
    let refundableDepositTotal = 0;
    let buyCount = 0;
    let rentCount = 0;

    for (const item of items) {
      if (item.type === 'buy') {
        buySubtotal += item.price * item.quantity;
        buyCount += item.quantity;
      } else if (item.type === 'rent') {
        const rentalCalc = RentalPricingCalculator.calculate({
          dailyRate: item.dailyRate,
          durationDays: item.rentalDays,
          depositPerUnit: item.rentalDeposit,
          quantity: item.quantity,
        });

        rentSubtotal += rentalCalc.rentalFee;
        refundableDepositTotal += rentalCalc.securityDeposit;
        rentCount += item.quantity;
      }
    }

    const equipmentCharges = buySubtotal + rentSubtotal;
    const shippingFee =
      items.length === 0 || equipmentCharges >= this.FREE_SHIPPING_THRESHOLD
        ? 0
        : this.STANDARD_SHIPPING_FEE;

    // Prices are inclusive of medical GST in India (12% standard medical devices)
    // We compute estimated tax breakdown for transparency
    const estimatedTax = Math.round(equipmentCharges * 0.12);

    const totalPayableNow = equipmentCharges + refundableDepositTotal + shippingFee;

    return {
      buySubtotal,
      rentSubtotal,
      refundableDepositTotal,
      itemCount: buyCount + rentCount,
      buyCount,
      rentCount,
      shippingFee,
      estimatedTax,
      totalPayableNow,
      refundableAmountPostRental: refundableDepositTotal,
    };
  }
}
