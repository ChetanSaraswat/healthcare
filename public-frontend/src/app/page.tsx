'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { listCategories } from '@/features/categories/list-categories/list-categories.action';
import { STATIC_LEARN_CONDITIONS } from '@/content/learn/conditions';
import { ConditionEntity } from '@/domain/entities/condition.entity';
import { useTranslation } from '@/locales';
import { CONTACT_CONFIG } from '@/config/contact.config';
import styles from './page.module.scss';
import {
  ShieldCheck,
  ArrowRight,
  Wind,
  Accessibility,
  Activity,
  HeartPulse,
  PhoneCall,
  Clock,
} from 'lucide-react';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { t, locale } = useTranslation();
  const [activeSlide, setActiveSlide] = useState(0);

  // Live Redux catalog data binding with loading state - NO fake fallback
  const categoriesList = useAppSelector((state) => state.categories?.categories) || [];
  const categoriesLoading = useAppSelector((state) => state.categories?.loading);

  useEffect(() => {
    if (categoriesList.length === 0) {
      dispatch(listCategories());
    }
  }, [dispatch, categoriesList.length]);

  const heroSlides = [
    {
      pillEn: '4-Hour Emergency Dispatch Across 40+ Cities',
      pillHi: '40+ शहरों में 4 घंटे के भीतर आपातकालीन डिलीवरी',
      titleEn: (
        <>
          Hospital-Grade Medical Equipment. <span>Buy or Rent</span> with Complete Trust.
        </>
      ),
      titleHi: (
        <>
          अस्पताल-ग्रेड चिकित्सा उपकरण। <span>खरीदें या किराए पर लें</span> पूर्ण विश्वास के साथ।
        </>
      ),
      subtitleEn:
        'From high-output 10L medical oxygen concentrators to auto-adjusting CPAP and BiPAP machines. Delivered, sanitized to biomedical standards, and calibrated directly at your home by certified technicians.',
      subtitleHi:
        'उच्च-उत्पादन 10L मेडिकल ऑक्सीजन कंसंट्रेटर से लेकर ऑटो-एडजस्टिंग सीपैप और बाईपैप मशीनों तक। रोगाणुरहित कैलिब्रेटेड उपकरण, प्रमाणित तकनीशियनों द्वारा सीधे आपके घर पर स्थापित।',
      primaryCtaTextEn: 'Explore Rental Plans',
      primaryCtaTextHi: 'रेंटल योजनाएं देखें',
      primaryCtaLink: '/shop?mode=rent',
      secondaryCtaTextEn: 'Buy Outright',
      secondaryCtaTextHi: 'सीधे खरीदें',
      secondaryCtaLink: '/shop?mode=buy',
    },
    {
      pillEn: 'Pre-Calibrated Pressure & Purity Standards',
      pillHi: 'दबाव और शुद्धता के लिए पूर्व-कैलिब्रेटेड मानक',
      titleEn: (
        <>
          Critical Care <span>Post-ICU Recovery</span> in Your Home.
        </>
      ),
      titleHi: (
        <>
          घर पर क्रिटिकल केयर एवं <span>आईसीयू-पश्चात रिकवरी</span>।
        </>
      ),
      subtitleEn:
        'Biomedical engineers pre-calibrate every device for pressure accuracy and 93% oxygen purity before rapid 4-hour metro delivery.',
      subtitleHi:
        'बायोमेडिकल इंजीनियर त्वरित 4-घंटे की मेट्रो डिलीवरी से पहले हर डिवाइस को सटीक दबाव और 93% ऑक्सीजन शुद्धता के लिए कैलिब्रेट करते हैं।',
      primaryCtaTextEn: 'Equipment Assessment',
      primaryCtaTextHi: 'केयरगिवर मूल्यांकन',
      primaryCtaLink: '/assessment',
      secondaryCtaTextEn: 'About Clinical Protocols',
      secondaryCtaTextHi: 'क्लिनिकल मानकों के बारे में',
      secondaryCtaLink: '/about',
    },
    {
      pillEn: '100% Escrow Protection & Deposit Guarantee',
      pillHi: '100% एस्क्रो सुरक्षा और जमा वापसी गारंटी',
      titleEn: (
        <>
          100% Escrow Protection. <span>24-Hour Deposit Refund</span> SLA.
        </>
      ),
      titleHi: (
        <>
          100% एस्क्रो सुरक्षा। <span>24 घंटे में डिपॉजिट रिफंड</span> की गारंटी।
        </>
      ),
      subtitleEn:
        'Zero arbitrary deductions. Deposits are safeguarded in escrow and refunded directly to your bank account upon technician equipment pickup.',
      subtitleHi:
        'शून्य अनुचित कटौती। तकनीशियन द्वारा उपकरण पिकअप के 24 घंटे के भीतर सुरक्षा जमा राशि सीधे आपके बैंक खाते में वापस।',
      primaryCtaTextEn: 'About Omkar Healthcare',
      primaryCtaTextHi: 'ओमकार हेल्थकेयर के बारे में',
      primaryCtaLink: '/about',
      secondaryCtaTextEn: '24/7 Clinical Support',
      secondaryCtaTextHi: '24/7 क्लिनिकल सहायता',
      secondaryCtaLink: '/contact',
    },
  ];

  const currentSlide = heroSlides[activeSlide];

  const getCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Wind':
        return <Wind size={24} />;
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
          {/* Interactive Hero Banner Switcher */}
          <div className={styles.heroSliderNav}>
            <button
              type="button"
              className={`${styles.slideTab} ${activeSlide === 0 ? styles.activeSlideTab : ''}`}
              onClick={() => setActiveSlide(0)}
            >
              1. {locale === 'hi' ? 'अस्पताल-ग्रेड खरीद व रेंटल' : 'Hospital Buy & Rent'}
            </button>
            <button
              type="button"
              className={`${styles.slideTab} ${activeSlide === 1 ? styles.activeSlideTab : ''}`}
              onClick={() => setActiveSlide(1)}
            >
              2. {locale === 'hi' ? 'पोस्ट-आईसीयू रिकवरी' : 'Post-ICU Recovery'}
            </button>
            <button
              type="button"
              className={`${styles.slideTab} ${activeSlide === 2 ? styles.activeSlideTab : ''}`}
              onClick={() => setActiveSlide(2)}
            >
              3. {locale === 'hi' ? '24-घंटे डिपॉजिट रिफंड' : '24-Hr Deposit SLA'}
            </button>
          </div>

          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <div className={styles.urgencyPill}>
                <Clock size={16} /> {locale === 'hi' ? currentSlide.pillHi : currentSlide.pillEn}
              </div>
              <h1>{locale === 'hi' ? currentSlide.titleHi : currentSlide.titleEn}</h1>
              <p>{locale === 'hi' ? currentSlide.subtitleHi : currentSlide.subtitleEn}</p>

              <div className={styles.heroCtas}>
                <Link href={currentSlide.primaryCtaLink} className={styles.btnRentPrimary}>
                  <span>{locale === 'hi' ? currentSlide.primaryCtaTextHi : currentSlide.primaryCtaTextEn}</span>
                  <ArrowRight size={18} />
                </Link>
                <Link href={currentSlide.secondaryCtaLink} className={styles.btnBuySecondary}>
                  <span>{locale === 'hi' ? currentSlide.secondaryCtaTextHi : currentSlide.secondaryCtaTextEn}</span>
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
                  <div className={styles.num}>40+</div>
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
            </div>
          </div>
        </div>
      </section>

      {/* 2. Specialized Equipment Categories */}
      <section className={styles.categoriesSection}>
        <div className={styles.container}>
          <div className={styles.sectionTitleRow}>
            <div className={styles.pretitle}>Hospital-Grade Respiratory Care</div>
            <h2>Specialized Equipment for Every Recovery Need</h2>
            <p>
              Designed for home respiratory therapy, acute lung care, and sleep apnea treatment.
              Available for immediate outright purchase or flexible weekly and monthly rental.
            </p>
          </div>

          <div className={styles.categoryGrid}>
            {categoriesLoading && categoriesList.length === 0 ? (
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={styles.catCard}
                  style={{ opacity: 0.6, pointerEvents: 'none', minHeight: 180 }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: '#e0e5eb',
                      marginBottom: 16,
                    }}
                  />
                  <div
                    style={{
                      height: 18,
                      width: '70%',
                      background: '#e0e5eb',
                      borderRadius: 4,
                      marginBottom: 8,
                    }}
                  />
                  <div
                    style={{
                      height: 14,
                      width: '90%',
                      background: '#edf0f5',
                      borderRadius: 4,
                    }}
                  />
                </div>
              ))
            ) : categoriesList.filter((cat) => (cat.productCount ?? 0) > 0).length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem 0', color: '#6e7977' }}>
                {locale === 'hi' ? 'कोई श्रेणी उपलब्ध नहीं है।' : 'No categories currently available.'}
              </div>
            ) : (
              categoriesList
                .filter((cat) => (cat.productCount ?? 0) > 0)
                .map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.id}`}
                    className={styles.catCard}
                  >
                    <div className={styles.catIcon}>{getCategoryIcon(cat.icon)}</div>
                    <h3>{cat.name}</h3>
                    <p>
                      {cat.description ||
                        (cat.slug.includes('cpap')
                          ? 'Auto-adjusting CPAP and BiPAP sleep therapy systems with heated humidifiers.'
                          : cat.slug.includes('oxygen')
                          ? 'Continuous medical oxygen concentrators delivering 93% ± 3% purity.'
                          : 'Hospital-grade aerosol nebulizers and high-vacuum secretion suction machines.')}
                    </p>
                    <div className={styles.catFooter}>
                      <span>
                        Explore {cat.productCount} {cat.productCount === 1 ? 'model' : 'models'}
                      </span>
                      <ArrowRight size={14} />
                    </div>
                  </Link>
                ))
            )}
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
                  color: '#16453A',
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
                Every single piece of rental equipment returned to Omkar Healthcare undergoes a stringent
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



      {/* 4.5. Clinical Trust & Biomedical Compliance Banner */}
      <section className={styles.clinicalTrustBannerSection}>
        <div className={styles.container}>
          <div className={styles.clinicalTrustBanner}>
            <div className={styles.bannerContent}>
              <div className={styles.badge}>
                <ShieldCheck size={14} /> Certified Clinical Equipment
              </div>
              <h3>
                {locale === 'hi'
                  ? 'भारत के 40+ परिवार ओमकार हेल्थकेयर के क्लिनिकल मानकों पर भरोसा क्यों करते हैं?'
                  : 'Why 40+ Indian Families Trust Omkar Healthcare Clinical Standards'}
              </h3>
              <p>
                {locale === 'hi'
                  ? 'अस्पताल-ग्रेड 10-चरणीय ऑटोक्लेव कीटाणुशोधन, बायोमेडिकल इंजीनियरों द्वारा प्रेशर और ऑक्सीजन शुद्धता कैलिब्रेशन, तथा 24-घंटे में 100% सुरक्षा जमा वापसी गारंटी।'
                  : 'Hospital-grade 10-step autoclave sterilization, digital flow calibration by certified biomedical engineers, and a guaranteed 24-hour refundable deposit SLA.'}
              </p>
            </div>
            <div className={styles.bannerActions}>
              <Link href="/about" className={styles.btnAbout}>
                <span>{locale === 'hi' ? 'हमारे क्लिनिकल मानक' : 'Our Clinical Protocols'}</span>
                <ArrowRight size={16} />
              </Link>
              <Link href="/contact" className={styles.btnHelpline}>
                <PhoneCall size={16} />
                <span>{locale === 'hi' ? '24/7 क्लिनिकल हेल्पलाइन' : '24/7 Clinical Support'}</span>
              </Link>
            </div>
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
            {STATIC_LEARN_CONDITIONS.map((cond) => {
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
              background: '#16453A',
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
              ? 'हमारे प्रशिक्षित बायोमेडिकल विशेषज्ञ और क्लिनिकल सलाहकार 24/7 उपलब्ध हैं ताकि आपके डॉक्टर द्वारा निर्धारित सटीक ऑक्सीजन फ्लो, मास्क साइजिंग या सीपैप/बाईपैप प्रेशर चुनने में आपकी सहायता कर सकें।'
              : 'Our trained biomedical specialists and clinical counselors are available 24/7 to help you select the exact flow rate, mask sizing, or CPAP/BiPAP pressure prescribed by your doctor.'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <a
              href={`tel:${CONTACT_CONFIG.phone}`}
              style={{
                background: '#16453A',
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
              <PhoneCall size={18} /> {t.common.callTollFree || (locale === 'hi' ? 'कॉल करें' : 'Call Care Support')}
            </a>
            {CONTACT_CONFIG.whatsappEnabled && (
              <a
                href={CONTACT_CONFIG.getWhatsAppHref(locale)}
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
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {t.common.chatWhatsApp}
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
