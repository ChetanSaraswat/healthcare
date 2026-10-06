/**
 * Pure TypeScript Domain Entity: Wishlist
 * In accordance with DDD principles: Zero framework or UI dependencies.
 */

export interface WishlistItem {
  productId: string;
  title: string;
  slug: string;
  image: string;
  brand: string;
  categoryName?: string;
  buyPrice: number;
  rentDailyRate?: number;
  rentAvailable: boolean;
  preferredIntent: 'buy' | 'rent';
  addedAt: string;
}

export class WishlistEntity {
  /**
   * Adds an item to the wishlist if it does not already exist.
   * If it exists, updates the preferredIntent and addedAt timestamp.
   */
  public static addItem(currentList: WishlistItem[], newItem: WishlistItem): WishlistItem[] {
    const existingIndex = currentList.findIndex((item) => item.productId === newItem.productId);
    if (existingIndex >= 0) {
      const updated = [...currentList];
      updated[existingIndex] = {
        ...updated[existingIndex],
        preferredIntent: newItem.preferredIntent,
        addedAt: new Date().toISOString(),
      };
      return updated;
    }
    return [
      {
        ...newItem,
        addedAt: newItem.addedAt || new Date().toISOString(),
      },
      ...currentList,
    ];
  }

  /**
   * Removes an item from the wishlist by productId.
   */
  public static removeItem(currentList: WishlistItem[], productId: string): WishlistItem[] {
    return currentList.filter((item) => item.productId !== productId);
  }

  /**
   * Checks whether a given productId is present in the wishlist.
   */
  public static isInWishlist(currentList: WishlistItem[], productId: string): boolean {
    return currentList.some((item) => item.productId === productId);
  }

  /**
   * Formats display price according to the preferred intent.
   */
  public static formatDisplayPrice(item: WishlistItem): string {
    if (item.preferredIntent === 'rent' && item.rentAvailable && item.rentDailyRate) {
      return `₹${item.rentDailyRate.toLocaleString('en-IN')}/day (Rent)`;
    }
    return `₹${item.buyPrice.toLocaleString('en-IN')} (Buy)`;
  }
}
