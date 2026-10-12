'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  PlusCircle,
  Search,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  ExternalLink,
  Pencil,
  Boxes,
  X,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { listProducts } from '@/features/products/list-products/list-products.action';
import { listCategories } from '@/features/categories/list-categories/list-categories.action';
import { deleteProduct, updateProduct } from '@/features/products/products.slice';
import { showToast } from '@/features/ui/ui.slice';
import { axiosInterceptorInstanceClient, extractApiErrorMessage } from '@/config/axios';
import { Product } from '@/domain/entities/product.entity';
import { stockFormSchema, StockFormValues } from '@/features/products/product-form.schema';
import { getProductImageUrl } from '@/utils/image';
import { PaginationControl } from '@/components/common/PaginationControl';

// Quick Stock Update Modal Component
function StockEditModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StockFormValues>({
    resolver: zodResolver(stockFormSchema),
    defaultValues: {
      stock: product.stock ?? 0,
    },
  });

  const currentStockVal = watch('stock') ?? 0;

  const handleAdjust = (delta: number) => {
    const nextVal = Math.max(0, Number(currentStockVal) + delta);
    setValue('stock', nextVal, { shouldValidate: true });
  };

  const onSubmit = async (values: StockFormValues) => {
    setSubmitting(true);
    try {
      const newStock = Number(values.stock);
      await axiosInterceptorInstanceClient.patch(`/products/${product.id}`, {
        stock_quantity: newStock,
      });

      dispatch(
        updateProduct({
          ...product,
          stock: newStock,
        })
      );

      dispatch(
        showToast({
          type: 'success',
          message: `Inventory stock for "${product.name}" updated to ${newStock} units.`,
        })
      );
      onClose();
    } catch (err: any) {
      const msg = extractApiErrorMessage(err, 'Failed to update stock quantity');
      dispatch(showToast({ type: 'error', message: msg }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(19, 27, 46, 0.45)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          width: '100%',
          maxWidth: 460,
          border: '1px solid #dae2fd',
          boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #f2f3ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: '#e8f5f3',
                color: '#16453A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Boxes size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#131b2e' }}>
                Update Inventory Stock
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#6e7977' }}>
                SKU: {product.slug || product.id}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#6e7977',
              cursor: 'pointer',
              padding: 4,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '1.5rem' }}>
          {/* Product Summary */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 14px',
              borderRadius: 10,
              background: '#f8f9ff',
              border: '1px solid #e2e7ff',
              marginBottom: '1.25rem',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 8,
                position: 'relative',
                overflow: 'hidden',
                background: '#ffffff',
                border: '1px solid #dae2fd',
                flexShrink: 0,
              }}
            >
              <Image
                src={getProductImageUrl(product.primaryImage || product.images?.[0])}
                alt={product.name}
                fill
                unoptimized
                sizes="44px"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: '#131b2e',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {product.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6e7977' }}>
                Current Level:{' '}
                <strong style={{ color: product.stock > 5 ? '#16453A' : '#ba1a1a' }}>
                  {product.stock} units
                </strong>
              </div>
            </div>
          </div>

          {/* New Stock Field with Stepper Buttons */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: '#3e4947',
                marginBottom: 8,
              }}
            >
              Adjust Available Stock Quantity *
            </label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="number"
                {...register('stock')}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: `1.5px solid ${errors.stock ? '#ba1a1a' : '#16453A'}`,
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: '#131b2e',
                  outline: 'none',
                  textAlign: 'center',
                }}
              />
            </div>
            {errors.stock && (
              <span style={{ color: '#ba1a1a', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>
                {errors.stock.message}
              </span>
            )}

            {/* Quick Adjust Buttons */}
            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
              {[-10, -5, -1, 1, 5, 10].map((delta) => (
                <button
                  key={delta}
                  type="button"
                  onClick={() => handleAdjust(delta)}
                  style={{
                    flex: 1,
                    padding: '6px 0',
                    borderRadius: 6,
                    border: '1px solid #dae2fd',
                    background: delta > 0 ? '#e8f5f3' : '#fff0ee',
                    color: delta > 0 ? '#16453A' : '#ba1a1a',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {delta > 0 ? `+${delta}` : delta}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Status Indicator */}
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              background:
                Number(currentStockVal) > 5
                  ? '#eaf8f6'
                  : Number(currentStockVal) > 0
                  ? '#fff8ec'
                  : '#fdf2f2',
              border: `1px solid ${
                Number(currentStockVal) > 5
                  ? '#a3faef'
                  : Number(currentStockVal) > 0
                  ? '#ffe2a4'
                  : '#fecaca'
              }`,
              color:
                Number(currentStockVal) > 5
                  ? '#16453A'
                  : Number(currentStockVal) > 0
                  ? '#b45309'
                  : '#b91c1c',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: '1.5rem',
            }}
          >
            {Number(currentStockVal) > 5 ? (
              <>
                <CheckCircle2 size={16} />
                <span>Healthy stock level (Ready for immediate purchase &amp; rental dispatch)</span>
              </>
            ) : Number(currentStockVal) > 0 ? (
              <>
                <AlertTriangle size={16} />
                <span>Low stock warning (Consider restocking soon)</span>
              </>
            ) : (
              <>
                <AlertCircle size={16} />
                <span>Out of stock (Product will be marked unavailable for ordering)</span>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 18px',
                borderRadius: 8,
                background: '#f2f3ff',
                color: '#3e4947',
                fontSize: '0.8125rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '9px 20px',
                borderRadius: 8,
                background: submitting ? '#6e7977' : '#16453A',
                color: '#ffffff',
                fontSize: '0.8125rem',
                fontWeight: 700,
                border: 'none',
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
            >
              {submitting ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <span>Save Stock</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminProductsPage() {
  const dispatch = useAppDispatch();
  const { products, loading, total, totalPages } = useAppSelector((state) => state.products);
  const categories = useAppSelector((state) => state.categories.categories);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Quick Stock Editing Modal
  const [editingStockProduct, setEditingStockProduct] = useState<Product | null>(null);

  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(
        listProducts({
          page: currentPage,
          limit: pageSize,
          search: searchQuery.trim() || undefined,
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
        })
      );
    }, 200);
    return () => clearTimeout(timer);
  }, [dispatch, currentPage, pageSize, searchQuery, selectedCategory]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from the active medical catalog?`)) {
      try {
        await axiosInterceptorInstanceClient.delete(`/products/${id}`);
        dispatch(deleteProduct(id));
        dispatch(showToast({ type: 'success', message: `Product "${name}" removed from catalog.` }));
      } catch (err: any) {
        const msg = extractApiErrorMessage(err, 'Failed to delete product from database');
        dispatch(showToast({ type: 'error', message: msg }));
      }
    }
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', paddingBottom: '3rem' }}>
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
            Product Catalog
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6e7977', margin: '4px 0 0' }}>
            Manage medical equipment &amp; supplies with dual buy/rent pricing, inventory stock, and bilingual content.
          </p>
        </div>

        {/* Unified "Add New Product" Action */}
        <Link
          href="/admin/products/new"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            borderRadius: 10,
            background: '#16453A',
            color: '#ffffff',
            fontSize: '0.875rem',
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(0,92,85,0.25)',
          }}
        >
          <PlusCircle size={18} />
          <span>Add New Product</span>
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
            placeholder="Search by product name, brand, or SKU..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
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

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[{ id: 'all', name: 'All Categories' }, ...categories].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategorySelect(cat.id)}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                border: selectedCategory === cat.id ? '1px solid #16453A' : '1px solid #dae2fd',
                background: selectedCategory === cat.id ? '#e8f5f3' : '#ffffff',
                color: selectedCategory === cat.id ? '#16453A' : '#3e4947',
                fontSize: '0.8125rem',
                fontWeight: selectedCategory === cat.id ? 700 : 500,
                cursor: 'pointer',
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table Card */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          border: '1px solid #e2e7ff',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        }}
      >
        {/* Scrollable Table Viewport with Sticky Header */}
        <div
          className="custom-scrollbar"
          style={{
            overflowX: 'auto',
            overflowY: 'auto',
            maxHeight: 'calc(100vh - 310px)',
            minHeight: 380,
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 920 }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr style={{ background: '#f8f9ff' }}>
                <th style={{ position: 'sticky', top: 0, background: '#f8f9ff', zIndex: 10, padding: '12px 16px', fontSize: '0.75rem', fontWeight: 800, color: '#6e7977', textTransform: 'uppercase', boxShadow: 'inset 0 -1px 0 #e2e7ff' }}>
                  Product
                </th>
                <th style={{ position: 'sticky', top: 0, background: '#f8f9ff', zIndex: 10, padding: '12px 16px', fontSize: '0.75rem', fontWeight: 800, color: '#6e7977', textTransform: 'uppercase', boxShadow: 'inset 0 -1px 0 #e2e7ff' }}>
                  Category &amp; Brand
                </th>
                <th style={{ position: 'sticky', top: 0, background: '#f8f9ff', zIndex: 10, padding: '12px 16px', fontSize: '0.75rem', fontWeight: 800, color: '#6e7977', textTransform: 'uppercase', boxShadow: 'inset 0 -1px 0 #e2e7ff' }}>
                  Buy Price
                </th>
                <th style={{ position: 'sticky', top: 0, background: '#f8f9ff', zIndex: 10, padding: '12px 16px', fontSize: '0.75rem', fontWeight: 800, color: '#6e7977', textTransform: 'uppercase', boxShadow: 'inset 0 -1px 0 #e2e7ff' }}>
                  Daily Rent / Deposit
                </th>
                <th style={{ position: 'sticky', top: 0, background: '#f8f9ff', zIndex: 10, padding: '12px 16px', fontSize: '0.75rem', fontWeight: 800, color: '#6e7977', textTransform: 'uppercase', boxShadow: 'inset 0 -1px 0 #e2e7ff' }}>
                  Inventory Stock
                </th>
                <th style={{ position: 'sticky', top: 0, background: '#f8f9ff', zIndex: 10, padding: '12px 16px', fontSize: '0.75rem', fontWeight: 800, color: '#6e7977', textTransform: 'uppercase', boxShadow: 'inset 0 -1px 0 #e2e7ff' }}>
                  Hindi Translation
                </th>
                <th style={{ position: 'sticky', top: 0, background: '#f8f9ff', zIndex: 10, padding: '12px 16px', fontSize: '0.75rem', fontWeight: 800, color: '#6e7977', textTransform: 'uppercase', textAlign: 'right', boxShadow: 'inset 0 -1px 0 #e2e7ff' }}>
                  Actions
                </th>
              </tr>
            </thead>
          <tbody>
            {loading && products.length === 0 ? (
              [1, 2, 3, 4].map((n) => (
                <tr key={n} style={{ borderBottom: '1px solid #f2f3ff' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 8, background: '#f1f5f9' }} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ width: 140, height: 16, borderRadius: 4, background: '#f1f5f9' }} />
                        <div style={{ width: 80, height: 12, borderRadius: 4, background: '#f1f5f9' }} />
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ width: 90, height: 16, borderRadius: 4, background: '#f1f5f9' }} />
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ width: 70, height: 16, borderRadius: 4, background: '#f1f5f9' }} />
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ width: 80, height: 16, borderRadius: 4, background: '#f1f5f9' }} />
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ width: 50, height: 16, borderRadius: 4, background: '#f1f5f9' }} />
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ width: 60, height: 20, borderRadius: 999, background: '#f1f5f9' }} />
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f1f5f9' }} />
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f1f5f9' }} />
                    </div>
                  </td>
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '2.5rem', textAlign: 'center', color: '#6e7977' }}>
                  No product catalog records found matching the query.
                </td>
              </tr>
            ) : (
              products.map((p) => {
                const hasHindi = Boolean(p.translations?.hi);
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f2f3ff', transition: 'background 0.1s ease' }}>
                    {/* Product Thumbnail + Title */}
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
                            src={getProductImageUrl(p.images?.[0] || p.primaryImage)}
                            alt={p.name}
                            fill
                            unoptimized
                            sizes="48px"
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <div>
                          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#131b2e', display: 'block' }}>
                            {p.name}
                          </span>
                          <span style={{ fontSize: '0.6875rem', color: '#6e7977' }}>
                            SKU: {p.slug || p.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category & Brand */}
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#131b2e', display: 'block' }}>
                        {p.brand || 'Omkar Healthcare'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#B75932', background: '#eaedff', padding: '2px 6px', borderRadius: 4 }}>
                        {p.categoryName || p.categoryId}
                      </span>
                    </td>

                    {/* Buy Price */}
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#16453A' }}>
                        ₹{p.buyPrice?.toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Daily Rent & Deposit */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#B75932' }}>
                        ₹{p.rentalDailyRate}/day
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: '#6e7977' }}>
                        +₹{p.rentalSecurityDeposit?.toLocaleString('en-IN')} deposit
                      </div>
                    </td>

                    {/* Interactive Stock Column */}
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        type="button"
                        onClick={() => setEditingStockProduct(p)}
                        title="Click to quickly update stock level"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: 6,
                          background: p.stock > 5 ? '#e8f5f3' : p.stock > 0 ? '#fff4eb' : '#fdf2f2',
                          color: p.stock > 5 ? '#16453A' : p.stock > 0 ? '#913200' : '#ba1a1a',
                          border: '1px solid transparent',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <Boxes size={13} />
                        <span>{p.stock} units</span>
                      </button>
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
                            color: '#16453A',
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

                    {/* Actions Column */}
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        {/* Edit Stock Quick Action */}
                        <button
                          type="button"
                          onClick={() => setEditingStockProduct(p)}
                          title="Quick update stock inventory"
                          style={{
                            padding: 6,
                            borderRadius: 6,
                            background: '#e8f5f3',
                            color: '#16453A',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Boxes size={15} />
                        </button>

                        {/* Edit Product Full Action */}
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          title="Edit full product details"
                          style={{
                            padding: 6,
                            borderRadius: 6,
                            background: '#eef2ff',
                            color: '#4338ca',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textDecoration: 'none',
                          }}
                        >
                          <Pencil size={15} />
                        </Link>

                        {/* View on Storefront */}
                        <Link
                          href={`/product/${p.slug}`}
                          target="_blank"
                          title="View on Customer Storefront"
                          style={{
                            padding: 6,
                            borderRadius: 6,
                            background: '#f2f3ff',
                            color: '#B75932',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <ExternalLink size={15} />
                        </Link>

                        {/* Delete Action */}
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
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Backend-Driven Pagination Controls Bar */}
      <div style={{ borderTop: '1px solid #e2e7ff', background: '#fafbff' }}>
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages || 1}
          totalItems={total || 0}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
          isLoading={loading}
        />
      </div>
    </div>

      {/* Quick Stock Modal */}
      {editingStockProduct && (
        <StockEditModal
          product={editingStockProduct}
          onClose={() => setEditingStockProduct(null)}
        />
      )}
    </div>
  );
}
