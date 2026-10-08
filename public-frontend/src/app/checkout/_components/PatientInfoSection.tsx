'use client';

import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { CheckoutFormData } from '../types';
import { useTranslation } from '@/locales';

interface PatientInfoSectionProps {
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
}

export function PatientInfoSection({ register, errors }: PatientInfoSectionProps) {
  const { t } = useTranslation();

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
      <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#131b2e', marginBottom: '1.25rem' }}>
        {t.checkout.patientSection}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 4 }}>
            {t.checkout.fullName} <span style={{ color: '#ba1a1a' }}>*</span>
          </label>
          <input
            type="text"
            {...register('fullName')}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 8,
              border: errors.fullName ? '1.5px solid #ba1a1a' : '1px solid #bdc9c6',
              fontSize: '0.875rem',
              outline: 'none',
            }}
          />
          {errors.fullName && (
            <span style={{ display: 'block', color: '#ba1a1a', fontSize: '0.75rem', marginTop: 4 }}>
              {errors.fullName.message}
            </span>
          )}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 4 }}>
            {t.checkout.phone} <span style={{ color: '#ba1a1a' }}>*</span>
          </label>
          <input
            type="tel"
            placeholder="e.g. 9876543210"
            {...register('phone')}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 8,
              border: errors.phone ? '1.5px solid #ba1a1a' : '1px solid #bdc9c6',
              fontSize: '0.875rem',
              outline: 'none',
            }}
          />
          {errors.phone && (
            <span style={{ display: 'block', color: '#ba1a1a', fontSize: '0.75rem', marginTop: 4 }}>
              {errors.phone.message}
            </span>
          )}
        </div>

        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 4 }}>
            {t.checkout.email} <span style={{ color: '#ba1a1a' }}>*</span>
          </label>
          <input
            type="email"
            placeholder="patient@example.com"
            {...register('email')}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 8,
              border: errors.email ? '1.5px solid #ba1a1a' : '1px solid #bdc9c6',
              fontSize: '0.875rem',
              outline: 'none',
            }}
          />
          {errors.email && (
            <span style={{ display: 'block', color: '#ba1a1a', fontSize: '0.75rem', marginTop: 4 }}>
              {errors.email.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
