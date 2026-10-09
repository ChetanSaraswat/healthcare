'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useTranslation } from '@/locales';
import { WishlistEntity, WishlistItem } from '@/domain/entities/wishlist.entity';
import { removeItem } from '@/features/wishlist/wishlist.slice';
import { addToCart } from '@/features/cart/cart.slice';
import {
  Heart,
  ShoppingCart,
  Trash2,
  CalendarClock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  PackageCheck,
} from 'lucide-react';

export default function AccountWishlistPage() {
  const { t, locale } = useTranslation();
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist?.items || []);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const handleMoveToCart = (item: WishlistItem) => {
    // Construct cart item
    const isRent = item.preferredIntent === 'rent' && item.rentAvailable;
    if (isRent) {
      dispatch(
        addToCart({
          id: `${item.productId}-rent`,
          productId: item.productId,
          name: item.title,
          slug: item.slug,
          image: item.image,
          type: 'rent',
          dailyRate: item.rentDailyRate || 100,
          rentalDays: 30,
          rentalDeposit: Math.round((item.rentDailyRate || 100) * 15),
          quantity: 1,
        })
      );
    } else {
      dispatch(
        addToCart({
          id: `${item.productId}-buy`,
          productId: item.productId,
          name: item.title,
          slug: item.slug,
          image: item.image,
          type: 'buy',
          price: item.buyPrice,
          mrp: Math.round(item.buyPrice * 1.15),
          quantity: 1,
        })
      );
    }

    setAddedToast(
      locale === 'hi'
        ? `"${item.title}" कार्ट में जोड़ा गया (${isRent ? 'किराया' : 'खरीद'})`
        : `"${item.title}" added to cart (${isRent ? 'Rental' : 'Purchase'})`
    );

    setTimeout(() => {
      setAddedToast(null);
    }, 3500);
  };

  const handleRemove = (productId: string) => {
    dispatch(removeItem(productId));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Toast alert */}
      {addedToast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9999,
            background: '#16453A',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: 12,
            boxShadow: '0 8px 24px rgba(0, 92, 85, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: '0.875rem',
            fontWeight: 700,
            animation: 'fadeIn 0.2s ease-in-out',
          }}
        >
          <CheckCircle2 size={18} color="#9cf2e8" />
          <span>{addedToast}</span>
          <Link
            href="/cart"
            style={{
              color: '#9cf2e8',
              textDecoration: 'underline',
              marginLeft: 8,
              fontSize: '0.8125rem',
            }}
          >
            {locale === 'hi' ? 'कार्ट देखें' : 'View Cart'}
          </Link>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#131b2e', margin: '0 0 4px' }}>
            {locale === 'hi' ? 'सहेजी गई इच्छासूची और पसंदीदा उपकरण' : 'Saved Wishlist & Favorite Equipment'}
          </h2>
          <p style={{ fontSize: '0.8125rem', color: '#6e7977', margin: 0 }}>
            {locale === 'hi'
              ? 'अस्पताल-ग्रेड उपकरण जिन्हें आपने बाद में खरीदने या किराये पर लेने के लिए सुरक्षित रखा है।'
              : 'Hospital-grade equipment and accessories saved for quick purchase or rental initiation.'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              background: '#eaf8f6',
              color: '#16453A',
              fontWeight: 700,
              fontSize: '0.8125rem',
              padding: '6px 14px',
              borderRadius: 9999,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Heart size={14} fill="#16453A" color="#16453A" />
            <span>
              {wishlistItems.length} {locale === 'hi' ? 'उपकरण सहेजे गए' : 'Items Saved'}
            </span>
          </span>

          <Link
            href="/shop"
            style={{
              background: '#16453A',
              color: '#ffffff',
              padding: '8px 18px',
              borderRadius: 9999,
              fontSize: '0.8125rem',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Sparkles size={14} />
            <span>{locale === 'hi' ? 'कैटलॉग ब्राउज़ करें' : 'Browse Equipment'}</span>
          </Link>
        </div>
      </div>

      {/* Wishlist Items List */}
      {wishlistItems.length === 0 ? (
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #dae2fd',
            padding: '4rem 2rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: '#f2f3ff',
              color: '#6e7977',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <Heart size={36} color="#bdc9c6" />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#131b2e', marginBottom: 6 }}>
            {locale === 'hi' ? 'आपकी इच्छासूची खाली है' : 'Your Wishlist is Empty'}
          </h3>
          <p style={{ color: '#6e7977', fontSize: '0.875rem', maxWidth: 460, margin: '0 auto 1.5rem' }}>
            {locale === 'hi'
              ? 'चिकित्सा उपकरण देखते समय दिल के आइकन (♥) पर क्लिक करके उन्हें बाद में देखने या तुरंत कार्ट में डालने के लिए सहेजें।'
              : 'Save equipment by clicking the heart icon on any product page to plan your care protocol or purchase later.'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Link
              href="/shop"
              style={{
                background: '#16453A',
                color: '#ffffff',
                padding: '10px 22px',
                borderRadius: 9999,
                fontSize: '0.875rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              {locale === 'hi' ? 'सभी उपकरण देखें' : 'Explore Medical Equipment'}
            </Link>
            <Link
              href="/assessment"
              style={{
                background: '#f2f3ff',
                color: '#16453A',
                border: '1px solid #dae2fd',
                padding: '10px 22px',
                borderRadius: 9999,
                fontSize: '0.875rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              {locale === 'hi' ? 'क्लिनिकल मूल्यांकन' : 'Clinical Assessment'}
            </Link>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {wishlistItems.map((item) => {
            const isRentPreferred = item.preferredIntent === 'rent' && item.rentAvailable;

            return (
              <div
                key={item.productId}
                style={{
                  background: '#ffffff',
                  borderRadius: 16,
                  border: '1px solid #dae2fd',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 2px 8px rgba(19, 27, 46, 0.04)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                {/* Product Image & Badges */}
                <div style={{ position: 'relative', background: '#f8f9ff', height: 180 }}>
                  <img
                    src={item.image || '/images/oxygen_concentrator.png'}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1rem' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      background: 'rgba(255, 255, 255, 0.92)',
                      backdropFilter: 'blur(4px)',
                      color: '#16453A',
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: 6,
                      textTransform: 'uppercase',
                      border: '1px solid #dae2fd',
                    }}
                  >
                    {item.brand}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleRemove(item.productId)}
                    title={locale === 'hi' ? 'हटाएं' : 'Remove from Wishlist'}
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: '#ffffff',
                      border: '1px solid #eaedff',
                      color: '#ba1a1a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                {/* Content */}
                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Link
                    href={`/product/${item.slug}`}
                    style={{
                      fontSize: '0.9375rem',
                      fontWeight: 700,
                      color: '#131b2e',
                      textDecoration: 'none',
                      lineHeight: 1.4,
                      marginBottom: 8,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {item.title}
                  </Link>

                  {/* Pricing Comparison */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 12,
                      marginBottom: '1rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.6875rem', color: '#6e7977', fontWeight: 600 }}>
                        {locale === 'hi' ? 'खरीद मूल्य' : 'Buy Price'}
                      </div>
                      <div
                        style={{
                          fontSize: '1.125rem',
                          fontWeight: 800,
                          color: !isRentPreferred ? '#16453A' : '#131b2e',
                        }}
                      >
                        ₹{item.buyPrice.toLocaleString('en-IN')}
                      </div>
                    </div>

                    {item.rentAvailable && item.rentDailyRate && (
                      <div style={{ borderLeft: '1px solid #eaedff', paddingLeft: 12 }}>
                        <div style={{ fontSize: '0.6875rem', color: '#6e7977', fontWeight: 600 }}>
                          {locale === 'hi' ? 'किराया दर' : 'Rental Rate'}
                        </div>
                        <div
                          style={{
                            fontSize: '1.125rem',
                            fontWeight: 800,
                            color: isRentPreferred ? '#16453A' : '#131b2e',
                          }}
                        >
                          ₹{item.rentDailyRate.toLocaleString('en-IN')}
                          <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6e7977' }}>
                            /{locale === 'hi' ? 'दिन' : 'day'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => handleMoveToCart(item)}
                      style={{
                        width: '100%',
                        background: '#16453A',
                        color: '#ffffff',
                        border: 'none',
                        padding: '10px 14px',
                        borderRadius: 10,
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        boxShadow: '0 2px 6px rgba(0, 92, 85, 0.2)',
                      }}
                    >
                      <ShoppingCart size={16} />
                      <span>
                        {isRentPreferred
                          ? locale === 'hi'
                            ? 'किराये पर कार्ट में जोड़ें'
                            : 'Add to Cart as Rental'
                          : locale === 'hi'
                          ? 'खरीदने के लिए कार्ट में जोड़ें'
                          : 'Add to Cart to Buy'}
                      </span>
                    </button>

                    <Link
                      href={`/product/${item.slug}`}
                      style={{
                        textAlign: 'center',
                        color: '#16453A',
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        padding: '6px 0',
                      }}
                    >
                      {locale === 'hi' ? 'विवरण और विनिर्देश देखें →' : 'View Specifications & Rent Terms →'}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
