'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectToast, hideToast, showToast } from '@/features/ui/ui.slice';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export function ToastSnackbar() {
  const dispatch = useAppDispatch();
  const toast = useAppSelector(selectToast);

  useEffect(() => {
    const handleCustomToast = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        dispatch(showToast(customEvent.detail));
      }
    };
    window.addEventListener('aarogyamed:toast', handleCustomToast);
    return () => window.removeEventListener('aarogyamed:toast', handleCustomToast);
  }, [dispatch]);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      dispatch(hideToast());
    }, toast.duration || 4500);

    return () => clearTimeout(timer);
  }, [toast, dispatch]);

  if (!toast) return null;

  const config = {
    success: {
      bg: '#eaf8f6',
      border: '#005c55',
      text: '#005c55',
      icon: <CheckCircle2 size={20} color="#005c55" />,
    },
    error: {
      bg: '#fdf2f2',
      border: '#ba1a1a',
      text: '#900018',
      icon: <AlertCircle size={20} color="#ba1a1a" />,
    },
    warning: {
      bg: '#fffbeb',
      border: '#d97706',
      text: '#b45309',
      icon: <AlertTriangle size={20} color="#d97706" />,
    },
    info: {
      bg: '#f0f7ff',
      border: '#0284c7',
      text: '#0369a1',
      icon: <Info size={20} color="#0284c7" />,
    },
  }[toast.type || 'info'];

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 18px',
        borderRadius: 12,
        backgroundColor: config.bg,
        border: `1.5px solid ${config.border}`,
        color: config.text,
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        fontSize: '0.875rem',
        fontWeight: 600,
        maxWidth: 420,
        animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div style={{ flexShrink: 0 }}>{config.icon}</div>
      <div style={{ flex: 1, lineHeight: 1.4 }}>{toast.message}</div>
      <button
        type="button"
        onClick={() => dispatch(hideToast())}
        style={{
          background: 'none',
          border: 'none',
          color: config.text,
          cursor: 'pointer',
          padding: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.7,
        }}
        aria-label="Dismiss notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}
