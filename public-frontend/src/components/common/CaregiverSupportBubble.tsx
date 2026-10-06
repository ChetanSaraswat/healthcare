'use client';

import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';

export const CaregiverSupportBubble: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        alignItems: 'flex-end',
      }}
    >
      <a
        href="https://wa.me/919876543210?text=Hello%20AarogyaMed,%20I%20need%20urgent%20guidance%20on%20medical%20equipment."
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: '#25D366',
          color: '#ffffff',
          padding: '12px 18px',
          borderRadius: 9999,
          boxShadow: '0 8px 24px rgba(37, 211, 102, 0.4)',
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: '0.875rem',
          transition: 'transform 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <MessageCircle size={20} />
        <span>Caregiver WhatsApp Helpdesk</span>
      </a>
    </div>
  );
};
