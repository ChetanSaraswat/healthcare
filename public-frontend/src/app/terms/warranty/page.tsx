'use client';

import React from 'react';

import { ShieldCheck, Award, Wrench, CheckCircle2 } from 'lucide-react';

export default function WarrantyTermsPage() {
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
              <Award size={16} /> Clinical Quality Standards
            </span>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#131b2e', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
              Warranty &amp; Equipment Guarantees
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#6e7977', margin: 0 }}>
              CDSCO Medical Device Compliance • ISO 13485 Certified Quality Management
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
                1. Manufacturer Warranty on Outright Purchases
              </h2>
              <p style={{ margin: 0 }}>
                All brand-new medical devices purchased through Omkar Healthcare carry the official comprehensive OEM warranty (typically 2 to 3 years for ResMed, Philips, and accredited manufacturers). Omkar Healthcare serves as your authorized medical liaison for warranty registration, servicing, and spare parts procurement.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#131b2e', margin: '0 0 10px' }}>
                2. Zero-Downtime Rental Replacement Guarantee
              </h2>
              <p style={{ margin: 0 }}>
                In the rare event that a rented medical machine reports an error code, power variance, or pressure drop, Omkar Healthcare guarantees a <strong>same-day machine replacement</strong> dispatched from the nearest city hub at zero additional fee. Critical respiratory and life-support devices are treated with 4-hour emergency SLA priority.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#131b2e', margin: '0 0 10px' }}>
                3. Doorstep Bio-Medical Calibration
              </h2>
              <p style={{ margin: 0 }}>
                Our technician visits your home with clinical calibration instruments to verify CPAP 95th percentile pressure delivery, oxygen concentrator molecular sieve purity (&gt;93% O2 at rated LPM), and device motor safety calibrations.
              </p>
            </section>
          </div>
        </div>
      </div>
  );
}
