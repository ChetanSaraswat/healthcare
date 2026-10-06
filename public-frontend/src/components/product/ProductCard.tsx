'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product, ProductEntity } from '@/domain/entities/product.entity';
import { useAppDispatch } from '@/store/hooks';
import { addToCart } from '@/features/cart/cart.slice';
import { useTranslation } from '@/locales';
import styles from './ProductCard.module.scss';
import { ShieldCheck, Star, ShoppingBag, CalendarClock } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t, locale } = useTranslation();
  const localized = ProductEntity.getLocalized(product, locale);

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      addToCart({
        id: `${product.id}-buy`,
        productId: product.id,
        name: localized.name,
        slug: product.slug,
        image: product.primaryImage,
        type: 'buy',
        quantity: 1,
        price: product.buyPrice,
        mrp: product.mrp,
      })
    );
    router.push('/cart');
  };

  const handleQuickRent = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      addToCart({
        id: `${product.id}-rent`,
        productId: product.id,
        name: localized.name,
        slug: product.slug,
        image: product.primaryImage,
        type: 'rent',
        quantity: 1,
        dailyRate: product.rentalDailyRate,
        rentalDays: product.rentalMinDays || 7,
        rentalDeposit: product.rentalSecurityDeposit,
      })
    );
    router.push('/cart');
  };

  const discountPercent =
    product.mrp && product.mrp > product.buyPrice
      ? Math.round(((product.mrp - product.buyPrice) / product.mrp) * 100)
      : 0;

  return (
    <div className={styles.card}>
      <Link href={`/product/${product.slug}`} className={styles.imageBox}>
        <img src={product.primaryImage} alt={localized.name} />
        <div className={styles.badgeStack}>
          {product.certifications && product.certifications[0] && (
            <span className={styles.certBadge}>
              <ShieldCheck size={12} /> {product.certifications[0]}
            </span>
          )}
          <span className={styles.sterilizedBadge}>
            {locale === 'hi' ? '10-चरणीय सैनिटाइज्ड' : '10-Step Sanitized'}
          </span>
        </div>
      </Link>

      <div className={styles.body}>
        <div className={styles.categoryTag}>{product.categoryName || 'Medical Equipment'}</div>
        <Link href={`/product/${product.slug}`} className={styles.title}>
          {localized.name}
        </Link>

        <div className={styles.ratingRow}>
          <div className={styles.stars}>
            <Star size={14} fill="#ea580c" />
          </div>
          <span className={styles.score}>{product.rating || 4.9}</span>
          <span>({product.reviewsCount || 85} {locale === 'hi' ? 'समीक्षाएं' : 'reviews'})</span>
        </div>

        {/* Dual Buy vs Rent Pricing Grid */}
        <div className={styles.pricingSplit}>
          <div className={styles.priceCol}>
            <span className={styles.label}>{t.product.buyOutright}</span>
            <span className={styles.amount}>₹{product.buyPrice.toLocaleString('en-IN')}</span>
            {discountPercent > 0 && (
              <span className={styles.mrpStrikethrough}>
                MRP ₹{product.mrp.toLocaleString('en-IN')} ({discountPercent}% off)
              </span>
            )}
          </div>

          <div className={styles.priceCol}>
            <span className={styles.label}>{t.product.rentFlexible}</span>
            <span className={styles.rentAmount}>₹{product.rentalDailyRate}/{t.product.day}</span>
            <span className={styles.subinfo}>
              {t.product.minDays} {product.rentalMinDays || 7} {t.product.days}
            </span>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.buyBtn}
            onClick={handleQuickBuy}
            aria-label={`Buy ${localized.name}`}
          >
            <ShoppingBag size={14} /> {t.product.buyNow}
          </button>
          <button
            type="button"
            className={styles.rentBtn}
            onClick={handleQuickRent}
            aria-label={`Rent ${localized.name}`}
          >
            <CalendarClock size={14} /> {t.product.rentNow}
          </button>
        </div>
      </div>
    </div>
  );
};

