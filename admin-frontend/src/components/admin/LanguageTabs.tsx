'use client';

import React from 'react';
import { useTranslation } from '@/locales';
import { Globe, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface LanguageTabsProps {
  selectedLocale: 'en' | 'hi';
  onSelectLocale: (locale: 'en' | 'hi') => void;
  hasHindiTranslation?: boolean;
  onAutoTranslate?: () => void;
  className?: string;
}

export const LanguageTabs: React.FC<LanguageTabsProps> = ({
  selectedLocale,
  onSelectLocale,
  hasHindiTranslation = false,
  onAutoTranslate,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={className}
      style={{
        background: '#ffffff',
        border: '1px solid #dae2fd',
        borderRadius: 14,
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
        boxShadow: '0 2px 8px rgba(19, 27, 46, 0.04)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Globe size={18} color="#005c55" />
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#131b2e' }}>
            {t.admin.languageTabs}
          </span>
        </div>

        {/* Tab Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: '#f2f3ff',
            padding: 3,
            borderRadius: 10,
            gap: 4,
          }}
        >
          <button
            type="button"
            onClick={() => onSelectLocale('en')}
            style={{
              border: 'none',
              background: selectedLocale === 'en' ? '#005c55' : 'transparent',
              color: selectedLocale === 'en' ? '#ffffff' : '#3e4947',
              padding: '6px 16px',
              borderRadius: 8,
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {t.admin.english}
          </button>

          <button
            type="button"
            onClick={() => onSelectLocale('hi')}
            style={{
              border: 'none',
              background: selectedLocale === 'hi' ? '#005c55' : 'transparent',
              color: selectedLocale === 'hi' ? '#ffffff' : '#3e4947',
              padding: '6px 16px',
              borderRadius: 8,
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {t.admin.hindi}
          </button>
        </div>

        {/* Translation Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {hasHindiTranslation ? (
            <span
              style={{
                background: '#eaf8f6',
                color: '#005c55',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 9999,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                border: '1px solid #a3faef',
              }}
            >
              <CheckCircle2 size={14} /> {t.admin.hindiComplete}
            </span>
          ) : (
            <span
              style={{
                background: '#fff0eb',
                color: '#ea580c',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 9999,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                border: '1px solid #ffd8c8',
              }}
            >
              <AlertTriangle size={14} /> {t.admin.missingHindi}
            </span>
          )}

          {onAutoTranslate && !hasHindiTranslation && (
            <button
              type="button"
              onClick={onAutoTranslate}
              style={{
                background: '#005c55',
                color: '#ffffff',
                border: 'none',
                padding: '5px 12px',
                borderRadius: 8,
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Auto-Translate Draft
            </button>
          )}
        </div>
      </div>

      {/* Missing Translation Fallback Warning */}
      {selectedLocale === 'hi' && !hasHindiTranslation && (
        <div
          style={{
            marginTop: 12,
            padding: '8px 12px',
            background: '#fff7f2',
            border: '1px solid #ffd8c8',
            borderRadius: 8,
            color: '#913200',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <AlertTriangle size={16} style={{ flexShrink: 0 }} />
          <span>{t.admin.missingHindiWarning}</span>
        </div>
      )}
    </div>
  );
};
