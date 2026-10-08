'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  ShoppingBag,
  CalendarSync,
  IndianRupee,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  getCustomers,
  getCustomerCareHistory,
} from '@/features/user/get-customers/get-customers.action';
import { setSelectedCustomerHistory } from '@/features/user/user.slice';
import { CustomerSummary } from '@/domain/entities/user.entity';
import { CustomerTable } from './_components/CustomerTable';
import { CustomerCareHistoryModal } from './_components/CustomerCareHistoryModal';

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
  const buyersCount = customers.filter((c) => c.totalOrdersCount > 0).length;
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
              Patients &amp; Caregivers Directory
            </h1>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#6e7977', margin: '6px 0 0' }}>
            Centralized directory of verified equipment buyers, active rental subscribers, and clinical care journeys.
          </p>
        </div>
      </div>

      {/* Aggregate KPI Stats Banner */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
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
              Registered Patients
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
              <Users size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#131b2e', marginTop: 8 }}>
            {totalCustomers}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6e7977', marginTop: 4 }}>
            Direct storefront accounts
          </div>
        </div>

        {/* Card 2: Rental Subscribers */}
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
              Active Rental Patients
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
            Ongoing monthly subscriptions
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
              Repeat Buyers
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
            Multiple purchases &amp; consumables
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
            Direct sales &amp; rental contracts
          </div>
        </div>
      </div>

      {/* Customer Directory Table Component */}
      <CustomerTable
        customers={filteredCustomers}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        segmentFilter={segmentFilter}
        setSegmentFilter={setSegmentFilter}
        totalCustomersCount={customers.length}
        activeRenteesCount={activeRenteesCount}
        buyersCount={buyersCount}
        onOpenHistory={handleOpenHistory}
      />

      {/* Patient Care History Modal / Drawer Component */}
      <CustomerCareHistoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedHistory={selectedHistory}
        customerLoading={customerLoading}
        modalTab={modalTab}
        setModalTab={setModalTab}
      />
    </div>
  );
}
