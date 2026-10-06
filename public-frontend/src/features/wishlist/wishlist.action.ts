import { WishlistItem } from '@/domain/entities/wishlist.entity';
import { addItem, removeItem, toggleItem, clearWishlist } from './wishlist.slice';

export const addToWishlistAction = (item: WishlistItem) => addItem(item);
export const removeFromWishlistAction = (productId: string) => removeItem(productId);
export const toggleWishlistAction = (item: WishlistItem) => toggleItem(item);
export const clearWishlistAction = () => clearWishlist();
