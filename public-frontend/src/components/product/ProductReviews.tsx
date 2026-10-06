'use client';

import React, { useState } from 'react';
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  PlusCircle,
  Award,
} from 'lucide-react';

interface ReviewItem {
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

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Dr. Ramesh Kulkarni',
    location: 'Bengaluru',
    verifiedType: 'Verified Caregiver',
    rating: 5,
    date: '14 Sep 2026',
    title: 'Hospital-grade quietness & smooth delivery setup',
    comment:
      'We rented this unit for my 74-year-old father who was discharged from Manipal Hospital. The technician arrived within 3.5 hours, conducted the 10-step sterilization swab test in front of us, and calibrated the pressure. Outstanding service for distressed families.',
    helpfulCount: 24,
  },
  {
    id: 'rev-2',
    author: 'Sunita Mehra',
    location: 'Delhi NCR',
    verifiedType: 'Verified Patient',
    rating: 5,
    date: '02 Sep 2026',
    title: 'Zero snoring from night one, very transparent rental terms',
    comment:
      'I was hesitant to buy outright before trying. AarogyaMed’s monthly rental option allowed me to test the therapy with only a refundable deposit. The auto-adjusting algorithm worked flawlessly.',
    helpfulCount: 19,
  },
  {
    id: 'rev-3',
    author: 'Col. V. N. Rao (Retd.)',
    location: 'Pune',
    verifiedType: 'Verified Caregiver',
    rating: 5,
    date: '28 Aug 2026',
    title: 'Prompt deposit refund upon return pickup',
    comment:
      'When my recovery period ended after 30 days, I requested pickup from My Account. The technician picked up the unit in the morning, and the ₹12,000 security deposit was credited back to my UPI within 3 hours. Honest, reliable medical platform.',
    helpfulCount: 31,
  },
];

interface ProductReviewsProps {
  productName: string;
  ratingAvg?: number;
  ratingCount?: number;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({
  productName,
  ratingAvg = 4.9,
  ratingCount = 148,
}) => {
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // Form state
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('Delhi NCR');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      author: author || 'Caregiver',
      location,
      verifiedType: 'Verified Caregiver',
      rating,
      date: 'Just now',
      title,
      comment,
      helpfulCount: 0,
    };
    setReviews([newRev, ...reviews]);
    setModalOpen(false);
    alert('Thank you! Your clinical review has been submitted.');
  };

  return (
    <section
      style={{
        marginTop: '3.5rem',
        paddingTop: '2.5rem',
        borderTop: '1px solid #dae2fd',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Award size={18} color="#005c55" />
            <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#005c55', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
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
            background: '#005c55',
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

      {/* Rating Breakdown Bar */}
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
        {/* Score Card */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', borderRight: '1px solid #f2f3ff', paddingRight: '1rem' }}>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: '#005c55', lineHeight: 1 }}>
            {ratingAvg.toFixed(1)}
          </div>
          <div style={{ display: 'flex', gap: 4, margin: '8px 0 4px', color: '#ffb599' }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={18} fill="#b94200" color="#b94200" />
            ))}
          </div>
          <span style={{ fontSize: '0.8125rem', color: '#6e7977' }}>
            Based on {ratingCount} certified purchases &amp; rentals
          </span>
          <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 999, background: '#e8f5f3', color: '#005c55', fontSize: '0.6875rem', fontWeight: 700 }}>
            <ShieldCheck size={12} /> CDSCO ISO 13485 Verified Reviews
          </div>
        </div>

        {/* Feature Ratings Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
          {[
            { label: 'Sterilization & Cleanliness', score: '99%' },
            { label: 'Quiet Clinical Performance', score: '98%' },
            { label: 'Technician Doorstep Setup', score: '96%' },
            { label: 'Deposit Refund Transparency', score: '100%' },
          ].map((item, idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: 4 }}>
                <span style={{ color: '#3e4947', fontWeight: 600 }}>{item.label}</span>
                <strong style={{ color: '#005c55' }}>{item.score}</strong>
              </div>
              <div style={{ height: 6, width: '100%', background: '#eaedff', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: item.score, height: '100%', background: '#005c55', borderRadius: 999 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
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
                    color: '#005c55',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.875rem',
                  }}
                >
                  {rev.author[0]}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <strong style={{ fontSize: '0.9375rem', color: '#131b2e' }}>{rev.author}</strong>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 4,
                        background: '#e8f5f3',
                        color: '#005c55',
                      }}
                    >
                      ✓ {rev.verifiedType}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#6e7977' }}>
                    {rev.location} • {rev.date}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 2, color: '#b94200' }}>
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} size={15} fill="#b94200" color="#b94200" />
                ))}
              </div>
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#131b2e', margin: '4px 0 0' }}>
              {rev.title}
            </h4>
            <p style={{ fontSize: '0.875rem', color: '#3e4947', lineHeight: 1.6, margin: 0 }}>
              {rev.comment}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 6, borderTop: '1px solid #f2f3ff', fontSize: '0.75rem', color: '#6e7977' }}>
              <ThumbsUp size={13} color="#005c55" />
              <span>{rev.helpfulCount} caregivers found this review helpful</span>
            </div>
          </div>
        ))}
      </div>

      {/* Review Submission Modal */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(19, 27, 46, 0.5)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 20,
              maxWidth: 500,
              width: '100%',
              padding: '2rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#131b2e', margin: '0 0 4px' }}>
              Share Your Clinical Experience
            </h3>
            <span style={{ fontSize: '0.8125rem', color: '#6e7977', display: 'block', marginBottom: '1.25rem' }}>
              Reviewing: <strong>{productName}</strong>
            </span>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', marginBottom: 4 }}>
                  Overall Rating
                </label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 2,
                      }}
                    >
                      <Star
                        size={24}
                        fill={star <= rating ? '#b94200' : 'none'}
                        color={star <= rating ? '#b94200' : '#dae2fd'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', marginBottom: 4 }}>
                  Your Name / Caregiver Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Nair (Caregiver)"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #dae2fd' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', marginBottom: 4 }}>
                  City / Location
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #dae2fd' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', marginBottom: 4 }}>
                  Review Headline
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Excellent quiet performance, easy return pickup"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #dae2fd' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', marginBottom: 4 }}>
                  Detailed Experience
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="How was the equipment sterilization, sound level, and delivery experience?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #dae2fd', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: 10,
                    background: '#f2f3ff',
                    color: '#3e4947',
                    border: 'none',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    padding: '12px',
                    borderRadius: 10,
                    background: '#005c55',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 800,
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
