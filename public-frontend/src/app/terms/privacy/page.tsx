'use client';

import React from 'react';

import { Lock } from 'lucide-react';

export default function PrivacyTermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#faf8ff', fontFamily: "'Plus Jakarta Sans', sans-serif", padding: '2.5rem 0 4rem' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 12px',
                borderRadius: 999,
                background: '#e8f5f3',
                color: '#16453A',
                fontSize: '0.8125rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 8,
              }}
            >
              <Lock size={16} /> Data Protection &amp; Confidentiality
            </span>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#131b2e', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
              Patient Health Data &amp; Privacy Policy
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#6e7977', margin: 0 }}>
              Compliance with Digital Personal Data Protection Act (DPDPA) &amp; Medical Confidentiality
            </p>
          </div>

          <div
            style={{
              background: '#ffffff',
              borderRadius: 20,
              padding: '2.5rem',
              border: '1px solid #dae2fd',
              boxShadow: '0 4px 20px rgba(19, 27, 46, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
              lineHeight: 1.7,
              color: '#3e4947',
            }}
          >
            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#131b2e', margin: '0 0 10px' }}>
                1. Confidential Handling of Patient Information
              </h2>
              <p style={{ margin: 0 }}>
                Omkar Healthcare recognizes that patient health diagnoses, clinical prescriptions, and residential care addresses are deeply personal. All information shared during order placement, rental scheduling, or clinical consultation is stored on encrypted HIPAA-compliant database infrastructure within Indian data centers.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#131b2e', margin: '0 0 10px' }}>
                2. Use of Telemetry &amp; Sleep Compliance Data
              </h2>
              <p style={{ margin: 0 }}>
                Certain connected CPAP and BiPAP devices (such as ResMed AirSense 10 with cellular modems) generate sleep therapy telemetry (AHI index, leak rates, mask adherence hours). This data is strictly utilized to generate titration compliance reports for your prescribing pulmonologist and is never shared with third-party marketers or advertisers.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#131b2e', margin: '0 0 10px' }}>
                3. Security Deposit &amp; Payment Credentials
              </h2>
              <p style={{ margin: 0 }}>
                Payment processing is handled via certified Level 1 PCI-DSS payment gateways (such as Razorpay). Omkar Healthcare never stores customer credit card numbers or UPI MPINs on internal servers.
              </p>
            </section>
          </div>
        </div>
      </div>
  );
}
