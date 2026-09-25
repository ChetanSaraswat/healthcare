'use client';

import React from 'react';
import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';
import { useTranslation } from '@/locales';
import { UserEntity, AddressEntity } from '@/domain/entities/user.entity';
import { OrderEntity } from '@/domain/entities/order.entity';
import { RentalEntity } from '@/domain/entities/rental.entity';
import {
  CalendarClock,
  ShoppingBag,
  MapPin,
  ShieldCheck,
  ArrowRight,
  RotateCcw,
  Clock,
  User,
  HeartPulse,
  Award,
  PhoneCall,
  CheckCircle2,
} from 'lucide-react';

export default function AccountOverviewPage() {
  const { t, locale } = useTranslation();
  const authUser = useAppSelector((state) => state.auth.user);
  const rentals = useAppSelector((state) => state.rentals.rentals);
  const orders = useAppSelector((state) => state.orders.orders);
  const addresses = useAppSelector((state) => state.user.addresses);

  const defaultAddress = UserEntity.getDefaultAddress(addresses);
  const totalDepositHeld = rentals
    .filter((r) => r.paymentStatus !== 'deposit_refunded')
    .reduce((acc, r) => acc + (r.totalDeposit || 0), 0);

  const latestRental = rentals[0] || null;
  const latestOrder = orders[0] || null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* 4 Metric Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
        }}
      >
        {/* Metric 1: Active Rentals */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #dae2fd',
            padding: '1.25rem',
            boxShadow: '0 2px 8px rgba(19, 27, 46, 0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#6e7977' }}>
              {locale === 'hi' ? 'सक्रिय रेंटल उपकरण' : 'Active Rentals'}
            </span>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#eaf8f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#005c55',
              }}
            >
              <CalendarClock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#131b2e' }}>
            {rentals.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#005c55', fontWeight: 600, marginTop: 4 }}>
            ₹{totalDepositHeld.toLocaleString('en-IN')} {locale === 'hi' ? 'जमा सुरक्षित' : 'refundable deposit held'}
          </div>
        </div>

        {/* Metric 2: Purchase Orders */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #dae2fd',
            padding: '1.25rem',
            boxShadow: '0 2px 8px rgba(19, 27, 46, 0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#6e7977' }}>
              {locale === 'hi' ? 'कुल खरीद आदेश' : 'Purchase Orders'}
            </span>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#e6f4fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#006398',
              }}
            >
              <ShoppingBag size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#131b2e' }}>
            {orders.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#006398', fontWeight: 600, marginTop: 4 }}>
            {locale === 'hi' ? 'वारंटी एवं इनवॉइस सक्रिय' : 'Full warranty & invoices active'}
          </div>
        </div>

        {/* Metric 3: Saved Addresses */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #dae2fd',
            padding: '1.25rem',
            boxShadow: '0 2px 8px rgba(19, 27, 46, 0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#6e7977' }}>
              {locale === 'hi' ? 'सहेजे गए पते' : 'Saved Addresses'}
            </span>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#fff0eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ea580c',
              }}
            >
              <MapPin size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#131b2e' }}>
            {addresses.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6e7977', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {defaultAddress ? `${defaultAddress.city} - ${defaultAddress.pincode}` : 'No default set'}
          </div>
        </div>

        {/* Metric 4: KYC & Medical ID */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #dae2fd',
            padding: '1.25rem',
            boxShadow: '0 2px 8px rgba(19, 27, 46, 0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#6e7977' }}>
              {locale === 'hi' ? 'केवाईसी और चिकित्सा सत्यापन' : 'Medical Verification'}
            </span>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#faf8ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#005c55',
              }}
            >
              <HeartPulse size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#005c55', display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCircle2 size={18} />
            <span>{locale === 'hi' ? 'सत्यापित' : 'Tier-1 Verified'}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6e7977', marginTop: 8 }}>
            CDSCO Class B/C Eligible
          </div>
        </div>
      </div>

      {/* Active Rental Spotlight Card */}
      {latestRental && (
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #dae2fd',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(19, 27, 46, 0.04)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
              marginBottom: '1rem',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid #eaedff',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CalendarClock size={20} color="#005c55" />
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#131b2e', margin: 0 }}>
                {locale === 'hi' ? 'वर्तमान सक्रिय रेंटल अनुबंध' : 'Current Active Rental Agreement'}
              </h3>
            </div>

            <Link
              href="/account/rentals"
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: '#005c55',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span>{locale === 'hi' ? 'सभी रेंटल देखें' : 'View All Rentals'}</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {latestRental.items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  background: '#faf8ff',
                  padding: '12px 16px',
                  borderRadius: 12,
                  border: '1px solid #eaedff',
                }}
              >
                <img
                  src={item.productImage}
                  alt={item.productName}
                  style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8 }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#131b2e', margin: '0 0 4px' }}>
                    {item.productName}
                  </h4>
                  <div style={{ fontSize: '0.8125rem', color: '#6e7977' }}>
                    Agreement #{latestRental.rentalOrderNumber} • {item.durationDays} Days (₹{item.dailyRate}/day)
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#005c55', fontWeight: 600, marginTop: 2 }}>
                    Active range: {item.startDate} &rarr; {item.endDate}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#131b2e' }}>
                    ₹{item.rentalCost.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#6e7977' }}>
                    + ₹{item.securityDeposit.toLocaleString('en-IN')} deposit
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Latest Purchase Order Spotlight */}
      {latestOrder && (
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #dae2fd',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(19, 27, 46, 0.04)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
              marginBottom: '1rem',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid #eaedff',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShoppingBag size={20} color="#006398" />
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#131b2e', margin: 0 }}>
                {locale === 'hi' ? 'हालिया खरीद आदेश' : 'Recent Purchase Order'}
              </h3>
            </div>

            <Link
              href="/account/orders"
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: '#006398',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span>{locale === 'hi' ? 'सभी ऑर्डर देखें' : 'View All Orders'}</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e' }}>
                Order #{latestOrder.orderNumber}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6e7977', marginTop: 2 }}>
                Placed on {OrderEntity.formatDate(latestOrder.createdAt)} • {latestOrder.items.length} items
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#005c55' }}>
                  ₹{latestOrder.total.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.6875rem', color: '#6e7977' }}>
                  {latestOrder.paymentMethod}
                </div>
              </div>

              <span
                style={{
                  background: '#eaf8f6',
                  color: '#005c55',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: 9999,
                }}
              >
                {OrderEntity.getStatusBadge(latestOrder.status).label}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Caregiver Profile & Primary Address Card */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 20,
        }}
      >
        {/* Profile Card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #dae2fd',
            padding: '1.5rem',
          }}
        >
          <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#131b2e', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <User size={18} color="#005c55" />
            <span>{locale === 'hi' ? 'देखभालकर्ता विवरण' : 'Caregiver Information'}</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f4f3', paddingBottom: 6 }}>
              <span style={{ color: '#6e7977' }}>{locale === 'hi' ? 'पूरा नाम:' : 'Full Name:'}</span>
              <strong>{authUser?.name || 'Sunita Sharma'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f4f3', paddingBottom: 6 }}>
              <span style={{ color: '#6e7977' }}>{locale === 'hi' ? 'ईमेल आईडी:' : 'Email ID:'}</span>
              <strong>{authUser?.email || 'sunita.sharma@example.com'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f4f3', paddingBottom: 6 }}>
              <span style={{ color: '#6e7977' }}>{locale === 'hi' ? 'मोबाइल नंबर:' : 'Mobile Phone:'}</span>
              <strong>{authUser?.phone || '+91 98765 43210'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 2 }}>
              <span style={{ color: '#6e7977' }}>{locale === 'hi' ? 'पसंदीदा भाषा:' : 'Preferred Language:'}</span>
              <strong style={{ color: '#005c55' }}>
                {locale === 'hi' ? 'हिन्दी (Hindi)' : 'English (EN)'}
              </strong>
            </div>
          </div>
        </div>

        {/* Primary Delivery Address Card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #dae2fd',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#131b2e', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={18} color="#005c55" />
              <span>{locale === 'hi' ? 'प्राथमिक वितरण पता' : 'Default Delivery Address'}</span>
            </h3>

            <Link
              href="/account/addresses"
              style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#005c55', textDecoration: 'none' }}
            >
              {locale === 'hi' ? 'प्रबंधित करें' : 'Manage'}
            </Link>
          </div>

          {defaultAddress ? (
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#eaf8f6', color: '#005c55', fontSize: '0.6875rem', fontWeight: 800, padding: '2px 8px', borderRadius: 9999, marginBottom: 8 }}>
                <CheckCircle2 size={12} />
                <span>{defaultAddress.label || 'Home'}</span>
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#131b2e', lineHeight: 1.4 }}>
                {defaultAddress.line1}
              </div>
              {defaultAddress.line2 && (
                <div style={{ fontSize: '0.8125rem', color: '#6e7977', marginTop: 2 }}>
                  {defaultAddress.line2}
                </div>
              )}
              <div style={{ fontSize: '0.8125rem', color: '#3e4947', marginTop: 4, fontWeight: 600 }}>
                {defaultAddress.city}, {defaultAddress.state} - {defaultAddress.pincode}
              </div>
            </div>
          ) : (
            <div style={{ color: '#6e7977', fontSize: '0.875rem' }}>
              {locale === 'hi' ? 'कोई पता सहेजा नहीं गया है।' : 'No saved delivery addresses yet.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
