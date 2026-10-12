'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearCart } from '@/features/cart/cart.slice';
import { showToast } from '@/features/ui/ui.slice';
import { createOrder } from '@/features/orders/create-order/create-order.action';
import { requestRental } from '@/features/rentals/request-rental/request-rental.action';
import { createPaymentOrderAction } from '@/features/payment/create-order/create-order.action';
import { verifyPaymentAction } from '@/features/payment/verify-payment/verify-payment.action';
import { UserEntity } from '@/domain/entities/user.entity';
import { useTranslation } from '@/locales';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChooseFromMapModal, SelectedLocationData } from '@/components/checkout/ChooseFromMapModal';
import { AuthModal } from '@/components/auth/AuthModal';
import {
  DurableCheckoutSession,
  computeCartFingerprint,
  loadCheckoutSession,
  persistCheckoutSession,
  clearCheckoutSession,
  isValidOrderIdentifier,
} from '@/features/payment/checkout-session';

import {
  checkoutSchema,
  CheckoutFormData,
  RAZORPAY_METHOD_ONLINE,
  RAZORPAY_METHOD_COD,
} from './types';
import { PatientInfoSection } from './_components/PatientInfoSection';
import { DeliveryAddressSection } from './_components/DeliveryAddressSection';
import { PaymentMethodSection } from './_components/PaymentMethodSection';
import { CheckoutOrderSummary } from './_components/CheckoutOrderSummary';

const resolveProductUuid = (rawId: string, slug?: string): string => {
  return rawId || slug || '';
};

const loadRazorpaySdk = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const existingScript = document.getElementById('razorpay-checkout-script') as HTMLScriptElement;
    if (existingScript) {
      if ((window as any).Razorpay) return resolve(true);
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      setTimeout(() => {
        resolve(Boolean((window as any).Razorpay));
      }, 1200);
      return;
    }

    const script = document.createElement('script');
    script.id = 'razorpay-checkout-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
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

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  const getInitialFormData = useCallback((): CheckoutFormData => {
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
        paymentMethod: RAZORPAY_METHOD_ONLINE,
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
      paymentMethod: RAZORPAY_METHOD_ONLINE,
    };
  }, [savedAddresses, addressMode, selectedSavedAddressId, authUser, serviceableCity, pincode]);

  const {
    register,
    handleSubmit: handleFormSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: getInitialFormData(),
    mode: 'onTouched',
  });

  const selectedPaymentMethod = watch('paymentMethod');

  // Sync authUser updates when user logs in via AuthModal
  useEffect(() => {
    if (authUser) {
      if (authUser.name) setValue('fullName', authUser.name, { shouldValidate: true });
      if (authUser.phone) setValue('phone', authUser.phone, { shouldValidate: true });
      if (authUser.email) setValue('email', authUser.email, { shouldValidate: true });
    }
  }, [authUser, setValue]);

  // When saved address selection changes, auto-fill form
  useEffect(() => {
    if (addressMode === 'saved' && selectedSavedAddressId) {
      const addr = savedAddresses.find((a) => a.id === selectedSavedAddressId);
      if (addr) {
        setValue('addressLine1', addr.line1, { shouldValidate: true });
        setValue('addressLine2', addr.line2 || '', { shouldValidate: true });
        setValue('city', addr.city, { shouldValidate: true });
        setValue('state', addr.state, { shouldValidate: true });
        setValue('pincode', addr.pincode, { shouldValidate: true });
      }
    }
  }, [addressMode, selectedSavedAddressId, savedAddresses, setValue]);

  const handleMapLocationSelected = (loc: SelectedLocationData) => {
    setAddressMode('new');
    setSelectedSavedAddressId(null);
    setSelectedCoordinates({ lat: loc.lat, lng: loc.lng });
    setValue('addressLine1', loc.addressLine1, { shouldValidate: true });
    setValue('city', loc.city, { shouldValidate: true });
    setValue('state', loc.state, { shouldValidate: true });
    setValue('pincode', loc.pincode, { shouldValidate: true });
    dispatch(
      showToast({
        type: 'success',
        message: `Delivery pin set: ${loc.city} (${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)})`,
      })
    );
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const cartFingerprint = computeCartFingerprint(items);
  const [checkoutSession, setCheckoutSession] = useState<DurableCheckoutSession>(() =>
    loadCheckoutSession(cartFingerprint)
  );

  useEffect(() => {
    const loaded = loadCheckoutSession(cartFingerprint);
    setCheckoutSession(loaded);
  }, [cartFingerprint]);

  // Preload Razorpay checkout script on checkout mount
  useEffect(() => {
    loadRazorpaySdk().catch(() => {});
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
            background: '#16453A',
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

  const onSubmit = async (data: CheckoutFormData) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const canonicalAddress = {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        line1: data.addressLine1,
        line2: data.addressLine2 || null,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        coordinates: selectedCoordinates,
      };

      // 1. If purchase items exist, create order (or reuse existing order from this durable checkout session)
      let buyOrderId = isValidOrderIdentifier(checkoutSession.buyOrderId)
        ? checkoutSession.buyOrderId
        : undefined;

      if (!buyOrderId && buyItems.length > 0) {
        const createdBuyOrder = await dispatch(
          createOrder({
            shipping_address: canonicalAddress,
            payment_method: data.paymentMethod,
            items: buyItems.map((item) => ({
              product_uuid: resolveProductUuid(item.productId, item.slug),
              productName: item.name,
              productImage: item.image,
              unit_price: item.price,
              quantity: item.quantity,
              total_price: item.price * item.quantity,
            })),
          } as any)
        ).unwrap();
        const rawBuyId = createdBuyOrder?.data?.uuid || (createdBuyOrder?.data?.id ? String(createdBuyOrder.data.id) : undefined);
        buyOrderId = isValidOrderIdentifier(rawBuyId) ? rawBuyId : undefined;
        setCheckoutSession((prev) => {
          const updated = { ...prev, buyOrderId };
          persistCheckoutSession(updated);
          return updated;
        });
      }

      // 2. If rental items exist, request rental (or reuse existing rental order from this session)
      let rentalOrderId = isValidOrderIdentifier(checkoutSession.rentalOrderId)
        ? checkoutSession.rentalOrderId
        : undefined;

      if (!rentalOrderId && rentItems.length > 0) {
        const createdRentalOrder = await dispatch(
          requestRental({
            delivery_address: canonicalAddress,
            payment_method: data.paymentMethod,
            notes: data.installationNotes,
            start_date: new Date().toISOString().split('T')[0],
            end_date: new Date(Date.now() + (rentItems[0]?.rentalDays || 7) * 86400000)
              .toISOString()
              .split('T')[0],
            items: rentItems.map((item) => ({
              product_uuid: resolveProductUuid(item.productId, item.slug),
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
        const rawRentalId = createdRentalOrder?.data?.uuid || (createdRentalOrder?.data?.id ? String(createdRentalOrder.data.id) : undefined);
        rentalOrderId = isValidOrderIdentifier(rawRentalId) ? rawRentalId : undefined;
        setCheckoutSession((prev) => {
          const updated = { ...prev, rentalOrderId };
          persistCheckoutSession(updated);
          return updated;
        });
      }

      // 3. Determine payment mode: Cash on Delivery vs Online Gateway (Razorpay)
      const methodLower = (data.paymentMethod || '').toLowerCase();
      const isCod =
        data.paymentMethod === RAZORPAY_METHOD_COD ||
        data.paymentMethod === t.checkout.cod ||
        methodLower.includes('arrival') ||
        methodLower.includes('technician') ||
        methodLower.includes('delivery') ||
        methodLower.includes('cash') ||
        methodLower.includes('cod') ||
        methodLower.includes('आगमन');

      if (isCod) {
        clearCheckoutSession();
        dispatch(clearCart());
        dispatch(
          showToast({
            type: 'success',
            message: 'Order placed for Pay on Arrival with Biomedical Technician verification!',
          })
        );
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
            patientName: data.fullName,
            phone: data.phone,
            email: data.email,
          },
        })
      ).unwrap();

      const rzpOrderData = orderActionRes.data;

      // If backend detected order is ALREADY captured
      if (rzpOrderData?.alreadyCaptured || rzpOrderData?.status === 'captured') {
        clearCheckoutSession();
        dispatch(clearCart());
        dispatch(showToast({ type: 'success', message: 'Payment confirmed successfully!' }));
        router.push(`/order-confirmation?paymentId=${rzpOrderData.orderId || 'captured'}`);
        return;
      }

      // Check if real live Razorpay Key is provided
      const isPlaceholderKey =
        !rzpOrderData?.keyId ||
        rzpOrderData.keyId.includes('aarogya_med') ||
        rzpOrderData.keyId.startsWith('rzp_test_mock');

      if (!isPlaceholderKey) {
        const isSdkLoaded = await loadRazorpaySdk();
        if (!isSdkLoaded || typeof window === 'undefined' || !(window as any).Razorpay) {
          setIsSubmitting(false);
          dispatch(
            showToast({
              type: 'error',
              message: 'Failed to initialize Razorpay checkout gateway. Please check your internet connection or ad-blockers and try again.',
            })
          );
          return;
        }

        const options = {
          key: rzpOrderData.keyId,
          amount: rzpOrderData.amount,
          currency: rzpOrderData.currency || 'INR',
          name: 'Omkar Healthcare',
          description: 'Medical Equipment Purchase / Rental Security Deposit',
          order_id: rzpOrderData.orderId,
          prefill: {
            name: data.fullName,
            email: data.email,
            contact: data.phone,
          },
          theme: {
            color: '#16453A',
          },
          modal: {
            ondismiss: () => {
              setIsSubmitting(false);
              dispatch(
                showToast({
                  type: 'info',
                  message: 'Razorpay payment window closed. You can retry whenever you are ready.',
                })
              );
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
                  payment_method: 'razorpay',
                })
              ).unwrap();

              clearCheckoutSession();
              dispatch(clearCart());
              dispatch(showToast({ type: 'success', message: 'Payment confirmed successfully!' }));
              router.push(`/order-confirmation?paymentId=${response.razorpay_payment_id}&status=captured`);
            } catch (verErr: any) {
              console.error('Signature verification error:', verErr);
              setIsSubmitting(false);
              dispatch(
                showToast({
                  type: 'error',
                  message: verErr?.message || 'Payment signature verification failed. Please contact support if amount was debited.',
                })
              );
            }
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', (failResp: any) => {
          console.warn('Payment failed at gateway:', failResp);
          setIsSubmitting(false);
          dispatch(
            showToast({
              type: 'error',
              message: `Payment failed: ${failResp?.error?.description || 'Gateway declined'}. Please retry or choose Pay on Arrival.`,
            })
          );
        });
        rzp.open();
      } else {
        setIsSubmitting(false);
        dispatch(
          showToast({
            type: 'error',
            message: 'Online payment gateway is temporarily unavailable. Please choose "Pay on Arrival / Cash on Delivery" to complete your medical order.',
          })
        );
        return;
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setIsSubmitting(false);
      dispatch(
        showToast({
          type: 'error',
          message: err?.message || 'Could not complete checkout. Please verify connection or helpline.',
        })
      );
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
        <form onSubmit={handleFormSubmit(onSubmit)} noValidate>
          {/* Section 1: Patient / Contact Information */}
          <PatientInfoSection register={register} errors={errors} />

          {/* Section 2: Delivery & Installation Address */}
          <DeliveryAddressSection
            register={register}
            errors={errors}
            authUser={authUser}
            savedAddresses={savedAddresses}
            addressMode={addressMode}
            setAddressMode={setAddressMode}
            selectedSavedAddressId={selectedSavedAddressId}
            setSelectedSavedAddressId={setSelectedSavedAddressId}
            selectedCoordinates={selectedCoordinates}
            onOpenMapModal={() => setIsMapModalOpen(true)}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />

          {/* Section 3: Payment Method */}
          <PaymentMethodSection
            selectedPaymentMethod={selectedPaymentMethod}
            onSelectPaymentMethod={(method) => setValue('paymentMethod', method, { shouldValidate: true })}
            isSubmitting={isSubmitting}
            totalPayableNow={pricing.totalPayableNow}
            errorMessage={errors.paymentMethod?.message}
          />
        </form>

        {/* Right Summary Box */}
        <CheckoutOrderSummary items={items} pricing={pricing} />
      </div>

      {/* Interactive Authentication Modal for in-place checkout login/registration */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Interactive Choose from Map Modal for GPS coordinates and delivery address */}
      <ChooseFromMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        onSelectLocation={handleMapLocationSelected}
      />
    </div>
  );
}
