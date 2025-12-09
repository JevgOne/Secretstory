"use client";

import { useEffect, useState } from 'react';
import ReviewStars from './ReviewStars';

interface Review {
  id: number;
  author_name: string;
  rating: number;
  title?: string;
  content: string;
  created_at: string;
  girl_name?: string;
}

interface ReviewsListProps {
  girlId?: number;
  limit?: number;
  translations: {
    title: string;
    no_reviews: string;
    loading: string;
    verified_booking: string;
    reviewed_on: string;
  };
}

export default function ReviewsList({
  girlId,
  limit,
  translations
}: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Dnes';
    if (diffDays === 1) return 'Včera';
    if (diffDays < 7) return `Před ${diffDays} dny`;
    if (diffDays < 30) return `Před ${Math.floor(diffDays / 7)} týdny`;
    if (diffDays < 365) return `Před ${Math.floor(diffDays / 30)} měsíci`;
    return date.toLocaleDateString('cs-CZ');
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
      <h3 className="reviews-title">{translations.title}</h3>

      <div className="reviews-grid">
        {reviews.map((review) => (
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
              <ReviewStars rating={review.rating} size="small" />
            </div>

            {review.title && (
              <h4 className="review-title">{review.title}</h4>
            )}

            <p className="review-content">{review.content}</p>

            {review.girl_name && (
              <div className="review-girl">
                Recenze na: <strong>{review.girl_name}</strong>
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .reviews-list {
          margin-top: 2rem;
        }

        .reviews-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--white);
          margin-bottom: 1.5rem;
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

        @media (max-width: 768px) {
          .review-header {
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
}
