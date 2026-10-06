'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearCart } from '@/features/cart/cart.slice';
import { createOrder } from '@/features/orders/create-order/create-order.action';
import { requestRental } from '@/features/rentals/request-rental/request-rental.action';
import { createPaymentOrderAction } from '@/features/payment/create-order/create-order.action';
import { verifyPaymentAction } from '@/features/payment/verify-payment/verify-payment.action';
import { PaymentCalculator } from '@/domain/entities/payment.entity';
import { AddressEntity, UserEntity, Address } from '@/domain/entities/user.entity';
import { useTranslation } from '@/locales';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Building,
  CheckCircle2,
  ArrowRight,
  Info,
  MapPin,
  Plus,
  BookmarkCheck,
} from 'lucide-react';
import { AuthModal } from '@/components/auth/AuthModal';
import {
  CHECKOUT_SESSION_KEY,
  DurableCheckoutSession,
  computeCartFingerprint,
  loadCheckoutSession,
  persistCheckoutSession,
  clearCheckoutSession,
} from '@/features/payment/checkout-session';

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t, locale } = useTranslation();
  const { items, pricing, pincode, serviceableCity } = useAppSelector((state) => state.cart);
  const savedAddresses = useAppSelector((state) => state.user.addresses);
  const authUser = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const buyItems = items.filter((i) => i.type === 'buy');
  const rentItems = items.filter((i) => i.type === 'rent');

  // Address mode: 'saved' picks from user's saved addresses, 'new' uses the manual form
  const [addressMode, setAddressMode] = useState<'saved' | 'new'>(
    savedAddresses.length > 0 ? 'saved' : 'new'
  );
  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState<string | null>(() => {
    const defaultAddr = UserEntity.getDefaultAddress(savedAddresses);
    return defaultAddr?.id ?? null;
  });


  const getInitialFormData = useCallback(() => {
    if (savedAddresses.length > 0 && addressMode === 'saved') {
      const addr = savedAddresses.find((a) => a.id === selectedSavedAddressId) || savedAddresses[0];
      return {
        fullName: authUser?.name || 'Patient / Caregiver',
        phone: authUser?.phone || '',
        email: authUser?.email || '',
        addressLine1: addr.line1,
        addressLine2: addr.line2 || '',
        city: addr.city,
        state: addr.state,
        pincode: addr.pincode,
        installationNotes: '',
        paymentMethod: 'Razorpay UPI / NetBanking',
      };
    }
    return {
      fullName: authUser?.name || '',
      phone: authUser?.phone || '',
      email: authUser?.email || '',
      addressLine1: '',
      addressLine2: '',
      city: serviceableCity || '',
      state: '',
      pincode: pincode || '',
      installationNotes: '',
      paymentMethod: 'Razorpay UPI / NetBanking',
    };
  }, [savedAddresses, addressMode, selectedSavedAddressId, authUser, serviceableCity, pincode]);

  const [formData, setFormData] = useState(getInitialFormData);

  // Sync authUser updates when user logs in via AuthModal
  useEffect(() => {
    if (authUser) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || authUser.name,
        phone: prev.phone || authUser.phone || '',
        email: prev.email || authUser.email,
      }));
    }
  }, [authUser]);

  // When saved address selection changes, auto-fill form
  useEffect(() => {
    if (addressMode === 'saved' && selectedSavedAddressId) {
      const addr = savedAddresses.find((a) => a.id === selectedSavedAddressId);
      if (addr) {
        setFormData((prev) => ({
          ...prev,
          addressLine1: addr.line1,
          addressLine2: addr.line2 || '',
          city: addr.city,
          state: addr.state,
          pincode: addr.pincode,
        }));
      }
    }
  }, [addressMode, selectedSavedAddressId, savedAddresses]);


  const [isSubmitting, setIsSubmitting] = useState(false);
  const cartFingerprint = computeCartFingerprint(items);
  const [checkoutSession, setCheckoutSession] = useState<DurableCheckoutSession>(() =>
    loadCheckoutSession(cartFingerprint)
  );

  useEffect(() => {
    const loaded = loadCheckoutSession(cartFingerprint);
    setCheckoutSession(loaded);
  }, [cartFingerprint]);

  // Dynamically load Razorpay checkout script
  useEffect(() => {
    const scriptId = 'razorpay-checkout-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: 600, margin: '5rem auto', textAlign: 'center', padding: '0 1.5rem' }}>
        <h2>Your cart is empty.</h2>
        <p style={{ color: '#6e7977', margin: '1rem 0 2rem' }}>
          Please select medical equipment before proceeding to clinical checkout.
        </p>
        <Link
          href="/shop"
          style={{
            background: '#005c55',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: 9999,
            textDecoration: 'none',
            fontWeight: 700,
          }}
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const canonicalAddress = {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        line1: formData.addressLine1,
        line2: formData.addressLine2 || null,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      };

      // 1. If purchase items exist, create order (or reuse existing order from this durable checkout session)
      let buyOrderId = checkoutSession.buyOrderId;
      if (!buyOrderId && buyItems.length > 0) {
        const createdBuyOrder = await dispatch(
          createOrder({
            shipping_address: canonicalAddress,
            payment_method: formData.paymentMethod,
            items: buyItems.map((item) => ({
              product_uuid: item.productId,
              productName: item.name,
              productImage: item.image,
              unit_price: item.price,
              quantity: item.quantity,
              total_price: item.price * item.quantity,
            })),
          } as any)
        ).unwrap();
        buyOrderId =
          createdBuyOrder?.data?.uuid ||
          (createdBuyOrder as any)?.uuid ||
          createdBuyOrder?.data?.id ||
          (createdBuyOrder as any)?.id;
        setCheckoutSession((prev) => {
          const updated = { ...prev, buyOrderId };
          persistCheckoutSession(updated);
          return updated;
        });
      }

      // 2. If rental items exist, request rental (or reuse existing rental order from this session)
      let rentalOrderId = checkoutSession.rentalOrderId;
      if (!rentalOrderId && rentItems.length > 0) {
        const createdRentalOrder = await dispatch(
          requestRental({
            delivery_address: canonicalAddress,
            payment_method: formData.paymentMethod,
            notes: formData.installationNotes,
            start_date: new Date().toISOString().split('T')[0],
            end_date: new Date(Date.now() + (rentItems[0]?.rentalDays || 7) * 86400000)
              .toISOString()
              .split('T')[0],
            items: rentItems.map((item) => ({
              product_uuid: item.productId,
              productName: item.name,
              productImage: item.image,
              dailyRate: item.dailyRate,
              duration_count: item.rentalDays,
              duration_type: 'daily',
              securityDeposit: item.rentalDeposit * item.quantity,
              rentalCost: item.dailyRate * item.rentalDays * item.quantity,
              start_date: new Date().toISOString().split('T')[0],
              end_date: new Date(Date.now() + item.rentalDays * 86400000)
                .toISOString()
                .split('T')[0],
              quantity: item.quantity,
            })),
          } as any)
        ).unwrap();
        rentalOrderId =
          createdRentalOrder?.data?.uuid ||
          (createdRentalOrder as any)?.uuid ||
          createdRentalOrder?.data?.id ||
          (createdRentalOrder as any)?.id;
        setCheckoutSession((prev) => {
          const updated = { ...prev, rentalOrderId };
          persistCheckoutSession(updated);
          return updated;
        });
      }

      // 3. Determine payment mode: Cash on Delivery vs Online Gateway (Razorpay / UPI / Cards)
      const methodLower = (formData.paymentMethod || '').toLowerCase();
      const isCod =
        formData.paymentMethod === t.checkout.cod ||
        methodLower.includes('arrival') ||
        methodLower.includes('technician') ||
        methodLower.includes('delivery') ||
        methodLower.includes('cash') ||
        methodLower.includes('cod') ||
        methodLower.includes('आगमन');

      if (isCod) {
        clearCheckoutSession();
        dispatch(clearCart());
        router.push('/order-confirmation?method=cod');
        return;
      }

      // 4. Online Payment via Razorpay (Idempotent per durable checkout session)
      const totalAmount = pricing.totalPayableNow;
      const orderActionRes = await dispatch(
        createPaymentOrderAction({
          amount: totalAmount,
          orderId: buyOrderId,
          rentalOrderId: rentalOrderId,
          idempotency_key: checkoutSession.idempotencyKey,
          notes: {
            patientName: formData.fullName,
            phone: formData.phone,
            email: formData.email,
          },
        })
      ).unwrap();

      const rzpOrderData = orderActionRes.data;

      // If backend detected order is ALREADY captured (e.g., from retry or concurrent webhook completion)
      if (rzpOrderData?.alreadyCaptured || rzpOrderData?.status === 'captured') {
        clearCheckoutSession();
        dispatch(clearCart());
        router.push(`/order-confirmation?paymentId=${rzpOrderData.orderId || 'captured'}`);
        return;
      }

      // Check if real live Razorpay Key is provided and SDK is loaded in browser
      const isPlaceholderKey =
        !rzpOrderData?.keyId ||
        rzpOrderData.keyId.includes('aarogya_med') ||
        rzpOrderData.keyId.startsWith('rzp_test_mock');

      if (typeof window !== 'undefined' && (window as any).Razorpay && !isPlaceholderKey) {
        const options = {
          key: rzpOrderData.keyId,
          amount: rzpOrderData.amount,
          currency: rzpOrderData.currency || 'INR',
          name: 'AarogyaMed Healthcare',
          description: 'Medical Equipment Purchase / Rental Security Deposit',
          order_id: rzpOrderData.orderId,
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: '#005c55',
          },
          modal: {
            ondismiss: () => {
              setIsSubmitting(false);
            },
          },
          handler: async (response: any) => {
            try {
              await dispatch(
                verifyPaymentAction({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  order_id: buyOrderId,
                  rental_order_id: rentalOrderId,
                  payment_method: formData.paymentMethod,
                })
              ).unwrap();

              clearCheckoutSession();
              dispatch(clearCart());
              router.push(`/order-confirmation?paymentId=${response.razorpay_payment_id}`);
            } catch (verErr) {
              console.error('Signature verification error:', verErr);
              clearCheckoutSession();
              dispatch(clearCart());
              router.push(
                `/order-confirmation?paymentId=${response.razorpay_payment_id}&warning=verification_pending`
              );
            }
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', (failResp: any) => {
          console.warn('Payment failed at gateway:', failResp);
          setIsSubmitting(false);
          alert(`Payment attempt unconfirmed: ${failResp?.error?.description || 'Gateway declined'}. You can retry or choose Payment on Arrival.`);
        });
        rzp.open();
      } else {
        // Sandbox mock payment for development / test environments without live merchant keys
        const mockPaymentId = `pay_mock_${Date.now()}`;
        await dispatch(
          verifyPaymentAction({
            razorpay_order_id: rzpOrderData.orderId,
            razorpay_payment_id: mockPaymentId,
            razorpay_signature: 'mock_valid_signature',
            order_id: buyOrderId,
            rental_order_id: rentalOrderId,
            payment_method: formData.paymentMethod,
          })
        ).unwrap();

        clearCheckoutSession();
        dispatch(clearCart());
        router.push(`/order-confirmation?paymentId=${mockPaymentId}`);
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      alert('Could not complete checkout. Please verify connection or helpline.');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto 5rem', padding: '0 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#131b2e', marginBottom: '0.5rem' }}>
          {t.checkout.title}
        </h1>
        <p style={{ color: '#6e7977' }}>
          {t.checkout.subtitle}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '2.5rem',
          alignItems: 'start',
        }}
      >
        {/* Left Form Column */}
        <form onSubmit={handleSubmit}>
          {/* Section 1: Patient / Contact Information */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              border: '1px solid #dae2fd',
              padding: '1.5rem',
              marginBottom: '1.5rem',
            }}
          >
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#131b2e', marginBottom: '1.25rem' }}>
              {t.checkout.patientSection}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 4 }}>
                  {t.checkout.fullName}
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #bdc9c6',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 4 }}>
                  {t.checkout.phone}
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #bdc9c6',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 4 }}>
                  {t.checkout.email}
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #bdc9c6',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery & Installation Address */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              border: '1px solid #dae2fd',
              padding: '1.5rem',
              marginBottom: '1.5rem',
            }}
          >
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#131b2e', marginBottom: '1.25rem' }}>
              {t.checkout.addressSection}
            </h3>

            {/* Account Status / Sign-in Banner */}
            {!authUser ? (
              <div
                style={{
                  background: '#eaf8f6',
                  border: '1px solid #9cf2e8',
                  borderRadius: 12,
                  padding: '12px 16px',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BookmarkCheck size={18} color="#005c55" />
                  <span style={{ fontSize: '0.8125rem', color: '#005c55', fontWeight: 600 }}>
                    {locale === 'hi'
                      ? 'सहेजे गए पते स्वतः भरने के लिए अपने खाते में साइन इन करें।'
                      : 'Have an account? Sign in to use your saved patient delivery addresses.'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  style={{
                    background: '#005c55',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '6px 14px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {locale === 'hi' ? 'साइन इन करें' : 'Sign In'}
                </button>
              </div>
            ) : (
              <div
                style={{
                  background: '#faf8ff',
                  border: '1px solid #dae2fd',
                  borderRadius: 12,
                  padding: '10px 14px',
                  marginBottom: '1.25rem',
                  fontSize: '0.8125rem',
                  color: '#3e4947',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <ShieldCheck size={16} color="#005c55" />
                <span>
                  {locale === 'hi' ? 'सत्यापित रोगी खाता:' : 'Ordering as:'}{' '}
                  <strong style={{ color: '#131b2e' }}>{authUser.name}</strong> ({authUser.email})
                </span>
              </div>
            )}

            {/* Saved Address Picker */}
            {savedAddresses.length > 0 && (

              <div style={{ marginBottom: '1.25rem' }}>
                {/* Mode Toggle */}
                <div style={{ display: 'flex', gap: 10, marginBottom: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setAddressMode('saved');
                      const defaultAddr = UserEntity.getDefaultAddress(savedAddresses);
                      if (defaultAddr) setSelectedSavedAddressId(defaultAddr.id);
                    }}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: addressMode === 'saved' ? '2px solid #005c55' : '1px solid #dae2fd',
                      background: addressMode === 'saved' ? '#eaf8f6' : '#ffffff',
                      color: addressMode === 'saved' ? '#005c55' : '#6e7977',
                      fontWeight: 700,
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                    }}
                  >
                    <BookmarkCheck size={15} />
                    {locale === 'hi' ? 'सहेजे गए पतों से चुनें' : 'Choose Saved Address'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAddressMode('new');
                      setSelectedSavedAddressId(null);
                      setFormData((prev) => ({
                        ...prev,
                        addressLine1: '',
                        addressLine2: '',
                        city: serviceableCity || '',
                        state: '',
                        pincode: pincode || '',
                      }));
                    }}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: addressMode === 'new' ? '2px solid #005c55' : '1px solid #dae2fd',
                      background: addressMode === 'new' ? '#eaf8f6' : '#ffffff',
                      color: addressMode === 'new' ? '#005c55' : '#6e7977',
                      fontWeight: 700,
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                    }}
                  >
                    <Plus size={15} />
                    {locale === 'hi' ? 'नया पता दर्ज करें' : 'Enter New Address'}
                  </button>
                </div>

                {/* Saved Address Cards */}
                {addressMode === 'saved' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {savedAddresses.map((addr) => {
                      const isSelected = selectedSavedAddressId === addr.id;
                      return (
                        <label
                          key={addr.id}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 12,
                            padding: '12px 14px',
                            borderRadius: 10,
                            border: isSelected ? '2px solid #005c55' : '1px solid #dae2fd',
                            background: isSelected ? '#eaf8f6' : '#ffffff',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <input
                            type="radio"
                            name="savedAddress"
                            checked={isSelected}
                            onChange={() => setSelectedSavedAddressId(addr.id)}
                            style={{ marginTop: 3 }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                              <MapPin size={14} color="#005c55" />
                              <strong style={{ fontSize: '0.875rem', color: '#131b2e' }}>
                                {addr.label}
                              </strong>
                              {addr.isDefault && (
                                <span
                                  style={{
                                    background: '#005c55',
                                    color: '#ffffff',
                                    fontSize: '0.625rem',
                                    fontWeight: 800,
                                    padding: '2px 8px',
                                    borderRadius: 9999,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                  }}
                                >
                                  {locale === 'hi' ? 'डिफ़ॉल्ट' : 'Default'}
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.8125rem', color: '#3e4947', lineHeight: 1.5 }}>
                              {AddressEntity.formatSingleLine(addr)}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Manual address form — always show for 'new', or as read-only summary for 'saved' */}
            {addressMode === 'new' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 4 }}>
                    {t.checkout.street}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.addressLine1}
                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: '1px solid #bdc9c6',
                      fontSize: '0.875rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 4 }}>
                    {t.checkout.landmark}
                  </label>
                  <input
                    type="text"
                    value={formData.addressLine2}
                    onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: '1px solid #bdc9c6',
                      fontSize: '0.875rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 4 }}>
                      {t.checkout.city}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: '1px solid #bdc9c6',
                        fontSize: '0.875rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 4 }}>
                      {t.checkout.state}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: '1px solid #bdc9c6',
                        fontSize: '0.875rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 4 }}>
                      {t.checkout.pincode}
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: '1px solid #bdc9c6',
                        fontSize: '0.875rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Installation notes — always visible regardless of address mode */}
            <div style={{ marginTop: addressMode === 'saved' ? 0 : undefined }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 4 }}>
                {t.checkout.notes}
              </label>
              <textarea
                rows={2}
                value={formData.installationNotes}
                onChange={(e) => setFormData({ ...formData, installationNotes: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid #bdc9c6',
                  fontSize: '0.875rem',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              border: '1px solid #dae2fd',
              padding: '1.5rem',
              marginBottom: '2rem',
            }}
          >
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#131b2e', marginBottom: '1.25rem' }}>
              {t.checkout.paymentSection}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                {
                  id: 'upi',
                  label: t.checkout.upi,
                  desc: locale === 'hi' ? 'शून्य पेमेंट गेटवे शुल्क। तत्काल ऑर्डर सत्यापन।' : 'Zero payment gateway surcharge. Immediate order verification.',
                },
                {
                  id: 'cards',
                  label: t.checkout.cards,
                  desc: locale === 'hi' ? 'CDSCO मेडिकल मर्चेंट मानकों द्वारा सत्यापित।' : 'Verified by CDSCO medical merchant compliance.',
                },
                {
                  id: 'cod',
                  label: t.checkout.cod,
                  desc: locale === 'hi' ? 'भुगतान से पहले स्टरलाइज़्ड सील और मशीन कैलिब्रेशन की जांच करें।' : 'Inspect sterilized seal and test machine calibration before paying.',
                },
              ].map((pm) => (
                <label
                  key={pm.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: formData.paymentMethod === pm.label ? '2px solid #005c55' : '1px solid #dae2fd',
                    background: formData.paymentMethod === pm.label ? '#eaf8f6' : '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={formData.paymentMethod === pm.label}
                    onChange={() => setFormData({ ...formData, paymentMethod: pm.label })}
                    style={{ marginTop: 3 }}
                  />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9375rem', color: '#131b2e' }}>
                      {pm.label}
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: '#6e7977' }}>{pm.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              background: '#005c55',
              color: '#ffffff',
              padding: '16px 24px',
              borderRadius: 12,
              fontSize: '1.0625rem',
              fontWeight: 800,
              border: 'none',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 8px 24px rgba(0, 92, 85, 0.3)',
            }}
          >
            {isSubmitting ? (
              locale === 'hi' ? 'ऑर्डर प्रोसेस हो रहा है...' : 'Processing Order & Scheduling Dispatch...'
            ) : (
              <>
                <span>{t.checkout.confirmBtn} (₹{pricing.totalPayableNow.toLocaleString('en-IN')})</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Right Summary Box */}
        <div
          style={{
            background: '#faf8ff',
            borderRadius: 16,
            border: '1px solid #dae2fd',
            padding: '1.5rem',
            position: 'sticky',
            top: 90,
          }}
        >
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#131b2e', marginBottom: '1.25rem' }}>
            {t.checkout.equipmentInOrder}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: '1.5rem' }}>
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: '#ffffff',
                  borderRadius: 10,
                  padding: 10,
                  border: '1px solid #eaedff',
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6 }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', lineHeight: 1.3 }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: item.type === 'buy' ? '#005c55' : '#ea580c', fontWeight: 600 }}>
                    {item.type === 'buy'
                      ? (locale === 'hi' ? 'खरीद (नया)' : 'Purchase (New)')
                      : (locale === 'hi' ? `रेंटल (${item.rentalDays} दिन)` : `Rental (${item.rentalDays} Days)`)}{' '}
                    • {locale === 'hi' ? 'मात्रा' : 'Qty'}: {item.quantity}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #dae2fd', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.875rem' }}>
            {pricing.buySubtotal > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6e7977' }}>{t.cart.purchaseSubtotal}:</span>
                <strong>₹{pricing.buySubtotal.toLocaleString('en-IN')}</strong>
              </div>
            )}
            {pricing.rentSubtotal > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6e7977' }}>{t.cart.rentalCharges}:</span>
                <strong>₹{pricing.rentSubtotal.toLocaleString('en-IN')}</strong>
              </div>
            )}
            {pricing.refundableDepositTotal > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#005c55', fontWeight: 700 }}>
                <span>{t.cart.securityDeposit}:</span>
                <span>+ ₹{pricing.refundableDepositTotal.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6e7977' }}>{t.cart.setupFee}:</span>
              <strong style={{ color: '#005c55' }}>{t.cart.freeDelivery}</strong>
            </div>

            <div style={{ borderTop: '1px solid #dae2fd', margin: '8px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <strong style={{ fontSize: '1rem', color: '#131b2e' }}>{t.cart.totalPayable}:</strong>
              <strong style={{ fontSize: '1.5rem', color: '#005c55' }}>
                ₹{pricing.totalPayableNow.toLocaleString('en-IN')}
              </strong>
            </div>

            {pricing.refundableDepositTotal > 0 && (
              <div
                style={{
                  background: '#eaf8f6',
                  borderRadius: 8,
                  padding: 8,
                  fontSize: '0.75rem',
                  color: '#005c55',
                  marginTop: 6,
                }}
              >
                {locale === 'hi'
                  ? `उपकरण वापसी निरीक्षण पर ₹${pricing.refundableDepositTotal.toLocaleString('en-IN')} सुरक्षा जमा सीधे आपके खाते में वापस कर दी जाएगी।`
                  : `₹${pricing.refundableDepositTotal.toLocaleString('en-IN')} security deposit will be refunded to your account upon equipment return inspection.`}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Authentication Modal for in-place checkout login/registration */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

