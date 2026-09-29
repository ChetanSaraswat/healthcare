'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/locales';
import styles from './about.module.scss';
import {
  ShieldCheck,
  Award,
  Sparkles,
  Clock,
  HeartPulse,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Stethoscope,
  RotateCcw,
  FileText,
  PhoneCall,
} from 'lucide-react';

export default function AboutPage() {
  const { t, locale } = useTranslation();

  return (
    <div className={styles.aboutWrapper}>
      {/* 1. Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.compliancePill}>
              <ShieldCheck size={16} /> CDSCO Registered Medical Establishment #MD-40918
            </div>
            <h1 className={styles.heroTitle}>
              {locale === 'hi' ? (
                <>
                  अस्पताल से घर तक <span>सुरक्षित स्वास्थ्य सेवा</span> का सेतु।
                </>
              ) : (
                <>
                  Bridging the Hospital-to-Home <span>Clinical Care Divide</span>.
                </>
              )}
            </h1>
            <p className={styles.heroSubtitle}>
              {locale === 'hi'
                ? 'भारत का प्रमुख प्रमाणित चिकित्सा उपकरण मंच। अस्पताल-ग्रेड परिशुद्धता, पारदर्शी रेंटल मूल्य निर्धारण, और 40,000+ परिवारों के लिए समर्पित क्लिनिकल सहायता।'
                : "India's premier certified medical equipment ecosystem. Hospital-grade precision, transparent rental ethics, and round-the-clock biomedical engineering support for over 40,000 recovering families."}
            </p>

            <div className={styles.metricsGrid}>
              <div className={styles.metricCard}>
                <div className={styles.metricNum}>40,000+</div>
                <div className={styles.metricLabel}>
                  {locale === 'hi' ? 'समर्थित परिवार' : 'Families Supported'}
                </div>
              </div>
              <div className={styles.metricCard}>
                <div className={styles.metricNum}>10-Step</div>
                <div className={styles.metricLabel}>
                  {locale === 'hi' ? 'ऑटोक्लेव स्टेरिलाइज़ेशन' : 'Autoclave Sterilization'}
                </div>
              </div>
              <div className={styles.metricCard}>
                <div className={styles.metricNum}>4 Hours</div>
                <div className={styles.metricLabel}>
                  {locale === 'hi' ? 'आपातकालीन प्रेषण' : 'Critical Metro Dispatch'}
                </div>
              </div>
              <div className={styles.metricCard}>
                <div className={styles.metricNum}>24 Hours</div>
                <div className={styles.metricLabel}>
                  {locale === 'hi' ? 'डिपॉजिट रिफंड गारंटी' : 'Deposit Refund SLA'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Mission & Clinical Narrative */}
      <section className={styles.missionSection}>
        <div className={styles.container}>
          <div className={styles.twoColGrid}>
            <div>
              <div className={styles.sectionPretitle}>
                {locale === 'hi' ? 'हमारा मिशन' : 'Our Founding Mission'}
              </div>
              <h2 className={styles.sectionHeading}>
                {locale === 'hi'
                  ? 'रोगियों के लिए अस्थायी जरूरतों हेतु भारी वित्तीय बोझ को समाप्त करना।'
                  : 'Ending the Financial Dilemma of Temporary Home Critical Care.'}
              </h2>
              <p className={styles.paragraph}>
                {locale === 'hi'
                  ? 'अक्सर देखा गया है कि जब किसी मरीज को आईसीयू से छुट्टी मिलती है, तो परिवार को ₹1,50,000 या अधिक मूल्य के उपकरण खरीदने के लिए विवश होना पड़ता है, जिनकी जरूरत केवल 3 से 6 सप्ताह के लिए होती है।'
                  : 'When patients are discharged from the ICU, families are routinely forced into an agonizing choice: spend ₹1,50,000+ on motorized hospital beds and oxygen concentrators needed for only 4-6 weeks, or risk renting unverified, unsterilized equipment from informal channels.'}
              </p>
              <p className={styles.paragraph}>
                {locale === 'hi'
                  ? 'आरोग्यमेड की स्थापना इस अंतर को पाटने के लिए की गई थी। हम खरीद और किराए को पूरी तरह से समान दर्जा देते हैं। प्रत्येक रेंटल डिवाइस अस्पताल के आईसीयू मानकों के अनुसार प्रमाणित, रोगाणुरहित और कैलिब्रेटेड होता है।'
                  : 'AarogyaMed was founded to establish parity between outright ownership and clinical rental. We treat Buy and Rent on completely equal footing. Every rented device receives the same rigorous biomedical inspection as new equipment, protected by escrow deposits and 24-hour return guarantees.'}
              </p>
            </div>

            <div className={styles.narrativeCard}>
              <div className={styles.sectionPretitle}>
                {locale === 'hi' ? 'बायोमेडिकल गुणवत्ता प्रतिबद्धता' : 'Biomedical Engineering Invariant'}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
                {locale === 'hi' ? 'शून्य-समझौता स्वच्छता मानक' : 'Zero-Compromise Hygiene Standards'}
              </h3>
              <p style={{ color: '#475569', fontSize: '0.9375rem', lineHeight: 1.6, margin: 0 }}>
                {locale === 'hi'
                  ? 'हमारे बायोमेडिकल इंजीनियर प्रत्येक उपकरण का निरीक्षण करते हैं। ऑटो-सीपैप, बाईपैप और ऑक्सीजन कंसंट्रेटर के आंतरिक वायुमार्ग 254nm UV-C कक्ष में कीटाणुरहित किए जाते हैं और नए बैक्टीरियल फिल्टर लगाए जाते हैं।'
                  : 'Our dedicated team of certified biomedical engineers inspects, services, and certifies every single unit before dispatch. We replace all patient-contact tubing and bacteriological filters with brand new clinical-grade OEM consumables.'}
              </p>

              <div className={styles.quoteBlock}>
                <p>
                  "A patient recovering at home deserves equipment as sterile and reliable as the finest tertiary ICU in the country. That is the non-negotiable benchmark we uphold every day."
                </p>
                <div className={styles.author}>
                  — Dr. Rajesh Verma, Chief Biomedical Director
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 4 Pillars of Clinical Trust */}
      <section className={styles.pillarsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionPretitle}>
              {locale === 'hi' ? 'विश्वास के 4 स्तंभ' : 'The 4 Pillars of Clinical Trust'}
            </div>
            <h2 className={styles.sectionHeading}>
              {locale === 'hi' ? 'मरीज की सुरक्षा ही हमारी एकमात्र प्राथमिकता है' : 'Engineered for Absolute Patient Safety'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
              {locale === 'hi'
                ? 'हर मशीन, हर डिलीवरी और हर डिपॉजिट वापसी में कड़े मानकों का पालन।'
                : 'Every protocol at AarogyaMed is codified in biomedical standards to guarantee hospital-level efficacy in your living room.'}
            </p>
          </div>

          <div className={styles.pillarsGrid}>
            <div className={styles.pillarCard}>
              <div className={styles.pillarIcon}>
                <ShieldCheck size={26} />
              </div>
              <h3>10-Step Autoclave Sanitization</h3>
              <p>
                Every returned rental device undergoes medical-grade ultrasonic scrub, hospital Class-B autoclave chamber sterilization, and 254nm germicidal UV-C treatment before vacuum packaging.
              </p>
              <span className={styles.badge}>ISO 13485:2016 Compliant</span>
            </div>

            <div className={styles.pillarCard}>
              <div className={styles.pillarIcon}>
                <HeartPulse size={26} />
              </div>
              <h3>Biomedical Analyzer Calibration</h3>
              <p>
                Oxygen concentrators are verified for 93% ± 3% purity across full 1–10 LPM flow rates. CPAP and BiPAP devices are tested against calibrated pressure manometers to match prescriptions.
              </p>
              <span className={styles.badge}>CDSCO Class B/C Standards</span>
            </div>

            <div className={styles.pillarCard}>
              <div className={styles.pillarIcon}>
                <RotateCcw size={26} />
              </div>
              <h3>24-Hour Deposit Refund Guarantee</h3>
              <p>
                Security deposits are held in dedicated escrow accounts and returned via instant digital bank transfer within 24 hours of technician equipment pickup. Zero arbitrary deductions.
              </p>
              <span className={styles.badge}>100% Escrow Protection</span>
            </div>

            <div className={styles.pillarCard}>
              <div className={styles.pillarIcon}>
                <Stethoscope size={26} />
              </div>
              <h3>At-Home Caregiver Onboarding</h3>
              <p>
                Our trained biomedical technicians do not just drop off a box; they assemble the motorized beds, connect patient interfaces, and train family caregivers on safety alarms and operations.
              </p>
              <span className={styles.badge}>Certified Field Technicians</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Clinical Leadership */}
      <section className={styles.leadershipSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionPretitle}>
              {locale === 'hi' ? 'क्लिनिकल सलाहकार एवं नेतृत्व' : 'Clinical & Biomedical Leadership'}
            </div>
            <h2 className={styles.sectionHeading}>
              {locale === 'hi' ? 'चिकित्सा विशेषज्ञों द्वारा निर्देशित' : 'Guided by Medical & Engineering Specialists'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
              Our operations are spearheaded by seasoned medical device engineers, geriatric clinicians, and patient advocacy leaders.
            </p>
          </div>

          <div className={styles.teamGrid}>
            <div className={styles.teamCard}>
              <div className={styles.avatarCircle}>RV</div>
              <h4>Dr. Rajesh Verma</h4>
              <div className={styles.role}>Chief Biomedical Director &amp; Operations Lead</div>
              <p className={styles.bio}>
                Former Senior Biomedical Consultant at premier multi-specialty hospitals with 18+ years of expertise in ICU ventilation, clinical calibration, and medical device compliance.
              </p>
            </div>

            <div className={styles.teamCard}>
              <div className={styles.avatarCircle}>PN</div>
              <h4>Dr. Priya Nambiar</h4>
              <div className={styles.role}>Head of Clinical Hygiene &amp; Sterilization</div>
              <p className={styles.bio}>
                Infection Control Specialist certified in ISO 13485 quality management systems, supervising our proprietary 10-step sterilization and bacterial filtration protocol.
              </p>
            </div>

            <div className={styles.teamCard}>
              <div className={styles.avatarCircle}>SS</div>
              <h4>Sunita Sharma</h4>
              <div className={styles.role}>Patient &amp; Caregiver Advocacy Director</div>
              <p className={styles.bio}>
                Geriatric care coordinator with a passion for dignified patient home transitions, championing transparent rental agreements and empathetic caregiver guidance across India.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Experience Hubs & Emergency Callout */}
      <section className={styles.container}>
        <div className={styles.hubsCallout}>
          <div className={styles.hubsText}>
            <h3>
              {locale === 'hi'
                ? 'अपने शहर में हमारे अनुभव केंद्र पर आएं'
                : 'Experience Hospital-Grade Machinery in Person'}
            </h3>
            <p>
              {locale === 'hi'
                ? 'बेंगलुरु, दिल्ली एनसीआर, मुंबई, हैदराबाद, चेन्नई, कोलकाता और पुणे में हमारे केंद्रों पर लाइव डेमो देखें और विशेषज्ञ तकनीशियनों से परामर्श लें।'
                : 'Visit an AarogyaMed Experience Center across 40+ Indian cities to trial ICU motorized beds, test CPAP mask seals, and evaluate oxygen purity before bringing equipment home.'}
            </p>
          </div>

          <div className={styles.hubsActions}>
            <Link href="/hubs" className={styles.btnHubs}>
              <MapPin size={18} />
              <span>{locale === 'hi' ? 'निकटतम केंद्र खोजें' : 'Locate Experience Hub'}</span>
            </Link>
            <Link href="/assessment" className={styles.btnContact}>
              <HeartPulse size={18} />
              <span>{locale === 'hi' ? 'क्लिनिकल मूल्यांकन' : 'Equipment Assessment'}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
