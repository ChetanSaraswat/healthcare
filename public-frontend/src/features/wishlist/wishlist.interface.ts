import { WishlistItem } from '@/domain/entities/wishlist.entity';

export interface WishlistState {
  items: WishlistItem[];
  lastUpdated: string | null;
}
