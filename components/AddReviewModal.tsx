"use client";

import React, { useState, useEffect } from 'react';

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  girls: { id: number; name: string }[];
  onSuccess: () => void;
}

export default function AddReviewModal({ isOpen, onClose, girls, onSuccess }: AddReviewModalProps) {
  console.log('[AddReviewModal] Rendered with isOpen:', isOpen, 'girls:', girls.length);

  const [formData, setFormData] = useState({
    girl_id: '',
    author_name: '',
    author_email: '',
    rating: 5,
    title: '',
    content: '',
    status: 'approved',
    created_at: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Log when isOpen changes
  useEffect(() => {
    console.log('[AddReviewModal] isOpen changed to:', isOpen);
    if (isOpen) {
      console.log('[AddReviewModal] Modal SHOULD be visible now!');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.girl_id || !formData.author_name || !formData.content) {
      setError('Vyplňte povinná pole');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/admin/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          girl_id: parseInt(formData.girl_id),
          created_at: formData.created_at || undefined
        })
      });

      const data = await response.json();

      if (data.success) {
        setFormData({
          girl_id: '',
          author_name: '',
          author_email: '',
          rating: 5,
          title: '',
          content: '',
          status: 'approved',
          created_at: ''
        });
        onSuccess();
        onClose();
      } else {
        setError(data.error || 'Chyba při vytváření recenze');
      }
    } catch (err) {
      console.error('Error creating review:', err);
      setError('Chyba při vytváření recenze');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✍️ Přidat novou recenzi</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Dívka *</label>
              <select
                value={formData.girl_id}
                onChange={(e) => setFormData({ ...formData, girl_id: e.target.value })}
                required
              >
                <option value="">Vyberte dívku</option>
                {girls.map((girl) => (
                  <option key={girl.id} value={girl.id}>{girl.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Hodnocení *</label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                required
              >
                <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                <option value="4">⭐⭐⭐⭐ (4)</option>
                <option value="3">⭐⭐⭐ (3)</option>
                <option value="2">⭐⭐ (2)</option>
                <option value="1">⭐ (1)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Jméno autora *</label>
              <input
                type="text"
                value={formData.author_name}
                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                placeholder="Jan Novák"
                required
              />
            </div>

            <div className="form-group">
              <label>Email autora</label>
              <input
                type="email"
                value={formData.author_email}
                onChange={(e) => setFormData({ ...formData, author_email: e.target.value })}
                placeholder="jan@email.cz"
              />
            </div>

            <div className="form-group full-width">
              <label>Nadpis</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Shrnutí zkušenosti"
              />
            </div>

            <div className="form-group full-width">
              <label>Obsah recenze *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Popište svou zkušenost..."
                rows={5}
                required
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="approved">Schváleno</option>
                <option value="pending">Čeká na schválení</option>
              </select>
            </div>

            <div className="form-group">
              <label>Datum recenze (nepovinné)</label>
              <input
                type="datetime-local"
                value={formData.created_at}
                onChange={(e) => setFormData({ ...formData, created_at: e.target.value })}
                placeholder="Pro staré recenze"
              />
              <small>Nechte prázdné pro aktuální datum</small>
            </div>
          </div>

          {error && (
            <div className="error-message">⚠️ {error}</div>
          )}

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={submitting}>
              Zrušit
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Vytváření...' : '✓ Vytvořit recenzi'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          padding: 1rem;
        }

        .modal-content {
          background: #1f1f23;
          border-radius: 16px;
          width: 100%;
          max-width: 700px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #2d2d31;
        }

        .modal-header h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #9ca3af;
          cursor: pointer;
          padding: 0.25rem;
          line-height: 1;
          transition: color 0.2s;
        }

        .modal-close:hover {
          color: #ffffff;
        }

        form {
          padding: 2rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        label {
          font-weight: 500;
          color: #e5e7eb;
          font-size: 0.9rem;
        }

        input, select, textarea {
          padding: 0.75rem;
          background: #2d2d31;
          border: 1px solid #3d3d41;
          border-radius: 8px;
          color: #ffffff;
          font-size: 0.95rem;
          transition: border-color 0.2s;
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #d4af37;
        }

        textarea {
          resize: vertical;
          font-family: inherit;
        }

        small {
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .error-message {
          padding: 0.75rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          color: #ef4444;
          font-size: 0.9rem;
          margin-top: 1rem;
        }

        .modal-footer {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          padding-top: 1.5rem;
          border-top: 1px solid #2d2d31;
          margin-top: 1.5rem;
        }

        button {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          font-size: 0.95rem;
        }

        .btn-secondary {
          background: #2d2d31;
          color: #e5e7eb;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #3d3d41;
        }

        .btn-primary {
          background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
          color: #1f1f23;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(212, 175, 55, 0.4);
        }

        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .modal-content {
            max-height: 95vh;
          }

          form {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
