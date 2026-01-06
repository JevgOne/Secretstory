"use client";

import AdminHeader from '@/components/AdminHeader';
import { useState, useEffect } from 'react';
import ReviewStars from '@/components/ReviewStars';
import AddReviewModal from '@/components/AddReviewModal';

interface Review {
  id: number;
  girl_id: number;
  girl_name: string;
  author_name: string;
  author_email?: string;
  ip_address?: string;
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [girls, setGirls] = useState<{id: number; name: string}[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Get user ID from session storage or cookie
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(parseInt(storedUserId));
    }
  }, []);

  useEffect(() => {
    fetchReviews();
    fetchGirls();
  }, [filter]);

  const fetchGirls = async () => {
    try {
      const response = await fetch('/api/girls?status=active');
      const data = await response.json();
      if (data.success) {
        setGirls(data.girls.map((g: any) => ({ id: g.id, name: g.name })));
      }
    } catch (err) {
      console.error('Error fetching girls:', err);
    }
  };

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
    <>
      <AdminHeader title="Správa recenzí" showBack={true} />
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <p className="admin-subtitle">Schvalujte a spravujte recenze od klientů</p>
          </div>
          <button
            className="btn-add-review"
            onClick={() => setShowAddModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
              color: '#1f1f23',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(212, 175, 55, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.3)';
            }}
          >
            ✍️ Nová recenze
          </button>
        </div>

      <div className="filters">
        <button
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          ⏳ Čekající na schválení
        </button>
        <button
          className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
          onClick={() => setFilter('approved')}
        >
          ✅ Schválené
        </button>
        <button
          className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          ❌ Zamítnuté
        </button>
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          📋 Všechny
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
                      {review.ip_address && (
                        <div className="author-ip">IP: {review.ip_address}</div>
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
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          border: 'none',
                          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                          color: '#ffffff',
                          boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)',
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 16px rgba(34, 197, 94, 0.4)';
                          e.currentTarget.style.background = 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(34, 197, 94, 0.3)';
                          e.currentTarget.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
                        }}
                        onClick={() => handleApprove(review.id)}
                      >
                        ✅ Schválit
                      </button>
                      <button
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          border: 'none',
                          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                          color: '#1f1f23',
                          boxShadow: '0 2px 8px rgba(251, 191, 36, 0.3)',
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 16px rgba(251, 191, 36, 0.4)';
                          e.currentTarget.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(251, 191, 36, 0.3)';
                          e.currentTarget.style.background = 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)';
                        }}
                        onClick={() => handleReject(review.id)}
                      >
                        ⚠️ Zamítnout
                      </button>
                    </>
                  )}
                  <button
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      border: 'none',
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: '#ffffff',
                      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
                      e.currentTarget.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.3)';
                      e.currentTarget.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                    }}
                    onClick={() => handleDelete(review.id)}
                  >
                    🗑️ Smazat
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

      {/* Add Review Modal */}
      <AddReviewModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        girls={girls}
        onSuccess={() => {
          fetchReviews();
          alert('Recenze byla úspěšně vytvořena!');
        }}
      />

      <style jsx>{`
        .admin-container {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .admin-header {
          margin-bottom: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .admin-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--white);
          margin-bottom: 0.5rem;
        }

        .admin-subtitle {
          color: #9ca3af;
        }

        .filters {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 0.75rem 1.5rem;
          background: #2d2d31;
          border: 1px solid #3d3d41;
          border-radius: 8px;
          color: #9ca3af;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-weight: 500;
          font-size: 0.9rem;
        }

        .filter-btn:hover {
          background: #35353a;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          border-color: #4d4d51;
        }

        .filter-btn.active {
          background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
          color: #1f1f23;
          border-color: transparent;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
        }

        .filter-btn.active:hover {
          box-shadow: 0 6px 16px rgba(212, 175, 55, 0.4);
        }

        .loading {
          text-align: center;
          padding: 3rem;
          color: #9ca3af;
        }

        .reviews-grid {
          display: grid;
          gap: 1.5rem;
        }

        .review-card {
          background: #1f1f23;
          border: 1px solid #2d2d31;
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .review-card:hover {
          border-color: #3d3d41;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
          transform: translateY(-2px);
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
          background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1f1f23;
          font-weight: 700;
          font-size: 1.1rem;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
        }

        .author-name {
          font-weight: 500;
          color: #ffffff;
        }

        .author-email {
          font-size: 0.85rem;
          color: #9ca3af;
        }

        .author-ip {
          font-size: 0.75rem;
          color: #6b7280;
          font-family: monospace;
          background: rgba(107, 114, 128, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          display: inline-block;
          margin-top: 4px;
        }

        .review-girl {
          font-size: 0.9rem;
          color: #9ca3af;
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
          color: #ffffff;
          margin-bottom: 0.75rem;
        }

        .review-content {
          color: #9ca3af;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .review-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid #2d2d31;
          gap: 1rem;
        }

        .review-date {
          font-size: 0.85rem;
          color: #9ca3af;
        }

        .review-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .action-btn svg {
          flex-shrink: 0;
        }

        .action-btn.approve {
          background: rgba(34, 197, 94, 0.15);
          color: #22c55e;
          border-color: rgba(34, 197, 94, 0.3);
        }

        .action-btn.approve:hover {
          background: rgba(34, 197, 94, 0.25);
          border-color: rgba(34, 197, 94, 0.5);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2);
        }

        .action-btn.reject {
          background: rgba(251, 191, 36, 0.15);
          color: #fbbf24;
          border-color: rgba(251, 191, 36, 0.3);
        }

        .action-btn.reject:hover {
          background: rgba(251, 191, 36, 0.25);
          border-color: rgba(251, 191, 36, 0.5);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(251, 191, 36, 0.2);
        }

        .action-btn.delete {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.3);
        }

        .action-btn.delete:hover {
          background: rgba(239, 68, 68, 0.25);
          border-color: rgba(239, 68, 68, 0.5);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          color: #9ca3af;
          background: #1f1f23;
          border: 1px solid #2d2d31;
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
    </>
  );
}
