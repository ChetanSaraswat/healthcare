'use client';

import React from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/product/ProductCard';
import { INITIAL_MOCK_PRODUCTS } from '@/features/products/list-products/list-products.service';
import { INITIAL_MOCK_CATEGORIES } from '@/features/categories/list-categories/list-categories.service';
import { INITIAL_MOCK_CONDITIONS } from '@/features/conditions/list-conditions/list-conditions.service';
import { ConditionEntity } from '@/domain/entities/condition.entity';
import { useTranslation } from '@/locales';
import styles from './page.module.scss';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Wind,
  Bed,
  Accessibility,
  Activity,
  HeartPulse,
  CheckCircle2,
  PhoneCall,
  Clock,
} from 'lucide-react';

export default function HomePage() {
  const { t, locale } = useTranslation();
  const featuredProducts = INITIAL_MOCK_PRODUCTS.slice(0, 4);

  const getCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Wind':
        return <Wind size={24} />;
      case 'Bed':
        return <Bed size={24} />;
      case 'Accessibility':
        return <Accessibility size={24} />;
      case 'Activity':
        return <Activity size={24} />;
      default:
        return <HeartPulse size={24} />;
    }
  };

  return (
    <div className={styles.homeWrapper}>
      {/* 1. Warm Clinical Trust Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <div className={styles.urgencyPill}>
                <Clock size={16} /> {t.common.dispatchPill}
              </div>
              <h1>
                {locale === 'hi' ? (
                  <>
                    अस्पताल-ग्रेड चिकित्सा उपकरण। <span>खरीदें या किराए पर लें</span> पूर्ण विश्वास के साथ।
                  </>
                ) : (
                  <>
                    Hospital-Grade Medical Equipment. <span>Buy or Rent</span> with Complete Trust.
                  </>
                )}
              </h1>
              <p>
                {locale === 'hi'
                  ? 'आईसीयू मोटराइज्ड बेड और 10L ऑक्सीजन कंसंट्रेटर से लेकर ऑटो-सीपैप मशीनों तक। रोगाणुरहित कैलिब्रेटेड उपकरण, प्रमाणित तकनीशियनों द्वारा सीधे आपके घर पर स्थापित।'
                  : 'From ICU motorized beds and 10L oxygen concentrators to auto-CPAP machines. Delivered, sanitized to biomedical standards, and installed directly at your home by certified technicians.'}
              </p>

              <div className={styles.heroCtas}>
                <Link href="/shop?mode=rent" className={styles.btnRentPrimary}>
                  <span>{locale === 'hi' ? 'रेंटल योजनाएं देखें' : 'Explore Rental Plans'}</span>
                  <ArrowRight size={18} />
                </Link>
                <Link href="/shop?mode=buy" className={styles.btnBuySecondary}>
                  <span>{t.product.buyOutright}</span>
                </Link>
              </div>

              <div className={styles.heroTrustStats}>
                <div className={styles.statItem}>
                  <div className={styles.num}>100%</div>
                  <div className={styles.lbl}>{t.common.depositGuarantee}</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.num}>10-Step</div>
                  <div className={styles.lbl}>{t.common.sterilization}</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.num}>40,000+</div>
                  <div className={styles.lbl}>{t.common.familiesSupported}</div>
                </div>
              </div>
            </div>

            <div className={styles.heroMedia}>
              <div className={styles.imageWrapper}>
                <img
                  src="/images/caregiver.png"
                  alt="Compassionate geriatric caregiver assisting patient"
                />
              </div>
              <div className={styles.floatingBadge}>
                <div className={styles.iconCircle}>
                  <ShieldCheck size={24} />
                </div>
                <div className={styles.badgeText}>
                  CDSCO &amp; ISO 13485 Registered
                  <span>Technician Onboarding Included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Specialized Equipment Categories */}
      <section className={styles.categoriesSection}>
        <div className={styles.container}>
          <div className={styles.sectionTitleRow}>
            <div className={styles.pretitle}>Hospital-Grade Clinical Categories</div>
            <h2>Specialized Equipment for Every Recovery Need</h2>
            <p>
              Designed for home recovery, post-ICU transitions, and long-term geriatric care.
              Available for immediate outright purchase or flexible weekly and monthly rental.
            </p>
          </div>

          <div className={styles.categoryGrid}>
            {INITIAL_MOCK_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.id}`}
                className={styles.catCard}
              >
                <div className={styles.catIcon}>{getCategoryIcon(cat.icon)}</div>
                <h3>{cat.name}</h3>
                <p>{cat.description}</p>
                <div className={styles.catFooter}>
                  <span>Explore {cat.productCount} models</span>
                  <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. 10-Step Biomedical Sanitization Protocol */}
      <section className={styles.protocolSection}>
        <div className={styles.container}>
          <div className={styles.protocolBox}>
            <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  color: '#005c55',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                <ShieldCheck size={16} /> Patient Safety Invariant
              </div>
              <h2
                style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: '#131b2e',
                  margin: '0.5rem 0 0.75rem',
                }}
              >
                Our 10-Step Hospital Sterilization Protocol
              </h2>
              <p style={{ color: '#3e4947', fontSize: '0.9375rem', lineHeight: 1.5 }}>
                Every single piece of rental equipment returned to AarogyaMed undergoes a stringent
                clinical re-conditioning procedure before it is dispatched to another family.
              </p>
            </div>

            <div className={styles.protocolGrid}>
              <div className={styles.protocolStep}>
                <span className={styles.stepNum}>STEP 01 - 03</span>
                <h4>Disassembly &amp; Medical Scrubbing</h4>
                <p>All filters, patient contact tubes, and masks are discarded. Outer shells undergo chlor-clean ultrasonic scrubbing.</p>
              </div>

              <div className={styles.protocolStep}>
                <span className={styles.stepNum}>STEP 04 - 06</span>
                <h4>UV-C &amp; Autoclave Chamber</h4>
                <p>Metal and heat-resistant components enter class-B hospital autoclave chambers; internal airways receive 254nm UV-C exposure.</p>
              </div>

              <div className={styles.protocolStep}>
                <span className={styles.stepNum}>STEP 07 - 08</span>
                <h4>Electronic Purity &amp; Flow Calibration</h4>
                <p>Concentrators and CPAPs are tested on digital biomedical analyzers to verify 93%±3% O2 purity and exact cm H2O pressures.</p>
              </div>

              <div className={styles.protocolStep}>
                <span className={styles.stepNum}>STEP 09 - 10</span>
                <h4>Vacuum Anti-Microbial Sealing</h4>
                <p>Devices are vacuum-sealed with sterile tamper-evident indicators and packaged with brand new clinical consumables.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Equipment Grid */}
      <section className={styles.productsSection}>
        <div className={styles.container}>
          <div className={styles.sectionTitleRow}>
            <div className={styles.pretitle}>Verified Clinical Catalog</div>
            <h2>Most Requested Critical Care Equipment</h2>
            <p>
              Every unit is eligible for either direct purchase with full manufacturer warranty or
              flexible monthly rental with zero maintenance liability.
            </p>
          </div>

          <div className={styles.productGrid}>
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link
              href="/shop"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#005c55',
                color: '#ffffff',
                padding: '14px 32px',
                borderRadius: 9999,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <span>{t.common.viewCatalog}</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Condition Guides Carousel */}
      <section className={styles.conditionsSection}>
        <div className={styles.container}>
          <div className={styles.sectionTitleRow}>
            <div className={styles.pretitle}>
              {locale === 'hi' ? 'परिवारों के लिए क्लिनिकल ज्ञान' : 'Clinical Knowledge For Families'}
            </div>
            <h2>{t.common.conditionGuides}</h2>
            <p>
              {locale === 'hi'
                ? 'यह निश्चित नहीं है कि कौन सा उपकरण उपयुक्त है? हमारी क्लिनिकल टीम ने लक्षणों, घरेलू सेटअप और अनुशंसित उपकरणों पर चरण-दर-चरण गाइड तैयार की हैं।'
                : 'Not sure which equipment is right? Our clinical team created step-by-step guides covering symptoms, home setup checklists, and recommended machinery.'}
            </p>
          </div>

          <div className={styles.conditionGrid}>
            {INITIAL_MOCK_CONDITIONS.map((cond) => {
              const locCond = ConditionEntity.getLocalized(cond, locale);
              return (
                <Link
                  key={cond.id}
                  href={`/learn/${cond.slug}`}
                  className={styles.condCard}
                >
                  <div className={styles.condImg}>
                    <img src={cond.heroImage || '/images/caregiver.png'} alt={locCond.name} />
                  </div>
                  <div className={styles.condBody}>
                    <h3>{locCond.name}</h3>
                    <p>{locCond.shortDescription}</p>
                    <div className={styles.condLink}>
                      <span>{locale === 'hi' ? 'गाइड और अनुशंसित सेटअप पढ़ें' : 'Read Guide & Recommended Setup'}</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Caregiver Emergency Callout */}
      <section style={{ background: '#f2f3ff', padding: '4rem 0', borderTop: '1px solid #dae2fd' }}>
        <div className={styles.container} style={{ textAlign: 'center', maxWidth: 800 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: '#005c55',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <PhoneCall size={26} />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#131b2e', marginBottom: '0.75rem' }}>
            {locale === 'hi'
              ? 'तत्काल बायोमेडिकल सलाह या आपातकालीन डिस्पैच की आवश्यकता है?'
              : 'Need Immediate Biomedical Advice or Emergency Dispatch?'}
          </h2>
          <p style={{ color: '#3e4947', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            {locale === 'hi'
              ? 'हमारे प्रशिक्षित बायोमेडिकल विशेषज्ञ और नर्सिंग सलाहकार 24/7 उपलब्ध हैं ताकि आपके डॉक्टर द्वारा निर्धारित सटीक ऑक्सीजन फ्लो, बेड स्पेसिफिकेशन या सीपैप प्रेशर चुनने में आपकी सहायता कर सकें।'
              : 'Our trained biomedical specialists and geriatric nursing counselors are available 24/7 to help you select the exact flow rate, bed specifications, or CPAP pressure prescribed by your doctor.'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <a
              href="tel:18008892273"
              style={{
                background: '#005c55',
                color: '#ffffff',
                padding: '14px 28px',
                borderRadius: 9999,
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <PhoneCall size={18} /> {t.common.callTollFree}
            </a>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#25D366',
                color: '#ffffff',
                padding: '14px 28px',
                borderRadius: 9999,
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '1rem',
              }}
            >
              {t.common.chatWhatsApp}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
