'use client';

import React from 'react';
import { CustomerCareHistory, Address } from '@/domain/entities/user.entity';
import { Order } from '@/domain/entities/order.entity';
import { RentalOrder } from '@/domain/entities/rental.entity';
import {
  ShoppingBag,
  CalendarSync,
  Mail,
  Phone,
  MapPin,
  X,
  Clock,
} from 'lucide-react';

interface CustomerCareHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedHistory: CustomerCareHistory | null;
  customerLoading: boolean;
  modalTab: 'all' | 'buy' | 'rent' | 'addresses';
  setModalTab: (tab: 'all' | 'buy' | 'rent' | 'addresses') => void;
}

export function CustomerCareHistoryModal({
  isOpen,
  onClose,
  selectedHistory,
  customerLoading,
  modalTab,
  setModalTab,
}: CustomerCareHistoryModalProps) {
  if (!isOpen) return null;

  return (
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
      onClick={onClose}
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
                    .map((n: string) => n[0])
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
            onClick={onClose}
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
            Active &amp; Past Rentals ({selectedHistory?.rentals?.length || 0})
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
                    {selectedHistory?.addresses?.map((addr: Address) => (
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
                      {selectedHistory.orders.map((order: Order) => (
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
                            {order.items?.map((item: any) => (
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
                      {selectedHistory.rentals.map((rental: RentalOrder) => (
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
                            {rental.items?.map((item: any) => (
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
  );
}
