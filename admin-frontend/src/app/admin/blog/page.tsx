'use client';

import React, { useState } from 'react';
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
  Globe2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { BlogPostTable } from './_components/BlogPostTable';
import { BlogPostModal } from './_components/BlogPostModal';

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
          <span style={{ fontSize: '0.75rem', color: '#005c55', fontWeight: 600 }}>{publishedCount} Active Storefront</span>
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
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#6e7977' }}>Hindi Localized</span>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#131b2e' }}>{translationRate}%</div>
          <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>{translatedCount} / {totalArticles} Articles Bilingual</span>
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
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#6e7977' }}>Editorial Quality</span>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#131b2e' }}>Certified</div>
          <span style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 600 }}>Biomedical Peer-Reviewed</span>
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

      {/* Articles Table */}
      <BlogPostTable
        posts={filteredPosts}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onEdit={openEditModal}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
      />

      {/* Editor Modal */}
      <BlogPostModal
        isOpen={Boolean(selectedPost && formData)}
        isCreatingNew={isCreatingNew}
        formData={formData}
        setFormData={setFormData}
        editTab={editTab}
        setEditTab={setEditTab}
        saveSuccess={saveSuccess}
        onClose={closeModal}
        onSave={handleSave}
      />
    </div>
  );
}
