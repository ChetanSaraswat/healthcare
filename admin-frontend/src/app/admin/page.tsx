'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  PackageCheck,
  CalendarSync,
  ShoppingBag,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  PlusCircle,
  Truck,
  IndianRupee,
  ExternalLink,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateRentalStatus } from '@/features/rentals/rentals.slice';
import { listOrders } from '@/features/orders/list-orders/list-orders.action';
import { listRentals } from '@/features/rentals/list-rentals/list-rentals.action';
import { listProducts } from '@/features/products/list-products/list-products.action';
import { axiosInterceptorInstanceClient } from '@/config/axios';

export default function AdminDashboardPage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.products);
  const rentals = useAppSelector((state) => state.rentals.rentals);
  const orders = useAppSelector((state) => state.orders.orders);

  useEffect(() => {
    dispatch(listOrders());
    dispatch(listRentals());
    dispatch(listProducts());
  }, [dispatch]);

  // Statistics
  const totalProducts = products.length;
  const missingHindiProducts = products.filter((p) => !p.translations?.hi);
  const activeRentals = rentals.filter((r) => r.status === 'active');
  const pendingRentals = rentals.filter((r) => r.status === 'pending' || r.status === 'confirmed');
  const totalDepositHeld = rentals
    .filter((r) => r.status === 'active' || r.status === 'confirmed')
    .reduce((sum, r) => sum + (r.totalDeposit || 0), 0);

  const handleQuickStatusUpdate = async (rentalId: string, newStatus: 'confirmed' | 'active') => {
    try {
      await axiosInterceptorInstanceClient.patch(`/rentals/${rentalId}/status`, { status: newStatus });
      dispatch(updateRentalStatus({ id: rentalId, status: newStatus }));
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Failed to update rental status in database');
    }
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: '1.75rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#131b2e', margin: 0, letterSpacing: '-0.02em' }}>
            Clinical Operations &amp; Catalog Overview
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6e7977', margin: '4px 0 0' }}>
            Monitor medical equipment rental deployments, purchase orders, and bilingual catalog health.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link
            href="/admin/products/new"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 16px',
              borderRadius: 10,
              background: '#005c55',
              color: '#ffffff',
              fontSize: '0.875rem',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(0,92,85,0.25)',
            }}
          >
            <PlusCircle size={16} />
            <span>Add Equipment</span>
          </Link>
          <Link
            href="/admin/rentals"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 16px',
              borderRadius: 10,
              background: '#ffffff',
              border: '1px solid #dae2fd',
              color: '#006398',
              fontSize: '0.875rem',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            <CalendarSync size={16} />
            <span>View All Rentals</span>
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        {/* Metric 1: Total Catalog Products */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 14,
            padding: '1.25rem',
            border: '1px solid #e2e7ff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#6e7977' }}>Hospital Catalog</span>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#e8f5f3', color: '#005c55', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PackageCheck size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#131b2e' }}>{totalProducts}</div>
          <div style={{ fontSize: '0.75rem', color: '#005c55', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
            <CheckCircle2 size={12} />
            <span>All products buy &amp; rent enabled</span>
          </div>
        </div>

        {/* Metric 2: Active Deployments */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 14,
            padding: '1.25rem',
            border: '1px solid #e2e7ff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#6e7977' }}>Active Rentals at Home</span>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#eaedff', color: '#006398', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#006398' }}>{activeRentals.length}</div>
          <div style={{ fontSize: '0.75rem', color: '#3e4947', marginTop: 4, fontWeight: 600 }}>
            {pendingRentals.length} rentals pending confirmation
          </div>
        </div>

        {/* Metric 3: Security Deposit Pool */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 14,
            padding: '1.25rem',
            border: '1px solid #e2e7ff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#6e7977' }}>Refundable Deposits Held</span>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#fff4eb', color: '#913200', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IndianRupee size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#913200' }}>
            ₹{totalDepositHeld.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6e7977', marginTop: 4 }}>
            Held securely for customer return release
          </div>
        </div>

        {/* Metric 4: Bilingual Health */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 14,
            padding: '1.25rem',
            border: '1px solid #e2e7ff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#6e7977' }}>Bilingual Catalog Health</span>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#e8f5f3', color: '#005c55', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#005c55' }}>
            {totalProducts - missingHindiProducts.length} / {totalProducts}
          </div>
          <div style={{ fontSize: '0.75rem', color: missingHindiProducts.length > 0 ? '#b94200' : '#005c55', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
            {missingHindiProducts.length > 0 ? (
              <>
                <AlertTriangle size={12} />
                <span>{missingHindiProducts.length} missing Hindi translation</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={12} />
                <span>100% Hindi translated</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Rental Queue (60%) + Translation Alerts (40%) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Left Column: Recent Rental Action Queue */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            padding: '1.5rem',
            border: '1px solid #e2e7ff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#131b2e', margin: 0 }}>
                Rental Action Queue
              </h2>
              <span style={{ fontSize: '0.75rem', color: '#6e7977' }}>
                Manage upcoming patient deployments &amp; deliveries
              </span>
            </div>
            <Link
              href="/admin/rentals"
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
              <span>View All ({rentals.length})</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {rentals.slice(0, 4).map((rental) => {
              const statusColors = {
                pending: { bg: '#fff4eb', text: '#913200', border: '#ffdbce' },
                confirmed: { bg: '#eaedff', text: '#006398', border: '#cce5ff' },
                active: { bg: '#e8f5f3', text: '#005c55', border: '#9cf2e8' },
                returned: { bg: '#f2f3ff', text: '#3e4947', border: '#dae2fd' },
                cancelled: { bg: '#ffdad6', text: '#ba1a1a', border: '#ffb4ab' },
              }[rental.status];

              return (
                <div
                  key={rental.id}
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: 12,
                    background: '#f8f9ff',
                    border: '1px solid #e2e7ff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#131b2e' }}>
                        {rental.rentalOrderNumber}
                      </span>
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 999,
                          background: statusColors.bg,
                          color: statusColors.text,
                          border: `1px solid ${statusColors.border}`,
                          textTransform: 'uppercase',
                        }}
                      >
                        {rental.status}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#6e7977' }}>
                      Deposit: <strong>₹{rental.totalDeposit?.toLocaleString('en-IN')}</strong>
                    </span>
                  </div>

                  <div style={{ fontSize: '0.875rem', color: '#131b2e', fontWeight: 600 }}>
                    {rental.items?.[0]?.productName || 'Hospital Equipment'}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, paddingTop: 6, borderTop: '1px solid #eaedff' }}>
                    <span style={{ fontSize: '0.75rem', color: '#6e7977' }}>
                      Duration: <strong>{rental.items?.[0]?.durationDays || 7} Days</strong> • {rental.deliveryAddress?.city || 'Delhi NCR'}
                    </span>

                    <div style={{ display: 'flex', gap: 6 }}>
                      {rental.status === 'pending' && (
                        <button
                          type="button"
                          onClick={() => handleQuickStatusUpdate(rental.id, 'confirmed')}
                          style={{
                            padding: '4px 10px',
                            borderRadius: 6,
                            background: '#006398',
                            color: '#ffffff',
                            border: 'none',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Confirm Order
                        </button>
                      )}
                      {rental.status === 'confirmed' && (
                        <button
                          type="button"
                          onClick={() => handleQuickStatusUpdate(rental.id, 'active')}
                          style={{
                            padding: '4px 10px',
                            borderRadius: 6,
                            background: '#005c55',
                            color: '#ffffff',
                            border: 'none',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Dispatch &amp; Activate
                        </button>
                      )}
                      {rental.status === 'active' && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#005c55', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <CheckCircle2 size={12} /> Active in Care
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Missing Hindi Translations Alert & Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Missing Hindi Translation Box */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              padding: '1.5rem',
              border: '1px solid #e2e7ff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: '#ffe5dc', color: '#b94200', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#131b2e', margin: 0 }}>
                  Bilingual Content Audit
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#6e7977' }}>
                  Ensure all medical equipment is accessible in Hindi
                </span>
              </div>
            </div>

            {missingHindiProducts.length === 0 ? (
              <div style={{ padding: '1rem', background: '#e8f5f3', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10, color: '#005c55' }}>
                <CheckCircle2 size={20} />
                <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>
                  Awesome! All products currently have complete Hindi clinical translations.
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <p style={{ fontSize: '0.8125rem', color: '#3e4947', margin: 0 }}>
                  The following equipment will fall back to English descriptions on the Hindi storefront until translated:
                </p>
                {missingHindiProducts.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      background: '#fff8f5',
                      border: '1px solid #ffdbce',
                      borderRadius: 10,
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', display: 'block' }}>
                        {p.name}
                      </span>
                      <span style={{ fontSize: '0.6875rem', color: '#913200' }}>
                        Missing Hindi title, specs, &amp; warranty
                      </span>
                    </div>
                    <Link
                      href={`/admin/products`}
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#005c55',
                        padding: '4px 8px',
                        background: '#e8f5f3',
                        borderRadius: 6,
                        textDecoration: 'none',
                      }}
                    >
                      Edit &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Operations Actions Box */}
          <div
            style={{
              background: 'linear-gradient(135deg, #005c55 0%, #004b46 100%)',
              borderRadius: 16,
              padding: '1.5rem',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(0,92,85,0.2)',
            }}
          >
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: '0 0 6px' }}>
              Out-of-App Logistics Check
            </h3>
            <p style={{ fontSize: '0.8125rem', opacity: 0.9, lineHeight: 1.5, margin: '0 0 16px' }}>
              Remember: Invariant 4 dictates the app&apos;s scope ends at order + payment. Physical delivery, sterilization checklist, and installation are coordinated by operations admin over phone/WhatsApp.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link
                href="/admin/products/new"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 14px',
                  borderRadius: 8,
                  background: '#ffffff',
                  color: '#005c55',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                <PlusCircle size={15} />
                <span>New Product</span>
              </Link>
              <Link
                href="/admin/products"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 14px',
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.25)',
                }}
              >
                <ExternalLink size={15} />
                <span>View Catalog</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
