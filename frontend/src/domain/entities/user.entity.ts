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

export type UserRole =
  | 'customer'
  | 'super_admin'
  | 'catalog_editor'
  | 'operations_staff'
  | 'content_editor';

export type StaffRole = 'super_admin' | 'catalog_editor' | 'operations_staff' | 'content_editor';

export type StaffPermission =
  | 'manage_staff'
  | 'manage_products'
  | 'manage_categories'
  | 'manage_orders'
  | 'manage_rentals'
  | 'manage_conditions'
  | 'view_customers';

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

export interface StaffMember {
  id: string;
  uuid: string;
  name: string;
  email: string;
  phone?: string;
  role: StaffRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
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

export interface RoleConfig {
  role: StaffRole;
  label: string;
  description: string;
  badgeBg: string;
  badgeColor: string;
  permissions: StaffPermission[];
}

export class RBACMatrix {
  static readonly ROLES: Record<StaffRole, RoleConfig> = {
    super_admin: {
      role: 'super_admin',
      label: 'Super Admin',
      description: 'Unrestricted master access to all platform systems, RBAC, clinical data, and audit records.',
      badgeBg: '#fef3f2',
      badgeColor: '#b42318',
      permissions: [
        'manage_staff',
        'manage_products',
        'manage_categories',
        'manage_orders',
        'manage_rentals',
        'manage_conditions',
        'view_customers',
      ],
    },
    catalog_editor: {
      role: 'catalog_editor',
      label: 'Catalog & Inventory Editor',
      description: 'Manages biomedical equipment catalog, bilingual specifications, and category taxonomy.',
      badgeBg: '#f0fdf4',
      badgeColor: '#166534',
      permissions: ['manage_products', 'manage_categories'],
    },
    operations_staff: {
      role: 'operations_staff',
      label: 'Clinical Operations Staff',
      description: 'Coordinates rental equipment deployments, returns, outright orders, and patient care records.',
      badgeBg: '#eff8ff',
      badgeColor: '#175cd3',
      permissions: ['manage_orders', 'manage_rentals', 'view_customers'],
    },
    content_editor: {
      role: 'content_editor',
      label: 'Clinical Content Editor',
      description: 'Authors and updates bilingual Condition Guides, clinical health effects, and medical blogs.',
      badgeBg: '#faf5ff',
      badgeColor: '#6941c6',
      permissions: ['manage_conditions'],
    },
  };

  static readonly ALL_PERMISSIONS: { key: StaffPermission; label: string; module: string }[] = [
    { key: 'manage_staff', label: 'Access Control & Staff Management', module: 'Admin Settings' },
    { key: 'manage_products', label: 'Biomedical Product Catalog', module: 'Catalog' },
    { key: 'manage_categories', label: 'Category Taxonomy Hierarchy', module: 'Catalog' },
    { key: 'manage_orders', label: 'Purchase Orders & Invoices', module: 'Fulfillment' },
    { key: 'manage_rentals', label: 'Rental Contracts & Deposits', module: 'Fulfillment' },
    { key: 'manage_conditions', label: 'Condition Guides & CMS', module: 'Clinical Education' },
    { key: 'view_customers', label: 'Patient Directory & Care History', module: 'Patient Care' },
  ];

  static hasPermission(role: StaffRole, permission: StaffPermission): boolean {
    const config = this.ROLES[role];
    return config ? config.permissions.includes(permission) : false;
  }

  static getRoleConfig(role: StaffRole): RoleConfig {
    return this.ROLES[role] || this.ROLES.operations_staff;
  }
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
