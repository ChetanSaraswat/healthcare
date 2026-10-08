'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  IndianRupee,
  MapPin,
  FileText,
  RefreshCw,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateOrderStatus } from '@/features/orders/orders.slice';
import { listOrders } from '@/features/orders/list-orders/list-orders.action';
import { Order } from '@/domain/entities/order.entity';
import { axiosInterceptorInstanceClient } from '@/config/axios';

export default function AdminOrdersPage() {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((state) => state.orders);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(listOrders());
  }, [dispatch]);

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.shippingAddress?.city?.toLowerCase().includes(searchQuery.toLowerCase());
    return Boolean(matchesStatus && matchesSearch);
  });

  const handleStatusChange = async (id: string, status: Order['status']) => {
    if (updatingId) return;
    setUpdatingId(id);
    try {
      await axiosInterceptorInstanceClient.patch(`/orders/${id}/status`, { status });
      dispatch(updateOrderStatus({ id, status }));
      dispatch(listOrders());
    } catch (err: any) {
      console.error('Failed to update order status on backend:', err);
      dispatch(updateOrderStatus({ id, status }));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#131b2e', margin: 0 }}>
            Purchase Orders (Buy Flow)
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6e7977', margin: '4px 0 0' }}>
            Track outright medical equipment purchases and invoice generation.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            onClick={() => dispatch(listOrders())}
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
              cursor: 'pointer',
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
            {orders.length} Total Purchases
          </span>
        </div>
      </div>

      {/* Filter and Search */}
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
            placeholder="Search by order ID or city..."
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

        <div style={{ display: 'flex', gap: 6 }}>
          {['all', 'pending', 'processing', 'shipped', 'delivered'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              style={{
                padding: '7px 12px',
                borderRadius: 8,
                border: filterStatus === st ? '1px solid #005c55' : '1px solid #dae2fd',
                background: filterStatus === st ? '#e8f5f3' : '#ffffff',
                color: filterStatus === st ? '#005c55' : '#3e4947',
                fontSize: '0.8125rem',
                fontWeight: filterStatus === st ? 700 : 500,
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {st === 'all' ? 'All Orders' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {loading && orders.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                style={{
                  height: 140,
                  borderRadius: 16,
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  opacity: 0.7,
                }}
              />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div
            style={{
              padding: '3rem 2rem',
              textAlign: 'center',
              background: '#ffffff',
              borderRadius: 16,
              border: '1px solid #e2e7ff',
            }}
          >
            <ShoppingBag size={40} color="#6e7977" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#131b2e', margin: 0 }}>
              No purchase orders found
            </h3>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isUpdating = updatingId === order.id;
            const statusConfig: Record<string, { bg: string; text: string }> = {
              pending: { bg: '#fff4eb', text: '#913200' },
              processing: { bg: '#eaedff', text: '#006398' },
              shipped: { bg: '#e8f5f3', text: '#005c55' },
              delivered: { bg: '#e8f5f3', text: '#005c55' },
              cancelled: { bg: '#ffdad6', text: '#ba1a1a' },
            };
            const statusStyle = statusConfig[order.status] || { bg: '#f2f3ff', text: '#3e4947' };

            return (
              <div
                key={order.id}
                style={{
                  background: '#ffffff',
                  borderRadius: 16,
                  padding: '1.25rem 1.5rem',
                  border: '1px solid #e2e7ff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: '#131b2e' }}>
                      {order.orderNumber}
                    </span>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: 999,
                        background: statusStyle.bg,
                        color: statusStyle.text,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                      }}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.6875rem', color: '#6e7977', display: 'block' }}>Total Paid (incl. GST)</span>
                    <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#005c55' }}>
                      ₹{order.total?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 12,
                    padding: '10px 14px',
                    background: '#f8f9ff',
                    borderRadius: 10,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8125rem', color: '#131b2e' }}>
                    <MapPin size={14} color="#006398" />
                    <span>
                      {[
                        order.shippingAddress?.addressLine1,
                        order.shippingAddress?.city,
                        order.shippingAddress?.state,
                        order.shippingAddress?.pincode,
                      ]
                        .filter(Boolean)
                        .join(', ') || 'Address not specified'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6e7977' }}>
                    Payment: <strong>{order.paymentMethod || 'Prepaid / COD'}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, paddingTop: 4 }}>
                  {order.status === 'pending' && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleStatusChange(order.id, 'processing')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 6,
                        background: isUpdating ? '#cbd5e1' : '#006398',
                        color: '#ffffff',
                        border: 'none',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: isUpdating ? 'not-allowed' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      {isUpdating && <RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} />}
                      Confirm &amp; Process
                    </button>
                  )}
                  {order.status === 'processing' && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleStatusChange(order.id, 'delivered')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 6,
                        background: isUpdating ? '#cbd5e1' : '#005c55',
                        color: '#ffffff',
                        border: 'none',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: isUpdating ? 'not-allowed' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      {isUpdating && <RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} />}
                      Mark Doorstep Delivered
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
