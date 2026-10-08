'use client';

import React from 'react';
import { RAZORPAY_METHOD_ONLINE, RAZORPAY_METHOD_COD } from '../types';
import { useTranslation } from '@/locales';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';

interface PaymentMethodSectionProps {
  selectedPaymentMethod: string;
  onSelectPaymentMethod: (method: string) => void;
  isSubmitting: boolean;
  totalPayableNow: number;
  errorMessage?: string;
}

export function PaymentMethodSection({
  selectedPaymentMethod,
  onSelectPaymentMethod,
  isSubmitting,
  totalPayableNow,
  errorMessage,
}: PaymentMethodSectionProps) {
  const { t, locale } = useTranslation();

  return (
    <>
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          border: '1px solid #dae2fd',
          padding: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#131b2e', margin: 0 }}>
            {t.checkout.paymentSection}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: '#005c55', fontWeight: 600 }}>
            <ShieldCheck size={16} />
            <span>100% CDSCO Compliant &amp; 256-bit Encrypted</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Option 1: Razorpay Online Gateway */}
          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14,
              padding: '16px 16px',
              borderRadius: 12,
              border: selectedPaymentMethod === RAZORPAY_METHOD_ONLINE ? '2px solid #005c55' : '1px solid #dae2fd',
              background: selectedPaymentMethod === RAZORPAY_METHOD_ONLINE ? '#eaf8f6' : '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={RAZORPAY_METHOD_ONLINE}
              checked={selectedPaymentMethod === RAZORPAY_METHOD_ONLINE}
              onChange={() => onSelectPaymentMethod(RAZORPAY_METHOD_ONLINE)}
              style={{ marginTop: 4, accentColor: '#005c55', width: 18, height: 18 }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                <strong style={{ fontSize: '0.9375rem', color: '#131b2e' }}>
                  {locale === 'hi' ? 'रेज़रपे सिक्योर ऑनलाइन पेमेंट' : 'Pay Online via Razorpay Gateway'}
                </strong>
                <span
                  style={{
                    background: '#005c55',
                    color: '#ffffff',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 9999,
                  }}
                >
                  {locale === 'hi' ? 'अनुशंसित • त्वरित प्रेषण' : 'Recommended • Instant Dispatch'}
                </span>
              </div>
              <p style={{ margin: '0 0 8px', fontSize: '0.8125rem', color: '#3e4947', lineHeight: 1.4 }}>
                {locale === 'hi'
                  ? 'यूपीआई क्यूआर (Google Pay, PhonePe, Paytm, BHIM), सभी बैंकों के क्रेडिट/डेबिट कार्ड और नेट बैंकिंग।'
                  : 'UPI QR (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards, Net Banking & Wallets in Razorpay Secure UI.'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.75rem', color: '#005c55', fontWeight: 600 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle2 size={13} color="#005c55" /> Zero Surcharge
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle2 size={13} color="#005c55" /> Instant Order Verification
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Lock size={12} color="#005c55" /> Razorpay Verified
                </span>
              </div>
            </div>
          </label>

          {/* Option 2: Payment on Biomedical Technician Arrival */}
          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14,
              padding: '16px 16px',
              borderRadius: 12,
              border: selectedPaymentMethod === RAZORPAY_METHOD_COD ? '2px solid #005c55' : '1px solid #dae2fd',
              background: selectedPaymentMethod === RAZORPAY_METHOD_COD ? '#eaf8f6' : '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={RAZORPAY_METHOD_COD}
              checked={selectedPaymentMethod === RAZORPAY_METHOD_COD}
              onChange={() => onSelectPaymentMethod(RAZORPAY_METHOD_COD)}
              style={{ marginTop: 4, accentColor: '#005c55', width: 18, height: 18 }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                <strong style={{ fontSize: '0.9375rem', color: '#131b2e' }}>
                  {locale === 'hi' ? 'बायोमेडिकल तकनीशियन आगमन पर भुगतान' : 'Payment on Biomedical Technician Arrival'}
                </strong>
                <span
                  style={{
                    background: '#e0f2fe',
                    color: '#0369a1',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 9999,
                  }}
                >
                  {locale === 'hi' ? 'क्लिनिकल सत्यापन पहले' : 'Clinical Verification First'}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: '#6e7977', lineHeight: 1.4 }}>
                {locale === 'hi'
                  ? 'स्टरलाइज़्ड सील का निरीक्षण करें और भुगतान करने से पहले तकनीशियन से मशीन कैलिब्रेशन की जांच करवाएं।'
                  : 'Inspect sterilized seal and test machine calibration with our certified biomedical technician before paying.'}
              </p>
            </div>
          </label>
        </div>
        {errorMessage && (
          <span style={{ display: 'block', color: '#ba1a1a', fontSize: '0.75rem', marginTop: 8 }}>
            {errorMessage}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          width: '100%',
          background: '#005c55',
          color: '#ffffff',
          padding: '16px 24px',
          borderRadius: 12,
          fontSize: '1.0625rem',
          fontWeight: 800,
          border: 'none',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          boxShadow: '0 8px 24px rgba(0, 92, 85, 0.3)',
          opacity: isSubmitting ? 0.75 : 1,
          transition: 'opacity 0.2s ease',
        }}
      >
        {isSubmitting ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                width: 18,
                height: 18,
                border: '2px solid #ffffff',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.6s linear infinite',
                display: 'inline-block',
              }}
            />
            <span>{locale === 'hi' ? 'ऑर्डर प्रोसेस हो रहा है...' : 'Processing Clinical Order & Payment...'}</span>
          </span>
        ) : selectedPaymentMethod === RAZORPAY_METHOD_ONLINE ? (
          <>
            <span>
              {locale === 'hi'
                ? `रेज़रपे से ₹${totalPayableNow.toLocaleString('en-IN')} भुगतान करें`
                : `Pay ₹${totalPayableNow.toLocaleString('en-IN')} via Razorpay`}
            </span>
            <ArrowRight size={18} />
          </>
        ) : (
          <>
            <span>
              {locale === 'hi'
                ? `ऑर्डर की पुष्टि करें और 4 घंटे में प्रेषण शेड्यूल करें (₹${totalPayableNow.toLocaleString('en-IN')})`
                : `Confirm Order & Schedule 4-Hour Dispatch (₹${totalPayableNow.toLocaleString('en-IN')})`}
            </span>
            <ArrowRight size={18} />
          </>
        )}
      </button>
    </>
  );
}
