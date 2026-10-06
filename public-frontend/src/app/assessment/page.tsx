'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  Stethoscope,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  ShoppingBag,
  CalendarClock,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  IndianRupee,
  Activity,
} from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { addToCart } from '@/features/cart/cart.slice';
import { INITIAL_MOCK_PRODUCTS } from '@/features/products/list-products/list-products.service';

interface QuestionOption {
  id: string;
  title: string;
  subtitle: string;
  recommendedSlug: string;
  recommendedMode: 'rent' | 'buy';
  recommendedDays: number;
}

export default function AssessmentPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // User selections
  const [condition, setCondition] = useState<string>('respiratory');
  const [mobility, setMobility] = useState<string>('bedbound');
  const [duration, setDuration] = useState<string>('short');

  // Recommendation logic
  const getRecommendation = () => {
    if (condition === 'sleep') {
      const product = INITIAL_MOCK_PRODUCTS.find((p) => p.slug.includes('cpap')) || INITIAL_MOCK_PRODUCTS[0];
      const isShort = duration === 'short' || duration === 'medium';
      return {
        product,
        mode: isShort ? ('rent' as const) : ('buy' as const),
        days: duration === 'short' ? 15 : 30,
        rationale:
          isShort
            ? 'For newly diagnosed sleep apnea or post-hospitalization recovery, renting an Auto CPAP for 15-30 days allows therapy adaptation without upfront capital expenditure.'
            : 'For chronic obstructive sleep apnea, outright purchase with a 2-year warranty offers the most economical long-term value.',
        rentSavings: '₹48,500 upfront savings with refundable deposit',
      };
    } else if (condition === 'oxygen') {
      const product = INITIAL_MOCK_PRODUCTS.find((p) => p.slug.includes('oxygen')) || INITIAL_MOCK_PRODUCTS[1];
      const isShort = duration === 'short';
      return {
        product,
        mode: isShort ? ('rent' as const) : ('buy' as const),
        days: 30,
        rationale:
          'High-purity 10L oxygen therapy requires medical-grade calibration. Renting includes ongoing filter changes and immediate machine swap guarantees.',
        rentSavings: '₹62,000 capital conserved during recovery phase',
      };
    } else if (condition === 'icu-bed') {
      const product = INITIAL_MOCK_PRODUCTS.find((p) => p.slug.includes('hospital-bed')) || INITIAL_MOCK_PRODUCTS[2];
      const isShort = duration !== 'long';
      return {
        product,
        mode: isShort ? ('rent' as const) : ('buy' as const),
        days: duration === 'short' ? 15 : 30,
        rationale:
          'Post-operative recovery and post-ICU transition often require motorized patient elevation for 15-60 days until the patient regains mobility. Renting prevents equipment stranding after recovery.',
        rentSavings: '₹75,000 saved vs purchasing hospital infrastructure',
      };
    } else {
      const product = INITIAL_MOCK_PRODUCTS.find((p) => p.slug.includes('wheelchair')) || INITIAL_MOCK_PRODUCTS[3];
      return {
        product,
        mode: duration === 'short' ? ('rent' as const) : ('buy' as const),
        days: 15,
        rationale:
          'For orthopedic fractures and short-term post-op recovery, an ultralight wheelchair on a 15-day rental provides immediate mobility support.',
        rentSavings: '₹14,500 saved compared to purchase',
      };
    }
  };

  const rec = getRecommendation();

  const handleAddToCart = () => {
    if (rec.mode === 'buy') {
      dispatch(
        addToCart({
          id: `${rec.product.id}-buy`,
          productId: rec.product.id,
          name: rec.product.name,
          slug: rec.product.slug,
          image: rec.product.primaryImage,
          type: 'buy',
          quantity: 1,
          price: rec.product.buyPrice,
          mrp: rec.product.mrp,
        })
      );
    } else {
      dispatch(
        addToCart({
          id: `${rec.product.id}-rent`,
          productId: rec.product.id,
          name: rec.product.name,
          slug: rec.product.slug,
          image: rec.product.primaryImage,
          type: 'rent',
          quantity: 1,
          dailyRate: rec.product.rentalDailyRate,
          rentalDays: rec.days,
          rentalDeposit: rec.product.rentalSecurityDeposit,
        })
      );
    }
    router.push('/cart');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#faf8ff', fontFamily: "'Plus Jakarta Sans', sans-serif", padding: '2.5rem 0 4rem' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 1.5rem' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
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
                marginBottom: 10,
              }}
            >
              <Stethoscope size={16} /> Clinical Equipment Decision Assistant
            </span>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#131b2e', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
              Find the Right Medical Equipment for Your Loved One
            </h1>
            <p style={{ fontSize: '1rem', color: '#6e7977', maxWidth: 620, margin: '0 auto', lineHeight: 1.6 }}>
              Answer 3 quick clinical questions. We will calculate whether buying or renting offers the greatest health outcome and financial savings.
            </p>
          </div>

          {/* Step Progress Pills */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginBottom: '2.5rem',
            }}
          >
            {[
              { step: 1, label: 'Condition' },
              { step: 2, label: 'Mobility' },
              { step: 3, label: 'Duration' },
              { step: 4, label: 'Recommendation' },
            ].map((s) => (
              <div
                key={s.step}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 14px',
                    borderRadius: 999,
                    background: currentStep === s.step ? '#005c55' : currentStep > s.step ? '#e8f5f3' : '#f2f3ff',
                    color: currentStep === s.step ? '#ffffff' : currentStep > s.step ? '#005c55' : '#6e7977',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                  }}
                >
                  <span>{s.step}</span>
                  <span>{s.label}</span>
                </div>
                {s.step < 4 && <div style={{ width: 16, height: 2, background: '#dae2fd' }} />}
              </div>
            ))}
          </div>

          {/* STEP 1: Condition Question */}
          {currentStep === 1 && (
            <div
              style={{
                background: '#ffffff',
                borderRadius: 20,
                padding: '2rem',
                border: '1px solid #dae2fd',
                boxShadow: '0 4px 20px rgba(19, 27, 46, 0.04)',
              }}
            >
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#131b2e', margin: '0 0 6px' }}>
                1. What is the primary clinical requirement or condition?
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#6e7977', margin: '0 0 1.5rem' }}>
                Select the care situation that most closely describes your family member.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { id: 'sleep', title: 'Sleep Apnea, Heavy Snoring, or Morning Choking', desc: 'Patient stops breathing during sleep or requires CPAP/BiPAP positive airway pressure.' },
                  { id: 'oxygen', title: 'Respiratory Distress or Low Blood Oxygen (SpO2 < 92%)', desc: 'Patient has COPD, post-COVID lung scarring, or doctor recommended continuous oxygen therapy.' },
                  { id: 'icu-bed', title: 'Post-ICU Recovery / Elderly Bedridden Home Care', desc: 'Patient requires elevation, head/foot tilting, or hospital bed to prevent bed sores and aspiration.' },
                  { id: 'mobility', title: 'Orthopedic Surgery, Fracture, or Stroke Rehab Mobility', desc: 'Patient has temporary weight-bearing restrictions and requires a wheelchair or walker.' },
                ].map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setCondition(opt.id)}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 14,
                      border: condition === opt.id ? '2px solid #005c55' : '1px solid #dae2fd',
                      background: condition === opt.id ? '#e8f5f3' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <strong style={{ fontSize: '1rem', color: '#131b2e' }}>{opt.title}</strong>
                      {condition === opt.id && <CheckCircle2 size={18} color="#005c55" />}
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: '#3e4947', margin: '4px 0 0' }}>{opt.desc}</p>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 24px',
                    borderRadius: 12,
                    background: '#005c55',
                    color: '#ffffff',
                    fontSize: '0.9375rem',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <span>Next: Mobility Needs</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Mobility Question */}
          {currentStep === 2 && (
            <div
              style={{
                background: '#ffffff',
                borderRadius: 20,
                padding: '2rem',
                border: '1px solid #dae2fd',
                boxShadow: '0 4px 20px rgba(19, 27, 46, 0.04)',
              }}
            >
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#131b2e', margin: '0 0 6px' }}>
                2. What is the patient&apos;s current mobility level?
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#6e7977', margin: '0 0 1.5rem' }}>
                This determines if pressure-relief mattresses or motorized lift controls are essential.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { id: 'bedbound', title: 'Completely Bedridden (Spends 18+ Hours in Bed)', desc: 'High risk of bed sores (decubitus ulcers); requires pressure-relieving ripple air mattress & motorized bed.' },
                  { id: 'assisted', title: 'Partially Mobile with Full Caregiver Assistance', desc: 'Can sit up with help, needs wheelchair for transfers to bathroom and dining.' },
                  { id: 'independent', title: 'Fully Mobile / Walks Independently', desc: 'Only requires device assistance (such as night-time CPAP or stationary oxygen while resting).' },
                ].map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setMobility(opt.id)}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 14,
                      border: mobility === opt.id ? '2px solid #005c55' : '1px solid #dae2fd',
                      background: mobility === opt.id ? '#e8f5f3' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <strong style={{ fontSize: '1rem', color: '#131b2e' }}>{opt.title}</strong>
                      {mobility === opt.id && <CheckCircle2 size={18} color="#005c55" />}
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: '#3e4947', margin: '4px 0 0' }}>{opt.desc}</p>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: 12,
                    background: '#f2f3ff',
                    color: '#3e4947',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  &larr; Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 24px',
                    borderRadius: 12,
                    background: '#005c55',
                    color: '#ffffff',
                    fontSize: '0.9375rem',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <span>Next: Care Duration</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Duration Question */}
          {currentStep === 3 && (
            <div
              style={{
                background: '#ffffff',
                borderRadius: 20,
                padding: '2rem',
                border: '1px solid #dae2fd',
                boxShadow: '0 4px 20px rgba(19, 27, 46, 0.04)',
              }}
            >
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#131b2e', margin: '0 0 6px' }}>
                3. What is the expected duration of equipment need?
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#6e7977', margin: '0 0 1.5rem' }}>
                We use this to calculate whether Buy or Rent is the most financially optimal choice.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { id: 'short', title: 'Short-Term Recovery (1 to 4 Weeks)', desc: 'Post-surgery healing, temporary oxygen weaning, or acute rehabilitation phase.' },
                  { id: 'medium', title: 'Medium-Term Therapy (1 to 3 Months)', desc: 'Extended stroke rehab, sleep therapy trial adaptation, or palliative care support.' },
                  { id: 'long', title: 'Long-Term / Permanent Care (6+ Months)', desc: 'Ongoing chronic COPD management, permanent tracheostomy, or permanent elderly home ICU.' },
                ].map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setDuration(opt.id)}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 14,
                      border: duration === opt.id ? '2px solid #005c55' : '1px solid #dae2fd',
                      background: duration === opt.id ? '#e8f5f3' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <strong style={{ fontSize: '1rem', color: '#131b2e' }}>{opt.title}</strong>
                      {duration === opt.id && <CheckCircle2 size={18} color="#005c55" />}
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: '#3e4947', margin: '4px 0 0' }}>{opt.desc}</p>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: 12,
                    background: '#f2f3ff',
                    color: '#3e4947',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  &larr; Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 24px',
                    borderRadius: 12,
                    background: '#005c55',
                    color: '#ffffff',
                    fontSize: '0.9375rem',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <span>View Clinical Recommendation</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Clinical Recommendation Engine Output */}
          {currentStep === 4 && (
            <div
              style={{
                background: '#ffffff',
                borderRadius: 20,
                padding: '2.5rem',
                border: '1px solid #dae2fd',
                boxShadow: '0 8px 30px rgba(19, 27, 46, 0.06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: 999,
                    background: rec.mode === 'rent' ? '#ffe5dc' : '#e8f5f3',
                    color: rec.mode === 'rent' ? '#b94200' : '#005c55',
                    fontSize: '0.8125rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                  }}
                >
                  Recommended Plan: {rec.mode === 'rent' ? `Rent for ${rec.days} Days` : 'Outright Purchase'}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#005c55', fontWeight: 700 }}>
                  ✓ {rec.rentSavings}
                </span>
              </div>

              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#131b2e', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                {rec.product.name}
              </h2>

              <p style={{ fontSize: '0.9375rem', color: '#3e4947', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
                {rec.rationale}
              </p>

              {/* Equipment Highlight Box */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: 16,
                  padding: '1.25rem',
                  background: '#f8f9ff',
                  borderRadius: 14,
                  border: '1px solid #dae2fd',
                  marginBottom: '1.75rem',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#6e7977', display: 'block' }}>Hospital-Grade Equipment</span>
                  <strong style={{ fontSize: '1.125rem', color: '#131b2e' }}>{rec.product.brand}</strong>
                  <div style={{ fontSize: '0.75rem', color: '#005c55', marginTop: 4 }}>
                    ✓ 10-Step Autoclave Disinfected
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: '#6e7977', display: 'block' }}>
                    {rec.mode === 'rent' ? `Rental Total (${rec.days} Days)` : 'Purchase Price (incl. GST)'}
                  </span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#005c55' }}>
                    {rec.mode === 'rent'
                      ? `₹${(rec.product.rentalDailyRate * rec.days).toLocaleString('en-IN')}`
                      : `₹${rec.product.buyPrice.toLocaleString('en-IN')}`}
                  </div>
                  {rec.mode === 'rent' && (
                    <div style={{ fontSize: '0.75rem', color: '#913200', marginTop: 2 }}>
                      +₹{rec.product.rentalSecurityDeposit.toLocaleString('en-IN')} Refundable Deposit
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  style={{
                    flex: 2,
                    padding: '14px 24px',
                    borderRadius: 12,
                    background: '#005c55',
                    color: '#ffffff',
                    fontSize: '1rem',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 4px 14px rgba(0,92,85,0.25)',
                  }}
                >
                  {rec.mode === 'rent' ? <CalendarClock size={20} /> : <ShoppingBag size={20} />}
                  <span>Proceed with Recommended {rec.mode === 'rent' ? 'Rental' : 'Purchase'}</span>
                </button>

                <Link
                  href={`/product/${rec.product.slug}`}
                  style={{
                    flex: 1,
                    padding: '14px 20px',
                    borderRadius: 12,
                    background: '#f2f3ff',
                    color: '#006398',
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  View Full Specs &rarr;
                </Link>
              </div>

              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#6e7977',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Retake Assessment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
  );
}
