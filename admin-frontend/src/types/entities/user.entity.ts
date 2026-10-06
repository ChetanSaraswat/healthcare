import { Order } from './order.entity';
import { RentalOrder } from './rental.entity';

export interface Address {
  id: string;
  uuid?: string;
  userId?: string;
  label: string; // 'Home' | 'Clinic' | 'Elderly Care' | 'Hospital'
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type UserRole = 'customer' | 'super_admin';

export interface User {
  id: string;
  uuid: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  addresses?: Address[];
  createdAt: string;
}

export interface CustomerSummary extends User {
  totalOrdersCount: number;
  totalRentalsCount: number;
  totalSpend: number;
  lastActive: string;
  primaryCity?: string;
}

export interface CustomerCareHistory extends CustomerSummary {
  orders: Order[];
  rentals: RentalOrder[];
}


export class AddressEntity {
  /**
   * Validates standard 6-digit Indian PIN codes.
   */
  static validateIndianPincode(pincode: string): boolean {
    return /^[1-9][0-9]{5}$/.test(pincode.trim());
  }

  /**
   * Validates address fields according to Indian biomedical logistics requirements.
   */
  static validateAddress(address: Partial<Address>): {
    isValid: boolean;
    errors: Record<string, string>;
  } {
    const errors: Record<string, string> = {};

    if (!address.line1 || address.line1.trim().length < 5) {
      errors.line1 = 'Address line 1 must be at least 5 characters.';
    }

    if (!address.city || address.city.trim().length < 2) {
      errors.city = 'City name is required.';
    }

    if (!address.state || address.state.trim().length < 2) {
      errors.state = 'State name is required.';
    }

    if (!address.pincode || !this.validateIndianPincode(address.pincode)) {
      errors.pincode = 'Please enter a valid 6-digit Indian PIN code.';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Formats address as a single descriptive line for order summaries.
   */
  static formatSingleLine(address: Address): string {
    const parts = [
      address.line1,
      address.line2,
      address.city,
      `${address.state} - ${address.pincode}`,
    ].filter(Boolean);
    return parts.join(', ');
  }

  /**
   * Formats address into multi-line display suitable for shipping labels.
   */
  static formatMultiline(address: Address): string[] {
    const lines = [address.line1];
    if (address.line2) {
      lines.push(address.line2);
    }
    lines.push(`${address.city}, ${address.state} - ${address.pincode}`);
    return lines;
  }
}

export class UserEntity {
  /**
   * Extracts initials for patient/caregiver avatar display.
   */
  static getInitials(name: string): string {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  /**
   * Finds the user's default delivery address, or falls back to the first available.
   */
  static getDefaultAddress(addresses: Address[]): Address | undefined {
    if (!addresses || addresses.length === 0) return undefined;
    return addresses.find((a) => a.isDefault) || addresses[0];
  }

  /**
   * Sorts addresses placing default address first, followed by newest.
   */
  static sortAddresses(addresses: Address[]): Address[] {
    return [...addresses].sort((a, b) => {
      if (a.isDefault === b.isDefault) return 0;
      return a.isDefault ? -1 : 1;
    });
  }
}
