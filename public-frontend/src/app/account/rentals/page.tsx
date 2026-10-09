'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useTranslation } from '@/locales';
import { listRentals } from '@/features/rentals/list-rentals/list-rentals.action';
import { RentalEntity, RentalStatus } from '@/domain/entities/rental.entity';
import { extendRental } from '@/features/rentals/extend-rental/extend-rental.action';
import { scheduleReturn } from '@/features/rentals/schedule-return/schedule-return.action';
import {
  CalendarClock,
  RotateCcw,
  ShieldCheck,
  PhoneCall,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Calendar,
  Sparkles,
  ChevronRight,
  Info,
} from 'lucide-react';

export default function AccountRentalsPage() {
  const dispatch = useAppDispatch();
  const { t, locale } = useTranslation();
  const rentals = useAppSelector((state) => state.rentals.rentals);
  const loading = useAppSelector((state) => state.rentals.loading);

  useEffect(() => {
    dispatch(listRentals());
  }, [dispatch]);

  // Modal states
  const [extensionRental, setExtensionRental] = useState<any | null>(null);
  const [extensionDays, setExtensionDays] = useState<number>(15);
  const [returnRental, setReturnRental] = useState<any | null>(null);
  const [returnDate, setReturnDate] = useState<string>('2026-09-28');
  const [returnSlot, setReturnSlot] = useState<'morning' | 'evening'>('morning');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleConfirmExtension = () => {
    if (!extensionRental) return;
    dispatch(extendRental({ rentalId: extensionRental.id, days: extensionDays }));
    const toastMsg =
      locale === 'hi'
        ? `अनुबंध #${extensionRental.rentalOrderNumber || extensionRental.id} को सफलतापूर्वक ${extensionDays} दिनों के लिए बढ़ाया गया।`
        : `Agreement #${extensionRental.rentalOrderNumber || extensionRental.id} extended by ${extensionDays} days.`;
    setSuccessToast(toastMsg);
    setExtensionRental(null);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleConfirmReturn = () => {
    if (!returnRental) return;
    dispatch(scheduleReturn({
      rentalId: returnRental.id,
      return_date: returnDate,
      return_slot: returnSlot,
    }));
    const slotLabel = returnSlot === 'morning' ? '9:00 AM - 1:00 PM' : '2:00 PM - 7:00 PM';
    const toastMsg =
      locale === 'hi'
        ? `वापसी पिकअप ${returnDate} (${slotLabel}) के लिए निर्धारित की गई। तकनीशियन निरीक्षण के बाद जमा राशि वापस कर दी जाएगी।`
        : `Return pickup confirmed for ${returnDate} (${slotLabel}). Technician will inspect and trigger deposit refund.`;
    setSuccessToast(toastMsg);
    setReturnRental(null);
    setTimeout(() => setSuccessToast(null), 4500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Toast Alert */}
      {successToast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9999,
            background: '#16453A',
            color: '#ffffff',
            padding: '14px 22px',
            borderRadius: 12,
            boxShadow: '0 8px 24px rgba(0, 92, 85, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: '0.875rem',
            fontWeight: 700,
          }}
        >
          <CheckCircle2 size={20} color="#9cf2e8" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#131b2e', margin: '0 0 4px' }}>
            {locale === 'hi' ? 'सक्रिय और पूर्व रेंटल अनुबंध' : 'Active & Past Rental Agreements'}
          </h2>
          <p style={{ fontSize: '0.8125rem', color: '#6e7977', margin: 0 }}>
            {locale === 'hi'
              ? 'अस्पताल-ग्रेड उपकरण रेंटल, सुरक्षा जमा स्थिति, अवधि विस्तार और तकनीशियन वापसी शेड्यूलिंग।'
              : 'Hospital-grade equipment rentals, security deposit tracking, extensions, and technician return scheduling.'}
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
          <CalendarClock size={14} />
          <span>{locale === 'hi' ? 'नया उपकरण किराये पर लें' : 'Rent New Equipment'}</span>
        </Link>
      </div>

      {/* Rentals List */}
      {loading && rentals.length === 0 ? (
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
      ) : rentals.length === 0 ? (
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #dae2fd',
            padding: '4rem 2rem',
            textAlign: 'center',
          }}
        >
          <CalendarClock size={48} color="#bdc9c6" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#131b2e', marginBottom: 6 }}>
            {locale === 'hi' ? 'कोई रेंटल अनुबंध नहीं' : 'No Rental Agreements'}
          </h3>
          <p style={{ color: '#6e7977', fontSize: '0.875rem', maxWidth: 460, margin: '0 auto 1.5rem' }}>
            {locale === 'hi'
              ? 'जब आप चिकित्सा उपकरण किराये पर लेंगे, तो उनके अनुबंध और स्थिति यहां प्रदर्शित होगी।'
              : 'When you rent medical equipment, your agreements and deposit status will appear here.'}
          </p>
          <Link
            href="/assessment"
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
            {locale === 'hi' ? 'नैदानिक मूल्यांकन शुरू करें' : 'Start Clinical Assessment'}
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {rentals.map((rental) => {
            const statusBadge = RentalEntity.getStatusBadge(rental.status as RentalStatus);
            const canReturn = RentalEntity.canScheduleReturn(rental.status as RentalStatus);
            const isActive = rental.status === 'active' || rental.status === 'confirmed';

            return (
              <div
                key={rental.id}
                style={{
                  background: '#ffffff',
                  borderRadius: 16,
                  border: '1px solid #dae2fd',
                  padding: '1.5rem',
                  boxShadow: '0 2px 8px rgba(19, 27, 46, 0.04)',
                }}
              >
                {/* Order Header */}
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
                      {locale === 'hi' ? 'रेंटल अनुबंध:' : 'Rental Agreement:'}{' '}
                      <strong style={{ color: '#131b2e' }}>{rental.rentalOrderNumber}</strong>
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#3e4947', marginTop: 2 }}>
                      {locale === 'hi' ? 'बुकिंग दिनांक:' : 'Placed on:'}{' '}
                      {new Date(rental.createdAt).toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-IN')}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span
                      style={{
                        background: statusBadge.bg,
                        color: statusBadge.color,
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        padding: '4px 10px',
                        borderRadius: 9999,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <CheckCircle2 size={14} /> {statusBadge.label}
                    </span>

                    <span
                      style={{
                        background: rental.paymentStatus === 'deposit_refunded' ? '#f2f3ff' : '#eaf8f6',
                        color: rental.paymentStatus === 'deposit_refunded' ? '#B75932' : '#16453A',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: 8,
                      }}
                    >
                      {rental.paymentStatus === 'deposit_refunded'
                        ? locale === 'hi'
                          ? 'जमा वापस'
                          : 'Deposit Refunded'
                        : `${locale === 'hi' ? 'जमा सुरक्षित' : 'Deposit Held'}: ₹${rental.totalDeposit.toLocaleString('en-IN')}`}
                    </span>
                  </div>
                </div>

                {/* Items in Rental */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {rental.items.map((item: any) => (
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
                          {locale === 'hi' ? 'रेंटल अवधि' : 'Rental Period'}{' '}
                          <strong>{item.durationDays} {locale === 'hi' ? 'दिन' : 'Days'}</strong> •{' '}
                          {locale === 'hi' ? 'दैनिक दर' : 'Daily Rate'}: ₹{item.dailyRate}/{locale === 'hi' ? 'दिन' : 'day'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#16453A', fontWeight: 600, marginTop: 2 }}>
                          {locale === 'hi' ? 'सक्रिय अवधि:' : 'Active Range:'} {item.startDate} &rarr; {item.endDate}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#131b2e' }}>
                          ₹{item.rentalCost.toLocaleString('en-IN')}
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: '#6e7977' }}>
                          + ₹{item.securityDeposit.toLocaleString('en-IN')}{' '}
                          {locale === 'hi' ? 'सुरक्षा जमा' : 'deposit'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer: Delivery + Actions */}
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
                    {locale === 'hi' ? 'डिलीवरी पता:' : 'Delivery Address:'}{' '}
                    {rental.deliveryAddress.addressLine1}, {rental.deliveryAddress.city} -{' '}
                    {rental.deliveryAddress.pincode}
                  </div>

                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {/* Extend Rental Action */}
                    {isActive && (
                      <button
                        type="button"
                        onClick={() => setExtensionRental(rental)}
                        style={{
                          background: '#fff7f2',
                          color: '#B75932',
                          border: '1px solid #ffd8c8',
                          padding: '8px 16px',
                          borderRadius: 8,
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <CalendarClock size={14} />
                        <span>{locale === 'hi' ? 'अवधि बढ़ाएं' : 'Extend Rental'}</span>
                      </button>
                    )}

                    {/* Schedule Return Action */}
                    {canReturn && (
                      <button
                        type="button"
                        onClick={() => setReturnRental(rental)}
                        style={{
                          background: '#f2f3ff',
                          color: '#16453A',
                          border: '1px solid #dae2fd',
                          padding: '8px 16px',
                          borderRadius: 8,
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <RotateCcw size={14} />
                        <span>{locale === 'hi' ? 'वापसी पिकअप तय करें' : 'Schedule Return'}</span>
                      </button>
                    )}

                    <a
                      href="tel:18008892273"
                      style={{
                        background: '#16453A',
                        color: '#ffffff',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: 8,
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <PhoneCall size={14} />
                      <span>{locale === 'hi' ? 'तकनीशियन सहायता' : 'Technician Help'}</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: EXTEND RENTAL MODAL */}
      {extensionRental && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(19, 27, 46, 0.5)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 20,
              width: '100%',
              maxWidth: 520,
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #eaedff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CalendarClock size={20} color="#B75932" />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#131b2e', margin: 0 }}>
                  {locale === 'hi' ? 'रेंटल अवधि का विस्तार' : 'Extend Rental Duration'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setExtensionRental(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6e7977' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: '12px 16px', border: '1px solid #dae2fd' }}>
                <div style={{ fontSize: '0.75rem', color: '#6e7977' }}>
                  {locale === 'hi' ? 'अनुबंध संदर्भ:' : 'Agreement Reference:'} <strong>{extensionRental.rentalOrderNumber}</strong>
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#131b2e', marginTop: 4 }}>
                  {extensionRental.items[0]?.productName}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', marginBottom: 8 }}>
                  {locale === 'hi' ? 'अतिरिक्त रेंटल अवधि चुनें:' : 'Select Additional Duration:'}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {[7, 15, 30].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setExtensionDays(days)}
                      style={{
                        padding: '12px 8px',
                        borderRadius: 10,
                        border: extensionDays === days ? '2px solid #B75932' : '1px solid #dae2fd',
                        background: extensionDays === days ? '#fff7f2' : '#ffffff',
                        color: extensionDays === days ? '#B75932' : '#131b2e',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                    >
                      <div>+{days} {locale === 'hi' ? 'दिन' : 'Days'}</div>
                      {days === 30 && (
                        <div style={{ fontSize: '0.6875rem', color: '#16453A', fontWeight: 800, marginTop: 2 }}>
                          {locale === 'hi' ? '28% बचत' : '28% Saved'}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cost Calculation */}
              {(() => {
                const dailyRate = extensionRental.items[0]?.dailyRate || 100;
                const extensionFee = Math.round(dailyRate * extensionDays * (extensionDays === 30 ? 0.72 : 1));
                return (
                  <div
                    style={{
                      background: '#fff7f2',
                      borderRadius: 12,
                      padding: '14px 16px',
                      border: '1px solid #ffd8c8',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.8125rem' }}>
                      <span style={{ color: '#6e7977' }}>
                        {locale === 'hi' ? `अतिरिक्त किराया (${extensionDays} दिन):` : `Extension Fee (${extensionDays} days):`}
                      </span>
                      <strong style={{ color: '#131b2e' }}>₹{extensionFee.toLocaleString('en-IN')}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.8125rem' }}>
                      <span style={{ color: '#6e7977' }}>
                        {locale === 'hi' ? 'सुरक्षा जमा (पहले से जमा):' : 'Security Deposit (Retained):'}
                      </span>
                      <span style={{ color: '#16453A', fontWeight: 600 }}>
                        ₹{extensionRental.totalDeposit.toLocaleString('en-IN')} ({locale === 'hi' ? 'कोई नया जमा नहीं' : 'No extra charge'})
                      </span>
                    </div>
                    <div
                      style={{
                        borderTop: '1px solid #ffd8c8',
                        paddingTop: 8,
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '1rem',
                        fontWeight: 800,
                      }}
                    >
                      <span style={{ color: '#131b2e' }}>{locale === 'hi' ? 'देय राशि:' : 'Amount to Pay:'}</span>
                      <span style={{ color: '#B75932' }}>₹{extensionFee.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                );
              })()}

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', color: '#6e7977' }}>
                <ShieldCheck size={16} color="#16453A" />
                <span>
                  {locale === 'hi'
                    ? 'उपकरण आपके घर में ही रहेगा। तकनीशियन द्वारा कोई सेवा बाधा नहीं आएगी।'
                    : 'Equipment remains installed at your home. Continuous biomedical care assurance.'}
                </span>
              </div>
            </div>

            <div
              style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid #eaedff',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 12,
              }}
            >
              <button
                type="button"
                onClick={() => setExtensionRental(null)}
                style={{
                  background: 'none',
                  border: '1px solid #dae2fd',
                  padding: '10px 18px',
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  color: '#6e7977',
                }}
              >
                {locale === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmExtension}
                style={{
                  background: '#B75932',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 22px',
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(234, 88, 12, 0.25)',
                }}
              >
                {locale === 'hi' ? 'विस्तार की पुष्टि करें' : 'Confirm Extension & Pay'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: SCHEDULE RETURN MODAL */}
      {returnRental && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(19, 27, 46, 0.5)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 20,
              width: '100%',
              maxWidth: 520,
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #eaedff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <RotateCcw size={20} color="#16453A" />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#131b2e', margin: 0 }}>
                  {locale === 'hi' ? 'वापसी पिकअप शेड्यूलिंग' : 'Schedule Equipment Return Pickup'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReturnRental(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6e7977' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: '12px 16px', border: '1px solid #dae2fd' }}>
                <div style={{ fontSize: '0.75rem', color: '#6e7977' }}>
                  {locale === 'hi' ? 'वापसी उपकरण:' : 'Equipment for Return:'}
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#131b2e', marginTop: 4 }}>
                  {returnRental.items[0]?.productName}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#16453A', fontWeight: 600, marginTop: 4 }}>
                  {locale === 'hi' ? 'सुरक्षा जमा वापसी:' : 'Refundable Security Deposit:'} ₹{returnRental.totalDeposit.toLocaleString('en-IN')}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', marginBottom: 6 }}>
                  {locale === 'hi' ? 'पिकअप दिनांक:' : 'Preferred Pickup Date:'}
                </label>
                <input
                  type="date"
                  value={returnDate}
                  min="2026-09-23"
                  onChange={(e) => setReturnDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1px solid #dae2fd',
                    fontSize: '0.875rem',
                    color: '#131b2e',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', marginBottom: 8 }}>
                  {locale === 'hi' ? 'समय स्लॉट:' : 'Technician Time Slot:'}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setReturnSlot('morning')}
                    style={{
                      padding: '10px',
                      borderRadius: 10,
                      border: returnSlot === 'morning' ? '2px solid #16453A' : '1px solid #dae2fd',
                      background: returnSlot === 'morning' ? '#eaf8f6' : '#ffffff',
                      color: returnSlot === 'morning' ? '#16453A' : '#131b2e',
                      fontWeight: 700,
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                    }}
                  >
                    <div>{locale === 'hi' ? 'सुबह' : 'Morning Slot'}</div>
                    <div style={{ fontSize: '0.6875rem', color: '#6e7977', marginTop: 2 }}>9:00 AM - 1:00 PM</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReturnSlot('evening')}
                    style={{
                      padding: '10px',
                      borderRadius: 10,
                      border: returnSlot === 'evening' ? '2px solid #16453A' : '1px solid #dae2fd',
                      background: returnSlot === 'evening' ? '#eaf8f6' : '#ffffff',
                      color: returnSlot === 'evening' ? '#16453A' : '#131b2e',
                      fontWeight: 700,
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                    }}
                  >
                    <div>{locale === 'hi' ? 'दोपहर/शाम' : 'Evening Slot'}</div>
                    <div style={{ fontSize: '0.6875rem', color: '#6e7977', marginTop: 2 }}>2:00 PM - 7:00 PM</div>
                  </button>
                </div>
              </div>

              <div
                style={{
                  background: '#eaf8f6',
                  borderRadius: 12,
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  fontSize: '0.75rem',
                  color: '#16453A',
                }}
              >
                <ShieldCheck size={18} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong>{locale === 'hi' ? '24-घंटे जमा वापसी गारंटी:' : '24-Hour Deposit Refund SLA:'}</strong>{' '}
                  {locale === 'hi'
                    ? 'प्रमाणित बायोमेडिकल तकनीशियन घर पर उपकरण का कार्य निरीक्षण करेगा। निरीक्षण के तुरंत बाद आपके बैंक खाते/UPI में सुरक्षा जमा प्रेषित की जाएगी।'
                    : 'A certified biomedical technician conducts physical inspection on site. Full security deposit is triggered to your UPI/bank within 24 hours.'}
                </div>
              </div>
            </div>

            <div
              style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid #eaedff',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 12,
              }}
            >
              <button
                type="button"
                onClick={() => setReturnRental(null)}
                style={{
                  background: 'none',
                  border: '1px solid #dae2fd',
                  padding: '10px 18px',
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  color: '#6e7977',
                }}
              >
                {locale === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmReturn}
                style={{
                  background: '#16453A',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 22px',
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0, 92, 85, 0.25)',
                }}
              >
                {locale === 'hi' ? 'पिकअप बुक करें' : 'Confirm Return Appointment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
