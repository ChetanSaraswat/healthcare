'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useTranslation } from '@/locales';
import { addToCart } from '@/features/cart/cart.slice';
import { listOrders } from '@/features/orders/list-orders/list-orders.action';
import { OrderEntity, OrderStatus } from '@/domain/entities/order.entity';
import { ClinicalInvoiceModal } from '@/components/invoice/ClinicalInvoiceModal';
import {
  ShoppingBag,
  FileText,
  RotateCw,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

export default function AccountOrdersPage() {
  const { locale } = useTranslation();
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.orders);
  const loading = useAppSelector((state) => state.orders.loading);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<any | null>(null);

  useEffect(() => {
    dispatch(listOrders());
  }, [dispatch]);

  const handleReorder = (item: any) => {
    dispatch(
      addToCart({
        id: `${item.productId}-buy`,
        productId: item.productId,
        name: item.productName,
        slug: 'resmed-airsense-10-autoset-cpap', // default fallback slug
        image: item.productImage,
        type: 'buy',
        quantity: 1,
        price: item.unitPrice,
        mrp: Math.round(item.unitPrice * 1.15),
      })
    );
    alert(
      locale === 'hi'
        ? `"${item.productName}" आपके कार्ट में जोड़ दिया गया है!`
        : `"${item.productName}" added to your medical cart for quick re-order!`
    );
  };

  const handleDownloadInvoice = (order: any) => {
    setSelectedInvoiceOrder(order);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#131b2e', margin: '0 0 4px' }}>
            {locale === 'hi' ? 'खरीद के आदेश एवं इनवॉइस' : 'Purchase Orders & Invoices'}
          </h2>
          <p style={{ fontSize: '0.8125rem', color: '#6e7977', margin: 0 }}>
            {locale === 'hi'
              ? 'आपके द्वारा खरीदे गए अस्पताल-ग्रेड उपकरण, सहायक उपकरण और उपभोज्य वस्तुएं।'
              : 'Hospital-grade equipment, consumables, and OEM accessories purchased outright.'}
          </p>
        </div>

        <Link
          href="/shop"
          style={{
            background: '#16453A',
            color: '#ffffff',
            padding: '8px 18px',
            borderRadius: 9999,
            fontSize: '0.8125rem',
            fontWeight: 700,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <ShoppingBag size={14} />
          <span>{locale === 'hi' ? 'दुकान ब्राउज़ करें' : 'Browse Equipment Catalog'}</span>
        </Link>
      </div>

      {/* Orders List */}
      {loading && orders.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {[1, 2].map((i) => (
            <div
              key={i}
              style={{
                background: '#ffffff',
                borderRadius: 16,
                border: '1px solid #dae2fd',
                padding: '2rem',
                minHeight: 120,
                opacity: 0.6,
              }}
            >
              <div style={{ height: 20, width: '30%', background: '#e0e5eb', borderRadius: 4, marginBottom: 12 }} />
              <div style={{ height: 16, width: '60%', background: '#edf0f5', borderRadius: 4 }} />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #dae2fd',
            padding: '4rem 2rem',
            textAlign: 'center',
          }}
        >
          <ShoppingBag size={48} color="#bdc9c6" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#131b2e', marginBottom: 6 }}>
            {locale === 'hi' ? 'कोई खरीद आदेश नहीं मिला' : 'No Purchase Orders Yet'}
          </h3>
          <p style={{ color: '#6e7977', fontSize: '0.875rem', maxWidth: 460, margin: '0 auto 1.5rem' }}>
            {locale === 'hi'
              ? 'जब आप नए उपकरण या उपभोज्य सामग्री खरीदते हैं, तो उनके ऑर्डर और इनवॉइस यहां प्रदर्शित होंगे।'
              : 'When you purchase medical devices or replacement consumables, your orders and warranties will appear here.'}
          </p>
          <Link
            href="/shop"
            style={{
              background: '#16453A',
              color: '#ffffff',
              padding: '10px 22px',
              borderRadius: 9999,
              fontSize: '0.875rem',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            {locale === 'hi' ? 'कैटलॉग देखें' : 'Explore Catalog'}
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => {
            const badge = OrderEntity.getStatusBadge(order.status as OrderStatus);

            return (
              <div
                key={order.id}
                style={{
                  background: '#ffffff',
                  borderRadius: 16,
                  border: '1px solid #dae2fd',
                  padding: '1.5rem',
                  boxShadow: '0 2px 8px rgba(19, 27, 46, 0.04)',
                }}
              >
                {/* Order Top Bar */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 12,
                    paddingBottom: '1rem',
                    borderBottom: '1px solid #eaedff',
                    marginBottom: '1.25rem',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#6e7977', fontWeight: 600 }}>
                      {locale === 'hi' ? 'ऑर्डर संख्या:' : 'Order Number:'}{' '}
                      <strong style={{ color: '#131b2e' }}>{order.orderNumber}</strong>
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#3e4947', marginTop: 2 }}>
                      {locale === 'hi' ? 'खरीद दिनांक:' : 'Placed on:'}{' '}
                      {OrderEntity.formatDate(order.createdAt)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span
                      style={{
                        background: badge.bg,
                        color: badge.color,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '4px 12px',
                        borderRadius: 9999,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                      }}
                    >
                      <CheckCircle2 size={13} />
                      <span>{badge.label}</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDownloadInvoice(order)}
                      style={{
                        background: '#faf8ff',
                        color: '#16453A',
                        border: '1px solid #dae2fd',
                        padding: '5px 12px',
                        borderRadius: 8,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <FileText size={13} />
                      <span>{locale === 'hi' ? 'चालान (GST Invoice)' : 'Tax Invoice'}</span>
                    </button>
                  </div>
                </div>

                {/* Items in Order */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {order.items.map((item) => (
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
                        src={item.productImage || '/images/oxygen_concentrator.png'}
                        alt={item.productName}
                        style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }}
                      />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#131b2e', margin: '0 0 4px' }}>
                          {item.productName}
                        </h4>
                        <div style={{ fontSize: '0.8125rem', color: '#6e7977' }}>
                          {locale === 'hi' ? 'बिल्कुल नया उपकरण • मात्रा:' : 'Brand New OEM Unit • Qty:'}{' '}
                          <strong>{item.quantity}</strong> • ₹{item.unitPrice.toLocaleString('en-IN')} / unit
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#16453A', fontWeight: 600, marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <ShieldCheck size={13} />
                          <span>
                            {locale === 'hi'
                              ? 'सीडीएससीओ पंजीकृत • निर्माता वारंटी सक्रिय'
                              : 'CDSCO Class Registered • OEM Manufacturer Warranty Active'}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                        <div style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#16453A' }}>
                          ₹{item.totalPrice.toLocaleString('en-IN')}
                        </div>

                        {/* Reorder Button (PRD §6.4 Repeat/Consumables journey) */}
                        <button
                          type="button"
                          onClick={() => handleReorder(item)}
                          style={{
                            background: '#eaf8f6',
                            color: '#16453A',
                            border: '1px solid #9cf2e8',
                            padding: '4px 10px',
                            borderRadius: 6,
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <RotateCw size={11} />
                          <span>{locale === 'hi' ? 'पुनः ऑर्डर करें' : 'Re-order'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping & Financial Breakdown Footer */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 14,
                    marginTop: '1.25rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid #eaedff',
                  }}
                >
                  <div style={{ fontSize: '0.8125rem', color: '#6e7977' }}>
                    <div style={{ fontWeight: 700, color: '#3e4947', marginBottom: 2 }}>
                      {locale === 'hi' ? 'वितरण पता:' : 'Delivered to:'} {order.shippingAddress.fullName}
                    </div>
                    <div>
                      {order.shippingAddress.addressLine1}, {order.shippingAddress.city} - {order.shippingAddress.pincode}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: '#6e7977' }}>
                      {order.paymentMethod} • {locale === 'hi' ? 'मुफ़्त एक्सप्रेस शिपिंग' : 'Free Express Delivery'}
                    </div>
                    <div style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#131b2e', marginTop: 2 }}>
                      {locale === 'hi' ? 'कुल भुगतान:' : 'Total Paid:'} ₹{order.total.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Clinical GST Tax Invoice Modal */}
      <ClinicalInvoiceModal
        isOpen={Boolean(selectedInvoiceOrder)}
        onClose={() => setSelectedInvoiceOrder(null)}
        order={selectedInvoiceOrder}
        orderType="buy"
      />
    </div>
  );
}
