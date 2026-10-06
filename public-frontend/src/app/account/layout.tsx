'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useTranslation } from '@/locales';
import { UserEntity } from '@/domain/entities/user.entity';
import { AuthModal } from '@/components/auth/AuthModal';
import {
  CalendarClock,
  ShoppingBag,
  MapPin,
  UserCheck,
  PhoneCall,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Heart,
} from 'lucide-react';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t, locale } = useTranslation();
  const { user: authUser, isAuthenticated } = useAppSelector((state) => state.auth);
  const rentals = useAppSelector((state) => state.rentals.rentals);
  const orders = useAppSelector((state) => state.orders.orders);
  const addresses = useAppSelector((state) => state.user.addresses);
  const wishlistItems = useAppSelector((state) => state.wishlist?.items || []);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  if (!authUser || !isAuthenticated) {
    return (
      <div style={{ maxWidth: 640, margin: '5rem auto 7rem', padding: '0 1.5rem', textAlign: 'center' }}>
        <div
          style={{
            background: '#ffffff',
            borderRadius: 24,
            border: '1px solid #dae2fd',
            padding: '3rem 2rem',
            boxShadow: '0 12px 36px rgba(19, 27, 46, 0.06)',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              background: '#eaf8f6',
              color: '#005c55',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}
          >
            <UserCheck size={32} />
          </div>
          <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#131b2e', margin: '0 0 0.75rem' }}>
            {locale === 'hi' ? 'रोगी खाते में प्रवेश आवश्यक है' : 'Patient Authentication Required'}
          </h2>
          <p style={{ fontSize: '0.9375rem', color: '#6e7977', maxWidth: 440, margin: '0 auto 2rem', lineHeight: 1.6 }}>
            {locale === 'hi'
              ? 'सक्रिय चिकित्सा उपकरण रेंटल, डिलीवरी पते एवं ऑर्डर इतिहास देखने के लिए कृपया साइन इन करें।'
              : 'Please sign in to access your active medical equipment rentals, order history, and delivery addresses.'}
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              style={{
                background: '#005c55',
                color: '#ffffff',
                border: 'none',
                padding: '12px 28px',
                borderRadius: 12,
                fontSize: '0.9375rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 14px rgba(0, 92, 85, 0.25)',
              }}
            >
              <UserCheck size={18} />
              <span>{locale === 'hi' ? 'साइन इन / नया खाता' : 'Sign In / Register'}</span>
            </button>
            <Link
              href={`/login?redirect=${encodeURIComponent(pathname)}`}
              style={{
                background: '#f2f3ff',
                color: '#131b2e',
                border: '1px solid #dae2fd',
                padding: '12px 24px',
                borderRadius: 12,
                fontSize: '0.9375rem',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <span>{locale === 'hi' ? 'लॉग इन पृष्ठ' : 'Go to Login Page'}</span>
            </Link>
          </div>

          <AuthModal
            isOpen={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
          />
        </div>
      </div>
    );
  }

  const userName = authUser.name;
  const userEmail = authUser.email;
  const userPhone = authUser.phone || '+91 98765 43210';
  const initials = UserEntity.getInitials(userName);


  const navLinks = [
    {
      href: '/account',
      label: locale === 'hi' ? 'खाता सारांश और प्रोफ़ाइल' : 'Account Overview',
      icon: UserCheck,
      badge: null,
      exact: true,
    },
    {
      href: '/account/rentals',
      label: locale === 'hi' ? 'सक्रिय और पूर्व रेंटल' : 'Active & Past Rentals',
      icon: CalendarClock,
      badge: rentals.length > 0 ? rentals.length : null,
      exact: false,
    },
    {
      href: '/account/orders',
      label: locale === 'hi' ? 'खरीद के आदेश' : 'Purchase Orders',
      icon: ShoppingBag,
      badge: orders.length > 0 ? orders.length : null,
      exact: false,
    },
    {
      href: '/account/wishlist',
      label: locale === 'hi' ? 'सहेजी गई इच्छासूची' : 'Saved Wishlist',
      icon: Heart,
      badge: wishlistItems.length > 0 ? wishlistItems.length : null,
      exact: false,
    },
    {
      href: '/account/addresses',
      label: locale === 'hi' ? 'सहेजे गए वितरण पते' : 'Saved Delivery Addresses',
      icon: MapPin,
      badge: addresses.length > 0 ? addresses.length : null,
      exact: false,
    },
  ];

  return (
    <div style={{ maxWidth: 1180, margin: '2.5rem auto 6rem', padding: '0 1.5rem' }}>
      {/* Patient / Caregiver Master Profile Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #005c55 0%, #004741 100%)',
          borderRadius: 20,
          color: '#ffffff',
          padding: '2rem 2.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 18,
          marginBottom: '2rem',
          boxShadow: '0 10px 30px rgba(0, 92, 85, 0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 62,
              height: 62,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.375rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '0.05em',
            }}
          >
            {initials}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
                {userName}
              </h1>
              <span
                style={{
                  background: 'rgba(156, 242, 232, 0.25)',
                  color: '#9cf2e8',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '2px 10px',
                  borderRadius: 9999,
                  border: '1px solid rgba(156, 242, 232, 0.4)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <ShieldCheck size={13} /> {locale === 'hi' ? 'सत्यापित देखभालकर्ता' : 'Verified Caregiver'}
              </span>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#9cf2e8', marginTop: 4 }}>
              {userEmail} • {userPhone}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <a
            href="tel:18008892273"
            style={{
              background: 'rgba(255, 255, 255, 0.18)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              padding: '10px 18px',
              borderRadius: 9999,
              fontSize: '0.8125rem',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'background 0.2s ease',
            }}
          >
            <PhoneCall size={15} />
            <span>
              {locale === 'hi' ? '24/7 समर्पित तकनीशियन हेल्पलाइन' : '24/7 Technician Helpline'}
            </span>
          </a>
        </div>
      </div>

      {/* Account Layout Grid: Navigation Sidebar + Content */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: '2rem',
          alignItems: 'start',
        }}
      >
        {/* Sidebar Nav */}
        <aside
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #dae2fd',
            padding: '1rem',
            boxShadow: '0 2px 10px rgba(19, 27, 46, 0.04)',
            position: 'sticky',
            top: 96,
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6e7977', padding: '6px 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {locale === 'hi' ? 'खाता नेविगेशन' : 'Account Navigation'}
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 6 }}>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = link.exact
                ? pathname === link.href
                : pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 10,
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 800 : 600,
                    color: isActive ? '#005c55' : '#3e4947',
                    background: isActive ? '#eaf8f6' : 'transparent',
                    border: isActive ? '1px solid #9cf2e8' : '1px solid transparent',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Icon size={18} color={isActive ? '#005c55' : '#6e7977'} />
                    <span>{link.label}</span>
                  </div>

                  {link.badge !== null && (
                    <span
                      style={{
                        background: isActive ? '#005c55' : '#eaedff',
                        color: isActive ? '#ffffff' : '#131b2e',
                        fontSize: '0.6875rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: 9999,
                      }}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Support Card in Sidebar */}
          <div
            style={{
              marginTop: '1.75rem',
              padding: '1rem',
              background: '#faf8ff',
              borderRadius: 12,
              border: '1px solid #eaedff',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#005c55', fontWeight: 700, fontSize: '0.8125rem', marginBottom: 4 }}>
              <Sparkles size={14} />
              <span>{locale === 'hi' ? 'बायोमेडिकल सेवा गारंटी' : 'Biomedical SLA'}</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#6e7977', margin: '0 0 10px', lineHeight: 1.4 }}>
              {locale === 'hi'
                ? 'उपकरण वापसी पर 24 घंटे में सुरक्षा जमा वापसी एवं 10-चरणीय ऑटोक्लेव स्टरलाइज़ेशन।'
                : 'Instant 24-hr deposit refund SLA upon return and hospital-grade 10-step sterilization.'}
            </p>
            <Link
              href="/terms/rental"
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#005c55',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span>{locale === 'hi' ? 'रेंटल शर्तें पढ़ें' : 'View Rental Policies'}</span>
              <ChevronRight size={12} />
            </Link>
          </div>
        </aside>

        {/* Main Routed Content */}
        <main>{children}</main>
      </div>
    </div>
  );
}
