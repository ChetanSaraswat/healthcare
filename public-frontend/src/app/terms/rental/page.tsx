'use client';

import React from 'react';
import Link from 'next/link';

import {
  FileText,
  ShieldCheck,
  RotateCcw,
  AlertCircle,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export default function RentalTermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#faf8ff', fontFamily: "'Plus Jakarta Sans', sans-serif", padding: '2.5rem 0 4rem' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 1.5rem' }}>
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 12px',
                borderRadius: 999,
                background: '#e8f5f3',
                color: '#005c55',
                fontSize: '0.8125rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 8,
              }}
            >
              <ShieldCheck size={16} /> Legal &amp; Operational Standards
            </span>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#131b2e', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
              Terms of Medical Equipment Rental
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#6e7977', margin: 0 }}>
              Effective Date: September 2026 • AarogyaMed Healthcare Systems Pvt. Ltd.
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
            {/* 1. Equal Footing & Rental Contract */}
            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#131b2e', margin: '0 0 10px' }}>
                1. Equal Footing &amp; Scope of Rental Agreement
              </h2>
              <p style={{ margin: 0 }}>
                Every hospital-grade device marked eligible for rental on AarogyaMed is provided under a certified clinical lease contract. The rental agreement is executed directly between AarogyaMed Healthcare Systems Pvt. Ltd. and the customer (patient or designated family caregiver) upon payment of the initial rental duration fee and refundable security deposit.
              </p>
            </section>

            {/* 2. Security Deposit Refund Framework */}
            <section
              style={{
                background: '#f8f9ff',
                padding: '1.5rem',
                borderRadius: 14,
                border: '1px solid #eaedff',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <RotateCcw size={20} color="#005c55" />
                <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#005c55', margin: 0 }}>
                  2. Refundable Security Deposit Policy (24-Hour SLA)
                </h2>
              </div>
              <p style={{ margin: '0 0 10px' }}>
                A security deposit is collected at checkout to safeguard hospital-grade infrastructure. AarogyaMed enforces an inviolable deposit return protocol:
              </p>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>Upon scheduling return pickup via the <strong>Active Rentals Dashboard</strong>, our biomedical technician conducts an on-site physical and functional check.</li>
                <li>Normal medical wear and cosmetic usage (scratches on casing, caster wheel usage) are <strong>fully accepted</strong> and incur zero deduction.</li>
                <li>The complete deposit amount is credited back to the customer’s original payment method or instant UPI ID within <strong>24 business hours</strong> of physical equipment pickup.</li>
              </ul>
            </section>

            {/* 3. 10-Step Sterilization & Quality Assurance */}
            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#131b2e', margin: '0 0 10px' }}>
                3. 10-Step Autoclave &amp; Sanitization Guarantee
              </h2>
              <p style={{ margin: '0 0 10px' }}>
                Every returned device undergoes rigorous laboratory decontamination in our Class 10 sterilization hubs before redeployment:
              </p>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>HEPA and bacterial filters on CPAP, BiPAP, and oxygen machines are <strong>100% brand-new</strong> and individually vacuum-sealed for each user.</li>
                <li>Internal pneumatic chambers and flow sensors are calibrated using calibrated mass-flow analyzers.</li>
                <li>Hospital bed frames and patient surfaces undergo medical-grade quaternary ammonium antimicrobial washing.</li>
              </ul>
            </section>

            {/* 4. Rental Extensions & Cancellations */}
            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#131b2e', margin: '0 0 10px' }}>
                4. Extensions, Upgrades &amp; Return Scheduling
              </h2>
              <p style={{ margin: 0 }}>
                Caregivers may extend active rental durations at any time at the discounted daily tier rate directly from the account dashboard without re-depositing security funds. Should patient circumstances necessitate early equipment return, unused rental days beyond the initial minimum period (7 days) are refunded pro-rata.
              </p>
            </section>

            {/* 5. Out-of-App Logistics Invariant */}
            <section style={{ borderTop: '1px solid #f2f3ff', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#913200', marginBottom: 8 }}>
                <AlertCircle size={18} />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>
                  5. Physical Delivery &amp; Installation Coordination
                </h3>
              </div>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>
                The AarogyaMed digital software platform concludes its transaction scope at order confirmation and payment capture. Physical doorstep transportation, elevator maneuvering of motorized ICU beds, and bedside clinical titration are coordinated manually by dedicated operations coordinators via telephone and WhatsApp.
              </p>
            </section>
          </div>
        </div>
      </div>
  );
}
