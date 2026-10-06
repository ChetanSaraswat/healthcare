/**
 * Pure TypeScript Domain Entity: Invoice
 * In accordance with DDD principles: Zero framework or UI dependencies.
 */

export interface TaxBreakdown {
  taxableAmount: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalTax: number;
  grandTotal: number;
}

export interface InvoiceItem {
  id: string;
  description: string;
  hsnSacCode: string;
  quantity: number;
  unitPrice: number;
  taxableValue: number;
  cgstAmount: number;
  sgstAmount: number;
  totalAmount: number;
}

export class InvoiceEntity {
  public static readonly GSTIN = '29AABCA9876C1Z4';
  public static readonly PAN = 'AABCA9876C';
  public static readonly CDSCO_LICENSE = 'CDSCO/MD/2026/DL-44821-CL';
  public static readonly ISO_CERTIFICATION = 'ISO 13485:2016 Certified Facility';

  /**
   * Calculates GST breakdown. Standard medical devices & rentals in India attract 12% GST:
   * CGST 6% + SGST 6% (Intra-state) OR IGST 12% (Inter-state).
   */
  public static calculateGst(subtotal: number, isInterstate = false): TaxBreakdown {
    // In India, subtotal is treated as base taxable amount for B2C medical invoices
    const taxableAmount = Math.round(subtotal);
    if (isInterstate) {
      const igstRate = 12;
      const igstAmount = Math.round((taxableAmount * igstRate) / 100);
      return {
        taxableAmount,
        cgstRate: 0,
        cgstAmount: 0,
        sgstRate: 0,
        sgstAmount: 0,
        igstRate,
        igstAmount,
        totalTax: igstAmount,
        grandTotal: taxableAmount + igstAmount,
      };
    } else {
      const cgstRate = 6;
      const sgstRate = 6;
      const cgstAmount = Math.round((taxableAmount * cgstRate) / 100);
      const sgstAmount = Math.round((taxableAmount * sgstRate) / 100);
      const totalTax = cgstAmount + sgstAmount;
      return {
        taxableAmount,
        cgstRate,
        cgstAmount,
        sgstRate,
        sgstAmount,
        igstRate: 0,
        igstAmount: 0,
        totalTax,
        grandTotal: taxableAmount + totalTax,
      };
    }
  }

  /**
   * Returns standard HSN or SAC code based on whether item is sale or rental.
   * HSN 9018: Instruments and appliances used in medical, surgical, dental or veterinary sciences.
   * SAC 9973: Leasing or rental services with or without operator concerning machinery and equipment.
   */
  public static getHsnSacCode(isRental = false): string {
    return isRental ? 'SAC 997312' : 'HSN 901890';
  }

  /**
   * Formats Indian Rupee currency.
   */
  public static formatCurrency(amount: number): string {
    return `₹${amount.toLocaleString('en-IN')}`;
  }

  /**
   * Generates a unique clinical tax invoice number.
   */
  public static generateInvoiceNumber(orderNumber: string, prefix = 'INV'): string {
    const clean = orderNumber.replace(/[^A-Za-z0-9]/g, '');
    return `${prefix}-2026-${clean.slice(-6)}`;
  }
}
