import React from 'react';
import Link from 'next/link';
import { Search, Home, Stethoscope } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1rem',
        background: '#f8fafd',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 520,
          width: '100%',
          background: '#ffffff',
          borderRadius: 24,
          padding: '3rem 2rem',
          textAlign: 'center',
          boxShadow: '0 20px 45px rgba(0, 92, 85, 0.06)',
          border: '1px solid #e1e9ea',
        }}
      >
        <div
          style={{
            fontSize: '4.5rem',
            fontWeight: 900,
            color: '#005c55',
            lineHeight: 1,
            marginBottom: '0.75rem',
            letterSpacing: '-0.04em',
          }}
        >
          404
        </div>

        <h1
          style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            color: '#131b2e',
            margin: '0 0 0.75rem',
          }}
        >
          Equipment or Clinical Guide Not Found
        </h1>

        <p
          style={{
            fontSize: '0.925rem',
            color: '#6e7977',
            margin: '0 0 2rem',
            lineHeight: 1.6,
          }}
        >
          The page or medical equipment you are looking for might have been moved, updated, or does not exist in our active catalog.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/shop"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#005c55',
              color: '#ffffff',
              padding: '11px 22px',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: '0.875rem',
              textDecoration: 'none',
            }}
          >
            <Search size={16} />
            Search Catalog
          </Link>

          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#f1f5f9',
              color: '#131b2e',
              padding: '11px 20px',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: '0.875rem',
              textDecoration: 'none',
            }}
          >
            <Home size={16} />
            Back to Home
          </Link>
        </div>

        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
          <Link
            href="/assessment"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.85rem',
              color: '#005c55',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <Stethoscope size={16} />
            Need assistance choosing equipment? Take the Care Assessment →
          </Link>
        </div>
      </div>
    </div>
  );
}
