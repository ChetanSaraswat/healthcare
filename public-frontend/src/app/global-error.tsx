'use client';

import React from 'react';

export default function GlobalError({
  error,
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
          background: '#f8fafd',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <div
          style={{
            maxWidth: 480,
            background: '#ffffff',
            borderRadius: 16,
            padding: '2.5rem 2rem',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
          }}
        >
          <h2 style={{ color: '#131b2e', margin: '0 0 1rem' }}>Application Error</h2>
          <p style={{ color: '#6e7977', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            A critical error occurred while rendering the clinical interface.
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
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
