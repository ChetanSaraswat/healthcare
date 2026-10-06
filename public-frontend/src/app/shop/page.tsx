'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/product/ProductCard';
import { INITIAL_MOCK_PRODUCTS } from '@/features/products/list-products/list-products.service';
import { INITIAL_MOCK_CATEGORIES } from '@/features/categories/list-categories/list-categories.service';
import { Filter, SlidersHorizontal, ShoppingBag, RefreshCw } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialMode = (searchParams.get('mode') as 'all' | 'buy' | 'rent') || 'all';
  const searchQuery = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedMode, setSelectedMode] = useState<'all' | 'buy' | 'rent'>(initialMode);
  const [sortBy, setSortBy] = useState<'popular' | 'price_low' | 'price_high'>('popular');

  const filteredProducts = useMemo(() => {
    let result = [...INITIAL_MOCK_PRODUCTS];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter(
        (p) => p.categoryId === selectedCategory || p.slug.includes(selectedCategory)
      );
    }

    if (selectedMode === 'buy') {
      result = result.filter((p) => p.isAvailableForBuy);
    } else if (selectedMode === 'rent') {
      result = result.filter((p) => p.isAvailableForRent);
    }

    if (sortBy === 'price_low') {
      result.sort((a, b) => a.buyPrice - b.buyPrice);
    } else if (sortBy === 'price_high') {
      result.sort((a, b) => b.buyPrice - a.buyPrice);
    }

    return result;
  }, [searchQuery, selectedCategory, selectedMode, sortBy]);

  return (
    <div style={{ maxWidth: 1280, margin: '2rem auto 5rem', padding: '0 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#131b2e', marginBottom: '0.5rem' }}>
          Hospital-Grade Medical Equipment Catalog
        </h1>
        <p style={{ color: '#6e7977', fontSize: '1rem', maxWidth: 700 }}>
          Browse certified medical devices with dual buy &amp; rent availability. Every rental is 10-step sterilized and accompanied by technician home onboarding.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          border: '1px solid #dae2fd',
          padding: '1.25rem',
          marginBottom: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: '0 2px 8px rgba(19, 27, 46, 0.04)',
        }}
      >
        {/* Row 1: Mode Filter (Equal Weight Buy vs Rent) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#00201d', textTransform: 'uppercase' }}>
            Equipment Mode:
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setSelectedMode('all')}
              style={{
                padding: '6px 14px',
                borderRadius: 9999,
                fontSize: '0.8125rem',
                fontWeight: 600,
                border: selectedMode === 'all' ? '1.5px solid #005c55' : '1px solid #dae2fd',
                background: selectedMode === 'all' ? '#eaf8f6' : '#ffffff',
                color: selectedMode === 'all' ? '#005c55' : '#3e4947',
                cursor: 'pointer',
              }}
            >
              All Equipment ({INITIAL_MOCK_PRODUCTS.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedMode('buy')}
              style={{
                padding: '6px 14px',
                borderRadius: 9999,
                fontSize: '0.8125rem',
                fontWeight: 600,
                border: selectedMode === 'buy' ? '1.5px solid #005c55' : '1px solid #dae2fd',
                background: selectedMode === 'buy' ? '#eaf8f6' : '#ffffff',
                color: selectedMode === 'buy' ? '#005c55' : '#3e4947',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <ShoppingBag size={14} /> Buy Only
            </button>
            <button
              type="button"
              onClick={() => setSelectedMode('rent')}
              style={{
                padding: '6px 14px',
                borderRadius: 9999,
                fontSize: '0.8125rem',
                fontWeight: 600,
                border: selectedMode === 'rent' ? '1.5px solid #ea580c' : '1px solid #dae2fd',
                background: selectedMode === 'rent' ? '#fff0eb' : '#ffffff',
                color: selectedMode === 'rent' ? '#ea580c' : '#3e4947',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <RefreshCw size={14} /> Rent Only
            </button>
          </div>

          {/* Sort By Dropdown */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SlidersHorizontal size={16} color="#6e7977" />
            <span style={{ fontSize: '0.8125rem', color: '#6e7977', fontWeight: 600 }}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                border: '1px solid #dae2fd',
                fontSize: '0.8125rem',
                color: '#131b2e',
                background: '#faf8ff',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="popular">Most Popular &amp; Hospital Used</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Row 2: Categories Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.75rem', borderTop: '1px solid #eaedff' }}>
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              fontSize: '0.75rem',
              fontWeight: 700,
              background: selectedCategory === 'all' ? '#00201d' : '#f2f3ff',
              color: selectedCategory === 'all' ? '#ffffff' : '#3e4947',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            All Categories
          </button>
          {INITIAL_MOCK_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: '0.75rem',
                fontWeight: 600,
                background: selectedCategory === cat.id ? '#005c55' : '#f2f3ff',
                color: selectedCategory === cat.id ? '#ffffff' : '#3e4947',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.9375rem', color: '#3e4947', fontWeight: 600 }}>
          Showing <strong>{filteredProducts.length}</strong> medical equipment units
          {searchQuery ? ` matching "${searchQuery}"` : ''}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 1.5rem',
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #dae2fd',
          }}
        >
          <h3>No medical equipment matches your criteria.</h3>
          <p style={{ color: '#6e7977', marginTop: 8 }}>
            Try resetting your filters or call our helpline for custom medical procurement.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSelectedMode('all');
            }}
            style={{
              marginTop: 16,
              background: '#005c55',
              color: '#ffffff',
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center' }}>Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
