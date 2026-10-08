'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useTranslation } from '@/locales';
import { ClinicalInvoiceModal } from '@/components/invoice/ClinicalInvoiceModal';
import {
  CheckCircle2,
  ShieldCheck,
  Truck,
  PhoneCall,
  CalendarCheck,
  Clock,
  ArrowRight,
  FileText,
  Printer,
  CreditCard,
  AlertTriangle,
} from 'lucide-react';

function OrderConfirmationContent() {
  const { t, locale } = useTranslation();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('paymentId');
  const method = searchParams.get('method');
  const statusParam = searchParams.get('status');

  const latestOrder = useAppSelector((state) => state.orders.latestPlacedOrder);
  const latestRental = useAppSelector((state) => state.rentals.latestPlacedRental);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const orderNum = latestOrder?.orderNumber || 'ARM-BUY-2026-9482';
  const rentalNum = latestRental?.rentalOrderNumber || 'ARM-RNT-2026-3391';

  // In the Razorpay instant capture flow, orders reaching confirmation are confirmed immediately
  const isFailed = statusParam === 'failed';

  return (
    <div style={{ maxWidth: 840, margin: '3rem auto 6rem', padding: '0 1.5rem' }}>

      {/* 1. Failed State */}
      {isFailed && (
        <div
          style={{
            background: '#ffffff',
            borderRadius: 24,
            border: '1.5px solid #fecaca',
            boxShadow: '0 10px 32px rgba(220, 38, 38, 0.08)',
            padding: '3.5rem 2rem',
            textAlign: 'center',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: '50%',
              background: '#fef2f2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              border: '2px solid #dc2626',
            }}
          >
            <AlertTriangle size={44} />
          </div>

          <span
            style={{
              background: '#fef2f2',
              color: '#dc2626',
              fontSize: '0.8125rem',
              fontWeight: 700,
              padding: '4px 14px',
              borderRadius: 9999,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {locale === 'hi' ? 'भुगतान विफल' : 'Payment Failed'}
          </span>

          <h1 style={{ fontSize: '2.125rem', fontWeight: 800, color: '#131b2e', margin: '1rem 0 0.5rem' }}>
            {locale === 'hi' ? 'भुगतान की पुष्टि नहीं हो सकी' : 'Payment Could Not Be Confirmed'}
          </h1>
          <p style={{ color: '#52605d', fontSize: '1.0625rem', maxWidth: 620, margin: '0 auto 2rem', lineHeight: 1.6 }}>
            {locale === 'hi'
              ? 'गेटवे ने इस भुगतान को अस्वीकार कर दिया। आपके खाते से कोई राशि नहीं काटी गई है, या कटी हुई राशि स्वतः वापस आ जाएगी। कृपया पुनः प्रयास करें।'
              : 'The gateway reported that this payment attempt was declined or cancelled. Your order remains pending and you can retry payment.'}
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link
              href="/checkout"
              style={{
                background: '#005c55',
                color: '#ffffff',
                padding: '12px 24px',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: '0.9375rem',
                textDecoration: 'none',
              }}
            >
              Retry Payment
            </Link>
            <Link
              href="/shop"
              style={{
                background: '#faf8ff',
                color: '#00201d',
                padding: '12px 24px',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: '0.9375rem',
                border: '1.5px solid #dae2fd',
                textDecoration: 'none',
              }}
            >
              Return to Catalog
            </Link>
          </div>
        </div>
      )}

      {/* 2. Confirmed State (Rendered when captured or COD) */}
      {!isFailed && (
        <>
          <div
        style={{
          background: '#ffffff',
          borderRadius: 24,
          border: '1.5px solid #a3faef',
          boxShadow: '0 10px 32px rgba(0, 92, 85, 0.08)',
          padding: '3rem 2rem',
          textAlign: 'center',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: '#eaf8f6',
            color: '#005c55',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            border: '2px solid #005c55',
          }}
        >
          <CheckCircle2 size={44} />
        </div>

        <span
          style={{
            background: '#eaf8f6',
            color: '#005c55',
            fontSize: '0.8125rem',
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: 9999,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {t.confirmation.badge}
        </span>

        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#131b2e', margin: '0.75rem 0' }}>
          {t.confirmation.title}
        </h1>
        <p style={{ color: '#3e4947', fontSize: '1.0625rem', maxWidth: 620, margin: '0 auto 2rem', lineHeight: 1.6 }}>
          {t.confirmation.subtitle}
        </p>

        {/* Reference Numbers Box */}
        <div
          style={{
            display: 'inline-flex',
            gap: 24,
            background: '#faf8ff',
            border: '1px solid #dae2fd',
            borderRadius: 14,
            padding: '14px 24px',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {latestOrder && (
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6e7977', textTransform: 'uppercase', fontWeight: 700 }}>
                {locale === 'hi' ? 'उपकरण खरीद संदर्भ:' : 'Equipment Purchase Ref:'}
              </div>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#005c55' }}>{orderNum}</div>
            </div>
          )}
          {latestRental && (
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6e7977', textTransform: 'uppercase', fontWeight: 700 }}>
                {locale === 'hi' ? 'रेंटल अनुबंध संदर्भ:' : 'Rental Agreement Ref:'}
              </div>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#ea580c' }}>{rentalNum}</div>
            </div>
          )}
          {!latestOrder && !latestRental && (
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6e7977', textTransform: 'uppercase', fontWeight: 700 }}>
                {locale === 'hi' ? 'संदर्भ संख्या:' : 'Reference Number:'}
              </div>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#005c55' }}>ARM-2026-CONFIRMED</div>
            </div>
          )}
        </div>

        {/* Payment Verification / Method Badge */}
        {paymentId && (
          <div style={{ marginBottom: '2rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#eaf8f6',
                border: '1.5px solid #005c55',
                color: '#005c55',
                padding: '8px 18px',
                borderRadius: 9999,
                fontSize: '0.875rem',
                fontWeight: 700,
              }}
            >
              <ShieldCheck size={18} />
              <span>
                {locale === 'hi'
                  ? `Razorpay भुगतान सत्यापित: ${paymentId}`
                  : `Razorpay Gateway Verified: ${paymentId}`}
              </span>
            </div>
          </div>
        )}

        {method === 'cod' && (
          <div style={{ marginBottom: '2rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#fff0eb',
                border: '1.5px solid #ea580c',
                color: '#ea580c',
                padding: '8px 18px',
                borderRadius: 9999,
                fontSize: '0.875rem',
                fontWeight: 700,
              }}
            >
              <Truck size={18} />
              <span>
                {locale === 'hi'
                  ? 'पे ऑन होम डिलीवरी / इंस्टॉलेशन पर भुगतान'
                  : 'Pay on Delivery / Technician Home Installation'}
              </span>
            </div>
          </div>
        )}

        {/* 4-Hour Timeframe Box */}
        <div
          style={{
            background: '#eaf8f6',
            border: '1px solid #a3faef',
            borderRadius: 12,
            padding: '16px',
            maxWidth: 600,
            margin: '0 auto 2.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            textAlign: 'left',
          }}
        >
          <Clock size={28} color="#005c55" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, color: '#00201d', fontSize: '0.9375rem' }}>
              {locale === 'hi' ? 'अनुमानित डोरस्टेप डिलीवरी: आज 4 घंटे के भीतर' : 'Estimated Doorstep Arrival: Today within 4 Hours'}
            </div>
            <div style={{ fontSize: '0.8125rem', color: '#52605d', marginTop: 2 }}>
              {locale === 'hi'
                ? 'हमारा बायोमेडिकल तकनीशियन उपकरण को आपके घर लाकर स्टरलाइज़्ड सील खोलेगा और संचालन प्रदर्शन देगा।'
                : 'Our biomedical technician will deliver the device, unseal in front of you, and perform patient calibration.'}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setIsInvoiceOpen(true)}
            style={{
              background: '#005c55',
              color: '#ffffff',
              padding: '12px 24px',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: '0.9375rem',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 12px rgba(0, 92, 85, 0.25)',
            }}
          >
            <FileText size={18} />
            {locale === 'hi' ? 'क्लिनिकल जीएसटी टैक्स इनवॉइस देखें' : 'View Clinical GST Tax Invoice'}
          </button>

          <Link
            href="/account/orders"
            style={{
              background: '#faf8ff',
              color: '#00201d',
              padding: '12px 24px',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: '0.9375rem',
              border: '1.5px solid #dae2fd',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {locale === 'hi' ? 'ऑर्डर इतिहास' : 'View Order History'}
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/shop"
            style={{
              background: 'transparent',
              color: '#6e7977',
              padding: '12px 20px',
              borderRadius: 12,
              fontWeight: 600,
              fontSize: '0.9375rem',
              border: 'none',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {t.confirmation.returnCatalog}
          </Link>
        </div>
      </div>

      {/* Clinical Operations Guide Card */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 20,
          border: '1px solid #dae2fd',
          padding: '2rem',
          boxShadow: '0 4px 16px rgba(19, 27, 46, 0.04)',
        }}
      >
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#131b2e', marginBottom: '1.5rem' }}>
          {t.confirmation.whatNext}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#eaf8f6',
                color: '#005c55',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.875rem',
                flexShrink: 0,
              }}
            >
              1
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#131b2e', fontSize: '0.9375rem' }}>
                {t.confirmation.step1Title}
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#6e7977', marginTop: 2 }}>
                {t.confirmation.step1Desc}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#eaf8f6',
                color: '#005c55',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.875rem',
                flexShrink: 0,
              }}
            >
              2
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#131b2e', fontSize: '0.9375rem' }}>
                {t.confirmation.step2Title}
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#6e7977', marginTop: 2 }}>
                {t.confirmation.step2Desc}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#eaf8f6',
                color: '#005c55',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.875rem',
                flexShrink: 0,
              }}
            >
              3
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#131b2e', fontSize: '0.9375rem' }}>
                {t.confirmation.step3Title}
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#6e7977', marginTop: 2 }}>
                {t.confirmation.step3Desc}
              </div>
            </div>
          </div>
        </div>
      </div>
        </>
      )}

      {/* Clinical GST Tax Invoice Modal */}
      <ClinicalInvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        order={latestOrder || latestRental}
        orderType={latestOrder ? 'buy' : 'rent'}
      />
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div style={{ maxWidth: 840, margin: '4rem auto', textAlign: 'center', color: '#6e7977' }}>
          Loading order confirmation details...
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
