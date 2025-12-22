"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { VIBE_OPTIONS, TAG_OPTIONS } from '@/lib/review-constants';

interface Review {
  id: number;
  girl_id: number;
  girl_name?: string;
  girl_slug?: string;
  girl_photo?: string;
  author_name: string;
  rating: number;
  title?: string;
  content: string;
  created_at: string;
  status: string;
  vibe?: string;
  tags?: string;
}

interface ReviewsSectionProps {
  initialReviews?: Review[];
}

export default function ReviewsSection({ initialReviews = [] }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [loading, setLoading] = useState(initialReviews.length === 0);
  const locale = useLocale();

  useEffect(() => {
    // Only fetch if no initial data
    if (initialReviews.length === 0) {
      async function fetchReviews() {
        try {
          const response = await fetch('/api/reviews?status=approved&limit=6');
          const data = await response.json();
          if (data.success) {
            setReviews(data.reviews);
          }
        } catch (error) {
          console.error('Error fetching reviews:', error);
        } finally {
          setLoading(false);
        }
      }
      fetchReviews();
    }
  }, [initialReviews.length]);

  if (loading) {
    return (
      <section style={{ padding: '4rem 0' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', color: '#9ca3af' }}>Načítání recenzí...</div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? '#d4af37' : '#4b5563', fontSize: '18px' }}>
        ★
      </span>
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <section style={{ padding: '4rem 0', background: 'rgba(0, 0, 0, 0.2)' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="section-title">Co říkají naši klienti</h2>
          <p className="section-subtitle">Ověřené recenze od skutečných zákazníků</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '24px',
          marginBottom: '2rem'
        }}>
          {reviews.map((review) => (
            <div
              key={review.id}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '24px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.borderColor = '#d4af37';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              {/* Girl name with photo at the top */}
              {review.girl_name && (
                <Link
                  href={`/${locale}/profily/${review.girl_slug}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px',
                    textDecoration: 'none'
                  }}
                >
                  {review.girl_photo && (
                    <img
                      src={review.girl_photo}
                      alt={review.girl_name}
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid var(--wine)'
                      }}
                    />
                  )}
                  <div>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#fff',
                      marginBottom: '4px'
                    }}>
                      {review.girl_name}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'var(--wine)',
                      fontWeight: '500'
                    }}>
                      Zobrazit profil →
                    </div>
                  </div>
                </Link>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <div style={{ color: '#9ca3af', fontWeight: '500', fontSize: '13px' }}>
                    {review.author_name}
                    {review.status === 'approved' && (
                      <span style={{ marginLeft: '6px', color: '#10b981', fontSize: '13px' }} title="Ověřeno">✓</span>
                    )}
                    <span style={{ margin: '0 8px', color: '#4b5563' }}>•</span>
                    {formatDate(review.created_at)}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {renderStars(review.rating)}
                </div>
              </div>

              {review.title && (
                <h3 style={{
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  {review.title}
                </h3>
              )}

              <p style={{
                color: '#e5e7eb',
                fontSize: '14px',
                lineHeight: '1.6',
                marginBottom: '12px',
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {review.content}
              </p>

              {/* Vibe and Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                {/* Vibe emoji */}
                {review.vibe && VIBE_OPTIONS[review.vibe as keyof typeof VIBE_OPTIONS] && (
                  <div style={{
                    fontSize: '20px',
                    padding: '4px 8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {VIBE_OPTIONS[review.vibe as keyof typeof VIBE_OPTIONS].emoji}
                  </div>
                )}

                {/* Tags */}
                {review.tags && JSON.parse(review.tags).map((tagId: string) => {
                  const tag = TAG_OPTIONS[tagId as keyof typeof TAG_OPTIONS];
                  if (!tag) return null;
                  return (
                    <span
                      key={tagId}
                      style={{
                        fontSize: '12px',
                        padding: '4px 10px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        color: '#9ca3af',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span>{tag.emoji}</span>
                      <span>{tag.label_cs}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link
            href={`/${locale}/recenze`}
            className="btn"
            style={{
              display: 'inline-block',
              padding: '12px 32px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
          >
            Všechny recenze
          </Link>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          section {
            padding: 2rem 0 !important;
          }
        }
      `}</style>
    </section>
  );
}
