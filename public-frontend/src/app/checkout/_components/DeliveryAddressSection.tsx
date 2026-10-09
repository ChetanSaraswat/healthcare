'use client';

import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { CheckoutFormData } from '../types';
import { Address, AddressEntity, UserEntity } from '@/domain/entities/user.entity';
import { useTranslation } from '@/locales';
import {
  Navigation,
  BookmarkCheck,
  ShieldCheck,
  MapPin,
  Plus,
} from 'lucide-react';

interface DeliveryAddressSectionProps {
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  authUser: { name?: string; email?: string } | null;
  savedAddresses: Address[];
  addressMode: 'saved' | 'new';
  setAddressMode: (mode: 'saved' | 'new') => void;
  selectedSavedAddressId: string | null;
  setSelectedSavedAddressId: (id: string | null) => void;
  selectedCoordinates: { lat: number; lng: number } | null;
  onOpenMapModal: () => void;
  onOpenAuthModal: () => void;
}

export function DeliveryAddressSection({
  register,
  errors,
  authUser,
  savedAddresses,
  addressMode,
  setAddressMode,
  selectedSavedAddressId,
  setSelectedSavedAddressId,
  selectedCoordinates,
  onOpenMapModal,
  onOpenAuthModal,
}: DeliveryAddressSectionProps) {
  const { t, locale } = useTranslation();

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 16,
        border: '1px solid #dae2fd',
        padding: '1.5rem',
        marginBottom: '1.5rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#131b2e', margin: 0 }}>
          {t.checkout.addressSection}
        </h3>
        <button
          type="button"
          onClick={onOpenMapModal}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            borderRadius: 8,
            border: '1.5px solid #16453A',
            background: '#f0fdfa',
            color: '#16453A',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <Navigation size={13} color="#16453A" />
          {locale === 'hi' ? 'मैप से चुनें' : 'Choose from Map'}
        </button>
      </div>

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
            <BookmarkCheck size={18} color="#16453A" />
            <span style={{ fontSize: '0.8125rem', color: '#16453A', fontWeight: 600 }}>
              {locale === 'hi'
                ? 'सहेजे गए पते स्वतः भरने के लिए अपने खाते में साइन इन करें।'
                : 'Have an account? Sign in to use your saved patient delivery addresses.'}
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenAuthModal}
            style={{
              background: '#16453A',
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
          <ShieldCheck size={16} color="#16453A" />
          <span>
            {locale === 'hi' ? 'सत्यापित रोगी खाता:' : 'Ordering as:'}{' '}
            <strong style={{ color: '#131b2e' }}>{authUser.name}</strong> ({authUser.email})
          </span>
        </div>
      )}

      {/* Selected Map Coordinates Pill */}
      {selectedCoordinates && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            background: '#eaf8f6',
            borderRadius: 8,
            fontSize: '0.75rem',
            color: '#16453A',
            fontWeight: 600,
            marginBottom: '1.25rem',
            border: '1px solid #a3e9de',
          }}
        >
          <MapPin size={13} color="#16453A" />
          <span>
            {locale === 'hi' ? 'मैप जीपीएस स्थान चयनित:' : 'Selected via Map:'}{' '}
            {selectedCoordinates.lat.toFixed(5)}, {selectedCoordinates.lng.toFixed(5)}
          </span>
        </div>
      )}

      {/* Address Mode Selector */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: '1rem', flexWrap: 'wrap' }}>
          {savedAddresses.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setAddressMode('saved');
                const defaultAddr = UserEntity.getDefaultAddress(savedAddresses);
                if (defaultAddr) setSelectedSavedAddressId(defaultAddr.id);
              }}
              style={{
                flex: 1,
                minWidth: 140,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '10px 14px',
                borderRadius: 10,
                border: addressMode === 'saved' ? '2px solid #16453A' : '1px solid #dae2fd',
                background: addressMode === 'saved' ? '#eaf8f6' : '#ffffff',
                color: addressMode === 'saved' ? '#16453A' : '#6e7977',
                fontWeight: 700,
                fontSize: '0.8125rem',
                cursor: 'pointer',
              }}
            >
              <BookmarkCheck size={15} />
              {locale === 'hi' ? 'सहेजे गए पते' : 'Saved Addresses'}
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setAddressMode('new');
              setSelectedSavedAddressId(null);
            }}
            style={{
              flex: 1,
              minWidth: 140,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '10px 14px',
              borderRadius: 10,
              border: addressMode === 'new' ? '2px solid #16453A' : '1px solid #dae2fd',
              background: addressMode === 'new' ? '#eaf8f6' : '#ffffff',
              color: addressMode === 'new' ? '#16453A' : '#6e7977',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer',
            }}
          >
            <Plus size={15} />
            {locale === 'hi' ? 'नया पता दर्ज करें' : 'Enter Address'}
          </button>
          <button
            type="button"
            onClick={onOpenMapModal}
            style={{
              flex: 1,
              minWidth: 140,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '10px 14px',
              borderRadius: 10,
              border: '1.5px solid #16453A',
              background: '#f0fdfa',
              color: '#16453A',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer',
            }}
          >
            <Navigation size={15} />
            {locale === 'hi' ? 'मैप से चुनें' : 'Choose from Map'}
          </button>
        </div>

        {/* Saved Address Cards */}
        {addressMode === 'saved' && savedAddresses.length > 0 && (
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
                    border: isSelected ? '2px solid #16453A' : '1px solid #dae2fd',
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
                      <MapPin size={14} color="#16453A" />
                      <strong style={{ fontSize: '0.875rem', color: '#131b2e' }}>
                        {addr.label}
                      </strong>
                      {addr.isDefault && (
                        <span
                          style={{
                            background: '#16453A',
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

      {/* Manual address form fields */}
      {addressMode === 'new' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 4 }}>
              {t.checkout.street} <span style={{ color: '#ba1a1a' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="House / Flat No., Apartment Name, Street Area"
              {...register('addressLine1')}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: errors.addressLine1 ? '1.5px solid #ba1a1a' : '1px solid #bdc9c6',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
            {errors.addressLine1 && (
              <span style={{ display: 'block', color: '#ba1a1a', fontSize: '0.75rem', marginTop: 4 }}>
                {errors.addressLine1.message}
              </span>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 4 }}>
              {t.checkout.landmark}
            </label>
            <input
              type="text"
              placeholder="Nearby hospital, clinic or landmark (optional)"
              {...register('addressLine2')}
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
                {t.checkout.city} <span style={{ color: '#ba1a1a' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Bengaluru"
                {...register('city')}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: errors.city ? '1.5px solid #ba1a1a' : '1px solid #bdc9c6',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
              {errors.city && (
                <span style={{ display: 'block', color: '#ba1a1a', fontSize: '0.75rem', marginTop: 4 }}>
                  {errors.city.message}
                </span>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 4 }}>
                {t.checkout.state} <span style={{ color: '#ba1a1a' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Karnataka"
                {...register('state')}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: errors.state ? '1.5px solid #ba1a1a' : '1px solid #bdc9c6',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
              {errors.state && (
                <span style={{ display: 'block', color: '#ba1a1a', fontSize: '0.75rem', marginTop: 4 }}>
                  {errors.state.message}
                </span>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 4 }}>
                {t.checkout.pincode} <span style={{ color: '#ba1a1a' }}>*</span>
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="6-digit PIN"
                {...register('pincode')}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: errors.pincode ? '1.5px solid #ba1a1a' : '1px solid #bdc9c6',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
              {errors.pincode && (
                <span style={{ display: 'block', color: '#ba1a1a', fontSize: '0.75rem', marginTop: 4 }}>
                  {errors.pincode.message}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Installation notes — always visible */}
      <div style={{ marginTop: addressMode === 'saved' ? 0 : 14 }}>
        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 4 }}>
          {t.checkout.notes}
        </label>
        <textarea
          rows={2}
          placeholder="Patient room floor, lift availability, ICU setup requirements, etc."
          {...register('installationNotes')}
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
  );
}
