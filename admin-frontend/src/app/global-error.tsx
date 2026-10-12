'use client';

import React from 'react';

export default function AdminGlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          background: '#131b2e',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <div
          style={{
            maxWidth: 480,
            background: '#1e293b',
            borderRadius: 16,
            padding: '2.5rem 2rem',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <h2 style={{ color: '#ffffff', margin: '0 0 1rem' }}>Console Error</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            A critical fault occurred while rendering the Operations Hub layout.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              background: '#16453A',
              color: '#ffffff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: 8,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Reload Console
          </button>
        </div>
      </body>
    </html>
  );
}
