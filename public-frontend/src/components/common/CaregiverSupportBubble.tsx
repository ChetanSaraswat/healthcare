'use client';

import React from 'react';
import { useTranslation } from '@/locales';
import { CONTACT_CONFIG } from '@/config/contact.config';
import styles from './CaregiverSupportBubble.module.scss';

export const CaregiverSupportBubble: React.FC = () => {
  const { locale } = useTranslation();

  if (!CONTACT_CONFIG.whatsappEnabled) {
    return null;
  }

  const href = CONTACT_CONFIG.getWhatsAppHref(locale);

  return (
    <div className={styles.bubbleContainer}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={locale === 'hi' ? 'व्हाट्सएप पर सहायता प्राप्त करें' : 'Chat with Caregiver Support on WhatsApp'}
        title={locale === 'hi' ? 'व्हाट्सएप पर सहायता प्राप्त करें' : 'Chat with Caregiver Support on WhatsApp'}
        className={styles.bubbleLink}
      >
        {/* Ambient Catchy Pulse Wave */}
        <span className={styles.pulseRing} aria-hidden="true" />

        {/* Outlined WhatsApp Icon with crisp lines */}
        <svg
          viewBox="0 0 24 24"
          width={28}
          height={28}
          fill="none"
          stroke="#25D366"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.waSvg}
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          <path d="M9.5 9.5c.3-.6.6-.6 1-.6.2 0 .5.1.7.3.2.3.6 1.4.7 1.6.1.2.1.4 0 .6-.1.2-.2.3-.4.5-.2.2-.4.4-.2.7.3.5.7 1 1.2 1.4.5.4 1 .7 1.5.9.3.1.5 0 .7-.2.2-.2.4-.5.6-.6.2-.1.4-.1.6 0 .2.1 1.3.6 1.6.7.3.2.4.3.4.5 0 .4-.1 1.1-.7 1.6-.6.5-1.3.5-2 .3-1.6-.4-3.1-1.4-4.3-2.6-1.2-1.2-2.2-2.7-2.6-4.3-.2-.7-.2-1.4.3-2z" />
        </svg>
      </a>
    </div>
  );
};
