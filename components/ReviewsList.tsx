"use client";

import { useEffect, useState } from 'react';
import ReviewStars from './ReviewStars';
import { VIBE_OPTIONS, TAG_OPTIONS, type VibeId, type TagId } from '@/lib/review-constants';
import { translateReviews } from '@/lib/review-translation';

interface Review {
  id: number;
  author_name: string;
  rating: number;
  title?: string;
  content: string;
  vibe?: string;
  tags?: string;
  helpful_count?: number;
  created_at: string;
  girl_name?: string;
}

interface ReviewsListProps {
  girlId?: number;
  limit?: number;
  locale?: 'cs' | 'en' | 'de' | 'uk';
  translations: {
    title: string;
    no_reviews: string;
    loading: string;
    verified_booking: string;
    reviewed_on: string;
    helpful?: string;
  };
}

export default function ReviewsList({
  girlId,
  limit,
  locale = 'cs',
  translations
}: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [votingReview, setVotingReview] = useState<number | null>(null);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [girlId]);

  const fetchReviews = async () => {
    try {
      let url = '/api/reviews?status=approved';
      if (girlId) url += `&girl_id=${girlId}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        let reviewsList = data.reviews;
        if (limit) reviewsList = reviewsList.slice(0, limit);
        setReviews(reviewsList);
      } else {
        setError(data.error || 'Failed to load reviews');
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

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
  }, [locale, reviews.length]);

  const handleHelpfulVote = async (reviewId: number) => {
    if (votingReview) return;

    setVotingReview(reviewId);

    try {
      const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST'
      });

      const data = await response.json();

      if (data.success) {
        // Update the review's helpful count in state
        setReviews(prev => prev.map(review =>
          review.id === reviewId
            ? { ...review, helpful_count: data.helpful_count }
            : review
        ));
      } else {
        console.error('Failed to vote:', data.error);
      }
    } catch (err) {
      console.error('Error voting helpful:', err);
    } finally {
      setVotingReview(null);
    }
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

  if (loading) {
    return (
      <div className="reviews-loading">
        {translations.loading}
      </div>
    );
  }

  if (error) {
    return null;
  }

  if (reviews.length === 0) {
    return (
      <div className="reviews-empty">
        <div className="empty-icon">📝</div>
        <p>{translations.no_reviews}</p>

        <style jsx>{`
          .reviews-empty {
            text-align: center;
            padding: 3rem 1.5rem;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
          }

          .empty-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            opacity: 0.5;
          }

          .reviews-empty p {
            color: var(--gray);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="reviews-list">
      <div className="reviews-grid">
        {reviews.map((review) => {
          const vibe = review.vibe && VIBE_OPTIONS[review.vibe as VibeId];
          const vibeLabel = vibe ? (vibe[`label_${locale}`] || vibe.label_cs) : null;

          let reviewTags: TagId[] = [];
          try {
            reviewTags = review.tags ? JSON.parse(review.tags) : [];
          } catch (e) {
            reviewTags = [];
          }

          return (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="review-author">
                  <div className="author-avatar">
                    {review.author_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="author-info">
                    <div className="author-name">{review.author_name}</div>
                    <div className="review-date">{formatDate(review.created_at)}</div>
                  </div>
                </div>
                <div className="header-right">
                  {vibe && (
                    <div
                      className="vibe-badge"
                      style={{
                        background: `${vibe.color}20`,
                        border: `1px solid ${vibe.color}40`
                      }}
                    >
                      <span className="vibe-emoji">{vibe.emoji}</span>
                      <span className="vibe-label" style={{ color: vibe.color }}>
                        {vibeLabel}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {review.title && (
                <h4 className="review-title">{review.title}</h4>
              )}

              <p className="review-content">{review.content}</p>

              {reviewTags.length > 0 && (
                <div className="review-tags">
                  {reviewTags.map((tagId) => {
                    const tag = TAG_OPTIONS[tagId];
                    if (!tag) return null;
                    const tagLabel = tag[`label_${locale}`] || tag.label_cs;
                    return (
                      <div key={tagId} className="review-tag">
                        <span className="tag-emoji">{tag.emoji}</span>
                        <span className="tag-text">{tagLabel}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="review-footer">
                {review.girl_name && (
                  <div className="review-girl">
                    Recenze na: <strong>{review.girl_name}</strong>
                  </div>
                )}
                <button
                  className={`helpful-button ${votingReview === review.id ? 'voting' : ''}`}
                  onClick={() => handleHelpfulVote(review.id)}
                  disabled={votingReview === review.id}
                >
                  <span className="helpful-icon">👍</span>
                  <span className="helpful-text">{translations.helpful || 'Užitečné'}</span>
                  {review.helpful_count !== undefined && review.helpful_count > 0 && (
                    <span className="helpful-count">{review.helpful_count}</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .reviews-list {
          margin-top: 0;
        }

        .reviews-loading {
          text-align: center;
          padding: 2rem;
          color: var(--gray);
        }

        .reviews-grid {
          display: grid;
          gap: 1.5rem;
        }

        .review-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.3s;
        }

        .review-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .review-author {
          display: flex;
          gap: 12px;
        }

        .author-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--wine);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .author-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .author-name {
          font-weight: 500;
          color: var(--white);
        }

        .review-date {
          font-size: 0.85rem;
          color: var(--gray);
        }

        .review-title {
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--white);
          margin-bottom: 0.75rem;
        }

        .review-content {
          color: var(--gray);
          line-height: 1.6;
          margin-bottom: 0;
        }

        .review-girl {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 0.9rem;
          color: var(--gray);
        }

        .review-girl strong {
          color: var(--white);
        }

        /* VIBE BADGE */
        .header-right {
          display: flex;
          align-items: center;
        }

        .vibe-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.875rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .vibe-emoji {
          font-size: 1.25rem;
          line-height: 1;
        }

        .vibe-label {
          font-weight: 600;
        }

        /* REVIEW TAGS */
        .review-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .review-tag {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          font-size: 0.8rem;
        }

        .tag-emoji {
          font-size: 1rem;
        }

        .tag-text {
          color: rgba(255, 255, 255, 0.8);
        }

        /* REVIEW FOOTER */
        .review-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          gap: 1rem;
        }

        .helpful-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: var(--white);
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .helpful-button:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .helpful-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .helpful-button.voting {
          opacity: 0.8;
        }

        .helpful-icon {
          font-size: 1rem;
        }

        .helpful-text {
          font-weight: 500;
        }

        .helpful-count {
          background: rgba(255, 255, 255, 0.1);
          padding: 0.125rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .review-header {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }

          .header-right {
            justify-content: flex-start;
          }

          .review-footer {
            flex-direction: column;
            align-items: stretch;
          }

          .helpful-button {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .review-card {
            padding: 1.25rem;
          }

          .vibe-badge {
            padding: 0.375rem 0.75rem;
            font-size: 0.8rem;
          }

          .vibe-emoji {
            font-size: 1.125rem;
          }

          .review-tags {
            gap: 0.375rem;
          }

          .review-tag {
            padding: 0.25rem 0.625rem;
            font-size: 0.75rem;
          }

          .helpful-button {
            padding: 0.625rem 0.875rem;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}
