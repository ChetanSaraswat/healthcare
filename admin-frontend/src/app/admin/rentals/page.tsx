'use client';

import React, { useState, useEffect } from 'react';
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
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { listRentals } from '@/features/rentals/list-rentals/list-rentals.action';
import { updateRentalStatusAction } from '@/features/rentals/update-rental-status/update-rental-status.action';
import { RentalOrder } from '@/domain/entities/rental.entity';

export default function AdminRentalsPage() {
  const dispatch = useAppDispatch();
  const { rentals, loading, error } = useAppSelector((state) => state.rentals);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(listRentals());
  }, [dispatch]);

  const filteredRentals = rentals.filter((r) => {
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchesSearch =
      r.rentalOrderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.items?.some((item) => item.productName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.deliveryAddress?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.deliveryAddress?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.deliveryAddress?.phone?.includes(searchQuery);
    return Boolean(matchesStatus && matchesSearch);
  });

  const handleStatusChange = async (id: string, status: RentalOrder['status']) => {
    setUpdatingId(id);
    setActionError(null);
    try {
      await dispatch(updateRentalStatusAction({ rentalId: id, status })).unwrap();
      dispatch(listRentals());
    } catch (err: any) {
      setActionError(typeof err === 'string' ? err : 'Failed to update rental status on server');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: RentalOrder['status']) => {
    const config = {
      pending: { bg: '#fff4eb', text: '#913200', border: '#ffdbce', icon: Clock, label: 'Pending Confirmation' },
      confirmed: { bg: '#eaedff', text: '#006398', border: '#cce5ff', icon: Truck, label: 'Confirmed / Packing' },
      active: { bg: '#e8f5f3', text: '#005c55', border: '#9cf2e8', icon: CheckCircle2, label: 'Active on Rent' },
      returned: { bg: '#f2f3ff', text: '#3e4947', border: '#dae2fd', icon: RotateCcw, label: 'Returned & Released' },
      cancelled: { bg: '#ffdad6', text: '#ba1a1a', border: '#ffb4ab', icon: XCircle, label: 'Cancelled' },
    }[status] || { bg: '#f2f3ff', text: '#3e4947', border: '#dae2fd', icon: Clock, label: status };

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
          <button
            type="button"
            onClick={() => dispatch(listRentals())}
            disabled={loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 8,
              background: '#ffffff',
              border: '1px solid #dae2fd',
              color: '#005c55',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
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

      {actionError && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 8,
            background: '#ffdad6',
            color: '#ba1a1a',
            fontSize: '0.875rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <AlertCircle size={16} />
          <span>{actionError}</span>
        </div>
      )}

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
            placeholder="Search by rental ID, equipment, patient, city, phone..."
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
            { id: 'cancelled', label: 'Cancelled' },
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
        {loading && rentals.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  background: '#ffffff',
                  borderRadius: 16,
                  padding: '1.5rem',
                  border: '1px solid #e2e7ff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ height: 24, width: 220, background: '#f1f5f9', borderRadius: 8 }} />
                  <div style={{ height: 24, width: 140, background: '#f1f5f9', borderRadius: 8 }} />
                </div>
                <div style={{ height: 60, background: '#f8fafc', borderRadius: 12 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ height: 20, width: 180, background: '#f1f5f9', borderRadius: 6 }} />
                  <div style={{ height: 32, width: 200, background: '#f1f5f9', borderRadius: 8 }} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredRentals.length === 0 ? (
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
              {searchQuery || filterStatus !== 'all'
                ? 'Try changing your search query or status filter.'
                : 'No rental agreements have been placed yet.'}
            </p>
          </div>
        ) : (
          filteredRentals.map((rental) => {
            const isUpdating = updatingId === rental.id;
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
                  opacity: isUpdating ? 0.7 : 1,
                  pointerEvents: isUpdating ? 'none' : 'auto',
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
                        ₹{Number(rental.totalRentalFee || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right', borderLeft: '1px solid #e2e7ff', paddingLeft: 16 }}>
                      <span style={{ fontSize: '0.6875rem', color: '#6e7977', display: 'block' }}>Deposit Held</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#913200' }}>
                        ₹{Number(rental.totalDeposit || 0).toLocaleString('en-IN')}
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
                  {/* Equipment Items */}
                  <div>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6e7977', textTransform: 'uppercase' }}>
                      Medical Equipment ({rental.items?.length || 0})
                    </span>
                    {rental.items && rental.items.length > 0 ? (
                      rental.items.map((item, idx) => (
                        <div key={item.id || idx} style={{ marginTop: idx > 0 ? 8 : 4 }}>
                          <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#131b2e' }}>
                            {item.productName || 'Equipment'}
                            {item.quantity > 1 && (
                              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6e7977', marginLeft: 6 }}>
                                × {item.quantity}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#005c55', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            {item.durationDays ? (
                              <span>Duration: <strong>{item.durationDays} Days</strong></span>
                            ) : null}
                            {item.startDate && item.endDate && (
                              <span style={{ color: '#6e7977' }}>({item.startDate} to {item.endDate})</span>
                            )}
                            {item.dailyRate > 0 && (
                              <span style={{ color: '#6e7977' }}>• ₹{item.dailyRate.toLocaleString('en-IN')}/day</span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ fontSize: '0.8125rem', color: '#6e7977', marginTop: 4 }}>
                        No equipment details recorded
                      </div>
                    )}
                  </div>

                  {/* Delivery Location & Caregiver Contact */}
                  <div>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6e7977', textTransform: 'uppercase' }}>
                      Patient &amp; Delivery Destination
                    </span>
                    {rental.deliveryAddress?.fullName ? (
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#131b2e', marginTop: 2 }}>
                        {rental.deliveryAddress.fullName}
                      </div>
                    ) : null}
                    <div style={{ fontSize: '0.8125rem', color: '#131b2e', display: 'flex', alignItems: 'flex-start', gap: 6, marginTop: 4 }}>
                      <MapPin size={14} color="#006398" style={{ marginTop: 2, flexShrink: 0 }} />
                      <span>
                        {[
                          rental.deliveryAddress?.addressLine1,
                          rental.deliveryAddress?.city,
                          rental.deliveryAddress?.state,
                          rental.deliveryAddress?.pincode,
                        ]
                          .filter(Boolean)
                          .join(', ') || 'Address not specified'}
                      </span>
                    </div>
                    {rental.deliveryAddress?.phone ? (
                      <div style={{ fontSize: '0.75rem', color: '#005c55', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontWeight: 600 }}>
                        <Phone size={12} color="#005c55" />
                        <span>Patient Contact: {rental.deliveryAddress.phone}</span>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.75rem', color: '#889096', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <Phone size={12} color="#889096" />
                        <span>Patient Contact: Not provided</span>
                      </div>
                    )}
                    {rental.deliveryAddress?.email && (
                      <div style={{ fontSize: '0.75rem', color: '#6e7977', marginTop: 2, paddingLeft: 18 }}>
                        {rental.deliveryAddress.email}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Row: Manual Status Action Buttons (Out-of-app Fulfillment) */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ fontSize: '0.75rem', color: '#6e7977', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ShieldAlert size={14} color="#913200" />
                    <span>Out-of-app fulfillment: Equipment delivery and pickup are manually coordinated by AarogyaMed staff.</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {rental.status === 'pending' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(rental.id, 'confirmed')}
                        disabled={isUpdating}
                        style={{
                          padding: '7px 14px',
                          borderRadius: 8,
                          background: '#006398',
                          color: '#ffffff',
                          border: 'none',
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          cursor: isUpdating ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {isUpdating ? 'Updating...' : 'Confirm Booking'}
                      </button>
                    )}

                    {rental.status === 'confirmed' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(rental.id, 'active')}
                        disabled={isUpdating}
                        style={{
                          padding: '7px 14px',
                          borderRadius: 8,
                          background: '#005c55',
                          color: '#ffffff',
                          border: 'none',
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          cursor: isUpdating ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {isUpdating ? 'Updating...' : 'Dispatch & Mark Active'}
                      </button>
                    )}

                    {rental.status === 'active' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(rental.id, 'returned')}
                        disabled={isUpdating}
                        style={{
                          padding: '7px 14px',
                          borderRadius: 8,
                          background: '#913200',
                          color: '#ffffff',
                          border: 'none',
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          cursor: isUpdating ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {isUpdating ? 'Updating...' : `Process Return & Release Deposit (₹${Number(rental.totalDeposit || 0).toLocaleString('en-IN')})`}
                      </button>
                    )}

                    {rental.status !== 'cancelled' && rental.status !== 'returned' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(rental.id, 'cancelled')}
                        disabled={isUpdating}
                        style={{
                          padding: '7px 14px',
                          borderRadius: 8,
                          background: 'transparent',
                          color: '#ba1a1a',
                          border: '1px solid #ffdad6',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          cursor: isUpdating ? 'not-allowed' : 'pointer',
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
