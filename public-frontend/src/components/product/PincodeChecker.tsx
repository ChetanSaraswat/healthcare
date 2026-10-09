'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setPincode } from '@/features/cart/cart.slice';
import { MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

export const PincodeChecker: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentPincode = useAppSelector((state) => state.cart.pincode);
  const isServiceable = useAppSelector((state) => state.cart.isPincodeServiceable);
  const serviceableCity = useAppSelector((state) => state.cart.serviceableCity);

  const [inputVal, setInputVal] = useState(currentPincode || '');

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.length === 6) {
      dispatch(setPincode(inputVal));
    }
  };

  return (
    <div
      style={{
        background: '#f2f3ff',
        borderRadius: 12,
        padding: '14px 18px',
        border: '1px solid #dae2fd',
        marginTop: 16,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '0.8125rem',
          fontWeight: 700,
          color: '#0C2E27',
          marginBottom: 8,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        <MapPin size={16} color="#16453A" />
        <span>Check Hub Delivery &amp; Setup Serviceability</span>
      </div>

      <form
        onSubmit={handleCheck}
        style={{ display: 'flex', gap: 8, alignItems: 'center' }}
      >
        <input
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit Pincode"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value.replace(/\D/g, ''))}
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid #bdc9c6',
            fontSize: '0.875rem',
            fontFamily: 'inherit',
            width: 170,
            outline: 'none',
          }}
        />
        <button
          type="submit"
          style={{
            background: '#16453A',
            color: '#ffffff',
            border: 'none',
            borderRadius: 8,
            padding: '8px 16px',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Check
        </button>
      </form>

      {isServiceable && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginTop: 8,
            fontSize: '0.8125rem',
            color: '#16453A',
            fontWeight: 600,
          }}
        >
          <CheckCircle2 size={16} />
          <span>
            Hospital-grade delivery &amp; technician setup available in{' '}
            <strong>{serviceableCity || 'your city'}</strong> within 4 hours.
          </span>
        </div>
      )}

      {isServiceable === false && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginTop: 8,
            fontSize: '0.8125rem',
            color: '#ba1a1a',
            fontWeight: 600,
          }}
        >
          <AlertCircle size={16} />
          <span>Pincode not currently serviceable for 4-hour urgent dispatch. Call 1800-889-2273 for assisted delivery.</span>
        </div>
      )}
    </div>
  );
};
