'use client';

import React from 'react';
import styles from './ProductCardSkeleton.module.scss';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className={styles.skeletonCard} aria-busy="true" aria-label="Loading product card">
      {/* Product Image Placeholder */}
      <div className={`${styles.imageBox} ${styles.shimmerBox}`}>
        <div className={styles.badgeStack}>
          <div className={`${styles.badgePill} ${styles.shimmerBox}`} />
        </div>
      </div>

      {/* Body Content */}
      <div className={styles.body}>
        {/* Category Pill */}
        <div className={`${styles.categoryTag} ${styles.shimmerBox}`} />

        {/* Title (2 lines) */}
        <div className={`${styles.titleLine1} ${styles.shimmerBox}`} />
        <div className={`${styles.titleLine2} ${styles.shimmerBox}`} />

        {/* Rating Line */}
        <div className={`${styles.ratingRow} ${styles.shimmerBox}`} />

        {/* Dual Pricing Grid */}
        <div className={styles.pricingSplit}>
          <div className={styles.priceCol}>
            <div className={`${styles.priceLabel} ${styles.shimmerBox}`} />
            <div className={`${styles.priceAmount} ${styles.shimmerBox}`} />
          </div>
          <div className={styles.priceCol}>
            <div className={`${styles.priceLabel} ${styles.shimmerBox}`} />
            <div className={`${styles.priceAmount} ${styles.shimmerBox}`} />
          </div>
        </div>

        {/* Buy & Rent Action Buttons */}
        <div className={styles.actions}>
          <div className={`${styles.actionBtn} ${styles.shimmerBox}`} />
          <div className={`${styles.actionBtn} ${styles.shimmerBox}`} />
        </div>
      </div>
    </div>
  );
};
