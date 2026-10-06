'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  PackageCheck,
  PlusCircle,
  Search,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Eye,
  ExternalLink,
  IndianRupee,
  Layers,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { deleteProduct } from '@/features/products/products.slice';

export default function AdminProductsPage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.products);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'all' || p.categoryId === selectedCategory;
    return Boolean(matchesSearch && matchesCat);
  });

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from the active medical catalog?`)) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#131b2e', margin: 0 }}>
            Medical Equipment Catalog
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6e7977', margin: '4px 0 0' }}>
            Manage hospital-grade &amp; homecare inventory with buy/rent pricing and bilingual content.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            borderRadius: 10,
            background: '#005c55',
            color: '#ffffff',
            fontSize: '0.875rem',
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(0,92,85,0.25)',
          }}
        >
          <PlusCircle size={18} />
          <span>Add New Equipment</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 14,
          padding: '1rem 1.25rem',
          border: '1px solid #e2e7ff',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
          <Search
            size={18}
            color="#6e7977"
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search by equipment name, brand, or model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 38px',
              borderRadius: 8,
              border: '1px solid #dae2fd',
              fontSize: '0.875rem',
              outline: 'none',
              background: '#f8f9ff',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {['all', 'cat-respiratory', 'cat-mobility', 'cat-homecare'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                border: selectedCategory === cat ? '1px solid #005c55' : '1px solid #dae2fd',
                background: selectedCategory === cat ? '#e8f5f3' : '#ffffff',
                color: selectedCategory === cat ? '#005c55' : '#3e4947',
                fontSize: '0.8125rem',
                fontWeight: selectedCategory === cat ? 700 : 500,
                cursor: 'pointer',
              }}
            >
              {cat === 'all'
                ? 'All Categories'
                : cat === 'cat-respiratory'
                ? 'Respiratory'
                : cat === 'cat-mobility'
                ? 'Mobility'
                : 'Homecare'}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          border: '1px solid #e2e7ff',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8f9ff', borderBottom: '1px solid #e2e7ff' }}>
              <th style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 800, color: '#6e7977', textTransform: 'uppercase' }}>
                Equipment
              </th>
              <th style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 800, color: '#6e7977', textTransform: 'uppercase' }}>
                Category &amp; Brand
              </th>
              <th style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 800, color: '#6e7977', textTransform: 'uppercase' }}>
                Buy Price
              </th>
              <th style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 800, color: '#6e7977', textTransform: 'uppercase' }}>
                Daily Rent / Deposit
              </th>
              <th style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 800, color: '#6e7977', textTransform: 'uppercase' }}>
                Stock
              </th>
              <th style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 800, color: '#6e7977', textTransform: 'uppercase' }}>
                Hindi Translation
              </th>
              <th style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 800, color: '#6e7977', textTransform: 'uppercase', textAlign: 'right' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => {
              const hasHindi = Boolean(p.translations?.hi);
              return (
                <tr key={p.id} style={{ borderBottom: '1px solid #f2f3ff', transition: 'background 0.1s ease' }}>
                  {/* Equipment Thumbnail + Title */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 8,
                          background: '#f2f3ff',
                          overflow: 'hidden',
                          position: 'relative',
                          flexShrink: 0,
                          border: '1px solid #dae2fd',
                        }}
                      >
                        <Image
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200'}
                          alt={p.name}
                          fill
                          sizes="48px"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div>
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#131b2e', display: 'block' }}>
                          {p.name}
                        </span>
                        <span style={{ fontSize: '0.6875rem', color: '#6e7977' }}>
                          SKU: {p.slug}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category & Brand */}
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#131b2e', display: 'block' }}>
                      {p.brand || 'AarogyaMed'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#006398', background: '#eaedff', padding: '2px 6px', borderRadius: 4 }}>
                      {p.categoryId}
                    </span>
                  </td>

                  {/* Buy Price */}
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#005c55' }}>
                      ₹{p.buyPrice?.toLocaleString('en-IN')}
                    </span>
                  </td>

                  {/* Daily Rent & Deposit */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#006398' }}>
                      ₹{p.rentalDailyRate}/day
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: '#6e7977' }}>
                      +₹{p.rentalSecurityDeposit?.toLocaleString('en-IN')} deposit
                    </div>
                  </td>

                  {/* Stock */}
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 6,
                        background: p.stock > 5 ? '#e8f5f3' : '#fff4eb',
                        color: p.stock > 5 ? '#005c55' : '#913200',
                      }}
                    >
                      {p.stock} units
                    </span>
                  </td>

                  {/* Hindi Translation Status */}
                  <td style={{ padding: '14px 16px' }}>
                    {hasHindi ? (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '3px 8px',
                          borderRadius: 999,
                          background: '#e8f5f3',
                          color: '#005c55',
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                        }}
                      >
                        <CheckCircle2 size={12} />
                        Hindi Complete
                      </span>
                    ) : (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '3px 8px',
                          borderRadius: 999,
                          background: '#ffe5dc',
                          color: '#b94200',
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                        }}
                      >
                        <AlertTriangle size={12} />
                        Missing Hindi
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <Link
                        href={`/product/${p.slug}`}
                        target="_blank"
                        title="View on Customer Storefront"
                        style={{
                          padding: 6,
                          borderRadius: 6,
                          background: '#f2f3ff',
                          color: '#006398',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <ExternalLink size={16} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id, p.name)}
                        title="Delete product"
                        style={{
                          padding: 6,
                          borderRadius: 6,
                          background: '#fff0ee',
                          color: '#ba1a1a',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
