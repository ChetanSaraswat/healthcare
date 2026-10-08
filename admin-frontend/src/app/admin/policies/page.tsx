'use client';

import React, { useState, useEffect } from 'react';
import { axiosInterceptorInstanceClient } from '@/config/axios';
import {
  ShieldCheck,
  FileText,
  Lock,
  RefreshCw,
  RotateCcw,
  CheckCircle2,
  Clock,
  Save,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface PolicyTranslation {
  locale: string;
  title: string;
  body: string;
}

interface PolicyResponse {
  id: number;
  slug: string;
  is_active: boolean;
  updated_at: string;
  title: string;
  body: string;
  translations: PolicyTranslation[];
}

const POLICIES = [
  { slug: 'terms', label: 'Terms & Conditions', icon: FileText },
  { slug: 'privacy', label: 'Privacy Policy', icon: Lock },
  { slug: 'rental-policy', label: 'Rental Agreement & Deposit SLA', icon: RefreshCw },
  { slug: 'refund-policy', label: 'Refund & Cancellation Policy', icon: RotateCcw },
];

export default function AdminPoliciesPage() {
  const [selectedSlug, setSelectedSlug] = useState('terms');
  const [activeLocale, setActiveLocale] = useState<'en' | 'hi'>('en');

  const [titleEn, setTitleEn] = useState('');
  const [bodyEn, setBodyEn] = useState('');
  const [titleHi, setTitleHi] = useState('');
  const [bodyHi, setBodyHi] = useState('');
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch policy for selectedSlug
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setErrorMessage(null);
    setSaveSuccess(false);

    axiosInterceptorInstanceClient
      .get(`/policies/${selectedSlug}`)
      .then((res) => {
        if (!isMounted) return;
        const data: PolicyResponse = res.data.data;
        if (data) {
          setUpdatedAt(data.updated_at);
          const enTrans = data.translations?.find((t) => t.locale === 'en');
          const hiTrans = data.translations?.find((t) => t.locale === 'hi');

          setTitleEn(enTrans?.title || data.title || '');
          setBodyEn(enTrans?.body || data.body || '');
          setTitleHi(hiTrans?.title || '');
          setBodyHi(hiTrans?.body || '');
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn('[AdminPolicies] Fetch error:', err);
        setErrorMessage('Failed to load policy. You can still author new policy text below.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedSlug]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);
    setSaveSuccess(false);

    try {
      const res = await axiosInterceptorInstanceClient.put(`/policies/${selectedSlug}`, {
        titleEn,
        bodyEn,
        titleHi,
        bodyHi,
        is_active: true,
      });

      if (res.data?.data) {
        setUpdatedAt(res.data.data.updated_at);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      console.error('[AdminPolicies] Save error:', err);
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to save policy');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: '1.75rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#131b2e', margin: 0, letterSpacing: '-0.02em' }}>
            Legal Policies &amp; Compliance Management
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6e7977', margin: '4px 0 0' }}>
            Manage and publish clinical customer agreements, rental deposit guarantees, privacy policies, and refund rules. Updates go live immediately without frontend redeployment.
          </p>
        </div>

        <a
          href={`http://localhost:3000/policies/${selectedSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '9px 16px',
            borderRadius: 10,
            background: '#ffffff',
            border: '1px solid #dae2fd',
            color: '#005c55',
            fontSize: '0.875rem',
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          <ExternalLink size={15} />
          <span>View Live Customer Policy</span>
        </a>
      </div>

      {/* Main Grid: Policy Picker Tabs & Authoring Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Left Column: Select Policy */}
        <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #dae2fd', padding: 14 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6e7977', textTransform: 'uppercase', padding: '8px 12px' }}>
            Select Policy to Manage
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {POLICIES.map((p) => {
              const Icon = p.icon;
              const isSelected = selectedSlug === p.slug;
              return (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => setSelectedSlug(p.slug)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: isSelected ? '1.5px solid #005c55' : '1px solid transparent',
                    background: isSelected ? '#e8f5f3' : 'transparent',
                    color: isSelected ? '#005c55' : '#131b2e',
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Icon size={16} />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Editor */}
        <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #dae2fd', padding: '1.75rem' }}>
          {/* Status and Last Updated */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8125rem', color: '#6e7977' }}>
              <Clock size={15} />
              <span>
                Last Published Version:{' '}
                {updatedAt
                  ? new Date(updatedAt).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Default Template (Active)'}
              </span>
            </div>

            {/* Language Switcher Tabs */}
            <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 8, padding: 3 }}>
              <button
                type="button"
                onClick={() => setActiveLocale('en')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 6,
                  border: 'none',
                  background: activeLocale === 'en' ? '#005c55' : 'transparent',
                  color: activeLocale === 'en' ? '#ffffff' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                }}
              >
                English (EN)
              </button>
              <button
                type="button"
                onClick={() => setActiveLocale('hi')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 6,
                  border: 'none',
                  background: activeLocale === 'hi' ? '#005c55' : 'transparent',
                  color: activeLocale === 'hi' ? '#ffffff' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                }}
              >
                हिन्दी (HI)
              </button>
            </div>
          </div>

          {errorMessage && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 14px',
                borderRadius: 10,
                background: '#fef2f2',
                border: '1px solid #fee2e2',
                color: '#b91c1c',
                fontSize: '0.875rem',
                marginBottom: 16,
              }}
            >
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {saveSuccess && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 14px',
                borderRadius: 10,
                background: '#f0fdf4',
                border: '1px solid #dcfce7',
                color: '#166534',
                fontSize: '0.875rem',
                marginBottom: 16,
              }}
            >
              <CheckCircle2 size={16} />
              <span>Policy published live successfully! All customer views updated.</span>
            </div>
          )}

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {activeLocale === 'en' ? (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', marginBottom: 6 }}>
                    Policy Title (English)
                  </label>
                  <input
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', marginBottom: 6 }}>
                    Policy Body / Clauses (English Markdown)
                  </label>
                  <textarea
                    required
                    rows={16}
                    value={bodyEn}
                    onChange={(e) => setBodyEn(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 10,
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.875rem',
                      fontFamily: 'monospace',
                      lineHeight: 1.6,
                      resize: 'vertical',
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', marginBottom: 6 }}>
                    Policy Title (Hindi / हिन्दी)
                  </label>
                  <input
                    type="text"
                    placeholder="हिन्दी शीर्षक..."
                    value={titleHi}
                    onChange={(e) => setTitleHi(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', marginBottom: 6 }}>
                    Policy Body / Clauses (Hindi / हिन्दी)
                  </label>
                  <textarea
                    rows={16}
                    placeholder="हिन्दी में नीति विवरण दर्ज करें..."
                    value={bodyHi}
                    onChange={(e) => setBodyHi(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 10,
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.875rem',
                      fontFamily: 'monospace',
                      lineHeight: 1.6,
                      resize: 'vertical',
                    }}
                  />
                </div>
              </>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
              <button
                type="submit"
                disabled={saving || loading}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '11px 24px',
                  borderRadius: 10,
                  background: '#005c55',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                  boxShadow: '0 4px 12px rgba(0,92,85,0.25)',
                }}
              >
                <Save size={16} />
                <span>{saving ? 'Publishing Updates...' : 'Save & Publish Live Policy'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
