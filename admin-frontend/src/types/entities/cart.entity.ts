export type CartItemType = 'buy' | 'rent';

export interface BaseCartItem {
  id: string; // Unique cart line ID (e.g. `${productId}-${type}`)
  productId: string;
  name: string;
  slug: string;
  image: string;
  type: CartItemType;
  quantity: number;
}

export interface BuyCartItem extends BaseCartItem {
  type: 'buy';
  price: number;
  mrp: number;
}

export interface RentCartItem extends BaseCartItem {
  type: 'rent';
  dailyRate: number;
  rentalDays: number; // e.g. 7, 15, 30 days
  rentalDeposit: number; // Refundable security deposit per unit
  startDate?: string;
  endDate?: string;
}

export type CartItem = BuyCartItem | RentCartItem;

export interface CartPricingSummary {
  buySubtotal: number;
  rentSubtotal: number;
  refundableDepositTotal: number;
  itemCount: number;
  buyCount: number;
  rentCount: number;
  shippingFee: number;
  estimatedTax: number;
  totalPayableNow: number;
  refundableAmountPostRental: number;
}

export class CartEntity {
  /**
   * Adds an item to the cart or increments quantity if an identical item already exists.
   */
  static addItem(items: CartItem[], newItem: CartItem): CartItem[] {
    const existingIndex = items.findIndex((i) => i.id === newItem.id);

    if (existingIndex > -1) {
      const updated = [...items];
      const existing = updated[existingIndex];
      updated[existingIndex] = {
        ...existing,
        quantity: Math.min(existing.quantity + (newItem.quantity || 1), 10),
      } as CartItem;
      return updated;
    }

    return [...items, { ...newItem, quantity: Math.max(newItem.quantity || 1, 1) }];
  }

  /**
   * Removes an item by unique line ID.
   */
  static removeItem(items: CartItem[], lineId: string): CartItem[] {
    return items.filter((i) => i.id !== lineId);
  }

  /**
   * Updates item quantity with upper and lower bound guardrails.
   */
  static updateQuantity(items: CartItem[], lineId: string, quantity: number): CartItem[] {
    if (quantity <= 0) {
      return this.removeItem(items, lineId);
    }

    const boundedQuantity = Math.min(Math.max(quantity, 1), 10);
    return items.map((item) =>
      item.id === lineId ? ({ ...item, quantity: boundedQuantity } as CartItem) : item
    );
  }

  /**
   * Deconstructs mixed cart into Buy and Rent subsets and flags mixed cart status.
   */
  static getBreakdown(items: CartItem[]): {
    buyItems: BuyCartItem[];
    rentItems: RentCartItem[];
    isMixed: boolean;
  } {
    const buyItems = items.filter((i): i is BuyCartItem => i.type === 'buy');
    const rentItems = items.filter((i): i is RentCartItem => i.type === 'rent');
    return {
      buyItems,
      rentItems,
      isMixed: buyItems.length > 0 && rentItems.length > 0,
    };
  }
}
