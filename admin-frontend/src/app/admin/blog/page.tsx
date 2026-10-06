'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { BlogPost } from '@/domain/entities/blog.entity';
import {
  addPost,
  updatePost,
  togglePostStatus,
  deletePost,
} from '@/features/blog/blog.slice';
import {
  BookOpen,
  Plus,
  ExternalLink,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Globe2,
  Tag,
  Clock,
  Trash2,
  Save,
  X,
  FileText,
  Search,
  Filter,
  Eye,
  Sparkles,
} from 'lucide-react';

export default function AdminBlogPage() {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.blog.posts);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Modal State
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [editTab, setEditTab] = useState<'en' | 'hi'>('en');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState<BlogPost | null>(null);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.summary && post.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.authorName && post.authorName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Metrics
  const totalArticles = posts.length;
  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const translatedCount = posts.filter((p) => p.hasHindiTranslation || p.translations?.hi?.title).length;
  const translationRate = totalArticles > 0 ? Math.round((translatedCount / totalArticles) * 100) : 100;
  const totalReadMinutes = posts.reduce((acc, p) => acc + (p.readTimeMinutes || 5), 0);

  const openEditModal = (post: BlogPost) => {
    setSelectedPost(post);
    setIsCreatingNew(false);
    setFormData(JSON.parse(JSON.stringify(post)));
    setEditTab('en');
    setSaveSuccess(false);
  };

  const openCreateModal = () => {
    const newPost: BlogPost = {
      id: Date.now(),
      title: '',
      slug: '',
      summary: '',
      body: '',
      coverImage: '/images/caregiver.png',
      authorName: 'AarogyaMed Biomedical Team',
      status: 'published',
      category: 'Home Healthcare Protocol',
      equipmentTag: 'Clinical Equipment',
      readTime: '5 min read',
      readTimeMinutes: 5,
      hasHindiTranslation: false,
      translations: {
        hi: {
          locale: 'hi',
          title: '',
          summary: '',
          body: '',
        },
      },
    };
    setSelectedPost(newPost);
    setIsCreatingNew(true);
    setFormData(newPost);
    setEditTab('en');
    setSaveSuccess(false);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setFormData(null);
    setIsCreatingNew(false);
    setSaveSuccess(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !formData.title.trim()) return;

    // Auto slug if empty
    const slug =
      formData.slug.trim() ||
      formData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const hasHi = Boolean(
      formData.translations?.hi?.title && formData.translations?.hi?.title.trim().length > 0
    );

    const postToSave: BlogPost = {
      ...formData,
      slug,
      hasHindiTranslation: hasHi,
      publishedAt: formData.status === 'published' ? formData.publishedAt || new Date().toISOString() : undefined,
    };

    if (isCreatingNew) {
      dispatch(addPost(postToSave));
    } else {
      dispatch(updatePost(postToSave));
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      closeModal();
    }, 1200);
  };

  const handleToggleStatus = (post: BlogPost) => {
    const nextStatus = post.status === 'published' ? 'draft' : 'published';
    dispatch(togglePostStatus({ id: post.id, status: nextStatus }));
  };

  const handleDelete = (id: number | string) => {
    if (confirm('Are you sure you want to permanently delete this clinical article?')) {
      dispatch(deletePost(id));
    }
  };

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#131b2e', margin: 0 }}>
            Clinical Knowledge Hub &amp; Blog CMS
          </h1>
          <p style={{ color: '#52605d', fontSize: '0.9375rem', margin: '4px 0 0' }}>
            Biomedical articles, caregiver equipment protocols, and bilingual healthcare guides.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            borderRadius: 10,
            background: '#005c55',
            color: '#ffffff',
            border: 'none',
            fontSize: '0.875rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,92,85,0.25)',
          }}
        >
          <Plus size={18} />
          <span>New Clinical Article</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#6e7977' }}>Total Articles</span>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#eaf8f6', color: '#005c55', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#131b2e' }}>{totalArticles}</div>
          <span style={{ fontSize: '0.75rem', color: '#005c55', fontWeight: 600 }}>Clinical Guides Published</span>
        </div>

        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#6e7977' }}>Live on Storefront</span>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Eye size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#131b2e' }}>{publishedCount}</div>
          <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>
            {totalArticles - publishedCount} in Draft Status
          </span>
        </div>

        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#6e7977' }}>Hindi Translation Rate</span>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#131b2e' }}>{translationRate}%</div>
          <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600 }}>
            {translatedCount} of {totalArticles} Bilingual
          </span>
        </div>

        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#6e7977' }}>Total Clinical Reading</span>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#faf5ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#131b2e' }}>{totalReadMinutes} min</div>
          <span style={{ fontSize: '0.75rem', color: '#7c3aed', fontWeight: 600 }}>Comprehensive Library</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: '1rem 1.5rem',
          border: '1px solid #e2e8f0',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 260 }}>
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search articles by title, author, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              fontSize: '0.9375rem',
              width: '100%',
              color: '#0f172a',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#64748b' }}>Filter:</span>
          {(['all', 'published', 'draft'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: '0.75rem',
                fontWeight: 700,
                border: '1px solid',
                borderColor: statusFilter === status ? '#005c55' : '#cbd5e1',
                background: statusFilter === status ? '#005c55' : '#ffffff',
                color: statusFilter === status ? '#ffffff' : '#475569',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Table */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 20,
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #edf2f7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#131b2e', margin: 0 }}>
              Clinical Knowledge Repository ({filteredPosts.length})
            </h2>
            <p style={{ fontSize: '0.8125rem', color: '#6e7977', margin: '2px 0 0' }}>
              Directly manageable articles served to the storefront Caregiver Hub.
            </p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #edf2f7', color: '#475569', fontWeight: 700 }}>
                <th style={{ padding: '14px 20px' }}>Article Details</th>
                <th style={{ padding: '14px 20px' }}>Category &amp; Tag</th>
                <th style={{ padding: '14px 20px' }}>Bilingual Coverage</th>
                <th style={{ padding: '14px 20px' }}>Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => {
                const hasHi = Boolean(post.hasHindiTranslation || post.translations?.hi?.title);
                return (
                  <tr key={post.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: 10,
                            overflow: 'hidden',
                            background: '#f1f5f9',
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={post.coverImage || '/images/caregiver.png'}
                            alt={post.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div>
                          <strong style={{ display: 'block', color: '#0f172a', fontWeight: 700, fontSize: '0.9375rem' }}>
                            {post.title}
                          </strong>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            by {post.authorName || 'Biomedical Team'} &bull; {post.readTime || '5 min read'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span style={{ fontWeight: 600, color: '#005c55', fontSize: '0.8125rem' }}>
                          {post.category || 'General Home Care'}
                        </span>
                        {post.equipmentTag && (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              background: '#f1f5f9',
                              color: '#475569',
                              padding: '2px 8px',
                              borderRadius: 4,
                              fontSize: '0.6875rem',
                              width: 'fit-content',
                            }}
                          >
                            <Tag size={10} />
                            {post.equipmentTag}
                          </span>
                        )}
                      </div>
                    </td>

                    <td style={{ padding: '16px 20px' }}>
                      {hasHi ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            background: '#dcfce7',
                            color: '#15803d',
                            padding: '4px 10px',
                            borderRadius: 6,
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}
                        >
                          <CheckCircle2 size={13} />
                          English + हिन्दी
                        </span>
                      ) : (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            background: '#fef3c7',
                            color: '#b45309',
                            padding: '4px 10px',
                            borderRadius: 6,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        >
                          <AlertCircle size={13} />
                          English Only
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '16px 20px' }}>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(post)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '4px 10px',
                          borderRadius: 8,
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          border: 'none',
                          background: post.status === 'published' ? '#ecfdf5' : '#f1f5f9',
                          color: post.status === 'published' ? '#047857' : '#64748b',
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: post.status === 'published' ? '#10b981' : '#94a3b8',
                          }}
                        />
                        {post.status === 'published' ? 'Published' : 'Draft'}
                      </button>
                    </td>

                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <Link
                          href="/blog"
                          target="_blank"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '6px 12px',
                            borderRadius: 8,
                            fontSize: '0.8125rem',
                            fontWeight: 600,
                            background: '#f8fafc',
                            border: '1px solid #cbd5e1',
                            color: '#334155',
                            textDecoration: 'none',
                          }}
                        >
                          <ExternalLink size={13} />
                          Live View
                        </Link>
                        <button
                          onClick={() => openEditModal(post)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '6px 14px',
                            borderRadius: 8,
                            fontSize: '0.8125rem',
                            fontWeight: 700,
                            background: '#005c55',
                            border: 'none',
                            color: '#ffffff',
                            cursor: 'pointer',
                          }}
                        >
                          <Edit3 size={13} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '6px 10px',
                            borderRadius: 8,
                            background: '#fff1f2',
                            border: '1px solid #fecdd3',
                            color: '#e11d48',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={14} />
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

      {/* Editor Modal */}
      {selectedPost && formData && (
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
                onClick={closeModal}
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
                  borderColor: editTab === 'en' ? '#005c55' : '#cbd5e1',
                  background: editTab === 'en' ? '#005c55' : '#ffffff',
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
                  borderColor: editTab === 'hi' ? '#005c55' : '#cbd5e1',
                  background: editTab === 'hi' ? '#005c55' : '#ffffff',
                  color: editTab === 'hi' ? '#ffffff' : '#475569',
                  cursor: 'pointer',
                }}
              >
                हिन्दी (Hindi Translation)
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} style={{ padding: '2rem' }}>
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
                    placeholder="/images/hospital_bed.png"
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
                  onClick={closeModal}
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
                    background: '#005c55',
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
      )}
    </div>
  );
}
