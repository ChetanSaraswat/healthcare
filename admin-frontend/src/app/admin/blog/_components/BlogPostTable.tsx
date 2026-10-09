'use client';

import React from 'react';
import Link from 'next/link';
import { BlogPost } from '@/domain/entities/blog.entity';
import {
  ExternalLink,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Tag,
  Trash2,
  Search,
} from 'lucide-react';

interface BlogPostTableProps {
  posts: BlogPost[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: 'all' | 'published' | 'draft';
  setStatusFilter: (status: 'all' | 'published' | 'draft') => void;
  onEdit: (post: BlogPost) => void;
  onToggleStatus: (post: BlogPost) => void;
  onDelete: (id: number | string) => void;
}

export function BlogPostTable({
  posts,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  onEdit,
  onToggleStatus,
  onDelete,
}: BlogPostTableProps) {
  return (
    <>
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
                borderColor: statusFilter === status ? '#16453A' : '#cbd5e1',
                background: statusFilter === status ? '#16453A' : '#ffffff',
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
              Clinical Knowledge Repository ({posts.length})
            </h2>
            <p style={{ fontSize: '0.8125rem', color: '#6e7977', margin: '2px 0 0' }}>
              Directly manageable articles served to the storefront Caregiver Hub.
            </p>
          </div>
        </div>

        <div
          className="custom-scrollbar"
          style={{
            overflowX: 'auto',
            overflowY: 'auto',
            maxHeight: 'calc(100vh - 310px)',
            minHeight: 380,
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr style={{ background: '#f8fafc', color: '#475569', fontWeight: 700 }}>
                <th style={{ position: 'sticky', top: 0, background: '#f8fafc', zIndex: 10, padding: '14px 20px', boxShadow: 'inset 0 -1px 0 #edf2f7' }}>Article Details</th>
                <th style={{ position: 'sticky', top: 0, background: '#f8fafc', zIndex: 10, padding: '14px 20px', boxShadow: 'inset 0 -1px 0 #edf2f7' }}>Category &amp; Tag</th>
                <th style={{ position: 'sticky', top: 0, background: '#f8fafc', zIndex: 10, padding: '14px 20px', boxShadow: 'inset 0 -1px 0 #edf2f7' }}>Bilingual Coverage</th>
                <th style={{ position: 'sticky', top: 0, background: '#f8fafc', zIndex: 10, padding: '14px 20px', boxShadow: 'inset 0 -1px 0 #edf2f7' }}>Status</th>
                <th style={{ position: 'sticky', top: 0, background: '#f8fafc', zIndex: 10, padding: '14px 20px', textAlign: 'right', boxShadow: 'inset 0 -1px 0 #edf2f7' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => {
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
                        <span style={{ fontWeight: 600, color: '#16453A', fontSize: '0.8125rem' }}>
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
                        onClick={() => onToggleStatus(post)}
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
                          onClick={() => onEdit(post)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '6px 14px',
                            borderRadius: 8,
                            fontSize: '0.8125rem',
                            fontWeight: 700,
                            background: '#16453A',
                            border: 'none',
                            color: '#ffffff',
                            cursor: 'pointer',
                          }}
                        >
                          <Edit3 size={13} />
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(post.id)}
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
    </>
  );
}
