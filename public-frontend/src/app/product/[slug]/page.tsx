'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, notFound } from 'next/navigation';
import { getProduct } from '@/features/products/get-product/get-product.action';
import { ProductEntity } from '@/domain/entities/product.entity';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart } from '@/features/cart/cart.slice';
import { toggleItem } from '@/features/wishlist/wishlist.slice';
import { WishlistEntity } from '@/domain/entities/wishlist.entity';
import { BuyRentToggle } from '@/components/product/BuyRentToggle';
import { SpecTable } from '@/components/product/SpecTable';
import { PincodeChecker } from '@/components/product/PincodeChecker';
import { RentalPricingCalculator } from '@/domain/services/rental-pricing.calculator';
import { ProductReviews } from '@/components/product/ProductReviews';
import { useTranslation } from '@/locales';
import {
  ShieldCheck,
  Star,
  Truck,
  RotateCcw,
  CheckCircle2,
  CalendarClock,
  ShoppingBag,
  PhoneCall,
  ChevronRight,
  Info,
  Clock,
  Heart,
  AlertCircle,
} from 'lucide-react';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { t, locale } = useTranslation();

  const reduxProducts = useAppSelector((state) => state.products.products);
  const selectedProduct = useAppSelector((state) => state.products.selectedProduct);
  const productsLoading = useAppSelector((state) => state.products.loading);

  const product =
    reduxProducts.find(
      (p) => p.slug === resolvedParams.slug || p.id === resolvedParams.slug
    ) ||
    (selectedProduct &&
    (selectedProduct.slug === resolvedParams.slug || selectedProduct.id === resolvedParams.slug)
      ? selectedProduct
      : null);

  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  useEffect(() => {
    if (!product && !hasAttemptedFetch && !productsLoading) {
      setHasAttemptedFetch(true);
      dispatch(getProduct(resolvedParams.slug));
    }
  }, [product, hasAttemptedFetch, productsLoading, dispatch, resolvedParams.slug]);

  const initialMode = searchParams.get('mode') === 'rent' ? 'rent' : 'buy';
  const [activeMode, setActiveMode] = useState<'buy' | 'rent'>(initialMode);
  const [quantity, setQuantity] = useState(1);
  const [rentalDays, setRentalDays] = useState(7);
  const [selectedImage, setSelectedImage] = useState('');
  const [inputValue, setInputValue] = useState<string>('7');

  useEffect(() => {
    if (product) {
      const initialImg = product.primaryImage || product.images?.[0] || '/images/oxygen_concentrator.png';
      setSelectedImage(initialImg);
      const minDays = product.rentalMinDays || 1;
      setRentalDays(minDays);
      setInputValue(String(minDays));
    }
  }, [product?.id, product?.primaryImage]);

  useEffect(() => {
    const requested = searchParams.get('mode');
    if (requested === 'rent' || requested === 'buy') {
      setActiveMode(requested);
    }
  }, [searchParams]);

  const isWishlisted = useAppSelector((state) =>
    product ? WishlistEntity.isInWishlist(state.wishlist?.items || [], product.id) : false
  );



  if (productsLoading || (!product && !hasAttemptedFetch)) {
    return (
      <div style={{ maxWidth: 1280, margin: '2rem auto 5rem', padding: '0 1.5rem' }}>
        <div style={{ height: 20, width: 220, background: '#e0e5eb', borderRadius: 4, marginBottom: '2rem' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '3rem' }}>
          <div style={{ height: 440, background: '#f2f3ff', borderRadius: 20 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ height: 32, width: '80%', background: '#e0e5eb', borderRadius: 6 }} />
            <div style={{ height: 20, width: '40%', background: '#e0e5eb', borderRadius: 4 }} />
            <div style={{ height: 120, background: '#edf0f5', borderRadius: 16 }} />
            <div style={{ height: 50, background: '#005c55', opacity: 0.3, borderRadius: 9999 }} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ maxWidth: 800, margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#ffdad6', color: '#ba1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <AlertCircle size={32} />
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#131b2e', marginBottom: '0.75rem' }}>
          {locale === 'hi' ? 'चिकित्सा उपकरण नहीं मिला' : 'Medical Equipment Not Found'}
        </h1>
        <p style={{ color: '#6e7977', fontSize: '1rem', marginBottom: '2rem' }}>
          {locale === 'hi'
            ? 'अनुरोधित उत्पाद डेटाबेस में उपलब्ध नहीं है या हटा दिया गया है।'
            : 'The requested equipment record does not exist in our active clinical catalog.'}
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
          <ShoppingBag size={18} />
          <span>{locale === 'hi' ? 'कैटलॉग पर वापस जाएं' : 'Back to Equipment Catalog'}</span>
        </Link>
      </div>
    );
  }

  const localized = ProductEntity.getLocalized(product, locale);

  const rentalCalculation = RentalPricingCalculator.calculate({
    dailyRate: product.rentalDailyRate,
    durationDays: rentalDays,
    depositPerUnit: product.rentalSecurityDeposit,
    quantity,
  });

  const discountPercent =
    product.mrp && product.mrp > product.buyPrice
      ? Math.round(((product.mrp - product.buyPrice) / product.mrp) * 100)
      : 0;

  const handleAddToCart = () => {
    if (!product) return;
    if (activeMode === 'buy') {
      dispatch(
        addToCart({
          id: `${product.id}-buy`,
          productId: product.id,
          name: localized.name,
          slug: product.slug,
          image: product.primaryImage,
          type: 'buy',
          quantity,
          price: product.buyPrice,
          mrp: product.mrp,
        })
      );
    } else {
      dispatch(
        addToCart({
          id: `${product.id}-rent`,
          productId: product.id,
          name: localized.name,
          slug: product.slug,
          image: product.primaryImage,
          type: 'rent',
          quantity,
          dailyRate: product.rentalDailyRate,
          rentalDays,
          rentalDeposit: product.rentalSecurityDeposit,
        })
      );
    }
    router.push('/cart');
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    dispatch(
      toggleItem({
        productId: product.id,
        title: localized.name,
        slug: product.slug,
        image: product.primaryImage,
        brand: product.brand || 'AarogyaMed Certified',
        buyPrice: product.buyPrice,
        rentDailyRate: product.rentalDailyRate,
        rentAvailable: product.isAvailableForRent,
        preferredIntent: activeMode,
        addedAt: new Date().toISOString(),
      })
    );
  };

  return (
    <div style={{ maxWidth: 1280, margin: '1.5rem auto 5rem', padding: '0 1.5rem' }}>
      {/* Breadcrumbs */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '0.8125rem',
          color: '#6e7977',
          marginBottom: '2rem',
        }}
      >
        <Link href="/" style={{ color: '#005c55', textDecoration: 'none' }}>
          {locale === 'hi' ? 'होम' : 'Home'}
        </Link>
        <ChevronRight size={14} />
        <Link href="/shop" style={{ color: '#005c55', textDecoration: 'none' }}>
          {locale === 'hi' ? 'उपकरण कैटलॉग' : 'Equipment Catalog'}
        </Link>
        <ChevronRight size={14} />
        <span style={{ color: '#131b2e', fontWeight: 600 }}>{localized.name}</span>
      </nav>

      {/* Main Grid: Gallery + Purchasing Box */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: '3rem',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Visual Gallery, Specifications, Overview */}
        <div>
          {/* Main Image Display */}
          <div
            style={{
              background: '#f2f3ff',
              borderRadius: 20,
              overflow: 'hidden',
              border: '1px solid #dae2fd',
              position: 'relative',
              marginBottom: '1rem',
            }}
          >
            {(() => {
              const activeImg = selectedImage || product.primaryImage || product.images?.[0] || '/images/oxygen_concentrator.png';
              return activeImg ? (
                <img
                  src={activeImg}
                  alt={localized.name}
                  style={{
                    width: '100%',
                    height: 440,
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              ) : null;
            })()}
            <div
              style={{
                position: 'absolute',
                top: 16,
                left: 16,
                display: 'flex',
                gap: 8,
              }}
            >
              <span
                style={{
                  background: 'rgba(0, 92, 85, 0.92)',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: 6,
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <ShieldCheck size={14} /> {locale === 'hi' ? 'CDSCO पंजीकृत' : 'CDSCO Registered'}
              </span>
              <span
                style={{
                  background: 'rgba(0, 99, 152, 0.92)',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: 6,
                  backdropFilter: 'blur(4px)',
                }}
              >
                {locale === 'hi' ? '10-चरणीय अस्पताल नसबंदी' : '10-Step Hospital Sterilized'}
              </span>
            </div>
          </div>

          {/* Thumbnail Gallery */}
          {product.images && product.images.filter(Boolean).length > 1 && (
            <div style={{ display: 'flex', gap: 12, marginBottom: '2.5rem' }}>
              {product.images.filter(Boolean).map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 10,
                    overflow: 'hidden',
                    border: (selectedImage || product.primaryImage) === img ? '2px solid #005c55' : '1px solid #dae2fd',
                    padding: 0,
                    background: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}

          {/* Clinical Overview */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#131b2e', marginBottom: '0.75rem' }}>
              {t.product.clinicalOverview}
            </h2>
            <p style={{ color: '#3e4947', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              {localized.description}
            </p>

            {/* Condition Tags */}
            {product.conditionTags && product.conditionTags.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#6e7977' }}>
                  {t.product.prescribedFor}
                </span>
                {product.conditionTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/learn/${tag}`}
                    style={{
                      background: '#eaedff',
                      color: '#005c55',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: 9999,
                      textDecoration: 'none',
                    }}
                  >
                    #{tag.replace('-', ' ')}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Specifications Table */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#131b2e', marginBottom: '1rem' }}>
              {t.product.specificationsTitle}
            </h2>
            <SpecTable specifications={localized.specifications} />
          </div>

          {/* Biomedical Certification Standards */}
          <div
            style={{
              background: '#faf8ff',
              borderRadius: 16,
              border: '1px solid #dae2fd',
              padding: '1.5rem',
            }}
          >
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#131b2e', marginBottom: '0.5rem' }}>
              {t.product.biomedicalGuarantee}
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6e7977', lineHeight: 1.5, margin: 0 }}>
              {t.product.biomedicalGuaranteeText}
            </p>
          </div>
        </div>

        {/* Right Column: Pricing, Buy/Rent Mode Switch, and Cart Action */}
        <div>
          <div
            style={{
              background: '#ffffff',
              borderRadius: 20,
              border: '1px solid #dae2fd',
              padding: '2rem',
              boxShadow: '0 6px 24px rgba(19, 27, 46, 0.06)',
              position: 'sticky',
              top: 90,
            }}
          >
            {/* Title & SKU */}
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#006398', textTransform: 'uppercase', marginBottom: 4 }}>
              {product.categoryName || 'Medical Equipment'} • SKU: {product.sku}
            </div>
            <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#131b2e', lineHeight: 1.3, marginBottom: '0.75rem' }}>
              {localized.name}
            </h1>

            {/* Rating - Only display if authentic verified reviews exist */}
            {product.reviewsCount && product.reviewsCount > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '1.5rem', fontSize: '0.875rem', color: '#6e7977' }}>
                <div style={{ display: 'flex', color: '#ea580c' }}>
                  <Star size={16} fill="#ea580c" />
                </div>
                <strong style={{ color: '#131b2e' }}>{product.rating}</strong>
                <span>({product.reviewsCount} {t.product.verifiedReviews})</span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '1.5rem', fontSize: '0.8125rem', color: '#005c55', fontWeight: 600 }}>
                <ShieldCheck size={16} />
                <span>{locale === 'hi' ? 'सीधे अधिकृत बायोमेडिकल सप्लायर से सत्यापित' : 'AarogyaMed Verified Biomedical Equipment'}</span>
              </div>
            )}

            {/* Segmented Buy vs Rent Toggle Switch */}
            <BuyRentToggle
              mode={activeMode}
              onChange={setActiveMode}
              buyPrice={product.buyPrice}
              rentDailyRate={product.rentalDailyRate}
              buyAvailable={product.isAvailableForBuy}
              rentAvailable={product.isAvailableForRent}
            />

            {/* MODE 1: BUY NEW EQUIPMENT DETAILS */}
            {activeMode === 'buy' && (
              <div style={{ background: '#faf8ff', borderRadius: 14, padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid #dae2fd' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: '#005c55' }}>
                    ₹{product.buyPrice.toLocaleString('en-IN')}
                  </span>
                  {product.mrp > product.buyPrice && (
                    <span style={{ fontSize: '1rem', textDecoration: 'line-through', color: '#8c9b98' }}>
                      MRP ₹{product.mrp.toLocaleString('en-IN')}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#ea580c', background: '#fff0eb', padding: '2px 8px', borderRadius: 6 }}>
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6e7977', marginBottom: 12 }}>
                  {locale === 'hi' ? 'सभी मेडिकल डिवाइस कर व जीएसटी सहित' : 'Inclusive of all medical device taxes & GST'}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.8125rem', color: '#131b2e' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle2 size={16} color="#005c55" />
                    <span>{locale === 'hi' ? 'सीलबंद फैक्ट्री पैकेजिंग के साथ नया यूनिट' : 'Brand New Sealed Factory Packaging'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle2 size={16} color="#005c55" />
                    <span>
                      {product.warrantyInfo || (product.warrantyMonths ? `${product.warrantyMonths} ${locale === 'hi' ? 'महीने की व्यापक ओईएम वारंटी' : 'Months Comprehensive OEM Warranty'}` : (locale === 'hi' ? 'ओईएम वारंटी शामिल' : 'OEM Warranty Included'))}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Truck size={16} color="#005c55" />
                    <span>{locale === 'hi' ? '4 घंटे में निःशुल्क डोरस्टेप डिलीवरी व डेमो' : 'Free Doorstep Delivery & Demo in 4 Hours'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* MODE 2: RENT EQUIPMENT DETAILS */}
            {activeMode === 'rent' && (
              <div style={{ background: '#fff7f2', borderRadius: 14, padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid #ffd8c8' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: '#ea580c' }}>
                    ₹{rentalCalculation.effectiveDailyRate}/{t.product.day}
                  </span>
                  {rentalCalculation.discountAppliedPercent > 0 && (
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffffff', background: '#ea580c', padding: '2px 8px', borderRadius: 6 }}>
                      {rentalCalculation.discountAppliedPercent}% {locale === 'hi' ? 'दीर्घकालिक छूट' : 'Long Term Discount'}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6e7977', marginBottom: 14 }}>
                  {locale === 'hi' ? `न्यूनतम रेंटल अवधि: ${product.rentalMinDays || 1} दिन` : `Minimum rental period: ${product.rentalMinDays || 1} days`}
                </div>

                {/* Duration Buttons */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', marginBottom: 6 }}>
                    {t.product.rentalPeriod}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 10 }}>
                    {[7, 15, 30].map((days) => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => setRentalDays(days)}
                        style={{
                          padding: '8px 4px',
                          borderRadius: 8,
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          border: rentalDays === days ? '2px solid #ea580c' : '1px solid #dae2fd',
                          background: rentalDays === days ? '#ea580c' : '#ffffff',
                          color: rentalDays === days ? '#ffffff' : '#131b2e',
                          cursor: 'pointer',
                          textAlign: 'center',
                        }}
                      >
                        {days} {t.product.days}
                      </button>
                    ))}
                  </div>

                  {/* Custom Rental Days Input */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#ffffff', padding: '8px 12px', borderRadius: 8, border: '1px solid #ffd8c8' }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#131b2e' }}>
                      {locale === 'hi' ? `कस्टम रेंटल दिन (न्यूनतम ${product.rentalMinDays || 1}):` : `Custom Rental Days (Min ${product.rentalMinDays || 1}):`}
                    </span>

                    <input
                      type="number"
                      min={product.rentalMinDays || 1}
                      max={180}
                      value={inputValue}
                      onChange={(e) => {
                        const raw = e.target.value;
                        setInputValue(raw); // always reflect what the user typed

                        const val = parseInt(raw, 10);
                        if (!isNaN(val)) {
                          setRentalDays(val); // keep rentalDays as number, unclamped while typing
                        }
                      }}
                      onBlur={() => {
                        const min = product.rentalMinDays || 1;
                        const clamped = Math.min(180, Math.max(min, rentalDays || min));
                        setRentalDays(clamped);
                        setInputValue(String(clamped));
                      }}
                      style={{
                        width: 65,
                        padding: '4px 8px',
                        borderRadius: 6,
                        border: '1.5px solid #ea580c',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: '#ea580c',
                        textAlign: 'center',
                      }}
                    />
                    <span style={{ fontSize: '0.8125rem', color: '#6e7977' }}>{t.product.days}</span>
                  </div>
                </div>

                {/* Rental Cost & Deposit Summary */}
                <div style={{ background: '#ffffff', borderRadius: 10, padding: '10px 12px', border: '1px solid #ffd8c8', fontSize: '0.8125rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ color: '#6e7977' }}>
                      {locale === 'hi' ? `किराया शुल्क (${rentalDays} दिन):` : `Rental Fee (${rentalDays} days):`}
                    </span>
                    <strong style={{ color: '#131b2e' }}>₹{rentalCalculation.rentalFee.toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ color: '#6e7977' }}>{t.cart.securityDeposit}:</span>
                    <strong style={{ color: '#005c55' }}>+ ₹{rentalCalculation.securityDeposit.toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ borderTop: '1px solid #eaedff', paddingTop: 6, display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ color: '#131b2e' }}>{t.cart.totalPayable}:</strong>
                    <strong style={{ color: '#ea580c', fontSize: '1rem' }}>
                      ₹{rentalCalculation.totalPayableNow.toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, fontSize: '0.75rem', color: '#913200' }}>
                  <RotateCcw size={14} />
                  <span>{t.product.depositReturnedNotice}</span>
                </div>
              </div>
            )}

            {/* Pincode & Serviceability Checker */}
            <PincodeChecker />

            {/* Quantity and Primary Action */}
            <div style={{ display: 'flex', gap: 12, marginTop: '1.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #dae2fd',
                  borderRadius: 12,
                  background: '#f8fafc',
                  padding: '4px',
                }}
              >
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '8px 14px',
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                    color: quantity <= 1 ? '#cbd5e1' : '#005c55',
                  }}
                  title={quantity <= 1 ? 'Minimum quantity is 1' : 'Decrease quantity'}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span style={{ padding: '0 8px', fontWeight: 700, color: '#131b2e' }}>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '8px 14px',
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: '#005c55',
                  }}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  background: activeMode === 'buy' ? '#005c55' : '#ea580c',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 12,
                  padding: '14px 20px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow:
                    activeMode === 'buy'
                      ? '0 6px 18px rgba(0, 92, 85, 0.25)'
                      : '0 6px 18px rgba(234, 88, 12, 0.25)',
                  transition: 'transform 0.15s ease',
                }}
              >
                {activeMode === 'buy' ? (
                  <>
                    <ShoppingBag size={18} />
                    <span>{t.product.addToCartBuy}</span>
                  </>
                ) : (
                  <>
                    <CalendarClock size={18} />
                    <span>{t.product.bookRental} ({rentalDays} {t.product.days})</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleToggleWishlist}
                title={
                  isWishlisted
                    ? locale === 'hi'
                      ? 'इच्छासूची से हटाएं'
                      : 'Remove from Wishlist'
                    : locale === 'hi'
                      ? 'इच्छासूची में सहेजें'
                      : 'Save to Wishlist'
                }
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 12,
                  border: isWishlisted ? '2px solid #ba1a1a' : '1px solid #dae2fd',
                  background: isWishlisted ? '#fff0f0' : '#f8fafc',
                  color: isWishlisted ? '#ba1a1a' : '#6e7977',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                }}
              >
                <Heart
                  size={22}
                  fill={isWishlisted ? '#ba1a1a' : 'none'}
                  color={isWishlisted ? '#ba1a1a' : 'currentColor'}
                />
              </button>
            </div>

            {/* Helpline Assurance */}
            <div
              style={{
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid #eaedff',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: '0.8125rem',
                color: '#6e7977',
              }}
            >
              <PhoneCall size={16} color="#005c55" />
              <span>
                {locale === 'hi' ? 'प्रिस्क्रिप्शन या सेटअप के बारे में प्रश्न? कॉल करें ' : 'Questions about prescription or setup? Call '}
                <a href="tel:18008892273" style={{ color: '#005c55', fontWeight: 700 }}>
                  1800-889-2273
                </a>
              </span>
            </div>
          </div>
        </div>

        {/* Clinical Patient & Caregiver Reviews */}
        <ProductReviews
          productName={localized.name}
          ratingAvg={product.rating}
          ratingCount={product.reviewsCount}
        />
      </div>
    </div>
  );
}
