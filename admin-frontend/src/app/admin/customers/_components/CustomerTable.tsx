'use client';

import React from 'react';
import { CustomerSummary } from '@/domain/entities/user.entity';
import {
  Users,
  Search,
  ShoppingBag,
  CalendarSync,
  Mail,
  Phone,
  ShieldCheck,
  MapPin,
  Eye,
} from 'lucide-react';

interface CustomerTableProps {
  customers: CustomerSummary[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  segmentFilter: 'all' | 'rentees' | 'buyers';
  setSegmentFilter: (segment: 'all' | 'rentees' | 'buyers') => void;
  totalCustomersCount: number;
  activeRenteesCount: number;
  buyersCount: number;
  onOpenHistory: (customer: CustomerSummary) => void;
}

export function CustomerTable({
  customers,
  searchQuery,
  setSearchQuery,
  segmentFilter,
  setSegmentFilter,
  totalCustomersCount,
  activeRenteesCount,
  buyersCount,
  onOpenHistory,
}: CustomerTableProps) {
  return (
    <>
      {/* Search & Filter Toolbar */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 12,
          padding: '1rem 1.25rem',
          border: '1px solid #dce4e8',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 260 }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: 360 }}>
            <Search
              size={17}
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#8b9695',
              }}
            />
            <input
              type="text"
              placeholder="Search by name, email, phone, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 38px',
                borderRadius: 8,
                border: '1px solid #ccd6dc',
                fontSize: '0.875rem',
                outline: 'none',
                fontFamily: 'inherit',
                color: '#131b2e',
              }}
            />
          </div>
        </div>

        {/* Segment Toggle Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f4f6fc', padding: 4, borderRadius: 8 }}>
          <button
            onClick={() => setSegmentFilter('all')}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: segmentFilter === 'all' ? '#ffffff' : 'transparent',
              color: segmentFilter === 'all' ? '#131b2e' : '#6e7977',
              boxShadow: segmentFilter === 'all' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            All Patients ({totalCustomersCount})
          </button>
          <button
            onClick={() => setSegmentFilter('rentees')}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: segmentFilter === 'rentees' ? '#ffffff' : 'transparent',
              color: segmentFilter === 'rentees' ? '#b94200' : '#6e7977',
              boxShadow: segmentFilter === 'rentees' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Rentees ({activeRenteesCount})
          </button>
          <button
            onClick={() => setSegmentFilter('buyers')}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: segmentFilter === 'buyers' ? '#ffffff' : 'transparent',
              color: segmentFilter === 'buyers' ? '#006398' : '#6e7977',
              boxShadow: segmentFilter === 'buyers' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Buyers ({buyersCount})
          </button>
        </div>
      </div>

      {/* Customer Directory Table */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 12,
          border: '1px solid #dce4e8',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(19, 27, 46, 0.04)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 850 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #dce4e8' }}>
                <th style={{ padding: '12px 18px', fontSize: '0.75rem', fontWeight: 700, color: '#6e7977', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Patient / Caregiver
                </th>
                <th style={{ padding: '12px 18px', fontSize: '0.75rem', fontWeight: 700, color: '#6e7977', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Contact Information
                </th>
                <th style={{ padding: '12px 18px', fontSize: '0.75rem', fontWeight: 700, color: '#6e7977', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Care Location
                </th>
                <th style={{ padding: '12px 18px', fontSize: '0.75rem', fontWeight: 700, color: '#6e7977', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Equipment Activity
                </th>
                <th style={{ padding: '12px 18px', fontSize: '0.75rem', fontWeight: 700, color: '#6e7977', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Total Spend
                </th>
                <th style={{ padding: '12px 18px', fontSize: '0.75rem', fontWeight: 700, color: '#6e7977', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem 1rem', textAlign: 'center', color: '#6e7977' }}>
                    <Users size={36} style={{ opacity: 0.3, marginBottom: 8, display: 'block', margin: '0 auto' }} />
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#131b2e' }}>No matching patients found</div>
                    <div style={{ fontSize: '0.8125rem', marginTop: 4 }}>Try clearing the search query or changing filters.</div>
                  </td>
                </tr>
              ) : (
                customers.map((customer, idx) => (
                  <tr
                    key={customer.id}
                    style={{
                      borderBottom: idx === customers.length - 1 ? 'none' : '1px solid #edf2f7',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Customer Name & Badge */}
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #005c55 0%, #006398 100%)',
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '0.9375rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {customer.name
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#131b2e' }}>
                            {customer.name}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                            <span
                              style={{
                                fontSize: '0.6875rem',
                                padding: '2px 8px',
                                borderRadius: 12,
                                fontWeight: 700,
                                background: 'rgba(0, 92, 85, 0.08)',
                                color: '#005c55',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 3,
                              }}
                            >
                              <ShieldCheck size={11} />
                              Verified Caregiver
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ fontSize: '0.8125rem', color: '#131b2e', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Mail size={13} style={{ color: '#6e7977' }} />
                          {customer.email}
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: '#6e7977', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Phone size={13} style={{ color: '#6e7977' }} />
                          {customer.phone}
                        </div>
                      </div>
                    </td>

                    {/* Care Location */}
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: '#131b2e' }}>
                        <MapPin size={14} style={{ color: '#006398', flexShrink: 0 }} />
                        <span>{customer.primaryCity || 'Not Specified'}</span>
                      </div>
                      {customer.addresses?.[0]?.pincode && (
                        <div style={{ fontSize: '0.75rem', color: '#6e7977', marginLeft: 20, marginTop: 2 }}>
                          PIN: {customer.addresses[0].pincode}
                        </div>
                      )}
                    </td>

                    {/* Equipment Activity */}
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        {customer.totalOrdersCount > 0 ? (
                          <span
                            style={{
                              fontSize: '0.75rem',
                              padding: '3px 8px',
                              borderRadius: 6,
                              fontWeight: 700,
                              background: 'rgba(0, 99, 152, 0.08)',
                              color: '#006398',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                            }}
                          >
                            <ShoppingBag size={12} />
                            {customer.totalOrdersCount} Buy Orders
                          </span>
                        ) : null}

                        {customer.totalRentalsCount > 0 ? (
                          <span
                            style={{
                              fontSize: '0.75rem',
                              padding: '3px 8px',
                              borderRadius: 6,
                              fontWeight: 700,
                              background: 'rgba(185, 66, 0, 0.08)',
                              color: '#b94200',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                            }}
                          >
                            <CalendarSync size={12} />
                            {customer.totalRentalsCount} Rentals
                          </span>
                        ) : null}

                        {customer.totalOrdersCount === 0 && customer.totalRentalsCount === 0 && (
                          <span style={{ fontSize: '0.75rem', color: '#8b9695' }}>New Account</span>
                        )}
                      </div>
                    </td>

                    {/* Total Spend */}
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#005c55' }}>
                        ₹{customer.totalSpend.toLocaleString('en-IN')}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: '#8b9695', marginTop: 2 }}>
                        Lifetime Value
                      </div>
                    </td>

                    {/* Action */}
                    <td style={{ padding: '16px 18px', textAlign: 'right' }}>
                      <button
                        onClick={() => onOpenHistory(customer)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '7px 14px',
                          borderRadius: 6,
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          background: '#005c55',
                          color: '#ffffff',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#004741')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#005c55')}
                      >
                        <Eye size={14} />
                        View Care History
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
