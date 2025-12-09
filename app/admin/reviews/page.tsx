"use client";

import { useState, useEffect } from 'react';
import ReviewStars from '@/components/ReviewStars';

interface Review {
  id: number;
  girl_id: number;
  girl_name: string;
  author_name: string;
  author_email?: string;
  rating: number;
  title?: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('pending');
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    // Get user ID from session storage or cookie
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(parseInt(storedUserId));
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    try {
      let url = '/api/reviews';
      if (filter !== 'all') url += `?status=${filter}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId: number) => {
    if (!userId) {
      alert('Musíte být přihlášeni');
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved_by: userId })
      });

      const data = await response.json();

      if (data.success) {
        fetchReviews();
      } else {
        alert(data.error || 'Chyba při schvalování recenze');
      }
    } catch (err) {
      console.error('Error approving review:', err);
      alert('Chyba při schvalování recenze');
    }
  };

  const handleReject = async (reviewId: number) => {
    if (!userId) {
      alert('Musíte být přihlášeni');
      return;
    }

    if (!confirm('Opravdu chcete zamítnout tuto recenzi?')) {
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}/approve`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved_by: userId })
      });

      const data = await response.json();

      if (data.success) {
        fetchReviews();
      } else {
        alert(data.error || 'Chyba při zamítání recenze');
      }
    } catch (err) {
      console.error('Error rejecting review:', err);
      alert('Chyba při zamítání recenze');
    }
  };

  const handleDelete = async (reviewId: number) => {
    if (!confirm('Opravdu chcete smazat tuto recenzi? Tato akce je nevratná.')) {
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        fetchReviews();
      } else {
        alert(data.error || 'Chyba při mazání recenze');
      }
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('Chyba při mazání recenze');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, React.CSSProperties> = {
      approved: { background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' },
      pending: { background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24' },
      rejected: { background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }
    };

    const labels = {
      approved: 'Schváleno',
      pending: 'Čeká',
      rejected: 'Zamítnuto'
    };

    return (
      <span style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '500', ...styles[status] }}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('cs-CZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Správa recenzí</h1>
          <p className="admin-subtitle">Schvalujte a spravujte recenze od klientů</p>
        </div>
      </div>

      <div className="filters">
        <button
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Čekající na schválení
        </button>
        <button
          className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
          onClick={() => setFilter('approved')}
        >
          Schválené
        </button>
        <button
          className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          Zamítnuté
        </button>
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Všechny
        </button>
      </div>

      {loading ? (
        <div className="loading">Načítání...</div>
      ) : (
        <div className="reviews-grid">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="review-meta">
                  <div className="review-author">
                    <div className="author-avatar">
                      {review.author_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="author-name">{review.author_name}</div>
                      {review.author_email && (
                        <div className="author-email">{review.author_email}</div>
                      )}
                    </div>
                  </div>
                  <div className="review-girl">
                    <strong>{review.girl_name}</strong>
                  </div>
                </div>
                <div className="review-info">
                  <ReviewStars rating={review.rating} size="small" />
                  {getStatusBadge(review.status)}
                </div>
              </div>

              {review.title && (
                <h3 className="review-title">{review.title}</h3>
              )}

              <p className="review-content">{review.content}</p>

              <div className="review-footer">
                <div className="review-date">
                  {formatDate(review.created_at)}
                </div>

                <div className="review-actions">
                  {review.status === 'pending' && (
                    <>
                      <button
                        className="action-btn approve"
                        onClick={() => handleApprove(review.id)}
                      >
                        ✓ Schválit
                      </button>
                      <button
                        className="action-btn reject"
                        onClick={() => handleReject(review.id)}
                      >
                        ✕ Zamítnout
                      </button>
                    </>
                  )}
                  <button
                    className="action-btn delete"
                    onClick={() => handleDelete(review.id)}
                  >
                    Smazat
                  </button>
                </div>
              </div>
            </div>
          ))}

          {reviews.length === 0 && (
            <div className="empty-state">
              <p>Žádné recenze nenalezeny</p>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .admin-container {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .admin-header {
          margin-bottom: 2rem;
        }

        .admin-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--white);
          margin-bottom: 0.5rem;
        }

        .admin-subtitle {
          color: var(--gray);
        }

        .filters {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: var(--gray);
          cursor: pointer;
          transition: all 0.3s;
        }

        .filter-btn:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .filter-btn.active {
          background: var(--wine);
          color: white;
          border-color: var(--wine);
        }

        .loading {
          text-align: center;
          padding: 3rem;
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
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          gap: 1rem;
        }

        .review-meta {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .review-author {
          display: flex;
          gap: 12px;
          align-items: center;
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
          flex-shrink: 0;
        }

        .author-name {
          font-weight: 500;
          color: var(--white);
        }

        .author-email {
          font-size: 0.85rem;
          color: var(--gray);
        }

        .review-girl {
          font-size: 0.9rem;
          color: var(--gray);
        }

        .review-girl strong {
          color: var(--accent);
        }

        .review-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
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
          margin-bottom: 1rem;
        }

        .review-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          gap: 1rem;
        }

        .review-date {
          font-size: 0.85rem;
          color: var(--gray);
        }

        .review-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .action-btn {
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: all 0.3s;
        }

        .action-btn.approve {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
        }

        .action-btn.approve:hover {
          background: rgba(34, 197, 94, 0.3);
        }

        .action-btn.reject {
          background: rgba(251, 191, 36, 0.2);
          color: #fbbf24;
        }

        .action-btn.reject:hover {
          background: rgba(251, 191, 36, 0.3);
        }

        .action-btn.delete {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .action-btn.delete:hover {
          background: rgba(239, 68, 68, 0.3);
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          color: var(--gray);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
        }

        @media (max-width: 768px) {
          .review-header {
            flex-direction: column;
          }

          .review-info {
            flex-direction: row;
            align-items: center;
          }

          .review-footer {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
