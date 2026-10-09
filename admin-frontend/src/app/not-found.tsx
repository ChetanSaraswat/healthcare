import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, ArrowLeft } from 'lucide-react';

export default function AdminNotFound() {
  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: '#131b2e',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 480,
          width: '100%',
          background: '#1e293b',
          borderRadius: 20,
          padding: '2.5rem 2rem',
          textAlign: 'center',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div
          style={{
            fontSize: '4rem',
            fontWeight: 900,
            color: '#00a896',
            lineHeight: 1,
            marginBottom: '0.75rem',
            letterSpacing: '-0.04em',
          }}
        >
          404
        </div>

        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
          Operations Resource Not Found
        </h2>

        <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: '0 0 1.75rem', lineHeight: 1.6 }}>
          The requested administrative module, order document, or catalog entry does not exist or has been relocated.
        </p>

        <Link
          href="/admin"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#16453A',
            color: '#ffffff',
            padding: '10px 22px',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: '0.875rem',
            textDecoration: 'none',
          }}
        >
          <LayoutDashboard size={16} />
          Return to Operations Dashboard
        </Link>
      </div>
    </div>
  );
}
