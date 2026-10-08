'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useAppDispatch } from '@/store/hooks';
import { useTranslation } from '@/locales';
import { axiosInterceptorInstanceClient } from '@/config/axios';
import {
  ShieldCheck,
  FileText,
  Lock,
  RotateCcw,
  RefreshCw,
  Clock,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface PolicyData {
  id: number;
  slug: string;
  title: string;
  body: string;
  locale: string;
  updated_at: string;
}

const POLICY_TABS = [
  { slug: 'terms', labelEn: 'Terms & Conditions', labelHi: 'नियम एवं शर्तें', icon: FileText },
  { slug: 'privacy', labelEn: 'Privacy Policy', labelHi: 'गोपनीयता नीति', icon: Lock },
  { slug: 'rental-policy', labelEn: 'Rental & Escrow Policy', labelHi: 'रेंटल एवं एस्क्रो नीति', icon: RefreshCw },
  { slug: 'refund-policy', labelEn: 'Refund & Cancellation', labelHi: 'रिफंड एवं रद्दीकरण', icon: RotateCcw },
];

export default function PolicyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const activeSlug = resolvedParams.slug || 'terms';
  const { locale } = useTranslation();

  const [policy, setPolicy] = useState<PolicyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    axiosInterceptorInstanceClient
      .get(`/policies/${activeSlug}`, {
        params: { locale },
      })
      .then((res) => {
        if (isMounted && res.data && res.data.data) {
          setPolicy(res.data.data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn('[PolicyPage] Failed to fetch policy:', err);
          setError('Unable to load latest policy version. Showing cached standards.');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeSlug, locale]);

  return (
    <div style={{ minHeight: '100vh', background: '#faf8ff', padding: '2.5rem 0 5rem' }}>
      <div style={{ maxWidth: 1040, margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8125rem', color: '#6e7977', marginBottom: 20 }}>
          <Link href="/" style={{ color: '#005c55', textDecoration: 'none', fontWeight: 600 }}>Home</Link>
          <ChevronRight size={14} />
          <span>Policies &amp; Legal Trust</span>
        </div>

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
            <ShieldCheck size={16} /> CDSCO &amp; ISO 13485 Registered Healthcare Systems
          </span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#131b2e', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
            {policy ? policy.title : 'Healthcare Trust & Operational Policies'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: '0.8125rem', color: '#6e7977' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Clock size={14} />
              Last Updated:{' '}
              {policy?.updated_at
                ? new Date(policy.updated_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : 'Current Standard (Active)'}
            </span>
            <span>• Managed in Real-Time by AarogyaMed Compliance Bureau</span>
          </div>
        </div>

        {/* Policy Category Tabs */}
        <div
          style={{
            display: 'flex',
            gap: 10,
            overflowX: 'auto',
            paddingBottom: 8,
            marginBottom: '2rem',
            scrollbarWidth: 'none',
          }}
        >
          {POLICY_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSlug === tab.slug;
            return (
              <Link
                key={tab.slug}
                href={`/policies/${tab.slug}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 18px',
                  borderRadius: 12,
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  border: isActive ? '2px solid #005c55' : '1px solid #dae2fd',
                  background: isActive ? '#005c55' : '#ffffff',
                  color: isActive ? '#ffffff' : '#334155',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 4px 12px rgba(0, 92, 85, 0.2)' : 'none',
                }}
              >
                <Icon size={16} />
                <span>{locale === 'hi' ? tab.labelHi : tab.labelEn}</span>
              </Link>
            );
          })}
        </div>

        {/* Content Card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 20,
            padding: '2.5rem',
            border: '1px solid #dae2fd',
            boxShadow: '0 4px 20px rgba(19, 27, 46, 0.03)',
            lineHeight: 1.75,
            color: '#334155',
          }}
        >
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ height: 28, width: '40%', background: '#e2e8f0', borderRadius: 8 }} />
              <div style={{ height: 16, width: '90%', background: '#f1f5f9', borderRadius: 6 }} />
              <div style={{ height: 16, width: '80%', background: '#f1f5f9', borderRadius: 6 }} />
              <div style={{ height: 16, width: '85%', background: '#f1f5f9', borderRadius: 6 }} />
              <div style={{ height: 180, width: '100%', background: '#f8fafc', borderRadius: 12, marginTop: 12 }} />
            </div>
          ) : (
            <div style={{ whiteSpace: 'pre-line', fontSize: '0.9375rem' }}>
              {policy?.body}
            </div>
          )}

          {/* Verification Footnote */}
          <div
            style={{
              marginTop: '2.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
              fontSize: '0.8125rem',
              color: '#6e7977',
            }}
          >
            <span>
              AarogyaMed Healthcare Systems Pvt. Ltd. • CIN: U85110DL2026PTC099881
            </span>
            <span style={{ color: '#005c55', fontWeight: 600 }}>
              Official Active Policy Version (Live)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
