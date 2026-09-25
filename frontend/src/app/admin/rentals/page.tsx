'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CalendarSync,
  Search,
  CheckCircle2,
  Clock,
  RotateCcw,
  XCircle,
  Truck,
  IndianRupee,
  Phone,
  MapPin,
  ShieldAlert,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateRentalStatus } from '@/features/rentals/rentals.slice';
import { RentalOrder } from '@/domain/entities/rental.entity';

export default function AdminRentalsPage() {
  const dispatch = useAppDispatch();
  const rentals = useAppSelector((state) => state.rentals.rentals);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredRentals = rentals.filter((r) => {
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchesSearch =
      r.rentalOrderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.items?.[0]?.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.deliveryAddress?.city?.toLowerCase().includes(searchQuery.toLowerCase());
    return Boolean(matchesStatus && matchesSearch);
  });

  const handleStatusChange = (id: string, status: RentalOrder['status']) => {
    dispatch(updateRentalStatus({ id, status }));
  };

  const getStatusBadge = (status: RentalOrder['status']) => {
    const config = {
      pending: { bg: '#fff4eb', text: '#913200', border: '#ffdbce', icon: Clock, label: 'Pending Confirmation' },
      confirmed: { bg: '#eaedff', text: '#006398', border: '#cce5ff', icon: Truck, label: 'Confirmed / Packing' },
      active: { bg: '#e8f5f3', text: '#005c55', border: '#9cf2e8', icon: CheckCircle2, label: 'Active on Rent' },
      returned: { bg: '#f2f3ff', text: '#3e4947', border: '#dae2fd', icon: RotateCcw, label: 'Returned & Released' },
      cancelled: { bg: '#ffdad6', text: '#ba1a1a', border: '#ffb4ab', icon: XCircle, label: 'Cancelled' },
    }[status];

    const Icon = config.icon;
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          padding: '4px 10px',
          borderRadius: 999,
          background: config.bg,
          color: config.text,
          border: `1px solid ${config.border}`,
          fontSize: '0.75rem',
          fontWeight: 700,
        }}
      >
        <Icon size={12} />
        {config.label}
      </span>
    );
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
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#131b2e', margin: 0 }}>
            Rental Operations &amp; Dispatch Hub
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6e7977', margin: '4px 0 0' }}>
            Coordinate hospital equipment drop-offs, track active deployments, and release security deposits upon pickup.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              background: '#e8f5f3',
              color: '#005c55',
              fontSize: '0.8125rem',
              fontWeight: 700,
            }}
          >
            {rentals.filter((r) => r.status === 'active').length} Active Deployments
          </span>
        </div>
      </div>

      {/* Filter Chips & Search Bar */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 14,
          padding: '1rem 1.25rem',
          border: '1px solid #e2e7ff',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
          <Search
            size={18}
            color="#6e7977"
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search by rental ID, equipment, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 38px',
              borderRadius: 8,
              border: '1px solid #dae2fd',
              fontSize: '0.875rem',
              outline: 'none',
              background: '#f8f9ff',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Rentals' },
            { id: 'pending', label: 'Pending' },
            { id: 'confirmed', label: 'Confirmed' },
            { id: 'active', label: 'Active' },
            { id: 'returned', label: 'Returned' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id)}
              style={{
                padding: '7px 12px',
                borderRadius: 8,
                border: filterStatus === tab.id ? '1px solid #005c55' : '1px solid #dae2fd',
                background: filterStatus === tab.id ? '#e8f5f3' : '#ffffff',
                color: filterStatus === tab.id ? '#005c55' : '#3e4947',
                fontSize: '0.8125rem',
                fontWeight: filterStatus === tab.id ? 700 : 500,
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rentals Cards/Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredRentals.length === 0 ? (
          <div
            style={{
              padding: '3rem 2rem',
              textAlign: 'center',
              background: '#ffffff',
              borderRadius: 16,
              border: '1px solid #e2e7ff',
            }}
          >
            <CalendarSync size={40} color="#6e7977" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#131b2e', margin: 0 }}>
              No rental orders found
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6e7977', margin: '4px 0 0' }}>
              Try changing your search query or status filter.
            </p>
          </div>
        ) : (
          filteredRentals.map((rental) => {
            const firstItem = rental.items?.[0];
            return (
              <div
                key={rental.id}
                style={{
                  background: '#ffffff',
                  borderRadius: 16,
                  padding: '1.25rem 1.5rem',
                  border: '1px solid #e2e7ff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                {/* Top Row: Order ID, Date, Status */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: '#131b2e' }}>
                      {rental.rentalOrderNumber}
                    </span>
                    {getStatusBadge(rental.status)}
                    <span style={{ fontSize: '0.75rem', color: '#6e7977' }}>
                      Booked: {new Date(rental.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  {/* Financial Overview */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.6875rem', color: '#6e7977', display: 'block' }}>Rental Period Fee</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#006398' }}>
                        ₹{rental.totalRentalFee?.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right', borderLeft: '1px solid #e2e7ff', paddingLeft: 16 }}>
                      <span style={{ fontSize: '0.6875rem', color: '#6e7977', display: 'block' }}>Deposit Held</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#913200' }}>
                        ₹{rental.totalDeposit?.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Middle Section: Equipment Details & Delivery Address */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 16,
                    padding: '12px 16px',
                    background: '#f8f9ff',
                    borderRadius: 12,
                    border: '1px solid #eaedff',
                  }}
                >
                  {/* Equipment Item */}
                  <div>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6e7977', textTransform: 'uppercase' }}>
                      Medical Equipment
                    </span>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#131b2e', marginTop: 2 }}>
                      {firstItem?.productName || 'Hospital Bed'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#005c55', marginTop: 2 }}>
                      Duration: <strong>{firstItem?.durationDays || 7} Days</strong> (₹{firstItem?.dailyRate || 350}/day)
                    </div>
                  </div>

                  {/* Delivery Location & Caregiver */}
                  <div>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6e7977', textTransform: 'uppercase' }}>
                      Delivery Destination
                    </span>
                    <div style={{ fontSize: '0.8125rem', color: '#131b2e', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                      <MapPin size={14} color="#006398" />
                      <span>
                        {rental.deliveryAddress?.addressLine1 || 'Indiranagar'}, {rental.deliveryAddress?.city || 'Bengaluru'} - {rental.deliveryAddress?.pincode || '560038'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6e7977', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <Phone size={12} color="#005c55" />
                      <span>Patient Contact: +91 98765 43210</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Manual Status Action Buttons (Out-of-app Fulfillment) */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ fontSize: '0.75rem', color: '#6e7977', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ShieldAlert size={14} color="#913200" />
                    <span>Out-of-app fulfillment: Delivery and pickup are manually managed by operations.</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {rental.status === 'pending' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(rental.id, 'confirmed')}
                        style={{
                          padding: '7px 14px',
                          borderRadius: 8,
                          background: '#006398',
                          color: '#ffffff',
                          border: 'none',
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Confirm Booking
                      </button>
                    )}

                    {rental.status === 'confirmed' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(rental.id, 'active')}
                        style={{
                          padding: '7px 14px',
                          borderRadius: 8,
                          background: '#005c55',
                          color: '#ffffff',
                          border: 'none',
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Dispatch &amp; Mark Active
                      </button>
                    )}

                    {rental.status === 'active' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(rental.id, 'returned')}
                        style={{
                          padding: '7px 14px',
                          borderRadius: 8,
                          background: '#913200',
                          color: '#ffffff',
                          border: 'none',
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Process Return &amp; Release Deposit (₹{rental.totalDeposit})
                      </button>
                    )}

                    {rental.status !== 'cancelled' && rental.status !== 'returned' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(rental.id, 'cancelled')}
                        style={{
                          padding: '7px 14px',
                          borderRadius: 8,
                          background: 'transparent',
                          color: '#ba1a1a',
                          border: '1px solid #ffdad6',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
