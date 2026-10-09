'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  removeFromCart,
  updateQuantity,
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
  const [isMounted, setIsMounted] = useState(false);
  const { items, pricing } = useAppSelector((state) => state.cart);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Hydration state / skeleton loader prevents hydration mismatch and empty cart blink
  if (!isMounted) {
    return (
      <div className={styles.cartContainer} style={{ padding: '3.5rem 1.5rem', minHeight: '60vh' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div
            style={{
              height: 36,
              width: 320,
              background: '#e2e8f0',
              borderRadius: 8,
              marginBottom: 28,
              animation: 'pulse 1.5s infinite',
            }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 1fr)', gap: 32 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    height: 180,
                    background: '#ffffff',
                    borderRadius: 16,
                    border: '1px solid #e2e8f0',
                    padding: '1.5rem',
                    display: 'flex',
                    gap: 20,
                  }}
                >
                  <div style={{ width: 120, height: 120, background: '#f1f5f9', borderRadius: 12 }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ height: 22, width: '70%', background: '#f1f5f9', borderRadius: 6 }} />
                    <div style={{ height: 18, width: '40%', background: '#f1f5f9', borderRadius: 6 }} />
                    <div style={{ height: 32, width: '50%', background: '#f1f5f9', borderRadius: 6, marginTop: 'auto' }} />
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                height: 380,
                background: '#ffffff',
                borderRadius: 20,
                border: '1px solid #e2e8f0',
                padding: '2rem',
              }}
            />
          </div>
        </div>
      </div>
    );
  }

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
            color: '#16453A',
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
            background: '#16453A',
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
                  <ShoppingBag size={20} color="#16453A" />
                  <span>{t.cart.purchaseSection}</span>
                </h3>
                <span className={styles.badge}>{buyItems.length} {t.cart.brandNew}</span>
              </div>

              <div className={styles.itemsList}>
                {buyItems.map((item) => (
                  <div key={item.id} className={styles.cartCard}>
                    <div className={styles.thumbBox}>
                      <img src={item.image || '/images/oxygen_concentrator.png'} alt={item.name} />
                    </div>

                    <div className={styles.cardDetails}>
                      <Link href={`/product/${item.slug}`} className={styles.itemTitle}>
                        {item.name}
                      </Link>
                      <span className={`${styles.itemTypeTag} ${styles.buyTag}`}>
                        {locale === 'hi' ? 'उपकरण खरीद • ओईएम वारंटी शामिल' : 'Buy Outright • OEM Warranty Included'}
                      </span>

                      <div className={styles.cardBottom}>
                        {/* Quantity Controls - disabled minus button when qty === 1 */}
                        <div className={styles.qtyBox}>
                          <button
                            type="button"
                            disabled={item.quantity <= 1}
                            onClick={() => {
                              if (item.quantity > 1) {
                                dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }));
                              }
                            }}
                            style={{
                              opacity: item.quantity <= 1 ? 0.35 : 1,
                              cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                            }}
                            title={item.quantity <= 1 ? 'Cannot decrease below 1 (use Remove Item)' : 'Decrease quantity'}
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() =>
                              dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))
                            }
                            aria-label="Increase quantity"
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
                                brand: 'Omkar Healthcare Certified',
                                buyPrice: item.price,
                                rentAvailable: false,
                                preferredIntent: 'buy',
                                addedAt: new Date().toISOString(),
                              })
                            );
                            dispatch(removeFromCart(item.id));
                          }}
                          style={{ color: '#16453A' }}
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
                  <RefreshCw size={20} color="#B75932" />
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
                        <img src={item.image || '/images/oxygen_concentrator.png'} alt={item.name} />
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

                        {/* Requested Rental Duration */}
                        <div className={styles.requestedDurationBox}>
                          <span className={styles.requestedDurationLabel}>
                            {locale === 'hi' ? 'अनुरोधित अवधि:' : 'Requested Days:'}
                          </span>
                          <span className={styles.requestedDurationBadge}>
                            {item.rentalDays} {locale === 'hi' ? 'दिन' : item.rentalDays === 1 ? 'Day' : 'Days'}
                          </span>
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
                          {/* Quantity Controls - disabled minus button when qty === 1 */}
                          <div className={styles.qtyBox}>
                            <button
                              type="button"
                              disabled={item.quantity <= 1}
                              onClick={() => {
                                if (item.quantity > 1) {
                                  dispatch(
                                    updateQuantity({ id: item.id, quantity: item.quantity - 1 })
                                  );
                                }
                              }}
                              style={{
                                opacity: item.quantity <= 1 ? 0.35 : 1,
                                cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                              }}
                              title={item.quantity <= 1 ? 'Cannot decrease below 1 (use Remove Item)' : 'Decrease quantity'}
                              aria-label="Decrease rental quantity"
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
                              aria-label="Increase rental quantity"
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
                                  brand: 'Omkar Healthcare Certified',
                                  buyPrice: item.dailyRate * 30,
                                  rentDailyRate: item.dailyRate,
                                  rentAvailable: true,
                                  preferredIntent: 'rent',
                                  addedAt: new Date().toISOString(),
                                })
                              );
                              dispatch(removeFromCart(item.id));
                            }}
                            style={{ color: '#16453A' }}
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
              <strong style={{ color: '#16453A' }}>
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
                <ShieldCheck size={16} color="#16453A" />
                <span>{t.common.certifiedBadge}</span>
              </div>
              <div className={styles.badgeItem}>
                <Truck size={16} color="#16453A" />
                <span>{t.common.dispatchPill}</span>
              </div>
              <div className={styles.badgeItem}>
                <RotateCcw size={16} color="#16453A" />
                <span>{t.common.depositGuarantee}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
