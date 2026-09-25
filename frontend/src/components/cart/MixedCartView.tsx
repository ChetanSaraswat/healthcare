'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  removeFromCart,
  updateQuantity,
  updateRentalDuration,
} from '@/features/cart/cart.slice';
import { addItem } from '@/features/wishlist/wishlist.slice';
import { RentalPricingCalculator } from '@/domain/services/rental-pricing.calculator';
import { useTranslation } from '@/locales';
import styles from './MixedCartView.module.scss';
import {
  ShoppingBag,
  RefreshCw,
  Trash2,
  ShieldCheck,
  Truck,
  RotateCcw,
  ArrowRight,
  Info,
  Heart,
} from 'lucide-react';

export const MixedCartView: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t, locale } = useTranslation();
  const { items, pricing } = useAppSelector((state) => state.cart);

  const buyItems = items.filter((item) => item.type === 'buy');
  const rentItems = items.filter((item) => item.type === 'rent');

  if (items.length === 0) {
    return (
      <div className={styles.cartContainer} style={{ textAlign: 'center', padding: '5rem 1.5rem' }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: '#eaedff',
            color: '#005c55',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <ShoppingBag size={36} />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#131b2e', marginBottom: '0.75rem' }}>
          {t.cart.emptyCartTitle}
        </h2>
        <p style={{ color: '#6e7977', maxWidth: 500, margin: '0 auto 2rem', lineHeight: 1.5 }}>
          {t.cart.emptyCartSubtitle}
        </p>
        <Link
          href="/shop"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#005c55',
            color: '#ffffff',
            padding: '12px 28px',
            borderRadius: 9999,
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          {t.cart.browseCatalog} <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.cartContainer}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#131b2e', marginBottom: '1.5rem' }}>
        {t.cart.cartTitle} ({items.length} {locale === 'hi' ? 'उपकरण' : items.length === 1 ? 'equipment' : 'equipment items'})
      </h1>

      <div className={styles.cartGrid}>
        {/* Left Column: Mixed Items List */}
        <div>
          {/* 1. Equipment for Purchase Section */}
          {buyItems.length > 0 && (
            <div>
              <div className={styles.sectionHeader}>
                <h3>
                  <ShoppingBag size={20} color="#005c55" />
                  <span>{t.cart.purchaseSection}</span>
                </h3>
                <span className={styles.badge}>{buyItems.length} {t.cart.brandNew}</span>
              </div>

              <div className={styles.itemsList}>
                {buyItems.map((item) => (
                  <div key={item.id} className={styles.cartCard}>
                    <div className={styles.thumbBox}>
                      <img src={item.image} alt={item.name} />
                    </div>

                    <div className={styles.cardDetails}>
                      <Link href={`/product/${item.slug}`} className={styles.itemTitle}>
                        {item.name}
                      </Link>
                      <span className={`${styles.itemTypeTag} ${styles.buyTag}`}>
                        {locale === 'hi' ? 'उपकरण खरीद • ओईएम वारंटी शामिल' : 'Buy Outright • OEM Warranty Included'}
                      </span>

                      <div className={styles.cardBottom}>
                        <div className={styles.qtyBox}>
                          <button
                            type="button"
                            onClick={() =>
                              dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))
                            }
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() =>
                              dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))
                            }
                          >
                            +
                          </button>
                        </div>

                        <div className={styles.priceDisplay}>
                          <div className={styles.mainPrice}>
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </div>
                          <div className={styles.breakdown}>
                            ₹{item.price.toLocaleString('en-IN')} {locale === 'hi' ? 'प्रति' : 'each'}
                          </div>
                        </div>

                        <button
                          type="button"
                          className={styles.removeBtn}
                          onClick={() => {
                            dispatch(
                              addItem({
                                productId: item.id,
                                title: item.name,
                                slug: item.slug,
                                image: item.image,
                                brand: 'AarogyaMed Certified',
                                buyPrice: item.price,
                                rentAvailable: false,
                                preferredIntent: 'buy',
                                addedAt: new Date().toISOString(),
                              })
                            );
                            dispatch(removeFromCart(item.id));
                          }}
                          style={{ color: '#005c55' }}
                          title={locale === 'hi' ? 'इच्छासूची में ले जाएं' : 'Save for Later'}
                        >
                          <Heart size={14} /> {locale === 'hi' ? 'सहेजें' : 'Save for Later'}
                        </button>

                        <button
                          type="button"
                          className={styles.removeBtn}
                          onClick={() => dispatch(removeFromCart(item.id))}
                        >
                          <Trash2 size={14} /> {t.cart.remove}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Equipment for Rental Section */}
          {rentItems.length > 0 && (
            <div>
              <div className={styles.sectionHeader}>
                <h3>
                  <RefreshCw size={20} color="#ea580c" />
                  <span>{t.cart.rentalSection}</span>
                </h3>
                <span className={styles.rentBadge}>{rentItems.length} {t.cart.hospitalSanitized}</span>
              </div>

              <div className={styles.itemsList}>
                {rentItems.map((item) => {
                  const rentalCalc = RentalPricingCalculator.calculate({
                    dailyRate: item.dailyRate,
                    durationDays: item.rentalDays,
                    depositPerUnit: item.rentalDeposit,
                    quantity: item.quantity,
                  });

                  return (
                    <div key={item.id} className={styles.cartCard}>
                      <div className={styles.thumbBox}>
                        <img src={item.image} alt={item.name} />
                      </div>

                      <div className={styles.cardDetails}>
                        <Link href={`/product/${item.slug}`} className={styles.itemTitle}>
                          {item.name}
                        </Link>
                        <span className={`${styles.itemTypeTag} ${styles.rentTag}`}>
                          {locale === 'hi'
                            ? 'रेंटल • 10-चरणीय ऑटोक्लेव व यूवी-सी रोगाणुरहित'
                            : 'Rental • 10-Step Autoclave & UV-C Sanitized'}
                        </span>

                        {/* Rental Duration Selector */}
                        <div className={styles.durationSelector}>
                          <span className={styles.durationLabel}>{t.product.rentalPeriod}</span>
                          {[7, 15, 30].map((days) => (
                            <button
                              key={days}
                              type="button"
                              className={`${styles.durationPill} ${
                                item.rentalDays === days ? styles.activeDuration : ''
                              }`}
                              onClick={() =>
                                dispatch(
                                  updateRentalDuration({ id: item.id, durationDays: days })
                                )
                              }
                            >
                              {days} {t.product.days} {days === 30 ? (locale === 'hi' ? '(28% छूट)' : '(28% Off)') : ''}
                            </button>
                          ))}
                        </div>

                        {/* Deposit Callout */}
                        <div className={styles.depositNotice}>
                          <Info size={14} />
                          <span>
                            {locale === 'hi'
                              ? `इसमें ₹${(item.rentalDeposit * item.quantity).toLocaleString('en-IN')} वापसी योग्य सुरक्षा जमा शामिल है (पिकअप पर 100% वापस)`
                              : `Includes ₹${(item.rentalDeposit * item.quantity).toLocaleString('en-IN')} refundable security deposit (100% returned on pickup)`}
                          </span>
                        </div>

                        <div className={styles.cardBottom}>
                          <div className={styles.qtyBox}>
                            <button
                              type="button"
                              onClick={() =>
                                dispatch(
                                  updateQuantity({ id: item.id, quantity: item.quantity - 1 })
                                )
                              }
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() =>
                                dispatch(
                                  updateQuantity({ id: item.id, quantity: item.quantity + 1 })
                                )
                              }
                            >
                              +
                            </button>
                          </div>

                          <div className={styles.priceDisplay}>
                            <div className={styles.mainPrice}>
                              ₹{rentalCalc.rentalFee.toLocaleString('en-IN')}
                            </div>
                            <div className={styles.breakdown}>
                              ₹{rentalCalc.effectiveDailyRate}/{t.product.day}{' '}
                              {locale === 'hi' ? `${item.rentalDays} दिनों के लिए` : `for ${item.rentalDays} days`}
                            </div>
                          </div>

                          <button
                            type="button"
                            className={styles.removeBtn}
                            onClick={() => {
                              dispatch(
                                addItem({
                                  productId: item.id,
                                  title: item.name,
                                  slug: item.slug,
                                  image: item.image,
                                  brand: 'AarogyaMed Certified',
                                  buyPrice: item.dailyRate * 30,
                                  rentDailyRate: item.dailyRate,
                                  rentAvailable: true,
                                  preferredIntent: 'rent',
                                  addedAt: new Date().toISOString(),
                                })
                              );
                              dispatch(removeFromCart(item.id));
                            }}
                            style={{ color: '#005c55' }}
                            title={locale === 'hi' ? 'इच्छासूची में ले जाएं' : 'Save for Later'}
                          >
                            <Heart size={14} /> {locale === 'hi' ? 'सहेजें' : 'Save for Later'}
                          </button>

                          <button
                            type="button"
                            className={styles.removeBtn}
                            onClick={() => dispatch(removeFromCart(item.id))}
                          >
                            <Trash2 size={14} /> {t.cart.remove}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Unified Pricing & Deposit Breakdown */}
        <div>
          <div className={styles.summaryCard}>
            <h3>{t.cart.summaryTitle}</h3>

            {pricing.buySubtotal > 0 && (
              <div className={styles.summaryRow}>
                <span>{t.cart.purchaseSubtotal}</span>
                <strong>₹{pricing.buySubtotal.toLocaleString('en-IN')}</strong>
              </div>
            )}

            {pricing.rentSubtotal > 0 && (
              <div className={styles.summaryRow}>
                <span>{t.cart.rentalCharges}</span>
                <strong>₹{pricing.rentSubtotal.toLocaleString('en-IN')}</strong>
              </div>
            )}

            {pricing.refundableDepositTotal > 0 && (
              <div className={`${styles.summaryRow} ${styles.depositHighlight}`}>
                <span>{t.cart.securityDeposit}</span>
                <strong>+ ₹{pricing.refundableDepositTotal.toLocaleString('en-IN')}</strong>
              </div>
            )}

            <div className={styles.summaryRow}>
              <span>{t.cart.setupFee}</span>
              <strong style={{ color: '#005c55' }}>
                {pricing.shippingFee === 0 ? t.cart.freeDelivery : `₹${pricing.shippingFee}`}
              </strong>
            </div>

            <div className={styles.summaryRow}>
              <span>{t.cart.gstIncluded}</span>
              <span>₹{pricing.estimatedTax.toLocaleString('en-IN')}</span>
            </div>

            <div className={styles.divider} />

            <div className={styles.totalRow}>
              <div>
                <div className={styles.totalLabel}>{t.cart.totalPayable}</div>
                <div style={{ fontSize: '0.75rem', color: '#6e7977' }}>
                  {t.cart.totalPayableSub}
                </div>
              </div>
              <div className={styles.totalAmount}>
                ₹{pricing.totalPayableNow.toLocaleString('en-IN')}
              </div>
            </div>

            {pricing.refundableDepositTotal > 0 && (
              <div className={styles.refundNotice}>
                <strong>* {locale === 'hi' ? 'रिफंड गारंटी:' : 'Refund Guarantee:'}</strong> ₹
                {pricing.refundableDepositTotal.toLocaleString('en-IN')}{' '}
                {locale === 'hi'
                  ? 'उपकरण वापसी निरीक्षण के 24 घंटे के भीतर सीधे आपके बैंक खाते में जमा कर दी जाएगी।'
                  : 'will be credited back to your bank account within 24 hours of equipment return inspection.'}
              </div>
            )}

            <button
              type="button"
              className={styles.checkoutBtn}
              onClick={() => router.push('/checkout')}
            >
              <span>{t.cart.checkoutBtn}</span>
              <ArrowRight size={18} />
            </button>

            <div className={styles.guaranteeBadges}>
              <div className={styles.badgeItem}>
                <ShieldCheck size={16} color="#005c55" />
                <span>{t.common.certifiedBadge}</span>
              </div>
              <div className={styles.badgeItem}>
                <Truck size={16} color="#005c55" />
                <span>{t.common.dispatchPill}</span>
              </div>
              <div className={styles.badgeItem}>
                <RotateCcw size={16} color="#005c55" />
                <span>{t.common.depositGuarantee}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
