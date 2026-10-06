'use client';

import React from 'react';
import Link from 'next/link';
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

          <div className={styles.trustItem}>
            <div className={styles.iconBox}>
              <Award size={24} />
            </div>
            <div>
              <h4>CDSCO &amp; ISO 13485 Reg.</h4>
              <p>Hospital-grade certified machinery from ResMed, Philips &amp; certified OEMs.</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className={styles.grid}>
          {/* Brand Info */}
          <div className={styles.brandCol}>
            <img
              src="/images/logo.svg"
              alt="AarogyaMed"
              width={200}
              height={50}
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <p>
              India’s dedicated clinical medical equipment platform for families and caregivers.
              Providing equal access to hospital-grade equipment through verified purchase and flexible rental plans.
            </p>
            <a href="tel:18008892273" className={styles.helplinePill}>
              <PhoneCall size={20} color="#9cf2e8" />
              <div>
                <div className={styles.hlLabel}>24/7 Caregiver Support Helpline</div>
                <div className={styles.hlNumber}>1800-889-2273 (Toll Free)</div>
              </div>
            </a>
          </div>

          {/* Equipment Categories */}
          <div className={styles.col}>
            <h5>Equipment Categories</h5>
            <ul>
              <li><Link href="/shop?category=cat-respiratory">CPAP &amp; BiPAP Machines</Link></li>
              <li><Link href="/shop?category=cat-respiratory">10L Oxygen Concentrators</Link></li>
              <li><Link href="/shop?category=cat-icu-beds">5-Function ICU Electric Beds</Link></li>
              <li><Link href="/shop?category=cat-icu-beds">Anti-Decubitus Air Mattresses</Link></li>
              <li><Link href="/shop?category=cat-mobility">Rehabilitation Wheelchairs</Link></li>
              <li><Link href="/shop">Suction Units &amp; Monitors</Link></li>
            </ul>
          </div>

          {/* Condition Guides */}
          <div className={styles.col}>
            <h5>Condition Guides</h5>
            <ul>
              <li><Link href="/learn/sleep-apnea">Sleep Apnea &amp; Hypopnea</Link></li>
              <li><Link href="/learn/copd">COPD &amp; Oxygen Therapy</Link></li>
              <li><Link href="/learn/post-icu">Post-ICU Home Transition</Link></li>
              <li><Link href="/learn/stroke-rehab">Stroke Recovery &amp; Rehab</Link></li>
              <li><Link href="/blog">Caregiver Knowledge Hub</Link></li>
            </ul>
          </div>

          {/* Account & Policies */}
          <div className={styles.col}>
            <h5>Account &amp; Trust</h5>
            <ul>
              <li><Link href="/about">About AarogyaMed</Link></li>
              <li><Link href="/account/rentals">Active Rentals Dashboard</Link></li>
              <li><Link href="/cart">Your Healthcare Cart</Link></li>
              <li><Link href="/assessment">Equipment Assessment Tool</Link></li>
              <li><Link href="/terms/rental">Refundable Deposit Policy</Link></li>
              <li><Link href="/terms/warranty">10-Step Sterilization Protocol</Link></li>
              <li><Link href="/hubs">Serviceable Hubs (40+ Cities)</Link></li>
              <li><Link href="/contact">Caregiver Support / Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Notice */}
        <div className={styles.bottomBar}>
          <div>
            &copy; {new Date().getFullYear()} AarogyaMed Healthcare Systems Pvt. Ltd. All rights reserved.
          </div>
          <div>
            <Link href="/terms/privacy">Privacy Policy</Link>
            <Link href="/terms/rental">Terms of Rental</Link>
            <Link href="/terms/warranty">Biomedical Standards</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
