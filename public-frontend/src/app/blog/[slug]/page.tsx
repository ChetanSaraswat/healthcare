'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getStaticPostBySlug, STATIC_BLOG_POSTS } from '@/content/blog/posts';
import { useTranslation } from '@/locales';
import {
  BookOpen,
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Tag,
  ShoppingBag,
  Share2,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function BlogPostDetailPage({ params }: BlogPostPageProps) {
  const resolvedParams = use(params);
  const { locale } = useTranslation();

  const post = getStaticPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const localizedTitle =
    locale === 'hi' && post.translations?.hi?.title ? post.translations.hi.title : post.title;
  const localizedSummary =
    locale === 'hi' && post.translations?.hi?.summary ? post.translations.hi.summary : post.summary;
  const localizedBody =
    locale === 'hi' && post.translations?.hi?.body ? post.translations.hi.body : post.body;

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      alert('Article link copied to clipboard!');
    }
  };

  return (
    <article style={{ maxWidth: 880, margin: '2rem auto 6rem', padding: '0 1.5rem', fontFamily: 'inherit' }}>
      {/* Back to Blog */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          href="/blog"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: '#005c55',
            fontWeight: 700,
            fontSize: '0.875rem',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} />
          <span>{locale === 'hi' ? 'सभी क्लिनिकल लेख देखें' : 'Back to Clinical Guides'}</span>
        </Link>
      </div>

      {/* Meta tags */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: '1rem' }}>
        <span
          style={{
            padding: '4px 12px',
            borderRadius: 999,
            background: '#e8f5f3',
            color: '#005c55',
            fontSize: '0.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
          }}
        >
          {post.category}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.8125rem', color: '#6e7977' }}>
          <Clock size={14} /> {post.readTime}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.8125rem', color: '#6e7977' }}>
          <Calendar size={14} /> {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Sep 2026'}
        </span>
      </div>

      {/* Title & Summary */}
      <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#131b2e', lineHeight: 1.25, margin: '0 0 1rem' }}>
        {localizedTitle}
      </h1>

      <p style={{ fontSize: '1.125rem', color: '#3e4947', lineHeight: 1.6, marginBottom: '2rem', fontStyle: 'italic' }}>
        {localizedSummary}
      </p>

      {/* Author & Share Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 0',
          borderTop: '1px solid #dae2fd',
          borderBottom: '1px solid #dae2fd',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: '#005c55',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <User size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#131b2e' }}>{post.authorName}</div>
            <div style={{ fontSize: '0.75rem', color: '#005c55' }}>AarogyaMed Biomedical Advisory Panel</div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleShare}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            borderRadius: 9999,
            background: '#f2f3ff',
            color: '#006398',
            border: 'none',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Share2 size={14} />
          <span>Share</span>
        </button>
      </div>

      {/* Body Content */}
      <div style={{ fontSize: '1rem', color: '#131b2e', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
        {localizedBody}
      </div>

      {/* Recommended Equipment CTA */}
      {post.shopLink && (
        <div
          style={{
            marginTop: '3.5rem',
            padding: '2rem',
            borderRadius: 16,
            background: '#e8f5f3',
            border: '1px solid #9cf2e8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#005c55' }}>
              Related Medical Equipment
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#131b2e', margin: '4px 0 0' }}>
              Explore {post.equipmentTag || 'Certified Devices'} for Home Care
            </h3>
          </div>
          <Link
            href={post.shopLink}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#005c55',
              color: '#ffffff',
              padding: '12px 24px',
              borderRadius: 9999,
              fontWeight: 700,
              fontSize: '0.875rem',
              textDecoration: 'none',
            }}
          >
            <ShoppingBag size={16} />
            <span>Browse Catalog</span>
          </Link>
        </div>
      )}
    </article>
  );
}
