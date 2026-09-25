'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  ShoppingBag,
  CalendarSync,
  IndianRupee,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  Eye,
  X,
  FileText,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  getCustomers,
  getCustomerCareHistory,
} from '@/features/user/get-customers/get-customers.action';
import { setSelectedCustomerHistory } from '@/features/user/user.slice';
import { CustomerSummary } from '@/domain/entities/user.entity';

export default function AdminCustomersPage() {
  const dispatch = useAppDispatch();
  const customers = useAppSelector((state) => state.user.customers);
  const selectedHistory = useAppSelector((state) => state.user.selectedCustomerHistory);
  const customerLoading = useAppSelector((state) => state.user.customerLoading);

  const [searchQuery, setSearchQuery] = useState('');
  const [segmentFilter, setSegmentFilter] = useState<'all' | 'rentees' | 'buyers'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'all' | 'buy' | 'rent' | 'addresses'>('all');

  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);

  // Aggregate metrics
  const totalCustomers = customers.length;
  const activeRenteesCount = customers.filter((c) => c.totalRentalsCount > 0).length;
  const repeatBuyersCount = customers.filter((c) => c.totalOrdersCount > 1).length;
  const totalLifetimeSpend = customers.reduce((sum, c) => sum + (c.totalSpend || 0), 0);

  // Filtered customer list
  const filteredCustomers = customers.filter((customer) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.phone.includes(query) ||
      (customer.primaryCity && customer.primaryCity.toLowerCase().includes(query));

    let matchesSegment = true;
    if (segmentFilter === 'rentees') {
      matchesSegment = customer.totalRentalsCount > 0;
    } else if (segmentFilter === 'buyers') {
      matchesSegment = customer.totalOrdersCount > 0;
    }

    return matchesSearch && matchesSegment;
  });

  const handleOpenHistory = async (customer: CustomerSummary) => {
    dispatch(getCustomerCareHistory(customer.id));
    setIsModalOpen(true);
    setModalTab('all');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    dispatch(setSelectedCustomerHistory(null));
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Header */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: 'rgba(0, 99, 152, 0.1)',
                color: '#006398',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Users size={20} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#131b2e', margin: 0 }}>
              Patients & Caregivers Directory
            </h1>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#6e7977', margin: '6px 0 0' }}>
            Centralized directory of verified equipment buyers, active rental subscribers, and clinical care journeys.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: '0.8125rem',
              fontWeight: 700,
              background: 'rgba(0, 92, 85, 0.1)',
              color: '#005c55',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <ShieldCheck size={15} />
            CDSCO Clinical Care Network
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {/* Card 1: Total Patients */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 12,
            padding: '1.25rem',
            border: '1px solid #dce4e8',
            boxShadow: '0 2px 8px rgba(19, 27, 46, 0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#6e7977' }}>
              Total Registered Patients
            </span>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(0, 92, 85, 0.1)',
                color: '#005c55',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Users size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#131b2e', marginTop: 8 }}>
            {totalCustomers}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#005c55', marginTop: 4, fontWeight: 600 }}>
            Pan-India verified accounts
          </div>
        </div>

        {/* Card 2: Active Rentees */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 12,
            padding: '1.25rem',
            border: '1px solid #dce4e8',
            boxShadow: '0 2px 8px rgba(19, 27, 46, 0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#6e7977' }}>
              Active Equipment Rentees
            </span>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(185, 66, 0, 0.1)',
                color: '#b94200',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CalendarSync size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#131b2e', marginTop: 8 }}>
            {activeRenteesCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#b94200', marginTop: 4, fontWeight: 600 }}>
            Under active medical rental terms
          </div>
        </div>

        {/* Card 3: Repeat Buyers */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 12,
            padding: '1.25rem',
            border: '1px solid #dce4e8',
            boxShadow: '0 2px 8px rgba(19, 27, 46, 0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#6e7977' }}>
              Repeat Equipment Buyers
            </span>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(0, 99, 152, 0.1)',
                color: '#006398',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShoppingBag size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#131b2e', marginTop: 8 }}>
            {repeatBuyersCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#006398', marginTop: 4, fontWeight: 600 }}>
            Multiple purchases & consumables
          </div>
        </div>

        {/* Card 4: Platform Equipment Spend */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 12,
            padding: '1.25rem',
            border: '1px solid #dce4e8',
            boxShadow: '0 2px 8px rgba(19, 27, 46, 0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#6e7977' }}>
              Total Patient Equipment Value
            </span>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(0, 92, 85, 0.1)',
                color: '#005c55',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IndianRupee size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#005c55', marginTop: 8 }}>
            ₹{totalLifetimeSpend.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6e7977', marginTop: 4 }}>
            Direct sales & rental contracts
          </div>
        </div>
      </div>

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
            All Patients ({customers.length})
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
            Buyers ({customers.filter((c) => c.totalOrdersCount > 0).length})
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
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem 1rem', textAlign: 'center', color: '#6e7977' }}>
                    <Users size={36} style={{ opacity: 0.3, marginBottom: 8, display: 'block', margin: '0 auto' }} />
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#131b2e' }}>No matching patients found</div>
                    <div style={{ fontSize: '0.8125rem', marginTop: 4 }}>Try clearing the search query or changing filters.</div>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer, idx) => (
                  <tr
                    key={customer.id}
                    style={{
                      borderBottom: idx === filteredCustomers.length - 1 ? 'none' : '1px solid #edf2f7',
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
                        onClick={() => handleOpenHistory(customer)}
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

      {/* Patient Care History Modal / Drawer */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(19, 27, 46, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 16,
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              width: '100%',
              maxWidth: 850,
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.5rem',
                borderBottom: '1px solid #dce4e8',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                background: '#ffffff',
                zIndex: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #005c55 0%, #006398 100%)',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '1.125rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {selectedHistory?.name
                    ? selectedHistory.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                    : 'P'}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#131b2e', margin: 0 }}>
                      {selectedHistory?.name || 'Patient Care History'}
                    </h2>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: 10,
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        background: 'rgba(0, 92, 85, 0.1)',
                        color: '#005c55',
                      }}
                    >
                      Caregiver ID #{selectedHistory?.id}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 4, fontSize: '0.8125rem', color: '#6e7977' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Mail size={13} /> {selectedHistory?.email}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Phone size={13} /> {selectedHistory?.phone}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCloseModal}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6e7977',
                  cursor: 'pointer',
                  padding: 6,
                  borderRadius: 6,
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div
              style={{
                display: 'flex',
                borderBottom: '1px solid #dce4e8',
                padding: '0 1.5rem',
                background: '#f8fafc',
              }}
            >
              <button
                onClick={() => setModalTab('all')}
                style={{
                  padding: '12px 16px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: modalTab === 'all' ? '#005c55' : '#6e7977',
                  borderBottom: modalTab === 'all' ? '2px solid #005c55' : '2px solid transparent',
                }}
              >
                Care Journey Overview
              </button>
              <button
                onClick={() => setModalTab('buy')}
                style={{
                  padding: '12px 16px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: modalTab === 'buy' ? '#006398' : '#6e7977',
                  borderBottom: modalTab === 'buy' ? '2px solid #006398' : '2px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <ShoppingBag size={14} />
                Outright Purchases ({selectedHistory?.orders?.length || 0})
              </button>
              <button
                onClick={() => setModalTab('rent')}
                style={{
                  padding: '12px 16px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: modalTab === 'rent' ? '#b94200' : '#6e7977',
                  borderBottom: modalTab === 'rent' ? '2px solid #b94200' : '2px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <CalendarSync size={14} />
                Active & Past Rentals ({selectedHistory?.rentals?.length || 0})
              </button>
              <button
                onClick={() => setModalTab('addresses')}
                style={{
                  padding: '12px 16px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: modalTab === 'addresses' ? '#005c55' : '#6e7977',
                  borderBottom: modalTab === 'addresses' ? '2px solid #005c55' : '2px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <MapPin size={14} />
                Addresses ({selectedHistory?.addresses?.length || 0})
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem' }}>
              {customerLoading && !selectedHistory ? (
                <div style={{ textAlign: 'center', padding: '3rem 0', color: '#6e7977' }}>
                  <Clock size={28} style={{ animation: 'spin 1s linear infinite' }} />
                  <div style={{ marginTop: 8, fontSize: '0.875rem' }}>Loading patient equipment history...</div>
                </div>
              ) : (
                <>
                  {/* Overview Tab Content */}
                  {(modalTab === 'all' || modalTab === 'addresses') && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#131b2e', marginBottom: 12 }}>
                        Registered Delivery Addresses
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
                        {selectedHistory?.addresses?.map((addr) => (
                          <div
                            key={addr.id}
                            style={{
                              padding: '12px 14px',
                              borderRadius: 8,
                              border: '1px solid #dce4e8',
                              background: addr.isDefault ? '#f0fdf4' : '#ffffff',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e' }}>
                                {addr.label || 'Home'}
                              </span>
                              {addr.isDefault && (
                                <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#005c55', background: 'rgba(0, 92, 85, 0.1)', padding: '2px 6px', borderRadius: 4 }}>
                                  Default Delivery
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.8125rem', color: '#444d4c', lineHeight: 1.4 }}>
                              {addr.line1}
                              {addr.line2 ? `, ${addr.line2}` : ''}
                            </div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6e7977', marginTop: 4 }}>
                              {addr.city}, {addr.state} — {addr.pincode}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Outright Purchases Section */}
                  {(modalTab === 'all' || modalTab === 'buy') && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#131b2e', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <ShoppingBag size={16} style={{ color: '#006398' }} />
                          Outright Purchases (Buy Flow)
                        </h3>
                        <span style={{ fontSize: '0.75rem', color: '#6e7977' }}>
                          {selectedHistory?.orders?.length || 0} completed orders
                        </span>
                      </div>

                      {selectedHistory?.orders && selectedHistory.orders.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          {selectedHistory.orders.map((order) => (
                            <div
                              key={order.id}
                              style={{
                                border: '1px solid #dce4e8',
                                borderRadius: 10,
                                padding: '14px',
                                background: '#fafbfc',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, borderBottom: '1px solid #edf2f7', paddingBottom: 10, marginBottom: 10 }}>
                                <div>
                                  <span style={{ fontWeight: 800, color: '#131b2e', fontSize: '0.875rem' }}>
                                    {order.orderNumber}
                                  </span>
                                  <span style={{ fontSize: '0.75rem', color: '#6e7977', marginLeft: 8 }}>
                                    Placed: {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : 'Recent'}
                                  </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <span
                                    style={{
                                      fontSize: '0.6875rem',
                                      fontWeight: 700,
                                      padding: '2px 8px',
                                      borderRadius: 12,
                                      background: order.status === 'delivered' ? 'rgba(0, 92, 85, 0.1)' : 'rgba(0, 99, 152, 0.1)',
                                      color: order.status === 'delivered' ? '#005c55' : '#006398',
                                    }}
                                  >
                                    {order.status.toUpperCase()}
                                  </span>
                                  <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#005c55' }}>
                                    ₹{(order.total || (order as any).totalAmount || 0).toLocaleString('en-IN')}
                                  </span>
                                </div>
                              </div>

                              {/* Order Items */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {order.items?.map((item) => (
                                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                      <span style={{ color: '#131b2e', fontWeight: 600 }}>{item.productName}</span>
                                      <span style={{ color: '#6e7977' }}>× {item.quantity}</span>
                                    </div>
                                    <span style={{ fontWeight: 700, color: '#131b2e' }}>
                                      ₹{item.totalPrice.toLocaleString('en-IN')}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ padding: '1.5rem', textAlign: 'center', color: '#6e7977', background: '#f8fafc', borderRadius: 8, fontSize: '0.8125rem' }}>
                          No outright equipment purchases on file for this patient.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Rental Contracts Section */}
                  {(modalTab === 'all' || modalTab === 'rent') && (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#131b2e', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <CalendarSync size={16} style={{ color: '#b94200' }} />
                          Equipment Rental Contracts (Rent Flow)
                        </h3>
                        <span style={{ fontSize: '0.75rem', color: '#6e7977' }}>
                          {selectedHistory?.rentals?.length || 0} rental contracts
                        </span>
                      </div>

                      {selectedHistory?.rentals && selectedHistory.rentals.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          {selectedHistory.rentals.map((rental) => (
                            <div
                              key={rental.id}
                              style={{
                                border: '1px solid #dce4e8',
                                borderRadius: 10,
                                padding: '14px',
                                background: '#fafbfc',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, borderBottom: '1px solid #edf2f7', paddingBottom: 10, marginBottom: 10 }}>
                                <div>
                                  <span style={{ fontWeight: 800, color: '#131b2e', fontSize: '0.875rem' }}>
                                    {rental.rentalOrderNumber}
                                  </span>
                                  <span style={{ fontSize: '0.75rem', color: '#6e7977', marginLeft: 8 }}>
                                    Contract Date: {rental.createdAt ? new Date(rental.createdAt).toLocaleDateString('en-IN') : 'Recent'}
                                  </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <span
                                    style={{
                                      fontSize: '0.6875rem',
                                      fontWeight: 700,
                                      padding: '2px 8px',
                                      borderRadius: 12,
                                      background: rental.status === 'active' ? 'rgba(0, 92, 85, 0.1)' : 'rgba(185, 66, 0, 0.1)',
                                      color: rental.status === 'active' ? '#005c55' : '#b94200',
                                    }}
                                  >
                                    {rental.status.toUpperCase()}
                                  </span>
                                  <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#b94200' }}>
                                    ₹{rental.totalPaid.toLocaleString('en-IN')}
                                  </span>
                                </div>
                              </div>

                              {/* Rental Items */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {rental.items?.map((item) => (
                                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                                    <div>
                                      <div style={{ color: '#131b2e', fontWeight: 600 }}>{item.productName}</div>
                                      <div style={{ fontSize: '0.75rem', color: '#6e7977' }}>
                                        Duration: {item.durationDays} Days | Daily Rate: ₹{item.dailyRate} | Deposit: ₹{item.securityDeposit}
                                      </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                      <div style={{ fontWeight: 700, color: '#131b2e' }}>
                                        ₹{item.rentalCost.toLocaleString('en-IN')}
                                      </div>
                                      <div style={{ fontSize: '0.6875rem', color: '#005c55', fontWeight: 600 }}>
                                        Deposit: ₹{item.securityDeposit.toLocaleString('en-IN')}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ padding: '1.5rem', textAlign: 'center', color: '#6e7977', background: '#f8fafc', borderRadius: 8, fontSize: '0.8125rem' }}>
                          No rental contracts on file for this patient.
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
