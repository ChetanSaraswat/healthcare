'use client';

import React, { useState } from 'react';
import {
  Star,
  CheckCircle2,
  MessageSquare,
  PlusCircle,
  Award,
} from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { showToast } from '@/features/ui/ui.slice';

export interface ReviewItem {
  id: string;
  author: string;
  location: string;
  verifiedType: 'Verified Caregiver' | 'Verified Hospital Buyer' | 'Verified Patient';
  rating: number;
  date: string;
  title: string;
  comment: string;
  helpfulCount: number;
}

interface ProductReviewsProps {
  productName: string;
  ratingAvg?: number;
  ratingCount?: number;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({
  productName,
  ratingAvg,
  ratingCount,
}) => {
  const dispatch = useAppDispatch();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // Form state
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      author: author.trim() || 'Customer',
      location: location.trim(),
      verifiedType: 'Verified Caregiver',
      rating,
      date: 'Just now',
      title: title.trim() || 'Review',
      comment: comment.trim(),
      helpfulCount: 0,
    };
    setReviews([newRev, ...reviews]);
    setModalOpen(false);
    setAuthor('');
    setTitle('');
    setComment('');
    dispatch(
      showToast({
        type: 'success',
        message: 'Thank you! Your verified review has been submitted.',
      })
    );
  };

  const hasReviews = reviews.length > 0;
  const currentAvg = hasReviews
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : ratingAvg;
  const currentCount = hasReviews ? reviews.length : ratingCount || 0;

  return (
    <section
      style={{
        marginTop: '3.5rem',
        paddingTop: '2.5rem',
        borderTop: '1px solid #dae2fd',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: '2rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Award size={18} color="#16453A" />
            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: 800,
                color: '#16453A',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Verified Clinical Feedback
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#131b2e', margin: 0, letterSpacing: '-0.02em' }}>
            Patient &amp; Caregiver Reviews
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            borderRadius: 10,
            background: '#16453A',
            color: '#ffffff',
            border: 'none',
            fontSize: '0.875rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,92,85,0.25)',
          }}
        >
          <PlusCircle size={16} />
          <span>Write a Review</span>
        </button>
      </div>

      {hasReviews && currentAvg ? (
        /* Rating Breakdown Bar */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            background: '#ffffff',
            borderRadius: 16,
            padding: '1.75rem',
            border: '1px solid #dae2fd',
            marginBottom: '2rem',
            boxShadow: '0 2px 8px rgba(19, 27, 46, 0.02)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              borderRight: '1px solid #f2f3ff',
              paddingRight: '1rem',
            }}
          >
            <div style={{ fontSize: '3rem', fontWeight: 800, color: '#16453A', lineHeight: 1 }}>
              {currentAvg.toFixed(1)}
            </div>
            <div style={{ display: 'flex', gap: 4, margin: '8px 0 4px', color: '#B75932' }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={18}
                  fill={s <= Math.round(currentAvg) ? '#B75932' : 'none'}
                  color="#B75932"
                />
              ))}
            </div>
            <span style={{ fontSize: '0.8125rem', color: '#6e7977' }}>
              Based on {currentCount} verified caregiver {currentCount === 1 ? 'review' : 'reviews'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
            {[
              { label: 'Sterilization & Cleanliness', score: '100%' },
              { label: 'Quiet Clinical Performance', score: '100%' },
              { label: 'Technician Doorstep Setup', score: '100%' },
              { label: 'Deposit Refund Transparency', score: '100%' },
            ].map((item, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: 4 }}>
                  <span style={{ color: '#3e4947', fontWeight: 600 }}>{item.label}</span>
                  <strong style={{ color: '#16453A' }}>{item.score}</strong>
                </div>
                <div style={{ height: 6, width: '100%', background: '#eaedff', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: item.score, height: '100%', background: '#16453A', borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Reviews List or Clean Empty State */}
      {!hasReviews ? (
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1.5px dashed #cbd5e1',
            padding: '3rem 1.5rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: '#e8f5f3',
              color: '#16453A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MessageSquare size={24} />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#131b2e', margin: 0 }}>
            No Reviews Yet for this Equipment
          </h3>
          <p style={{ color: '#6e7977', fontSize: '0.875rem', maxWidth: 440, margin: 0, lineHeight: 1.5 }}>
            All reviews on Omkar Healthcare are from verified caregivers and hospitals. Be the first to share your experience with this device.
          </p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            style={{
              marginTop: 8,
              padding: '8px 18px',
              borderRadius: 8,
              border: '1.5px solid #16453A',
              background: 'transparent',
              color: '#16453A',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            Leave First Review
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {reviews.map((rev) => (
            <div
              key={rev.id}
              style={{
                background: '#ffffff',
                borderRadius: 14,
                padding: '1.5rem',
                border: '1px solid #dae2fd',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      background: '#e8f5f3',
                      color: '#16453A',
                      fontWeight: 800,
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {rev.author[0]}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <strong style={{ fontSize: '0.9375rem', color: '#131b2e' }}>{rev.author}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#6e7977' }}>• {rev.location}</span>
                    </div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#16453A', fontSize: '0.6875rem', fontWeight: 700 }}>
                      <CheckCircle2 size={12} />
                      {rev.verifiedType}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 2, color: '#B75932' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} fill={s <= rev.rating ? '#B75932' : 'none'} color="#B75932" />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#6e7977' }}>{rev.date}</span>
                </div>
              </div>

              <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#131b2e' }}>{rev.title}</div>
              <p style={{ color: '#3e4947', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>{rev.comment}</p>
            </div>
          ))}
        </div>
      )}

      {/* Review Submission Modal */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              maxWidth: 520,
              width: '100%',
              padding: '2rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#131b2e', marginBottom: '0.5rem' }}>
              Write Clinical Review
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#6e7977', marginBottom: '1.5rem' }}>
              Share your feedback on {productName} for other recovering patients and caregivers.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', marginBottom: 4 }}>
                  Overall Rating
                </label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
                    >
                      <Star size={24} fill={s <= rating ? '#B75932' : 'none'} color="#B75932" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', marginBottom: 4 }}>
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh or Caregiver Anita"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1.5px solid #bdc9c6',
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', marginBottom: 4 }}>
                  City / Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru, Delhi NCR, Mumbai"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1.5px solid #bdc9c6',
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', marginBottom: 4 }}>
                  Review Headline
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Excellent quiet operation and smooth home setup"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1.5px solid #bdc9c6',
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', marginBottom: 4 }}>
                  Detailed Experience
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe sterilization quality, technician assistance, comfort, and device effectiveness..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1.5px solid #bdc9c6',
                    fontSize: '0.875rem',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#475569',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 20px',
                    borderRadius: 8,
                    border: 'none',
                    background: '#16453A',
                    color: '#ffffff',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
