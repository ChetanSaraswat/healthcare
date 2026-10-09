'use client';

import React from 'react';
import Link from 'next/link';
import { useAppDispatch } from '@/store/hooks';
import { showToast } from '@/features/ui/ui.slice';
import styles from './Footer.module.scss';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  PhoneCall,
  Award,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const dispatch = useAppDispatch();
  return (
    <footer className={styles.footerWrapper}>
      <div className={styles.container}>
        {/* Trust Highlights Strip */}
        <div className={styles.trustBar}>
          <div className={styles.trustItem}>
            <div className={styles.iconBox}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4>10-Step Medical Sanitization</h4>
              <p>Autoclave, UV-C &amp; anti-microbial disinfection on every rental return.</p>
            </div>
          </div>

          <div className={styles.trustItem}>
            <div className={styles.iconBox}>
              <Truck size={24} />
            </div>
            <div>
              <h4>4-Hour Critical Dispatch</h4>
              <p>Dedicated bio-medical technicians for setup and caregiver onboarding.</p>
            </div>
          </div>

          <div className={styles.trustItem}>
            <div className={styles.iconBox}>
              <RotateCcw size={24} />
            </div>
            <div>
              <h4>Zero-Hassle Deposit Return</h4>
              <p>Instant digital refund of security deposit upon equipment pickup.</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className={styles.grid}>
          {/* Brand Info */}
          <div className={styles.brandCol}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <img
                src="/images/logo.png"
                alt="Omkar Healthcare"
                width={48}
                height={48}
                style={{ objectFit: 'contain' }}
              />
              <div style={{ display: 'inline-flex', flexDirection: 'column', width: 'fit-content' }}>
                <span
                  style={{
                    display: 'block',
                    fontSize: '1.45rem',
                    fontWeight: 900,
                    color: '#ffffff',
                    letterSpacing: '0.06em',
                    lineHeight: 1,
                    width: '100%',
                  }}
                >
                  OMKAR
                </span>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    marginTop: 3,
                  }}
                >
                  <span style={{ flex: 1, height: '1.5px', background: '#E0B478', marginRight: 4 }} />
                  <span
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      color: '#E0B478',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      lineHeight: 1,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    HEALTHCARE
                  </span>
                  <span style={{ flex: 1, height: '1.5px', background: '#E0B478', marginLeft: 4 }} />
                </div>
              </div>
            </div>
            <p>
              India’s dedicated clinical medical equipment platform for families and caregivers.
              Providing equal access to hospital-grade equipment through verified purchase and flexible rental plans.
            </p>
            <button
              type="button"
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.clipboard) {
                  navigator.clipboard.writeText('1800-889-2273');
                  dispatch(
                    showToast({
                      type: 'info',
                      message: '📞 24/7 Caregiver Support Helpline (1800-889-2273) copied to clipboard!',
                    })
                  );
                }
              }}
              className={styles.helplinePill}
              style={{ border: 'none', cursor: 'pointer', textAlign: 'left', font: 'inherit' }}
            >
              <PhoneCall size={20} color="#9cf2e8" />
              <div>
                <div className={styles.hlLabel}>24/7 Caregiver Support Helpline</div>
                <div className={styles.hlNumber}>1800-889-2273 (Toll Free)</div>
              </div>
            </button>
          </div>

          {/* Equipment Categories */}
          <div className={styles.col}>
            <h5>Equipment Categories</h5>
            <ul>
              <li><Link href="/shop">All Respiratory Equipment</Link></li>
              <li><Link href="/shop">CPAP &amp; BiPAP Machines</Link></li>
              <li><Link href="/shop">10L Oxygen Concentrators</Link></li>
              <li><Link href="/shop">5L Portable Oxygen Concentrators</Link></li>
              <li><Link href="/shop">Medical Suction Machines</Link></li>
              <li><Link href="/shop">Ultrasonic Nebulizer Kits</Link></li>
            </ul>
          </div>

          {/* Education & Care Guides */}
          <div className={styles.col}>
            <h5>Education &amp; Care Guides</h5>
            <ul>
              <li><Link href="/learn">All Education &amp; Guides</Link></li>
              <li><Link href="/learn/sleep-apnea">Sleep Apnea &amp; Hypopnea</Link></li>
              <li><Link href="/learn/copd">COPD &amp; Oxygen Therapy</Link></li>
              <li><Link href="/learn/post-icu">Post-ICU Home Transition</Link></li>
              <li><Link href="/learn/stroke-rehab">Stroke Recovery &amp; Rehab</Link></li>
            </ul>
          </div>

          {/* Account & Policies */}
          <div className={styles.col}>
            <h5>Account &amp; Trust</h5>
            <ul>
              <li><Link href="/about">About Omkar Healthcare</Link></li>
              <li><Link href="/experience-centers">Experience Centers</Link></li>
              <li><Link href="/contact">Contact Support</Link></li>
              <li><Link href="/account/rentals">Active Rentals Dashboard</Link></li>
              <li><Link href="/cart">Your Healthcare Cart</Link></li>
              <li><Link href="/assessment">Equipment Assessment Tool</Link></li>
              <li><Link href="/policies/rental-policy">Refundable Deposit SLA</Link></li>
              <li><Link href="/policies/refund-policy">Cancellation &amp; Refund Policy</Link></li>
              <li><Link href="/policies/terms">Terms &amp; Conditions</Link></li>
              <li><Link href="/policies/privacy">Privacy &amp; Health Data Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Notice */}
        <div className={styles.bottomBar}>
          <div>
            &copy; {new Date().getFullYear()} Omkar Healthcare Systems Pvt. Ltd. All rights reserved.
          </div>
          <div>
            <Link href="/policies/privacy">Privacy Policy</Link>
            <Link href="/policies/terms">Terms of Service</Link>
            <Link href="/policies/rental-policy">Rental Agreement</Link>
            <Link href="/policies/refund-policy">Refund SLA</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
