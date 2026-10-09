'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Omkar Healthcare Storefront Error]:', error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        background: '#f8fafd',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 540,
          width: '100%',
          background: '#ffffff',
          borderRadius: 20,
          padding: '2.5rem 2rem',
          boxShadow: '0 20px 45px rgba(0, 92, 85, 0.08)',
          border: '1px solid #e1e9ea',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            background: '#fff4eb',
            color: '#c2410c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <AlertTriangle size={32} />
        </div>

        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: '#131b2e',
            margin: '0 0 0.75rem',
            letterSpacing: '-0.02em',
          }}
        >
          Clinical Service Temporarily Unavailable
        </h1>

        <p
          style={{
            fontSize: '0.925rem',
            color: '#6e7977',
            margin: '0 0 1.5rem',
            lineHeight: 1.6,
          }}
        >
          {error?.message ||
            'We encountered an unexpected disruption while loading biomedical records. Our clinical systems remain secure.'}
        </p>

        {error?.digest && (
          <div
            style={{
              fontSize: '0.75rem',
              color: '#94a3b8',
              fontFamily: 'monospace',
              background: '#f1f5f9',
              padding: '6px 12px',
              borderRadius: 6,
              marginBottom: '1.5rem',
              display: 'inline-block',
            }}
          >
            Ref: {error.digest}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#16453A',
              color: '#ffffff',
              padding: '10px 22px',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: '0.875rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
          >
            <RefreshCw size={16} />
            Try Again
          </button>

          <Link
            href="/shop"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#f1f5f9',
              color: '#131b2e',
              padding: '10px 20px',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: '0.875rem',
              textDecoration: 'none',
            }}
          >
            <ShoppingBag size={16} />
            Explore Equipment
          </Link>
        </div>

        <div
          style={{
            marginTop: '2rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            fontSize: '0.8rem',
            color: '#16453A',
            fontWeight: 600,
          }}
        >
          <ShieldCheck size={16} />
          <span>Omkar Healthcare Verified Patient Care Helpline: 1800-890-CARE</span>
        </div>
      </div>
    </div>
  );
}
