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

  const handleExploreRentalPlans = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/product/${product.slug}?mode=rent`);
  };

  const discountPercent =
    product.mrp && product.mrp > product.buyPrice
      ? Math.round(((product.mrp - product.buyPrice) / product.mrp) * 100)
      : 0;

  const hasRealRating = Boolean(product.rating && product.reviewsCount && product.reviewsCount > 0);

  const imageSrc = product.primaryImage || product.images?.[0] || '/images/oxygen_concentrator.png';

  return (
    <div className={styles.card}>
      <Link href={`/product/${product.slug}`} className={styles.imageBox}>
        {imageSrc ? <img src={imageSrc} alt={localized.name} /> : null}
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

        {/* Real Rating Only - Empty State if no genuine reviews exist */}
        <div className={styles.ratingRow}>
          {hasRealRating ? (
            <>
              <div className={styles.stars}>
                <Star size={14} fill="#ea580c" />
              </div>
              <span className={styles.score}>{product.rating}</span>
              <span>({product.reviewsCount} {locale === 'hi' ? 'समीक्षाएं' : 'reviews'})</span>
            </>
          ) : (
            <span style={{ color: '#005c55', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <ShieldCheck size={13} /> {locale === 'hi' ? 'चिकित्सकीय रूप से सत्यापित' : 'AarogyaMed Verified'}
            </span>
          )}
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

        {/* Distinct Actions: Buy Outright vs Explore Rental Plans */}
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.buyBtn}
            onClick={handleQuickBuy}
            aria-label={`Buy ${localized.name} outright`}
            title={locale === 'hi' ? 'सीधे खरीदें' : 'Buy Outright'}
          >
            <ShoppingBag size={14} /> {locale === 'hi' ? 'सीधे खरीदें' : 'Buy Outright'}
          </button>
          <button
            type="button"
            className={styles.rentBtn}
            onClick={handleExploreRentalPlans}
            aria-label={`Explore rental plans for ${localized.name}`}
            title={locale === 'hi' ? 'रेंटल योजनाएं देखें' : 'Explore Rental Plans'}
          >
            <CalendarClock size={14} /> {locale === 'hi' ? 'रेंटल योजनाएं देखें' : 'Explore Rental Plans'}
          </button>
        </div>
      </div>
    </div>
  );
};
