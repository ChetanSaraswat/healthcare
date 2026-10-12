'use client';

import React from 'react';
import { useTranslation } from '@/locales';
import { OMKAR_LOCATIONS } from '@/config/locations.config';
import { CONTACT_CONFIG } from '@/config/contact.config';
import styles from './ExperienceCenters.module.scss';
import {
  MapPin,
  ExternalLink,
  PhoneCall,
  Clock,
  AlertTriangle,
  Building2,
  Warehouse,
  Stethoscope,
  Sparkles,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react';

export const ExperienceCentersClient: React.FC = () => {
  const { t, locale } = useTranslation();

  const experienceCenters = OMKAR_LOCATIONS.filter((l) => l.type === 'experience_center');
  const warehouseLocation = OMKAR_LOCATIONS.find((l) => l.type === 'warehouse');

  const pageT = t.experienceCentersPage || {
    title: 'Experience Centers & Facilities',
    subtitle:
      'Visit our official centers to see, test, and understand certified medical equipment with personalized caregiver guidance.',
    introTitle: 'Experience Medical Equipment Firsthand',
    introText:
      'Selecting equipment like oxygen concentrators, BiPAP machines, or specialized respiratory equipment can be critical. At Omkar Healthcare Experience Centers, patients and family caregivers can physically inspect calibrated equipment, test operation, and receive guidance from our specialists before choosing to buy or rent.',
    experienceCentersTitle: 'Official Experience Centers',
    experienceCentersSubtitle: 'Walk-in equipment trial, live demonstration, and rental consultation.',
    warehouseTitle: 'Dispatch & Storage Facility',
    warehouseSubtitle: 'Central medical equipment storage and biomedical dispatch operations.',
    getDirections: 'Get Directions',
    call: 'Call Center',
    viewOnMaps: 'View on Google Maps',
    visitPolicyLabel: 'Visit Policy',
    addressLabel: 'Address',
    typeExperienceCenter: 'Experience Center',
    typeWarehouse: 'Warehouse & Dispatch',
    featuresTrial: 'Hands-on Equipment Trial',
    featuresGuidance: 'Caregiver Guidance',
    featuresAssistance: 'Purchase & Rental Consultation',
    noHoursWalkIn: 'Walk-in hours not available (Visits by prior appointment only)',
    warehouseNotice:
      'Warehouse location handles biomedical sterilization, testing, and dispatch. In-person visits are strictly by prior appointment only.',
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 1. Header / Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroBadge}>
            <Building2 size={16} />
            <span>
              {locale === 'hi' ? 'ओमकार हेल्थकेयर केंद्र' : 'Omkar Healthcare Facilities'}
            </span>
          </div>

          <h1 className={styles.heroTitle}>
            {pageT.title}
          </h1>

          <p className={styles.heroSubtitle}>
            {pageT.subtitle}
          </p>

          {/* Intro Guidance Callout */}
          <div className={styles.guidanceBox}>
            <div className={styles.guidanceTitle}>
              <Stethoscope size={20} />
              <span>{pageT.introTitle}</span>
            </div>
            <p className={styles.guidanceText}>{pageT.introText}</p>

            <div className={styles.pillarsGrid}>
              <div className={styles.pillarItem}>
                <Sparkles size={18} className={styles.pillarIcon} />
                <span className={styles.pillarText}>{pageT.featuresTrial}</span>
              </div>
              <div className={styles.pillarItem}>
                <ShieldCheck size={18} className={styles.pillarIcon} />
                <span className={styles.pillarText}>{pageT.featuresGuidance}</span>
              </div>
              <div className={styles.pillarItem}>
                <Building2 size={18} className={styles.pillarIcon} />
                <span className={styles.pillarText}>{pageT.featuresAssistance}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className={styles.container}>
        {/* 2. Prominent Experience Centers Section */}
        <section>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>
              {locale === 'hi' ? 'उपकरण लाइव डेमो व ट्रायल' : 'Equipment Trial & Consultation'}
            </span>
            <h2 className={styles.sectionTitle}>{pageT.experienceCentersTitle}</h2>
            <p className={styles.sectionSubtitle}>{pageT.experienceCentersSubtitle}</p>
          </div>

          <div className={styles.primaryGrid}>
            {experienceCenters.map((location) => {
              const name = location.name[locale] || location.name.en;
              const address = location.address[locale] || location.address.en;
              const tagline = location.tagline ? location.tagline[locale] || location.tagline.en : null;
              const description = location.description
                ? location.description[locale] || location.description.en
                : null;
              const hours = location.hours ? location.hours[locale] || location.hours.en : null;

              return (
                <div key={location.id} className={styles.primaryCard}>
                  <div className={styles.cardTop}>
                    <div className={styles.typeBadge}>
                      <Building2 size={14} />
                      <span>{pageT.typeExperienceCenter}</span>
                    </div>
                    <h3 className={styles.cardTitle}>{name}</h3>
                    {tagline && <p className={styles.cardTagline}>{tagline}</p>}
                  </div>

                  <div className={styles.cardBody}>
                    {/* Address Block */}
                    <div className={styles.addressRow}>
                      <MapPin size={20} className={styles.pinIcon} />
                      <div className={styles.addressContent}>
                        <div>{address}</div>
                        <div className={styles.cityPin}>
                          {location.city}, {location.state} — {location.pincode}
                        </div>
                      </div>
                    </div>

                    {/* Purpose / Description */}
                    {description && (
                      <p className={styles.descriptionText}>{description}</p>
                    )}

                    {/* Optional Hours (Only rendered if real data exists) */}
                    {hours && (
                      <div className={styles.optionalInfo}>
                        <div className={styles.infoRow}>
                          <Clock size={16} color="#16453a" />
                          <span>{hours}</span>
                        </div>
                      </div>
                    )}

                    {/* Keyless Google Maps Embed */}
                    {location.embedUrl && (
                      <div className={styles.mapEmbedContainer}>
                        <iframe
                          src={location.embedUrl}
                          loading="lazy"
                          title={`Google Map for ${name}`}
                          allowFullScreen={false}
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                    )}
                  </div>

                  <div className={styles.cardFooter}>
                    <a
                      href={location.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.directionBtn}
                      aria-label={`${pageT.getDirections} to ${name}`}
                    >
                      <ExternalLink size={16} />
                      <span>{pageT.getDirections}</span>
                    </a>

                    {/* Optional Call Button (Only rendered if phone exists) */}
                    {location.phone && (
                      <a
                        href={`tel:${location.phone}`}
                        className={styles.callBtn}
                        aria-label={`${pageT.call} for ${name}`}
                      >
                        <PhoneCall size={16} />
                        <span>{pageT.call}</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. Secondary Warehouse & Dispatch Section */}
        {warehouseLocation && (
          <section>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionBadge} style={{ color: '#64748b' }}>
                {locale === 'hi' ? 'डिस्पैच एवं स्टोरेज सुविधा' : 'Operations & Dispatch'}
              </span>
              <h2 className={styles.sectionTitle}>{pageT.warehouseTitle}</h2>
              <p className={styles.sectionSubtitle}>{pageT.warehouseSubtitle}</p>
            </div>

            <div className={styles.warehouseCard}>
              <div className={styles.warehouseTop}>
                <div className={styles.warehouseBadge}>
                  <Warehouse size={15} />
                  <span>{pageT.typeWarehouse}</span>
                </div>

                <div className={styles.warehousePolicyAlert}>
                  <AlertTriangle size={15} />
                  <span>
                    {warehouseLocation.visitPolicy
                      ? warehouseLocation.visitPolicy[locale] || warehouseLocation.visitPolicy.en
                      : pageT.noHoursWalkIn}
                  </span>
                </div>
              </div>

              <div className={styles.warehouseContent}>
                <div className={styles.warehouseDetails}>
                  <h3 className={styles.warehouseName}>
                    {warehouseLocation.name[locale] || warehouseLocation.name.en}
                  </h3>

                  <div className={styles.addressRow}>
                    <MapPin size={20} className={styles.pinIcon} />
                    <div className={styles.addressContent}>
                      <div>
                        {warehouseLocation.address[locale] || warehouseLocation.address.en}
                      </div>
                      <div className={styles.cityPin}>
                        {warehouseLocation.city}, {warehouseLocation.state} —{' '}
                        {warehouseLocation.pincode}
                      </div>
                    </div>
                  </div>

                  <div className={styles.warehouseNoticeBox}>
                    <strong>{pageT.visitPolicyLabel}: </strong>
                    <span>{pageT.warehouseNotice}</span>
                  </div>

                  {warehouseLocation.description && (
                    <p className={styles.descriptionText}>
                      {warehouseLocation.description[locale] || warehouseLocation.description.en}
                    </p>
                  )}

                  <div>
                    <a
                      href={warehouseLocation.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.directionBtn}
                      style={{ maxWidth: 220 }}
                      aria-label={`${pageT.getDirections} to Warehouse`}
                    >
                      <ExternalLink size={16} />
                      <span>{pageT.getDirections}</span>
                    </a>
                  </div>
                </div>

                {warehouseLocation.embedUrl && (
                  <div className={styles.warehouseMap}>
                    <iframe
                      src={warehouseLocation.embedUrl}
                      loading="lazy"
                      title="Google Map for Warehouse"
                      allowFullScreen={false}
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 4. Bottom Caregiver Support Strip */}
        <section className={styles.bottomCta}>
          <div className={styles.ctaText}>
            <h3>
              {locale === 'hi'
                ? 'विजिट करने से पहले सहायता या जानकारी चाहिए?'
                : 'Need Guidance Before Your Visit?'}
            </h3>
            <p>
              {locale === 'hi'
                ? 'उपकरण उपलब्धता या विशिष्ट मॉडल के परीक्षण के लिए हमारी क्लिनिकल सपोर्ट टीम से सीधे व्हाट्सएप या फोन पर संपर्क करें।'
                : 'Contact our clinical assistance team directly on WhatsApp or call our helpline to confirm model availability or discuss patient requirements.'}
            </p>
          </div>

          <div className={styles.ctaActions}>
            {CONTACT_CONFIG.whatsappEnabled && (
              <a
                href={CONTACT_CONFIG.getWhatsAppHref(locale)}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsappBtn}
              >
                <MessageCircle size={18} />
                <span>
                  {locale === 'hi' ? 'व्हाट्सएप पर बात करें' : 'Chat on WhatsApp'}
                </span>
              </a>
            )}

            <a href={`tel:${CONTACT_CONFIG.phone}`} className={styles.helplineBtn}>
              <PhoneCall size={18} />
              <span>{CONTACT_CONFIG.phoneDisplay}</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};
