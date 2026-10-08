'use client';

import React from 'react';
import { useTranslation } from '@/locales';
import { CartItem } from '@/domain/entities/cart.entity';

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  pricing: {
    buySubtotal: number;
    rentSubtotal: number;
    refundableDepositTotal: number;
    totalPayableNow: number;
  };
}

export function CheckoutOrderSummary({ items, pricing }: CheckoutOrderSummaryProps) {
  const { t, locale } = useTranslation();

  return (
    <div
      style={{
        background: '#faf8ff',
        borderRadius: 16,
        border: '1px solid #dae2fd',
        padding: '1.5rem',
        position: 'sticky',
        top: 90,
      }}
    >
      <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#131b2e', marginBottom: '1.25rem' }}>
        {t.checkout.equipmentInOrder}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: '1.5rem' }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: '#ffffff',
              borderRadius: 10,
              padding: 10,
              border: '1px solid #eaedff',
            }}
          >
            <img
              src={item.image || '/images/oxygen_concentrator.png'}
              alt={item.name}
              style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6 }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', lineHeight: 1.3 }}>
                {item.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: item.type === 'buy' ? '#005c55' : '#ea580c', fontWeight: 600 }}>
                {item.type === 'buy'
                  ? (locale === 'hi' ? 'खरीद (नया)' : 'Purchase (New)')
                  : (locale === 'hi' ? `रेंटल (${item.rentalDays} दिन)` : `Rental (${item.rentalDays} Days)`)}{' '}
                • {locale === 'hi' ? 'मात्रा' : 'Qty'}: {item.quantity}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #dae2fd', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.875rem' }}>
        {pricing.buySubtotal > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#6e7977' }}>{t.cart.purchaseSubtotal}:</span>
            <strong>₹{pricing.buySubtotal.toLocaleString('en-IN')}</strong>
          </div>
        )}
        {pricing.rentSubtotal > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#6e7977' }}>{t.cart.rentalCharges}:</span>
            <strong>₹{pricing.rentSubtotal.toLocaleString('en-IN')}</strong>
          </div>
        )}
        {pricing.refundableDepositTotal > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#005c55', fontWeight: 700 }}>
            <span>{t.cart.securityDeposit}:</span>
            <span>+ ₹{pricing.refundableDepositTotal.toLocaleString('en-IN')}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#6e7977' }}>{t.cart.setupFee}:</span>
          <strong style={{ color: '#005c55' }}>{t.cart.freeDelivery}</strong>
        </div>

        <div style={{ borderTop: '1px solid #dae2fd', margin: '8px 0' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <strong style={{ fontSize: '1rem', color: '#131b2e' }}>{t.cart.totalPayable}:</strong>
          <strong style={{ fontSize: '1.5rem', color: '#005c55' }}>
            ₹{pricing.totalPayableNow.toLocaleString('en-IN')}
          </strong>
        </div>

        {pricing.refundableDepositTotal > 0 && (
          <div
            style={{
              background: '#eaf8f6',
              borderRadius: 8,
              padding: 8,
              fontSize: '0.75rem',
              color: '#005c55',
              marginTop: 6,
            }}
          >
            {locale === 'hi'
              ? `उपकरण वापसी निरीक्षण पर ₹${pricing.refundableDepositTotal.toLocaleString('en-IN')} सुरक्षा जमा सीधे आपके खाते में वापस कर दी जाएगी।`
              : `₹${pricing.refundableDepositTotal.toLocaleString('en-IN')} security deposit will be refunded to your account upon equipment return inspection.`}
          </div>
        )}
      </div>
    </div>
  );
}
