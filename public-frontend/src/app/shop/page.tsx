'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { listProducts } from '@/features/products/list-products/list-products.action';
import { listCategories } from '@/features/categories/list-categories/list-categories.action';
import { SlidersHorizontal, ShoppingBag, RefreshCw, AlertCircle } from 'lucide-react';
import { PaginationControl } from '@/components/common/PaginationControl';

function ShopContent() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialMode = (searchParams.get('mode') as 'all' | 'buy' | 'rent') || 'all';
  const searchQuery = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedMode, setSelectedMode] = useState<'all' | 'buy' | 'rent'>(initialMode);
  const [sortBy, setSortBy] = useState<'popular' | 'price_low' | 'price_high'>('popular');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [hasFetched, setHasFetched] = useState(false);

  const products = useAppSelector((state) => state.products.products);
  const total = useAppSelector((state) => state.products.total);
  const totalPages = useAppSelector((state) => state.products.totalPages);
  const productsLoading = useAppSelector((state) => state.products.loading);
  const productsError = useAppSelector((state) => state.products.error);
  const categories = useAppSelector((state) => state.categories.categories);

  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);

  useEffect(() => {
    const m = searchParams.get('mode') as 'all' | 'buy' | 'rent';
    if (m === 'all' || m === 'buy' || m === 'rent') {
      setSelectedMode(m);
    }
    const c = searchParams.get('category');
    if (c) {
      setSelectedCategory(c);
    }
  }, [searchParams]);

  // Reset to page 1 whenever filters or search criteria change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedMode, sortBy, searchQuery]);

  // Backend-driven fetching synchronized with pagination and filters
  useEffect(() => {
    let isCancelled = false;
    dispatch(
      listProducts({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        mode: selectedMode,
        sort: sortBy,
        search: searchQuery.trim() || undefined,
        page: currentPage,
        limit: pageSize,
      })
    ).finally(() => {
      if (!isCancelled) {
        setHasFetched(true);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [dispatch, selectedCategory, selectedMode, sortBy, searchQuery, currentPage, pageSize]);

  // Catalog is loading during initial mount/refresh or when fetching without cached items
  const isCatalogLoading = (!hasFetched && products.length === 0) || (productsLoading && products.length === 0);

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
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0C2E27', textTransform: 'uppercase' }}>
            Equipment Mode:
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setSelectedMode('all')}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: '0.8125rem',
                fontWeight: 700,
                background: selectedMode === 'all' ? '#16453A' : '#f2f3ff',
                color: selectedMode === 'all' ? '#ffffff' : '#3e4947',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              All Equipment {!isCatalogLoading && `(${total})`}
            </button>
            <button
              type="button"
              onClick={() => setSelectedMode('rent')}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: '0.8125rem',
                fontWeight: 700,
                background: selectedMode === 'rent' ? '#B75932' : '#FAF5EC',
                color: selectedMode === 'rent' ? '#ffffff' : '#B75932',
                border: selectedMode === 'rent' ? 'none' : '1px solid #ffedd5',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <RefreshCw size={13} />
              Flexible Rental
            </button>
            <button
              type="button"
              onClick={() => setSelectedMode('buy')}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: '0.8125rem',
                fontWeight: 700,
                background: selectedMode === 'buy' ? '#16453A' : '#eaedff',
                color: selectedMode === 'buy' ? '#ffffff' : '#16453A',
                border: selectedMode === 'buy' ? 'none' : '1px solid #d0e1fd',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <ShoppingBag size={13} />
              Buy Outright
            </button>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SlidersHorizontal size={14} color="#6e7977" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                padding: '6px 10px',
                borderRadius: 8,
                border: '1px solid #dae2fd',
                background: '#ffffff',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#131b2e',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="popular">Most Popular</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Row 2: Category Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.75rem', borderTop: '1px solid #eaedff' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6e7977', marginRight: '0.25rem' }}>
            Category:
          </span>
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              fontSize: '0.75rem',
              fontWeight: 700,
              background: selectedCategory === 'all' ? '#0C2E27' : '#f2f3ff',
              color: selectedCategory === 'all' ? '#ffffff' : '#3e4947',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: '0.75rem',
                fontWeight: 600,
                background: selectedCategory === cat.id ? '#16453A' : '#f2f3ff',
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
        {isCatalogLoading ? (
          <div style={{ fontSize: '0.9375rem', color: '#6e7977', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16453A', display: 'inline-block' }} />
            Loading certified medical equipment catalog...
          </div>
        ) : (
          <div style={{ fontSize: '0.9375rem', color: '#3e4947', fontWeight: 600 }}>
            Showing <strong>{products.length}</strong> of <strong>{total}</strong> medical equipment units
            {searchQuery ? ` matching "${searchQuery}"` : ''}
          </div>
        )}
      </div>

      {/* Products Grid / States */}
      {isCatalogLoading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : productsError ? (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 1.5rem',
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #fee2e2',
          }}
        >
          <AlertCircle size={40} color="#dc2626" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ color: '#991b1b' }}>Failed to load equipment catalog</h3>
          <p style={{ color: '#6e7977', marginTop: 8 }}>{productsError}</p>
          <button
            type="button"
            onClick={() => {
              setHasFetched(false);
              dispatch(
                listProducts({
                  category: selectedCategory !== 'all' ? selectedCategory : undefined,
                  mode: selectedMode,
                  sort: sortBy,
                  search: searchQuery.trim() || undefined,
                  page: currentPage,
                  limit: pageSize,
                })
              ).finally(() => setHasFetched(true));
            }}
            style={{
              marginTop: 16,
              background: '#16453A',
              color: '#ffffff',
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Retry Loading
          </button>
        </div>
      ) : products.length > 0 ? (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div style={{ marginTop: '2.5rem' }}>
            <PaginationControl
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={total}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              }}
              isLoading={productsLoading}
            />
          </div>
        </>
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
          <ShoppingBag size={42} color="#6e7977" style={{ margin: '0 auto 12px' }} />
          <h3>No medical equipment matches your criteria.</h3>
          <p style={{ color: '#6e7977', marginTop: 8 }}>
            Try resetting your filters or call our helpline for custom medical procurement.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSelectedMode('all');
              setCurrentPage(1);
            }}
            style={{
              marginTop: 16,
              background: '#16453A',
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
