'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';
import { BlogPost } from '@/domain/entities/blog.entity';
import {
  BookOpen,
  ArrowRight,
  PhoneCall,
  Clock,
  X,
  Tag,
  ShieldCheck,
  Share2,
  CheckCircle2,
} from 'lucide-react';

export default function CaregiverHubPage() {
  const locale = useAppSelector((state) => state.ui.locale);
  const rawPosts = useAppSelector((state) => state.blog?.posts || []);
  const publishedPosts = rawPosts.filter((p) => p.status === 'published');

  const [activeReadingPost, setActiveReadingPost] = useState<BlogPost | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div style={{ maxWidth: 1280, margin: '2rem auto 6rem', padding: '0 1.5rem' }}>
      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(135deg, #005c55 0%, #006398 100%)',
          borderRadius: 24,
          color: '#ffffff',
          padding: '3.5rem 2.5rem',
          marginBottom: '3.5rem',
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '2.5rem',
          alignItems: 'center',
        }}
      >
        <div>
          <span
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: '#9cf2e8',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '4px 12px',
              borderRadius: 9999,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {locale === 'hi' ? 'क्लीनिकल ज्ञान केंद्र' : 'Clinical Knowledge Hub'}
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '1rem 0', lineHeight: 1.2 }}>
            {locale === 'hi'
              ? 'देखभालकर्ता क्लीनिकल मार्गदर्शन और उपकरण प्रोटोकॉल'
              : 'Caregiver Clinical Guidance & Equipment Protocols'}
          </h1>
          <p style={{ fontSize: '1.0625rem', color: '#dae2fd', lineHeight: 1.6, maxWidth: 620, margin: 0 }}>
            {locale === 'hi'
              ? 'भारतीय परिवारों को घर पर मरीजों की गुणवत्तापूर्ण और सुरक्षित देखभाल हेतु बायोमेडिकल इंजीनियरों और वरिष्ठ नर्सिंग विशेषज्ञों द्वारा प्रमाणित।'
              : 'Curated by biomedical engineers and clinical nursing advisors to empower Indian families caring for recovering patients at home.'}
          </p>
        </div>

        <div style={{ borderRadius: 16, overflow: 'hidden', height: 240, border: '3px solid rgba(255,255,255,0.2)' }}>
          <img
            src="/images/caregiver.png"
            alt="Compassionate geriatric caregiver"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* Articles Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '2rem',
          marginBottom: '4rem',
        }}
      >
        {publishedPosts.map((art) => {
          const isHi = locale === 'hi' && Boolean(art.translations?.hi?.title);
          const title = isHi ? art.translations!.hi!.title : art.title;
          const summary = isHi ? art.translations!.hi!.summary || art.summary : art.summary;

          return (
            <div
              key={art.id}
              style={{
                background: '#ffffff',
                borderRadius: 20,
                border: '1px solid #dae2fd',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 2px 8px rgba(19, 27, 46, 0.04)',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
              }}
            >
              <div style={{ height: 180, background: '#f2f3ff', overflow: 'hidden' }}>
                <img
                  src={art.coverImage || '/images/caregiver.png'}
                  alt={title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#005c55', textTransform: 'uppercase' }}>
                    {art.category || 'Clinical Guidance'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#6e7977' }}>{art.readTime || '5 min read'}</span>
                </div>

                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#131b2e', lineHeight: 1.35, marginBottom: '0.75rem' }}>
                  {title}
                </h3>

                <p style={{ fontSize: '0.875rem', color: '#3e4947', lineHeight: 1.5, marginBottom: '1.5rem', flex: 1 }}>
                  {summary}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #eaedff' }}>
                  <button
                    type="button"
                    onClick={() => setActiveReadingPost(art)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      color: '#005c55',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    {locale === 'hi' ? 'पूरा लेख पढ़ें' : 'Read Full Protocol'} <ArrowRight size={14} />
                  </button>

                  {art.shopLink && (
                    <Link
                      href={art.shopLink}
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#006398',
                        textDecoration: 'none',
                      }}
                    >
                      {locale === 'hi' ? 'उपकरण देखें &rarr;' : 'View Equipment &rarr;'}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Article Reader Modal */}
      {activeReadingPost && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 24,
              width: '100%',
              maxWidth: 860,
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.5rem 2rem',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                background: '#ffffff',
                zIndex: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    background: '#e6f4f2',
                    color: '#005c55',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: 999,
                  }}
                >
                  {activeReadingPost.category || 'Clinical Protocol'}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {activeReadingPost.readTime || '5 min read'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  type="button"
                  onClick={handleShare}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    color: '#475569',
                    cursor: 'pointer',
                    padding: '6px 12px',
                    borderRadius: 8,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  {copiedLink ? <CheckCircle2 size={14} color="#16a34a" /> : <Share2 size={14} />}
                  <span>{copiedLink ? 'Copied' : 'Share'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReadingPost(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: 6,
                    borderRadius: 8,
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Article Content */}
            <div style={{ padding: '2.5rem 2.5rem 3rem' }}>
              <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.25, marginBottom: '1rem' }}>
                {locale === 'hi' && activeReadingPost.translations?.hi?.title
                  ? activeReadingPost.translations.hi.title
                  : activeReadingPost.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2rem', color: '#64748b', fontSize: '0.8125rem' }}>
                <span style={{ fontWeight: 600, color: '#334155' }}>
                  By {activeReadingPost.authorName || 'AarogyaMed Editorial Team'}
                </span>
                &bull;
                <span>Reviewed by Senior Biomedical Consultants</span>
              </div>

              {activeReadingPost.coverImage && (
                <div style={{ borderRadius: 16, overflow: 'hidden', maxHeight: 320, marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
                  <img
                    src={activeReadingPost.coverImage}
                    alt={activeReadingPost.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}

              {/* Body */}
              <div
                style={{
                  fontSize: '1rem',
                  lineHeight: 1.75,
                  color: '#334155',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {locale === 'hi' && activeReadingPost.translations?.hi?.body
                  ? activeReadingPost.translations.hi.body
                  : activeReadingPost.body}
              </div>

              {/* Bottom Equipment CTA */}
              {activeReadingPost.shopLink && (
                <div
                  style={{
                    marginTop: '3rem',
                    padding: '1.5rem 2rem',
                    borderRadius: 16,
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 16,
                  }}
                >
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#166534' }}>
                      Recommended Medical Equipment for this Protocol
                    </h4>
                    <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: '#15803d' }}>
                      Available for hospital-grade rental or direct purchase with certified sanitization.
                    </p>
                  </div>

                  <Link
                    href={activeReadingPost.shopLink}
                    style={{
                      background: '#16a34a',
                      color: '#ffffff',
                      padding: '10px 20px',
                      borderRadius: 10,
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      textDecoration: 'none',
                    }}
                  >
                    Browse Equipment &rarr;
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Caregiver Hotline Callout */}
      <div
        style={{
          background: '#f2f3ff',
          borderRadius: 20,
          border: '1px solid #dae2fd',
          padding: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 20,
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#131b2e', marginBottom: 6 }}>
            {locale === 'hi'
              ? 'क्या आपको डॉक्टर के पर्चे पर मार्गदर्शन की आवश्यकता है?'
              : "Need Guidance on a Doctor's Prescription?"}
          </h3>
          <p style={{ color: '#3e4947', fontSize: '0.9375rem', margin: 0, maxWidth: 600 }}>
            {locale === 'hi'
              ? 'अपनी डिस्चार्ज समरी या डॉक्टर का पर्चा साझा करें। हमारी बायोमेडिकल टीम आवश्यक उपकरणों का सही विनिर्देश निर्धारित करेगी।'
              : 'Share your discharge summary or physician prescription. Our biomedical counseling team will configure the exact specifications required.'}
          </p>
        </div>

        <a
          href="tel:18008892273"
          style={{
            background: '#005c55',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: 9999,
            fontWeight: 700,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <PhoneCall size={18} />
          <span>1800-889-2273 (Toll Free)</span>
        </a>
      </div>
    </div>
  );
}
