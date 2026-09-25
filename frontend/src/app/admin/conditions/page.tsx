'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { Condition, ConditionContentBlock } from '@/domain/entities/condition.entity';
import { updateCondition } from '@/features/conditions/conditions.slice';
import {
  BookOpen,
  Plus,
  ExternalLink,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Globe2,
  Tag,
  Layers,
  Image as ImageIcon,
  HeartPulse,
  Brain,
  Sparkles,
  Save,
  X,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export default function AdminConditionsPage() {
  const dispatch = useAppDispatch();
  const conditions = useAppSelector((state) => state.conditions.conditions);

  // Active editing condition
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null);
  const [editTab, setEditTab] = useState<'en' | 'hi'>('en');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form state when editing
  const [editFormData, setEditFormData] = useState<Condition | null>(null);

  const openEditModal = (cond: Condition) => {
    setSelectedCondition(cond);
    // Deep clone to isolate edits
    setEditFormData(JSON.parse(JSON.stringify(cond)));
    setEditTab('en');
    setSaveSuccess(false);
  };

  const closeEditModal = () => {
    setSelectedCondition(null);
    setEditFormData(null);
    setSaveSuccess(false);
  };

  const handleSaveCondition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData) return;

    dispatch(updateCondition(editFormData));
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2500);
  };

  // Metrics
  const totalGuides = conditions.length;
  const translatedGuides = conditions.filter((c) => c.translations?.hi && c.translations.hi.name).length;
  const totalBlocks = conditions.reduce((acc, c) => acc + (c.contentBlocks?.length || 0), 0);
  const totalIllustrations = conditions.reduce((acc, c) => {
    let count = c.symptomsIllustration ? 1 : 0;
    if (c.contentBlocks) {
      count += c.contentBlocks.filter((b) => !!b.illustration).length;
    }
    return acc + count;
  }, 0);

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto' }}>
      {/* Header */}
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
            Condition Care Guides CMS
          </h1>
          <p style={{ color: '#52605d', fontSize: '0.9375rem', margin: '4px 0 0' }}>
            Authoritative clinical condition guides, systemic health content blocks, and commissioned medical illustrations.
          </p>
        </div>
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
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#6e7977' }}>Total Clinical Guides</span>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#eaf8f6', color: '#005c55', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#131b2e' }}>{totalGuides}</div>
          <span style={{ fontSize: '0.75rem', color: '#005c55', fontWeight: 600 }}>Active on Storefront</span>
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
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#131b2e' }}>
            {totalGuides > 0 ? Math.round((translatedGuides / totalGuides) * 100) : 100}%
          </div>
          <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>
            {translatedGuides} of {totalGuides} Bilingual
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
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#6e7977' }}>Systemic Content Blocks</span>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#131b2e' }}>{totalBlocks}</div>
          <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600 }}>Directly Published Live</span>
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
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#6e7977' }}>Commissioned Medical Art</span>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#faf5ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ImageIcon size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#131b2e' }}>{totalIllustrations}</div>
          <span style={{ fontSize: '0.75rem', color: '#7c3aed', fontWeight: 600 }}>AarogyaMed Commissioned</span>
        </div>
      </div>

      {/* Conditions Table */}
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
              Published Condition Care Guides
            </h2>
            <p style={{ fontSize: '0.8125rem', color: '#6e7977', margin: '2px 0 0' }}>
              Guides linked to medical equipment tags and clinical recovery paths.
            </p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #edf2f7', color: '#475569', fontWeight: 700 }}>
                <th style={{ padding: '14px 20px' }}>Condition Guide</th>
                <th style={{ padding: '14px 20px' }}>Equipment Tag Link</th>
                <th style={{ padding: '14px 20px' }}>Content Blocks</th>
                <th style={{ padding: '14px 20px' }}>Bilingual Coverage</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {conditions.map((cond) => {
                const hasHi = Boolean(cond.translations?.hi && cond.translations.hi.name);
                const blockCount = cond.contentBlocks?.length || 0;

                return (
                  <tr key={cond.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div
                          style={{
                            width: 42,
                            height: 42,
                            borderRadius: 10,
                            overflow: 'hidden',
                            background: '#f1f5f9',
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={cond.heroImage || '/images/caregiver.png'}
                            alt={cond.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div>
                          <strong style={{ display: 'block', color: '#0f172a', fontWeight: 700 }}>
                            {cond.name}
                          </strong>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            slug: /learn/{cond.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '16px 20px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          background: '#f1f5f9',
                          color: '#334155',
                          padding: '4px 10px',
                          borderRadius: 6,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        <Tag size={12} />
                        {cond.tag}
                      </span>
                    </td>

                    <td style={{ padding: '16px 20px' }}>
                      {blockCount > 0 ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            background: '#e0f2fe',
                            color: '#0369a1',
                            padding: '4px 10px',
                            borderRadius: 6,
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}
                        >
                          <Layers size={12} />
                          {blockCount} Systemic Blocks
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Basic Structure</span>
                      )}
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
                          English + हिन्दी (100%)
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

                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <Link
                          href={`/learn/${cond.slug}`}
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
                          onClick={() => openEditModal(cond)}
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
                          Edit Guide
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

      {/* Direct CMS Editor Modal */}
      {selectedCondition && editFormData && (
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
              maxHeight: '90vh',
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
                    Edit Condition Guide: {editFormData.name}
                  </h2>
                  <span
                    style={{
                      background: '#dcfce7',
                      color: '#15803d',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 6,
                    }}
                  >
                    Direct Publication
                  </span>
                </div>
                <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                  Slug: <code>/learn/{editFormData.slug}</code> | Equipment Tag: <code>{editFormData.tag}</code>
                </span>
              </div>

              <button
                onClick={closeEditModal}
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

            {/* Form Body */}
            <form onSubmit={handleSaveCondition} style={{ padding: '2rem' }}>
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
                  Condition care guide saved and directly published to storefront!
                </div>
              )}

              {/* Title & Short Description */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                    Guide Title ({editTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={
                      editTab === 'en'
                        ? editFormData.name
                        : editFormData.translations?.hi?.name || ''
                    }
                    onChange={(e) => {
                      if (editTab === 'en') {
                        setEditFormData({ ...editFormData, name: e.target.value });
                      } else {
                        const trHi = editFormData.translations?.hi || {
                          locale: 'hi',
                          name: '',
                          shortDescription: '',
                          symptoms: [],
                          caregiverTips: [],
                        };
                        setEditFormData({
                          ...editFormData,
                          translations: {
                            ...editFormData.translations,
                            hi: { ...trHi, name: e.target.value },
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
                    Short Summary ({editTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={
                      editTab === 'en'
                        ? editFormData.shortDescription
                        : editFormData.translations?.hi?.shortDescription || ''
                    }
                    onChange={(e) => {
                      if (editTab === 'en') {
                        setEditFormData({ ...editFormData, shortDescription: e.target.value });
                      } else {
                        const trHi = editFormData.translations?.hi || {
                          locale: 'hi',
                          name: '',
                          shortDescription: '',
                          symptoms: [],
                          caregiverTips: [],
                        };
                        setEditFormData({
                          ...editFormData,
                          translations: {
                            ...editFormData.translations,
                            hi: { ...trHi, shortDescription: e.target.value },
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
              </div>

              {/* Commissioned Symptoms Infographic Info */}
              {editFormData.symptomsIllustration && (
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 16,
                    padding: '1.25rem',
                    marginBottom: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  <img
                    src={editFormData.symptomsIllustration.imageUrl}
                    alt={editFormData.symptomsIllustration.altText.en}
                    style={{ width: 80, height: 80, borderRadius: 10, objectFit: 'contain', background: '#ffffff', border: '1px solid #e2e8f0' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#005c55' }}>
                        Symptoms Infographic (Commissioned Asset)
                      </span>
                      <span style={{ fontSize: '0.6875rem', background: '#dcfce7', color: '#15803d', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                        {editFormData.symptomsIllustration.sourceAttribution}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                      Alt Text ({editTab.toUpperCase()}): {editFormData.symptomsIllustration.altText[editTab]}
                    </p>
                  </div>
                </div>
              )}

              {/* Content Blocks Section */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Layers size={18} color="#005c55" />
                  Systemic Health Effects Content Blocks ({editFormData.contentBlocks?.length || 0})
                </h3>

                {editFormData.contentBlocks && editFormData.contentBlocks.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {editFormData.contentBlocks.map((block, idx) => {
                      const trBlock = editTab === 'hi'
                        ? editFormData.translations?.hi?.contentBlocks?.find((b) => b.id === block.id || b.slug === block.slug)
                        : block;

                      return (
                        <div
                          key={block.id}
                          style={{
                            background: '#ffffff',
                            border: '1px solid #dae2fd',
                            borderRadius: 16,
                            padding: '1.5rem',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div
                                style={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: 8,
                                  background: block.slug.includes('heart') ? '#ffe4e6' : '#ede9fe',
                                  color: block.slug.includes('heart') ? '#e11d48' : '#6d28d9',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                {block.slug.includes('heart') ? <HeartPulse size={18} /> : <Brain size={18} />}
                              </div>
                              <strong style={{ fontSize: '1rem', color: '#0f172a' }}>
                                {trBlock?.title || block.title}
                              </strong>
                            </div>

                            <span style={{ fontSize: '0.75rem', color: '#64748b', background: '#f1f5f9', padding: '3px 8px', borderRadius: 6 }}>
                              {trBlock?.items.length || block.items.length} clinical points
                            </span>
                          </div>

                          {/* Illustration Details */}
                          {block.illustration && (
                            <div
                              style={{
                                background: '#f8fafc',
                                borderRadius: 12,
                                padding: '10px 14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                marginBottom: 12,
                                border: '1px solid #f1f5f9',
                              }}
                            >
                              <img
                                src={block.illustration.imageUrl}
                                alt={block.illustration.altText.en}
                                style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'contain', background: '#ffffff', border: '1px solid #e2e8f0' }}
                              />
                              <div style={{ flex: 1, fontSize: '0.75rem' }}>
                                <div style={{ fontWeight: 600, color: '#334155' }}>
                                  Commissioned Illustration: {block.illustration.imageUrl}
                                </div>
                                <div style={{ color: '#64748b' }}>
                                  Alt: {block.illustration.altText[editTab]}
                                </div>
                              </div>
                              <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#005c55', background: '#e0f3f0', padding: '2px 6px', borderRadius: 4 }}>
                                {block.illustration.sourceAttribution}
                              </span>
                            </div>
                          )}

                          {/* Reversibility Note if present */}
                          {(trBlock?.reversibilityNote || block.reversibilityNote) && (
                            <div
                              style={{
                                background: '#f0fdf4',
                                border: '1px solid #bbf7d0',
                                borderRadius: 10,
                                padding: '10px 14px',
                                fontSize: '0.8125rem',
                                color: '#166534',
                                display: 'flex',
                                gap: 8,
                                alignItems: 'center',
                              }}
                            >
                              <Sparkles size={16} color="#15803d" />
                              <span>{trBlock?.reversibilityNote || block.reversibilityNote}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>No systemic content blocks configured.</p>
                )}
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid #e2e8f0',
                }}
              >
                <Link
                  href={`/learn/${editFormData.slug}`}
                  target="_blank"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: '0.875rem',
                    color: '#005c55',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  <ExternalLink size={15} />
                  View Live on Storefront
                </Link>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={closeEditModal}
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
                    Close
                  </button>
                  <button
                    type="submit"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '10px 22px',
                      borderRadius: 10,
                      border: 'none',
                      background: '#005c55',
                      color: '#ffffff',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0, 92, 85, 0.25)',
                    }}
                  >
                    <Save size={16} />
                    Save & Publish Guide
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
