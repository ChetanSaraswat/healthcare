'use client';

import React, { use, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getStaticConditionBySlug } from '@/content/learn/conditions';
import { ConditionEntity } from '@/domain/entities/condition.entity';
import { listProducts } from '@/features/products/list-products/list-products.action';
import { ProductCard } from '@/components/product/ProductCard';
import { useTranslation } from '@/locales';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  ShieldAlert,
  HeartHandshake,
  CheckCircle2,
  ChevronRight,
  HeartPulse,
  Brain,
  Activity,
  Sparkles,
  Layers,
  ShoppingBag,
} from 'lucide-react';

interface ConditionPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ConditionDetailPage({ params }: ConditionPageProps) {
  const resolvedParams = use(params);
  const dispatch = useAppDispatch();
  const { t, locale } = useTranslation();

  const condition = getStaticConditionBySlug(resolvedParams.slug);

  if (!condition) {
    notFound();
  }

  const localized = ConditionEntity.getLocalized(condition, locale);

  const productsFromStore = useAppSelector((state) => state.products.products);
  const productsLoading = useAppSelector((state) => state.products.loading);

  useEffect(() => {
    if (!productsFromStore || productsFromStore.length === 0) {
      dispatch(listProducts());
    }
  }, [dispatch, productsFromStore]);

  // Tag-based linking: find live products matching this condition's tag
  const matchingProducts = (productsFromStore || []).filter((p) =>
    p.conditionTags?.includes(condition.tag)
  );

  return (
    <div style={{ maxWidth: 1280, margin: '2rem auto 6rem', padding: '0 1.5rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Breadcrumbs */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '0.8125rem',
          color: '#6e7977',
          marginBottom: '2rem',
        }}
      >
        <Link href="/" style={{ color: '#16453A', textDecoration: 'none' }}>
          {locale === 'hi' ? 'होम' : 'Home'}
        </Link>
        <ChevronRight size={14} />
        <Link href="/learn" style={{ color: '#16453A', textDecoration: 'none' }}>
          {t.common.educationGuides || (locale === 'hi' ? 'शिक्षा एवं केयर गाइड' : 'Education & Guides')}
        </Link>
        <ChevronRight size={14} />
        <span style={{ color: '#131b2e', fontWeight: 600 }}>{localized.name}</span>
      </nav>

      {/* Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F352C 0%, #16453A 100%)',
          borderRadius: 24,
          color: '#ffffff',
          padding: '3.5rem 2.5rem',
          marginBottom: '3.5rem',
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '2.5rem',
          alignItems: 'center',
          boxShadow: '0 8px 32px rgba(0, 71, 65, 0.15)',
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
            {locale === 'hi' ? 'क्लिनिकल केयरगिवर गाइड' : 'Clinical Caregiver Guide'}
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '1rem 0', lineHeight: 1.2 }}>
            {localized.name}
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#dae2fd', lineHeight: 1.6, maxWidth: 620, margin: 0 }}>
            {localized.shortDescription}
          </p>
        </div>

        <div style={{ borderRadius: 16, overflow: 'hidden', height: 260, border: '3px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.1)' }}>
          <img
            src={condition.heroImage || '/images/caregiver.png'}
            alt={localized.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* 1. Symptoms Section */}
      <section style={{ marginBottom: '4.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.75rem' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: '#ffdad6',
              color: '#ba1a1a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldAlert size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ba1a1a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {locale === 'hi' ? 'नैदानिक लक्षण पहचान' : 'Clinical Symptom Profiling'}
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#131b2e', margin: 0 }}>
              {locale === 'hi' ? 'नैदानिक लक्षणों की पहचान' : 'Recognizing Clinical Symptoms'}
            </h2>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: localized.symptomsIllustration ? '1.1fr 0.9fr' : '1fr',
            gap: '2.5rem',
            alignItems: 'start',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {localized.symptoms.map((sym, idx) => (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  borderRadius: 16,
                  padding: '1.25rem 1.5rem',
                  border: '1px solid #dae2fd',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                }}
              >
                <strong style={{ display: 'block', fontSize: '1.0625rem', color: '#131b2e', marginBottom: 6 }}>
                  {sym.title}
                </strong>
                <p style={{ fontSize: '0.875rem', color: '#52605d', lineHeight: 1.5, margin: 0 }}>
                  {sym.description}
                </p>
              </div>
            ))}
          </div>

          {localized.symptomsIllustration && (
            <div
              style={{
                background: '#ffffff',
                borderRadius: 20,
                overflow: 'hidden',
                border: '1px solid #dae2fd',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              }}
            >
              <img
                src={localized.symptomsIllustration.imageUrl}
                alt={localized.symptomsIllustration.alt}
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain', background: '#f8fafc', maxHeight: 420 }}
              />
              <div
                style={{
                  padding: '12px 18px',
                  background: '#f9fbfb',
                  borderTop: '1px solid #eef2f6',
                  fontSize: '0.75rem',
                  color: '#52605d',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                <span style={{ fontWeight: 500 }}>{localized.symptomsIllustration.alt}</span>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    color: '#16453A',
                    background: '#e0f3f0',
                    padding: '3px 8px',
                    borderRadius: 6,
                  }}
                >
                  {localized.symptomsIllustration.sourceAttribution}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. Systemic Health Effects Section (Content Blocks) */}
      {localized.contentBlocks && localized.contentBlocks.length > 0 && (
        <section style={{ marginBottom: '4.5rem' }}>
          <div style={{ marginBottom: '2.5rem', textAlign: 'left' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fee2e2', color: '#b91c1c', fontSize: '0.75rem', fontWeight: 800, padding: '4px 12px', borderRadius: 9999, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              <Layers size={14} />
              <span>{locale === 'hi' ? 'प्रणालीगत स्वास्थ्य प्रभाव' : 'Systemic Health & Organ Impact'}</span>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#131b2e', margin: '0.5rem 0 0.5rem' }}>
              {locale === 'hi' ? 'शरीर के प्रमुख अंगों पर स्लीप एप्निया के प्रभाव' : 'Systemic Health Effects & Secondary Risks'}
            </h2>
            <p style={{ fontSize: '1rem', color: '#52605d', maxWidth: 820, margin: 0, lineHeight: 1.6 }}>
              {locale === 'hi'
                ? 'नींद के दौरान बार-बार सांस रुकने और हाइपोक्सिया (ऑक्सीजन की कमी) से केवल नींद में खलल नहीं पड़ता, बल्कि हृदय और तंत्रिका तंत्र पर गंभीर दीर्घकालिक तनाव पैदा होता है।'
                : 'Frequent nocturnal breathing interruptions and intermittent hypoxia cause cumulative, systemic strain on vital organs, most notably the cardiovascular and central nervous systems.'}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {localized.contentBlocks.map((block) => {
              const isHeart = block.slug.includes('heart');
              const isBrain = block.slug.includes('brain');

              return (
                <div
                  key={block.id || block.slug}
                  style={{
                    background: '#ffffff',
                    borderRadius: 24,
                    border: '1px solid #dae2fd',
                    padding: '2.5rem',
                    boxShadow: '0 4px 24px rgba(19, 27, 46, 0.04)',
                  }}
                >
                  {/* Block Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: '2rem' }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 14,
                        background: isHeart ? '#ffe4e6' : isBrain ? '#ede9fe' : '#e0f2fe',
                        color: isHeart ? '#e11d48' : isBrain ? '#6d28d9' : '#0284c7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      }}
                    >
                      {isHeart ? <HeartPulse size={26} /> : isBrain ? <Brain size={26} /> : <Activity size={26} />}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#131b2e', margin: 0 }}>
                        {block.title}
                      </h3>
                      <span style={{ fontSize: '0.8125rem', color: '#6e7977' }}>
                        {locale === 'hi'
                          ? 'क्लिनिकल डेटा और चिकित्सा शोध पर आधारित प्रभाव'
                          : 'Clinical pathophysiological impact and associated health risks'}
                      </span>
                    </div>
                  </div>

                  {/* Grid with Content Items and Illustration */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: block.illustration ? '1.15fr 0.85fr' : '1fr',
                      gap: '2.5rem',
                      alignItems: 'start',
                    }}
                  >
                    {/* Items List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {block.items.map((item, iIdx) => (
                        <div
                          key={iIdx}
                          style={{
                            background: '#faf8ff',
                            border: '1px solid #eaedff',
                            borderRadius: 14,
                            padding: '1.125rem 1.25rem',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                            <div
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: isHeart ? '#e11d48' : isBrain ? '#6d28d9' : '#16453A',
                                marginTop: 7,
                                flexShrink: 0,
                              }}
                            />
                            <div>
                              <strong style={{ display: 'block', fontSize: '1rem', color: '#131b2e', marginBottom: 4 }}>
                                {item.title}
                              </strong>
                              <p style={{ fontSize: '0.875rem', color: '#52605d', lineHeight: 1.5, margin: 0 }}>
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Reversibility Note Callout */}
                      {block.reversibilityNote && (
                        <div
                          style={{
                            marginTop: 10,
                            background: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            borderRadius: 16,
                            padding: '1.25rem 1.5rem',
                            display: 'flex',
                            gap: 12,
                            alignItems: 'flex-start',
                          }}
                        >
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: 10,
                              background: '#dcfce7',
                              color: '#15803d',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <Sparkles size={20} />
                          </div>
                          <div>
                            <strong style={{ display: 'block', fontSize: '0.9375rem', color: '#166534', marginBottom: 4 }}>
                              {locale === 'hi' ? 'सकारात्मक रिकवरी नोट (रिवर्सिबिलिटी)' : 'Reversibility & Recovery Opportunity'}
                            </strong>
                            <p style={{ fontSize: '0.875rem', color: '#14532d', lineHeight: 1.5, margin: 0 }}>
                              {block.reversibilityNote}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Commissioned Illustration Card */}
                    {block.illustration && (
                      <div
                        style={{
                          background: '#f8fafc',
                          borderRadius: 20,
                          overflow: 'hidden',
                          border: '1px solid #dae2fd',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                        }}
                      >
                        <img
                          src={block.illustration.imageUrl}
                          alt={block.illustration.alt}
                          style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                            maxHeight: 460,
                            objectFit: 'contain',
                            background: '#ffffff',
                          }}
                        />
                        <div
                          style={{
                            padding: '14px 18px',
                            background: '#f1f5f9',
                            borderTop: '1px solid #e2e8f0',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 6,
                          }}
                        >
                          <span style={{ fontSize: '0.8125rem', color: '#334155', fontWeight: 500, lineHeight: 1.4 }}>
                            {block.illustration.alt}
                          </span>
                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <span
                              style={{
                                fontSize: '0.6875rem',
                                fontWeight: 700,
                                color: '#16453A',
                                background: '#e0f3f0',
                                padding: '3px 8px',
                                borderRadius: 6,
                              }}
                            >
                              {block.illustration.sourceAttribution}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. Caregiver Recovery Protocols */}
      <section
        style={{
          background: '#ffffff',
          borderRadius: 24,
          border: '1px solid #dae2fd',
          padding: '2.5rem',
          marginBottom: '4.5rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2rem' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: '#eaf8f6',
              color: '#16453A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <HeartHandshake size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16453A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {locale === 'hi' ? 'देखभालकर्ता रिकवरी प्रोटोकॉल' : 'Caregiver Clinical Protocols'}
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#131b2e', margin: 0 }}>
              {locale === 'hi' ? 'देखभालकर्ता प्रोटोकॉल और दैनिक दिशानिर्देश' : 'Caregiver Support & Management Guidelines'}
            </h2>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {localized.caregiverTips.map((tip, idx) => (
            <div
              key={idx}
              style={{
                background: '#f8fafc',
                borderRadius: 16,
                padding: '1.5rem',
                border: '1px solid #e2e8f0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <CheckCircle2 size={18} color="#16453A" />
                <strong style={{ fontSize: '1rem', color: '#16453A' }}>
                  {tip.title}
                </strong>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#52605d', lineHeight: 1.5, margin: 0 }}>
                {tip.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Recommended Medical Equipment (Tag-Linked) */}
      <section>
        <div style={{ marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#B75932', textTransform: 'uppercase' }}>
            {locale === 'hi' ? 'टैग-लिंक्ड क्लिनिकल कैटलॉग' : 'Tag-Linked Clinical Catalog'}
          </span>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#131b2e', marginTop: 4 }}>
            {locale === 'hi' ? `${localized.name} के लिए अनुशंसित उपकरण` : `Recommended Equipment for ${localized.name}`}
          </h2>
          <p style={{ color: '#6e7977', maxWidth: 650 }}>
            {locale === 'hi'
              ? `ये अस्पताल-ग्रेड प्रमाणित उपकरण ${localized.name} के उचित प्रबंधन और देखभाल के लिए कैलिब्रेटेड हैं। सीधी खरीद या लचीले किराए के लिए उपलब्ध हैं।`
              : `These verified hospital devices are calibrated for managing ${localized.name}. Available for outright purchase or flexible rental.`}
          </p>
        </div>

        {productsLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.75rem' }}>
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                style={{
                  height: 380,
                  borderRadius: 16,
                  background: '#f1f5f9',
                  opacity: 0.7,
                }}
              />
            ))}
          </div>
        ) : matchingProducts.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {matchingProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div
            style={{
              background: '#f8fafc',
              borderRadius: 16,
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              border: '1px dashed #cbd5e1',
            }}
          >
            <ShoppingBag size={36} color="#64748b" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1e293b', margin: '0 0 6px' }}>
              {locale === 'hi'
                ? 'वर्तमान में कोई कैटलॉग उपकरण इस स्थिति से मैप नहीं है'
                : 'No equipment currently tagged for this condition'}
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem', maxWidth: 450, margin: '0 auto 1.25rem' }}>
              {locale === 'hi'
                ? 'हमारे पूर्ण उपकरण कैटलॉग को देखें या क्लिनिकल सहायता टीम से संपर्क करें।'
                : 'Browse our full medical equipment catalog or speak with our clinical biomedical specialists.'}
            </p>
            <Link
              href="/shop"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#16453A',
                color: '#ffffff',
                padding: '9px 20px',
                borderRadius: 9999,
                fontSize: '0.875rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              {locale === 'hi' ? 'सभी उपकरण देखें' : 'Explore Medical Catalog'}
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
