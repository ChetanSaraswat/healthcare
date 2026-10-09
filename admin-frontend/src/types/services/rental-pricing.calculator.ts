export interface RentalCalculationInput {
  dailyRate: number;
  durationDays: number;
  depositPerUnit: number;
  quantity?: number;
}

export interface RentalCalculationResult {
  durationDays: number;
  quantity: number;
  effectiveDailyRate: number;
  rentalFee: number;
  securityDeposit: number;
  totalPayableNow: number;
  refundableUponReturn: number;
  discountAppliedPercent: number;
}

export class RentalPricingCalculator {
  /**
   * Omkar Healthcare Progressive Tiered Rental Discounting:
   * 1-6 days: 0% discount
   * 7-14 days: 10% daily rate discount
   * 15-29 days: 18% daily rate discount
   * 30+ days: 28% daily rate discount (Long term patient recovery care)
   */
  static calculate(input: RentalCalculationInput): RentalCalculationResult {
    const qty = Math.max(1, input.quantity || 1);
    const days = Math.max(1, input.durationDays);
    const baseDailyRate = input.dailyRate;

    let discountPercent = 0;
    if (days >= 30) {
      discountPercent = 28;
    } else if (days >= 15) {
      discountPercent = 18;
    } else if (days >= 7) {
      discountPercent = 10;
    }

    const effectiveDailyRate = Math.round(baseDailyRate * (1 - discountPercent / 100));
    const rentalFee = effectiveDailyRate * days * qty;
    const securityDeposit = input.depositPerUnit * qty;
    const totalPayableNow = rentalFee + securityDeposit;

    return {
      durationDays: days,
      quantity: qty,
      effectiveDailyRate,
      rentalFee,
      securityDeposit,
      totalPayableNow,
      refundableUponReturn: securityDeposit,
      discountAppliedPercent: discountPercent,
    };
  }

  static getRecommendedTiers(dailyRate: number, deposit: number) {
    return [
      {
        days: 7,
        label: '1 Week',
        badge: 'Short Recovery',
        calc: this.calculate({ dailyRate, durationDays: 7, depositPerUnit: deposit }),
      },
      {
        days: 15,
        label: '15 Days',
        badge: 'Post-Operative',
        calc: this.calculate({ dailyRate, durationDays: 15, depositPerUnit: deposit }),
      },
      {
        days: 30,
        label: '1 Month',
        badge: 'Best Value (28% Off)',
        calc: this.calculate({ dailyRate, durationDays: 30, depositPerUnit: deposit }),
      },
    ];
  }
}
