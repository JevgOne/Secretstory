"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { VIBE_OPTIONS, TAG_OPTIONS } from '@/lib/review-constants';
import { translateReviews } from '@/lib/review-translation';

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
  helpful_count?: number;
}

interface ReviewsSectionProps {
  initialReviews?: Review[];
}

export default function ReviewsSection({ initialReviews = [] }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [loading, setLoading] = useState(initialReviews.length === 0);
  const [translating, setTranslating] = useState(false);
  const locale = useLocale();
  const t = useTranslations('home');

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

  // Auto-translate reviews when locale changes (only for non-Czech)
  useEffect(() => {
    async function translateReviewsData() {
      if (locale === 'cs' || reviews.length === 0) {
        return; // No translation needed for Czech
      }

      setTranslating(true);
      try {
        const translated = await translateReviews(reviews, locale);
        setReviews(translated);
      } catch (error) {
        console.error('Error translating reviews:', error);
      } finally {
        setTranslating(false);
      }
    }

    translateReviewsData();
  }, [locale]);

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
    // Map locale to proper locale code
    const localeMap: Record<string, string> = {
      cs: 'cs-CZ',
      en: 'en-US',
      de: 'de-DE',
      uk: 'uk-UA'
    };
    const localeCode = localeMap[locale] || 'cs-CZ';
    return date.toLocaleDateString(localeCode, { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <section style={{ padding: '2.5rem 0', background: 'rgba(0, 0, 0, 0.2)' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 className="section-title">{t('reviews_title')}</h2>
          <p className="section-subtitle">{t('reviews_subtitle')}</p>
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
                      {t('view_profile')}
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
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
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

              {/* Helpful count */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#9ca3af',
                fontSize: '13px',
                fontWeight: '500'
              }}>
                <span>👍</span>
                <span>Užitečné</span>
                {review.helpful_count !== undefined && review.helpful_count > 0 && (
                  <span style={{
                    background: 'rgba(212, 175, 55, 0.15)',
                    color: '#d4af37',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {review.helpful_count}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link
            href={`/${locale}/recenze`}
            style={{
              display: 'inline-block',
              padding: '12px 32px',
              background: 'linear-gradient(135deg, rgba(139, 21, 56, 0.9) 0%, rgba(176, 27, 71, 0.9) 100%)',
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.95rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(139, 21, 56, 0.4)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 21, 56, 0.6)';
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139, 21, 56, 1) 0%, rgba(176, 27, 71, 1) 100%)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 21, 56, 0.4)';
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139, 21, 56, 0.9) 0%, rgba(176, 27, 71, 0.9) 100%)';
            }}
          >
            {t('reviews_all')}
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
