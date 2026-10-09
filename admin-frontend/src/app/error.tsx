'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertOctagon, RefreshCw, LayoutDashboard } from 'lucide-react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Omkar Healthcare Operations Hub Error]:', error);
  }, [error]);

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
          maxWidth: 520,
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
            width: 64,
            height: 64,
            borderRadius: 18,
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <AlertOctagon size={32} />
        </div>

        <h2
          style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            margin: '0 0 0.5rem',
            letterSpacing: '-0.02em',
          }}
        >
          Operations Console Fault Encountered
        </h2>

        <p
          style={{
            fontSize: '0.875rem',
            color: '#94a3b8',
            margin: '0 0 1.5rem',
            lineHeight: 1.6,
          }}
        >
          {error?.message ||
            'An error occurred while executing biomedical operations logic. Administrative audit log preserved.'}
        </p>

        {error?.digest && (
          <div
            style={{
              fontSize: '0.75rem',
              color: '#64748b',
              fontFamily: 'monospace',
              background: '#0f172a',
              padding: '6px 12px',
              borderRadius: 6,
              marginBottom: '1.5rem',
              display: 'inline-block',
            }}
          >
            Digest: {error.digest}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#16453A',
              color: '#ffffff',
              padding: '10px 20px',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: '0.875rem',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={16} />
            Reload Module
          </button>

          <Link
            href="/admin"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              padding: '10px 20px',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: '0.875rem',
              textDecoration: 'none',
            }}
          >
            <LayoutDashboard size={16} />
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
