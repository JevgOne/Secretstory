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
  girl_photo?: string;
  girl_slug?: string;
  girl_color?: string;
}

interface ReviewsListProps {
  girlId?: number;
  limit?: number;
  filterTag?: string | null;
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
  filterTag,
  locale = 'cs',
  translations
}: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [votingReview, setVotingReview] = useState<number | null>(null);
  const [translating, setTranslating] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set());

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

  // Generate consistent color for user based on name (WhatsApp style)
  const getAvatarColor = (name: string) => {
    const colors = [
      '#FF6B6B', // red
      '#4ECDC4', // teal
      '#45B7D1', // blue
      '#FFA07A', // salmon
      '#98D8C8', // mint
      '#F7DC6F', // yellow
      '#BB8FCE', // purple
      '#85C1E2', // sky blue
      '#F8B500', // orange
      '#E74C3C', // dark red
      '#3498DB', // bright blue
      '#2ECC71', // green
      '#E67E22', // dark orange
      '#9B59B6', // violet
      '#1ABC9C', // turquoise
      '#34495E', // dark gray blue
    ];

    // Generate hash from name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  const toggleExpanded = (reviewId: number) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="reviews-loading">
        <div className="loading-spinner"></div>
        <p>{translations.loading}</p>

        <style jsx>{`
          .reviews-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 4rem 2rem;
            gap: 1rem;
          }

          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255, 255, 255, 0.1);
            border-top-color: var(--wine);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          .reviews-loading p {
            color: var(--gray);
            font-size: 0.9rem;
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return null;
  }

  // Filter reviews by active tag
  const filteredReviews = filterTag
    ? reviews.filter(review => {
        try {
          const reviewTags = review.tags ? JSON.parse(review.tags) : [];
          return reviewTags.includes(filterTag);
        } catch (e) {
          return false;
        }
      })
    : reviews;

  if (reviews.length === 0) {
    return (
      <div className="reviews-empty">
        <div className="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M7 8h10M7 12h10M7 16h6"/>
            <rect x="3" y="4" width="18" height="18" rx="2"/>
          </svg>
        </div>
        <h4>Zatím žádné recenze</h4>
        <p>{translations.no_reviews}</p>

        <style jsx>{`
          .reviews-empty {
            text-align: center;
            padding: 4rem 2rem;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 20px;
            backdrop-filter: blur(10px);
          }

          .empty-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 1.5rem;
            background: linear-gradient(135deg, rgba(139, 41, 66, 0.2), rgba(92, 28, 46, 0.1));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .empty-icon svg {
            width: 36px;
            height: 36px;
            color: var(--wine);
          }

          .reviews-empty h4 {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--white);
            margin-bottom: 0.5rem;
          }

          .reviews-empty p {
            color: var(--gray);
            font-size: 0.95rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="reviews-list">
      {filteredReviews.length === 0 && filterTag && (
        <div className="reviews-empty" style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.95rem' }}>
            Žádné recenze s tímto tagem. Zkuste jiný tag nebo zrušte filtr.
          </p>
        </div>
      )}
      <div className="reviews-grid">
        {filteredReviews.map((review, index) => {
          const vibe = review.vibe && VIBE_OPTIONS[review.vibe as VibeId];
          const vibeLabel = vibe ? (vibe[`label_${locale}`] || vibe.label_cs) : null;

          let reviewTags: TagId[] = [];
          try {
            reviewTags = review.tags ? JSON.parse(review.tags) : [];
          } catch (e) {
            reviewTags = [];
          }

          return (
            <div
              key={review.id}
              className="review-card"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* Header with Avatar & Vibe */}
              <div className="review-header">
                <div className="review-author">
                  <div className="author-avatar" style={{
                    background: getAvatarColor(review.author_name)
                  }}>
                    <span className="avatar-letter">{review.author_name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="author-info">
                    <div className="author-name">{review.author_name}</div>
                    <div className="review-meta">
                      <ReviewStars rating={review.rating} size="small" />
                      <span className="meta-dot">•</span>
                      <span className="review-date">{formatDate(review.created_at)}</span>
                    </div>
                  </div>
                </div>
                {vibe && (
                  <div
                    className="vibe-badge"
                    style={{
                      background: `linear-gradient(135deg, ${vibe.color}25, ${vibe.color}10)`,
                      borderColor: `${vibe.color}40`
                    }}
                  >
                    <span className="vibe-emoji">{vibe.emoji}</span>
                    <span className="vibe-label" style={{ color: vibe.color }}>
                      {vibeLabel}
                    </span>
                  </div>
                )}
              </div>

              {/* Title */}
              {review.title && (
                <h4 className="review-title">{review.title}</h4>
              )}

              {/* Content */}
              <div className="review-content-wrapper">
                <p className={`review-content ${expandedReviews.has(review.id) ? 'expanded' : ''}`}>
                  {review.content}
                </p>
                {review.content.length > 200 && (
                  <button
                    className="read-more-btn"
                    onClick={() => toggleExpanded(review.id)}
                  >
                    {expandedReviews.has(review.id) ? 'Zobrazit méně' : 'Zobrazit více'}
                  </button>
                )}
              </div>

              {/* Tags */}
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

              {/* Footer */}
              <div className="review-footer">
                <button
                  className={`helpful-button ${votingReview === review.id ? 'voting' : ''}`}
                  onClick={() => handleHelpfulVote(review.id)}
                  disabled={votingReview === review.id}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
                  </svg>
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

        .reviews-grid {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .review-card {
          position: relative;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 1.75rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(12px);
          overflow: hidden;
          animation: fadeIn 0.5s ease-out both;
          display: flex;
          flex-direction: column;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .review-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100%;
          background: linear-gradient(135deg, rgba(139, 41, 66, 0.05) 0%, transparent 50%);
          opacity: 0;
          transition: opacity 0.4s;
          pointer-events: none;
        }

        .review-card:hover {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.09) 0%, rgba(255, 255, 255, 0.04) 100%);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
        }

        .review-card:hover::before {
          opacity: 1;
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.25rem;
          gap: 1rem;
        }

        .review-author {
          display: flex;
          gap: 14px;
          align-items: center;
        }

        .author-avatar {
          position: relative;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
        }

        .avatar-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-letter {
          color: white;
          font-weight: 700;
          font-size: 1.25rem;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
        }

        .author-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .author-name {
          font-weight: 600;
          font-size: 1.05rem;
          color: var(--white);
          letter-spacing: -0.01em;
        }

        .review-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--gray);
        }

        .meta-dot {
          opacity: 0.5;
        }

        .review-date {
          font-size: 0.85rem;
        }

        .review-title {
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--white);
          margin-bottom: 0.875rem;
          line-height: 1.4;
          letter-spacing: -0.02em;
        }

        .review-content-wrapper {
          position: relative;
          flex-grow: 1;
        }

        .review-content {
          color: rgba(255, 255, 255, 0.75);
          line-height: 1.7;
          margin-bottom: 0;
          font-size: 0.95rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .review-content.expanded {
          display: block;
          -webkit-line-clamp: unset;
        }

        .read-more-btn {
          background: none;
          border: none;
          color: var(--wine);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0.5rem 0 0 0;
          margin-top: 0.5rem;
          transition: all 0.2s;
          display: block;
        }

        .read-more-btn:hover {
          color: #a33352;
          text-decoration: underline;
        }

        /* VIBE BADGE */
        .vibe-badge {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.625rem 1rem;
          border-radius: 100px;
          font-size: 0.875rem;
          font-weight: 600;
          border: 1px solid;
          backdrop-filter: blur(8px);
          white-space: nowrap;
          transition: all 0.3s;
        }

        .vibe-badge:hover {
          transform: scale(1.05);
        }

        .vibe-emoji {
          font-size: 1.25rem;
          line-height: 1;
        }

        .vibe-label {
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        /* REVIEW TAGS */
        .review-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.625rem;
          margin-top: 1.25rem;
        }

        .review-tag {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.875rem;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 100px;
          font-size: 0.85rem;
          transition: all 0.3s;
        }

        .review-tag:hover {
          background: rgba(255, 255, 255, 0.09);
          transform: translateY(-2px);
        }

        .tag-emoji {
          font-size: 1.1rem;
          line-height: 1;
        }

        .tag-text {
          color: rgba(255, 255, 255, 0.85);
          font-weight: 500;
        }

        /* REVIEW FOOTER */
        .review-footer {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          margin-top: auto;
          padding-top: 1.25rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .helpful-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1.125rem;
          background: rgba(34, 197, 94, 0.08);
          border: 1px solid rgba(34, 197, 94, 0.25);
          border-radius: 100px;
          color: rgba(34, 197, 94, 0.9);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .helpful-button:hover:not(:disabled) {
          background: rgba(34, 197, 94, 0.15);
          border-color: rgba(34, 197, 94, 0.4);
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2);
        }

        .helpful-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .helpful-button.voting {
          opacity: 0.7;
          pointer-events: none;
        }

        .helpful-button svg {
          transition: transform 0.3s;
        }

        .helpful-button:hover:not(:disabled) svg {
          transform: scale(1.1);
        }

        .helpful-text {
          font-weight: 600;
        }

        .helpful-count {
          background: rgba(34, 197, 94, 0.15);
          padding: 0.25rem 0.625rem;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
          min-width: 24px;
          text-align: center;
          color: rgba(34, 197, 94, 0.95);
        }

        @media (max-width: 768px) {
          .reviews-grid {
            grid-template-columns: 1fr;
          }

          .review-card {
            padding: 1.5rem;
            border-radius: 16px;
          }

          .review-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .vibe-badge {
            align-self: flex-start;
          }

          .review-footer {
            justify-content: center;
          }

          .helpful-button {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .review-card {
            padding: 1.25rem;
          }

          .author-avatar {
            width: 46px;
            height: 46px;
          }

          .avatar-letter {
            font-size: 1.1rem;
          }

          .vibe-badge {
            padding: 0.5rem 0.875rem;
            font-size: 0.8rem;
          }

          .vibe-emoji {
            font-size: 1.125rem;
          }

          .review-tags {
            gap: 0.5rem;
          }

          .review-tag {
            padding: 0.375rem 0.75rem;
            font-size: 0.8rem;
          }

          .helpful-button {
            padding: 0.75rem 1rem;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
}
