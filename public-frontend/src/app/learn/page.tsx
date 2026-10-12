'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/locales';
import { STATIC_LEARN_CONDITIONS } from '@/content/learn/conditions';
import { STATIC_BLOG_POSTS } from '@/content/blog/posts';
import { ConditionEntity } from '@/domain/entities/condition.entity';
import { BlogPost } from '@/domain/entities/blog.entity';
import styles from './learn.module.scss';
import {
  GraduationCap,
  Stethoscope,
  BookOpen,
  ArrowRight,
  Clock,
  Tag,
  X,
  ShoppingBag,
} from 'lucide-react';

export default function LearnEducationHubPage() {
  const { locale } = useTranslation();
  const [activeTab, setActiveTab] = useState<'all' | 'conditions' | 'articles'>('all');
  const [activeReadingPost, setActiveReadingPost] = useState<BlogPost | null>(null);

  const publishedArticles = STATIC_BLOG_POSTS.filter((p) => p.status === 'published');

  return (
    <div className={styles.learnWrapper}>
      {/* 1. Hero Header */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroBadge}>
            <GraduationCap size={16} />
            <span>
              {locale === 'hi' ? 'देखभालकर्ता ज्ञान एवं शिक्षा केंद्र' : 'Caregiver Learning & Education Hub'}
            </span>
          </div>

          <h1 className={styles.heroTitle}>
            {locale === 'hi' ? (
              <>
                चिकित्सा स्थिति गाइड एवं <span>देखभालकर्ता व्यावहारिक संसाधन</span>
              </>
            ) : (
              <>
                Clinical Condition Guides &amp; <span>Caregiver Practical Resources</span>
              </>
            )}
          </h1>

          <p className={styles.heroSubtitle}>
            {locale === 'hi'
              ? 'गंभीर स्वास्थ्य स्थितियों के लिए प्रमाणित नैदानिक मार्गदर्शिकाएं, उपकरणों की तुलना, घरेलू आईसीयू सेटअप, और रखरखाव से जुड़े व्यावहारिक लेख — सब कुछ एक स्थान पर।'
              : 'Evergreen structured clinical condition guides, medical equipment comparisons, home ICU setups, and practical maintenance tips — all unified in one clinical education resource.'}
          </p>
        </div>
      </section>

      <div className={styles.container}>
        {/* 2. Filter Tabs */}
        <div className={styles.filterTabs}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'all' ? styles.active : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <span>{locale === 'hi' ? 'सभी संसाधन' : 'All Education Resources'}</span>
            <span className={styles.tabCount}>
              {STATIC_LEARN_CONDITIONS.length + publishedArticles.length}
            </span>
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'conditions' ? styles.active : ''}`}
            onClick={() => setActiveTab('conditions')}
          >
            <Stethoscope size={16} />
            <span>{locale === 'hi' ? 'कंडीशन केयर गाइड' : 'Condition Care Guides'}</span>
            <span className={styles.tabCount}>{STATIC_LEARN_CONDITIONS.length}</span>
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'articles' ? styles.active : ''}`}
            onClick={() => setActiveTab('articles')}
          >
            <BookOpen size={16} />
            <span>{locale === 'hi' ? 'व्यावहारिक लेख एवं टिप्स' : 'Practical Guides & How-Tos'}</span>
            <span className={styles.tabCount}>{publishedArticles.length}</span>
          </button>
        </div>

        {/* 3. Section: Condition Care Guides (Structured Evergreen Guides) */}
        {(activeTab === 'all' || activeTab === 'conditions') && (
          <section>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionBadge}>
                {locale === 'hi' ? 'सदाबहार क्लिनिकल मार्गदर्शिकाएं' : 'Evergreen Clinical Guides'}
              </span>
              <h2 className={styles.sectionTitle}>
                {locale === 'hi' ? 'स्वास्थ्य स्थिति केयर गाइड' : 'Clinical Condition Care Guides'}
              </h2>
              <p className={styles.sectionSubtitle}>
                {locale === 'hi'
                  ? 'रोग की स्थिति, सामान्य लक्षण, नैदानिक उपचार एवं अनुशंसित प्रमाणित चिकित्सा उपकरणों की विस्तृत जानकारी।'
                  : 'Structured, evergreen guides explaining pathology, symptoms, clinical management, and linked medical equipment.'}
              </p>
            </div>

            <div className={styles.conditionsGrid}>
              {STATIC_LEARN_CONDITIONS.map((condition) => {
                const localized = ConditionEntity.getLocalized(condition, locale);

                return (
                  <Link
                    key={condition.id}
                    href={`/learn/${condition.slug}`}
                    className={styles.conditionCard}
                  >
                    <div className={styles.cardImage}>
                      <img
                        src={condition.heroImage || '/images/elderly_couple.png'}
                        alt={localized.name}
                      />
                    </div>

                    <div className={styles.cardBody}>
                      <div className={styles.typeBadge}>
                        <Stethoscope size={13} />
                        <span>{locale === 'hi' ? 'क्लिनिकल गाइड' : 'Condition Guide'}</span>
                      </div>

                      <h3 className={styles.conditionTitle}>{localized.name}</h3>
                      <p className={styles.conditionDescription}>{localized.shortDescription}</p>

                      {condition.symptoms && condition.symptoms.length > 0 && (
                        <div className={styles.symptomsBlock}>
                          <div className={styles.symptomsLabel}>
                            {locale === 'hi' ? 'प्रमुख लक्षण:' : 'Key Indications:'}
                          </div>
                          <div className={styles.symptomPills}>
                            {condition.symptoms.slice(0, 3).map((sym, idx) => (
                              <span key={idx} className={styles.symptomPill}>
                                {sym.title}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className={styles.cardFooter}>
                        <span>
                          {locale === 'hi'
                            ? 'पूर्ण गाइड एवं उपकरण देखें'
                            : 'Explore Clinical Guide & Linked Equipment'}
                        </span>
                        <ArrowRight size={16} className={styles.arrowIcon} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* 4. Section: Practical Articles & How-Tos (Folded from Blog) */}
        {(activeTab === 'all' || activeTab === 'articles') && (
          <section>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionBadge} style={{ color: '#16453A' }}>
                {locale === 'hi' ? 'देखभालकर्ता व्यावहारिक सलाह' : 'Practical Caregiver Advice'}
              </span>
              <h2 className={styles.sectionTitle}>
                {locale === 'hi' ? 'व्यावहारिक गाइड एवं उपकरण तुलना' : 'Practical Guides, How-Tos & Comparisons'}
              </h2>
              <p className={styles.sectionSubtitle}>
                {locale === 'hi'
                  ? 'घरेलू आईसीयू सेटअप, डिवाइस तुलना, फिल्टर रखरखाव, एवं रेंटल डिपॉजिट सुरक्षा से जुड़े प्रमाणित लेख।'
                  : 'Practical caregiver articles on equipment comparisons, filter cleaning, home ICU setups, and rental insurance/deposit advice.'}
              </p>
            </div>

            <div className={styles.articlesGrid}>
              {publishedArticles.map((article) => {
                const title =
                  locale === 'hi' && article.translations?.hi?.title
                    ? article.translations.hi.title
                    : article.title;
                const summary =
                  locale === 'hi' && article.translations?.hi?.summary
                    ? article.translations.hi.summary
                    : article.summary;

                return (
                  <div
                    key={article.id}
                    className={styles.articleCard}
                    onClick={() => setActiveReadingPost(article)}
                  >
                    <div className={styles.articleImage}>
                      <img
                        src={article.coverImage || '/images/oxygen_concentrator.png'}
                        alt={title}
                      />
                    </div>

                    <div className={styles.articleBody}>
                      <div className={styles.articleMeta}>
                        <span className={styles.categoryBadge}>
                          <Tag size={12} />
                          <span>{article.category}</span>
                        </span>
                        <span className={styles.readTime}>
                          <Clock size={12} />
                          <span>{article.readTime}</span>
                        </span>
                      </div>

                      <h3 className={styles.articleTitle}>{title}</h3>
                      <p className={styles.articleSummary}>{summary}</p>

                      <div className={styles.articleAuthor}>
                        <span className={styles.authorName}>{article.authorName}</span>
                        <span className={styles.readBtn}>
                          <span>{locale === 'hi' ? 'लेख पढ़ें' : 'Read Guide'}</span>
                          <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* 5. Article Reading Modal */}
      {activeReadingPost && (
        <div className={styles.modalBackdrop} onClick={() => setActiveReadingPost(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.modalCloseBtn}
              onClick={() => setActiveReadingPost(null)}
              aria-label="Close article"
            >
              <X size={20} />
            </button>

            <div style={{ marginBottom: '1.25rem' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 12px',
                  borderRadius: 9999,
                  background: '#fbf2ed',
                  color: '#B75932',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  marginBottom: 10,
                }}
              >
                <Tag size={12} />
                <span>{activeReadingPost.category}</span>
              </span>

              <h2
                style={{
                  fontSize: '1.85rem',
                  fontWeight: 800,
                  color: '#131b2e',
                  lineHeight: 1.3,
                  margin: '0 0 10px',
                }}
              >
                {locale === 'hi' && activeReadingPost.translations?.hi?.title
                  ? activeReadingPost.translations.hi.title
                  : activeReadingPost.title}
              </h2>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  fontSize: '0.8125rem',
                  color: '#64748b',
                }}
              >
                <span>{activeReadingPost.authorName}</span>
                <span>•</span>
                <span>{activeReadingPost.readTime}</span>
              </div>
            </div>

            {/* Article Body */}
            <div
              style={{
                fontSize: '1rem',
                lineHeight: 1.8,
                color: '#334155',
                whiteSpace: 'pre-line',
                paddingTop: '1rem',
                borderTop: '1px solid #f1f5f9',
                marginBottom: '2rem',
              }}
            >
              {locale === 'hi' && activeReadingPost.translations?.hi?.body
                ? activeReadingPost.translations.hi.body
                : activeReadingPost.body}
            </div>

            {/* Footer with Linked Equipment */}
            <div
              style={{
                background: '#f8fafc',
                borderRadius: 16,
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <div>
                <strong style={{ color: '#16453A', display: 'block', fontSize: '0.9rem' }}>
                  {locale === 'hi' ? 'संबंधित चिकित्सा उपकरण' : 'Related Clinical Equipment'}
                </strong>
                <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                  {activeReadingPost.equipmentTag}
                </span>
              </div>

              {activeReadingPost.shopLink && (
                <Link
                  href={activeReadingPost.shopLink}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: '#16453A',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    padding: '8px 16px',
                    borderRadius: 8,
                  }}
                  onClick={() => setActiveReadingPost(null)}
                >
                  <ShoppingBag size={16} />
                  <span>{locale === 'hi' ? 'उपकरण कैटलॉग देखें' : 'View In Catalog'}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
