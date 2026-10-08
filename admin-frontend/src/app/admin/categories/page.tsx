'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Category } from '@/domain/entities/category.entity';
import { listCategories } from '@/features/categories/list-categories/list-categories.action';
import { listProducts } from '@/features/products/list-products/list-products.action';
import { addCategory, updateCategory, deleteCategory } from '@/features/categories/categories.slice';
import { axiosInterceptorInstanceClient } from '@/config/axios';
import {
  FolderTree,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  ChevronRight,
  Package,
  Layers,
  Sparkles,
  Search,
} from 'lucide-react';

export default function AdminCategoriesPage() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.categories);
  const loading = useAppSelector((state) => state.categories.loading);
  const products = useAppSelector((state) => state.products.products);

  useEffect(() => {
    dispatch(listCategories());
    dispatch(listProducts());
  }, [dispatch]);

  const [searchQuery, setSearchQuery] = useState('');
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    parentId: '',
    description: '',
    displayOrder: 1,
    isActive: true,
  });

  const rootCategories = categories.filter((c) => !c.parentId);
  const subCategories = categories.filter((c) => Boolean(c.parentId));

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const openCreateModal = (parent?: Category) => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      parentId: parent ? parent.id : '',
      description: '',
      displayOrder: categories.length + 1,
      isActive: true,
    });
    setModalMode('create');
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      parentId: cat.parentId || '',
      description: cat.description || '',
      displayOrder: cat.displayOrder || 1,
      isActive: cat.isActive !== false,
    });
    setModalMode('edit');
  };

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setFormData({ ...formData, name, slug: formData.slug && modalMode === 'edit' ? formData.slug : slug });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) return;

    try {
      if (modalMode === 'create') {
        const payload = {
          name: formData.name.trim(),
          slug: formData.slug.trim(),
          description: formData.description.trim(),
          parent_id: formData.parentId ? Number(formData.parentId) : null,
          display_order: Number(formData.displayOrder),
          is_active: formData.isActive,
        };
        const res = await axiosInterceptorInstanceClient.post('/categories', payload);
        const saved = res.data?.data;
        const newCat: Category = {
          id: String(saved?.id || saved?.uuid || `cat-${Date.now()}`),
          name: formData.name.trim(),
          slug: formData.slug.trim(),
          parentId: formData.parentId ? formData.parentId : null,
          description: formData.description.trim(),
          displayOrder: Number(formData.displayOrder),
          isActive: formData.isActive,
        };
        dispatch(addCategory(newCat));
        showToast(`Category "${newCat.name}" successfully created.`);
      } else if (modalMode === 'edit' && editingCategory) {
        const payload = {
          name: formData.name.trim(),
          slug: formData.slug.trim(),
          description: formData.description.trim(),
          parent_id: formData.parentId ? Number(formData.parentId) : null,
          display_order: Number(formData.displayOrder),
          is_active: formData.isActive,
        };
        await axiosInterceptorInstanceClient.patch(`/categories/${editingCategory.id}`, payload);
        const updatedCat: Category = {
          ...editingCategory,
          name: formData.name.trim(),
          slug: formData.slug.trim(),
          parentId: formData.parentId ? formData.parentId : null,
          description: formData.description.trim(),
          displayOrder: Number(formData.displayOrder),
          isActive: formData.isActive,
        };
        dispatch(updateCategory(updatedCat));
        showToast(`Category "${updatedCat.name}" updated successfully.`);
      }
      setModalMode(null);
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Failed to save category');
    }
  };

  const handleDelete = async (cat: Category) => {
    if (confirm(`Are you sure you want to delete category "${cat.name}" and any subcategories?`)) {
      try {
        await axiosInterceptorInstanceClient.delete(`/categories/${cat.id}`);
        dispatch(deleteCategory(cat.id));
        showToast(`Category "${cat.name}" deleted.`);
      } catch (err: any) {
        alert(err?.response?.data?.message || err?.message || 'Failed to delete category');
      }
    }
  };

  // Helper to count products mapped to category
  const getProductCount = (categorySlug: string) => {
    return products.filter((p) => p.categoryId === categorySlug || p.categoryId?.includes(categorySlug)).length;
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9999,
            background: '#005c55',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: 12,
            boxShadow: '0 8px 24px rgba(0, 92, 85, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: '0.875rem',
            fontWeight: 700,
          }}
        >
          <CheckCircle2 size={18} color="#9cf2e8" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#131b2e', margin: '0 0 6px' }}>
            Category Taxonomy & Hierarchy
          </h1>
          <p style={{ color: '#6e7977', fontSize: '0.875rem', margin: 0 }}>
            Dynamic parent-child categories for medical equipment without code changes (PRD §6.5, §7.8).
          </p>
        </div>

        <button
          type="button"
          onClick={() => openCreateModal()}
          style={{
            background: '#005c55',
            color: '#ffffff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: 10,
            fontSize: '0.875rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 14px rgba(0, 92, 85, 0.25)',
          }}
        >
          <PlusCircle size={18} />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 16, border: '1px solid #dae2fd' }}>
          <div style={{ fontSize: '0.8125rem', color: '#6e7977', fontWeight: 600 }}>Total Categories</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#131b2e', marginTop: 4 }}>
            {categories.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#005c55', fontWeight: 600, marginTop: 4 }}>
            Active in catalog tree
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 16, border: '1px solid #dae2fd' }}>
          <div style={{ fontSize: '0.8125rem', color: '#6e7977', fontWeight: 600 }}>Root Classifications</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#006398', marginTop: 4 }}>
            {rootCategories.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6e7977', marginTop: 4 }}>
            Top-level navigation hubs
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 16, border: '1px solid #dae2fd' }}>
          <div style={{ fontSize: '0.8125rem', color: '#6e7977', fontWeight: 600 }}>Subcategories</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ea580c', marginTop: 4 }}>
            {subCategories.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6e7977', marginTop: 4 }}>
            Specialized equipment sub-trees
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 16, border: '1px solid #dae2fd' }}>
          <div style={{ fontSize: '0.8125rem', color: '#6e7977', fontWeight: 600 }}>Classified Products</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#005c55', marginTop: 4 }}>
            {products.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#005c55', fontWeight: 600, marginTop: 4 }}>
            100% Taxonomically Mapped
          </div>
        </div>
      </div>

      {/* Category Tree Table */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          border: '1px solid #dae2fd',
          overflow: 'hidden',
          boxShadow: '0 2px 10px rgba(19, 27, 46, 0.04)',
        }}
      >
        {/* Table Search & Filter Bar */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #eaedff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ position: 'relative', width: 320 }}>
            <Search
              size={16}
              color="#6e7977"
              style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search category by name or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: 8,
                border: '1px solid #dae2fd',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ fontSize: '0.8125rem', color: '#6e7977' }}>
            Showing <strong>{filteredCategories.length}</strong> categories
          </div>
        </div>

        {/* Categories List View */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {loading && categories.length === 0 ? (
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  style={{
                    height: 56,
                    background: '#f8fafc',
                    borderRadius: 10,
                    border: '1px solid #eaedff',
                  }}
                />
              ))}
            </div>
          ) : rootCategories.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#6e7977' }}>
              No categories found. Create a root category to start organizing inventory.
            </div>
          ) : (
            rootCategories.map((root) => {
            const children = categories.filter((c) => c.parentId === root.id);
            const productCount = getProductCount(root.slug);

            return (
              <div key={root.id} style={{ borderBottom: '1px solid #eaedff' }}>
                {/* Root Category Row */}
                <div
                  style={{
                    padding: '1rem 1.5rem',
                    background: '#faf8ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <FolderTree size={20} color="#005c55" />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <strong style={{ fontSize: '0.9375rem', color: '#131b2e' }}>{root.name}</strong>
                        <span
                          style={{
                            background: '#005c55',
                            color: '#ffffff',
                            fontSize: '0.6875rem',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: 9999,
                            textTransform: 'uppercase',
                          }}
                        >
                          Root
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6e7977', marginTop: 2 }}>
                        Slug: <code>{root.slug}</code> • {root.description || 'Clinical root taxonomy'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span
                      style={{
                        background: '#eaf8f6',
                        color: '#005c55',
                        padding: '4px 10px',
                        borderRadius: 6,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      {children.length} subcategories
                    </span>

                    <button
                      type="button"
                      onClick={() => openCreateModal(root)}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #dae2fd',
                        color: '#005c55',
                        padding: '6px 12px',
                        borderRadius: 6,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <PlusCircle size={13} /> Subcategory
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditModal(root)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#6e7977',
                        cursor: 'pointer',
                        padding: 4,
                      }}
                      title="Edit Category"
                    >
                      <Edit2 size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(root)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ba1a1a',
                        cursor: 'pointer',
                        padding: 4,
                      }}
                      title="Delete Category"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Subcategories (Indented) */}
                {children.map((child) => (
                  <div
                    key={child.id}
                    style={{
                      padding: '0.875rem 1.5rem 0.875rem 3.5rem',
                      background: '#ffffff',
                      borderTop: '1px solid #f2f3ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <ChevronRight size={16} color="#bdc9c6" />
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#131b2e' }}>
                          {child.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6e7977', marginTop: 1 }}>
                          Slug: <code>{child.slug}</code> • {child.description || 'Specialized subcategory'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <button
                        type="button"
                        onClick={() => openEditModal(child)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#6e7977',
                          cursor: 'pointer',
                          padding: 4,
                        }}
                        title="Edit Subcategory"
                      >
                        <Edit2 size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(child)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ba1a1a',
                          cursor: 'pointer',
                          padding: 4,
                        }}
                        title="Delete Subcategory"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          }))}
        </div>
      </div>

      {/* CREATE / EDIT CATEGORY MODAL */}
      {modalMode && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(19, 27, 46, 0.5)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 20,
              width: '100%',
              maxWidth: 520,
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #eaedff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#131b2e', margin: 0 }}>
                {modalMode === 'create' ? 'Add New Category' : 'Edit Category'}
              </h3>
              <button
                type="button"
                onClick={() => setModalMode(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6e7977' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 4 }}>
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CPAP & BiPAP Masks"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #dae2fd',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 4 }}>
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. cpap-bipap-masks"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #dae2fd',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 4 }}>
                  Parent Classification (Optional)
                </label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #dae2fd',
                    fontSize: '0.875rem',
                    outline: 'none',
                    background: '#ffffff',
                  }}
                >
                  <option value="">-- None (Top Level Root Category) --</option>
                  {rootCategories.map((root) => (
                    <option key={root.id} value={root.id}>
                      {root.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 4 }}>
                  Clinical Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Clinical purpose and equipment scope..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #dae2fd',
                    fontSize: '0.875rem',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div
                style={{
                  paddingTop: '1rem',
                  borderTop: '1px solid #eaedff',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 12,
                }}
              >
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  style={{
                    background: 'none',
                    border: '1px solid #dae2fd',
                    padding: '10px 18px',
                    borderRadius: 8,
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: '#6e7977',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#005c55',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 22px',
                    borderRadius: 8,
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0, 92, 85, 0.25)',
                  }}
                >
                  {modalMode === 'create' ? 'Create Category' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
