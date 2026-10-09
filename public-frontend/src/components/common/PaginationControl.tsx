'use strict';
'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  isLoading?: boolean;
}

export function PaginationControl({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [12, 24, 48],
  isLoading = false,
}: PaginationControlProps) {
  if (totalItems <= 0 && totalPages <= 1) {
    return null;
  }

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        padding: '1.25rem 1rem',
        marginTop: '2rem',
        borderTop: '1px solid #dae2fd',
        fontSize: '0.875rem',
        color: '#475569',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <div>
          Showing{' '}
          <strong style={{ color: '#131b2e' }}>
            {startItem}–{endItem}
          </strong>{' '}
          of <strong style={{ color: '#131b2e' }}>{totalItems}</strong> products
        </div>

        {onPageSizeChange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '0.8125rem', color: '#6e7977' }}>Per page:</span>
            <select
              value={pageSize}
              disabled={isLoading}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              style={{
                padding: '4px 8px',
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#131b2e',
                outline: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1 || isLoading}
          title="First Page"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: 8,
            border: '1px solid #e2e8f0',
            background: '#ffffff',
            color: currentPage <= 1 ? '#cbd5e1' : '#334155',
            cursor: currentPage <= 1 || isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <ChevronsLeft size={16} />
        </button>

        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isLoading}
          title="Previous Page"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: 8,
            border: '1px solid #e2e8f0',
            background: '#ffffff',
            color: currentPage <= 1 ? '#cbd5e1' : '#334155',
            cursor: currentPage <= 1 || isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((p, idx) => {
          if (p === '...') {
            return (
              <span
                key={`ellipsis-${idx}`}
                style={{
                  width: 32,
                  height: 36,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94a3b8',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                }}
              >
                ...
              </span>
            );
          }

          const pageNum = Number(p);
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              type="button"
              disabled={isLoading}
              onClick={() => onPageChange(pageNum)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                border: isActive ? '1px solid #16453A' : '1px solid #e2e8f0',
                background: isActive ? '#16453A' : '#ffffff',
                color: isActive ? '#ffffff' : '#334155',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.875rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
                boxShadow: isActive ? '0 2px 6px rgba(0, 92, 85, 0.25)' : 'none',
              }}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isLoading}
          title="Next Page"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: 8,
            border: '1px solid #e2e8f0',
            background: '#ffffff',
            color: currentPage >= totalPages ? '#cbd5e1' : '#334155',
            cursor: currentPage >= totalPages || isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <ChevronRight size={16} />
        </button>

        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages || isLoading}
          title="Last Page"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: 8,
            border: '1px solid #e2e8f0',
            background: '#ffffff',
            color: currentPage >= totalPages ? '#cbd5e1' : '#334155',
            cursor: currentPage >= totalPages || isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
}
