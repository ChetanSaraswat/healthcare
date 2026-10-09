'use client';

import React from 'react';
import { ProductSpecification } from '@/domain/entities/product.entity';
import { useTranslation } from '@/locales';

interface SpecTableProps {
  specifications: ProductSpecification[];
  className?: string;
}

export const SpecTable: React.FC<SpecTableProps> = ({ specifications, className = '' }) => {
  const { t, locale } = useTranslation();

  if (!specifications || specifications.length === 0) {
    return (
      <p style={{ color: '#6e7977', fontStyle: 'italic', fontSize: '0.875rem' }}>
        {locale === 'hi'
          ? 'मानक क्लिनिकल विशिष्टताएँ अनुरोध पर उपलब्ध हैं।'
          : 'Standard clinical specifications available upon request.'}
      </p>
    );
  }

  return (
    <div
      className={className}
      style={{
        width: '100%',
        overflowX: 'auto',
        borderRadius: 12,
        border: '1px solid #dae2fd',
        background: '#ffffff',
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontSize: '0.875rem',
        }}
      >
        <thead>
          <tr style={{ background: '#f2f3ff', borderBottom: '1px solid #dae2fd' }}>
            <th
              style={{
                padding: '12px 18px',
                fontWeight: 700,
                color: '#0C2E27',
                width: '38%',
                fontSize: '0.8125rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {t.product.paramHeader}
            </th>
            <th
              style={{
                padding: '12px 18px',
                fontWeight: 700,
                color: '#0C2E27',
                fontSize: '0.8125rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {t.product.specHeader}
            </th>
          </tr>
        </thead>
        <tbody>
          {specifications.map((spec, index) => (
            <tr
              key={`${spec.label}-${index}`}
              style={{
                background: index % 2 === 0 ? '#ffffff' : '#faf8ff',
                borderBottom:
                  index === specifications.length - 1 ? 'none' : '1px solid #eaedff',
              }}
            >
              <td
                style={{
                  padding: '12px 18px',
                  fontWeight: 600,
                  color: '#131b2e',
                  verticalAlign: 'top',
                }}
              >
                {spec.label}
              </td>
              <td
                style={{
                  padding: '12px 18px',
                  color: '#3e4947',
                  lineHeight: 1.5,
                  verticalAlign: 'top',
                }}
              >
                {spec.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
