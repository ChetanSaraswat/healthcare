'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export const CaregiverSupportBubble: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <a
        href="https://wa.me/919876543210?text=Hello%20AarogyaMed,%20I%20need%20urgent%20guidance%20on%20medical%20equipment."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Caregiver WhatsApp Helpdesk"
        title="Caregiver WhatsApp Helpdesk"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 56,
          height: 56,
          background: '#25D366',
          color: '#ffffff',
          borderRadius: '50%',
          boxShadow: '0 8px 24px rgba(37, 211, 102, 0.45)',
          textDecoration: 'none',
          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 12px 28px rgba(37, 211, 102, 0.55)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 211, 102, 0.45)';
        }}
      >
        <MessageCircle size={28} />
      </a>
    </div>
  );
};
