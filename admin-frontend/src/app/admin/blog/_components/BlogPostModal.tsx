'use client';

import React from 'react';
import { BlogPost } from '@/domain/entities/blog.entity';
import { CheckCircle2, Save, X } from 'lucide-react';

interface BlogPostModalProps {
  isOpen: boolean;
  isCreatingNew: boolean;
  formData: BlogPost | null;
  setFormData: React.Dispatch<React.SetStateAction<BlogPost | null>>;
  editTab: 'en' | 'hi';
  setEditTab: (tab: 'en' | 'hi') => void;
  saveSuccess: boolean;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
}

export function BlogPostModal({
  isOpen,
  isCreatingNew,
  formData,
  setFormData,
  editTab,
  setEditTab,
  saveSuccess,
  onClose,
  onSave,
}: BlogPostModalProps) {
  if (!isOpen || !formData) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.6)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 24,
          width: '100%',
          maxWidth: 960,
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.5rem 2rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            background: '#ffffff',
            zIndex: 10,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {isCreatingNew ? 'Create New Clinical Article' : `Edit: ${formData.title}`}
              </h2>
              <span
                style={{
                  background: formData.status === 'published' ? '#dcfce7' : '#f1f5f9',
                  color: formData.status === 'published' ? '#15803d' : '#64748b',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 6,
                }}
              >
                {formData.status === 'published' ? 'Storefront Published' : 'Draft'}
              </span>
            </div>
            <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
              Slug: <code>/blog/{formData.slug || 'auto-generated'}</code>
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: 6,
              borderRadius: 8,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Language Switcher Tabs */}
        <div
          style={{
            padding: '0.75rem 2rem',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginRight: 8 }}>
            Editing Language:
          </span>
          <button
            type="button"
            onClick={() => setEditTab('en')}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: '0.8125rem',
              fontWeight: 700,
              border: '1px solid',
              borderColor: editTab === 'en' ? '#16453A' : '#cbd5e1',
              background: editTab === 'en' ? '#16453A' : '#ffffff',
              color: editTab === 'en' ? '#ffffff' : '#475569',
              cursor: 'pointer',
            }}
          >
            English (Original)
          </button>
          <button
            type="button"
            onClick={() => setEditTab('hi')}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: '0.8125rem',
              fontWeight: 700,
              border: '1px solid',
              borderColor: editTab === 'hi' ? '#16453A' : '#cbd5e1',
              background: editTab === 'hi' ? '#16453A' : '#ffffff',
              color: editTab === 'hi' ? '#ffffff' : '#475569',
              cursor: 'pointer',
            }}
          >
            हिन्दी (Hindi Translation)
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSave} style={{ padding: '2rem' }}>
          {saveSuccess && (
            <div
              style={{
                background: '#dcfce7',
                border: '1px solid #86efac',
                color: '#15803d',
                padding: '12px 18px',
                borderRadius: 12,
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              <CheckCircle2 size={18} />
              Article saved successfully and live on the Caregiver Hub!
            </div>
          )}

          {/* Title & Slug */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                Article Title ({editTab.toUpperCase()})
              </label>
              <input
                type="text"
                required
                value={
                  editTab === 'en'
                    ? formData.title
                    : formData.translations?.hi?.title || ''
                }
                onChange={(e) => {
                  if (editTab === 'en') {
                    setFormData({ ...formData, title: e.target.value });
                  } else {
                    const trHi = formData.translations?.hi || {
                      locale: 'hi',
                      title: '',
                      summary: '',
                      body: '',
                    };
                    setFormData({
                      ...formData,
                      translations: {
                        ...formData.translations,
                        hi: { ...trHi, title: e.target.value },
                      },
                    });
                  }
                }}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9375rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                Slug (URL Identifier)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. home-icu-setup-protocol"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9375rem',
                }}
              />
            </div>
          </div>

          {/* Metadata row (Author, Category, Tag, Status) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                Author Name
              </label>
              <input
                type="text"
                value={formData.authorName || ''}
                onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                Category
              </label>
              <input
                type="text"
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                Equipment Tag
              </label>
              <input
                type="text"
                value={formData.equipmentTag || ''}
                onChange={(e) => setFormData({ ...formData, equipmentTag: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  fontSize: '0.875rem',
                  background: '#ffffff',
                }}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Cover Image & Read Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                Cover Image URL / Path
              </label>
              <input
                type="text"
                value={formData.coverImage || ''}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                placeholder="/images/oxygen_concentrator.png"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                Read Time Text
              </label>
              <input
                type="text"
                value={formData.readTime || ''}
                onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                placeholder="e.g. 5 min read"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  fontSize: '0.875rem',
                }}
              />
            </div>
          </div>

          {/* Excerpt / Summary */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
              Article Summary / Excerpt ({editTab.toUpperCase()})
            </label>
            <textarea
              rows={3}
              value={
                editTab === 'en'
                  ? formData.summary || ''
                  : formData.translations?.hi?.summary || ''
              }
              onChange={(e) => {
                if (editTab === 'en') {
                  setFormData({ ...formData, summary: e.target.value });
                } else {
                  const trHi = formData.translations?.hi || {
                    locale: 'hi',
                    title: '',
                    summary: '',
                    body: '',
                  };
                  setFormData({
                    ...formData,
                    translations: {
                      ...formData.translations,
                      hi: { ...trHi, summary: e.target.value },
                    },
                  });
                }
              }}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid #cbd5e1',
                fontSize: '0.875rem',
              }}
            />
          </div>

          {/* Body Content */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
              Full Article Body ({editTab.toUpperCase()}) &bull; Supports Markdown
            </label>
            <textarea
              rows={10}
              required={editTab === 'en'}
              value={
                editTab === 'en'
                  ? formData.body || ''
                  : formData.translations?.hi?.body || ''
              }
              onChange={(e) => {
                if (editTab === 'en') {
                  setFormData({ ...formData, body: e.target.value });
                } else {
                  const trHi = formData.translations?.hi || {
                    locale: 'hi',
                    title: '',
                    summary: '',
                    body: '',
                  };
                  setFormData({
                    ...formData,
                    translations: {
                      ...formData.translations,
                      hi: { ...trHi, body: e.target.value },
                    },
                  });
                }
              }}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 10,
                border: '1px solid #cbd5e1',
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                lineHeight: 1.5,
              }}
            />
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 12,
              paddingTop: '1.5rem',
              borderTop: '1px solid #e2e8f0',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 18px',
                borderRadius: 10,
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#475569',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 22px',
                borderRadius: 10,
                background: '#16453A',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Save size={16} />
              <span>{isCreatingNew ? 'Publish Article' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
