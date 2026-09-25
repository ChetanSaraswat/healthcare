'use client';

import React from 'react';
import { useTranslation } from '@/locales';
import styles from './BuyRentToggle.module.scss';
import { ShoppingBag, RefreshCw } from 'lucide-react';

interface BuyRentToggleProps {
  mode: 'buy' | 'rent';
  onChange: (mode: 'buy' | 'rent') => void;
  buyAvailable?: boolean;
  rentAvailable?: boolean;
  buyPrice?: number;
  rentDailyRate?: number;
}

export const BuyRentToggle: React.FC<BuyRentToggleProps> = ({
  mode,
  onChange,
  buyAvailable = true,
  rentAvailable = true,
  buyPrice,
  rentDailyRate,
}) => {
  const { t, locale } = useTranslation();

  return (
    <div className={styles.toggleContainer} role="tablist" aria-label="Purchase or Rental Mode">
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'buy'}
        disabled={!buyAvailable}
        className={`${styles.toggleBtn} ${mode === 'buy' ? styles.active : ''}`}
        onClick={() => onChange('buy')}
      >
        <span className={styles.title}>
          <ShoppingBag size={18} />
          <span>{t.product.buyOutright}</span>
        </span>
        <span className={styles.subtitle}>
          {buyPrice
            ? `₹${buyPrice.toLocaleString('en-IN')} (${locale === 'hi' ? 'वारंटी सहित नया' : 'New & Warranty'})`
            : t.product.buyPriceSub}
        </span>
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={mode === 'rent'}
        disabled={!rentAvailable}
        className={`${styles.toggleBtn} ${mode === 'rent' ? styles.activeRent : ''}`}
        onClick={() => onChange('rent')}
      >
        <span className={styles.title}>
          <RefreshCw size={18} />
          <span>{t.product.rentFlexible}</span>
        </span>
        <span className={styles.subtitle}>
          {rentDailyRate
            ? `${locale === 'hi' ? 'मात्र' : 'From'} ₹${rentDailyRate}/${t.product.day} (${locale === 'hi' ? 'लचीला' : 'Flexible'})`
            : t.product.rentPriceSub}
        </span>
      </button>
    </div>
  );
};
