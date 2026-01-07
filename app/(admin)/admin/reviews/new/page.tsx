"use client";

import AdminHeader from '@/components/AdminHeader';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { VIBE_OPTIONS, TAG_OPTIONS, type VibeId, type TagId } from '@/lib/review-constants';

export default function NewReviewPage() {
  const router = useRouter();
  const [girls, setGirls] = useState<{ id: number; name: string }[]>([]);
  const [formData, setFormData] = useState({
    girl_id: '',
    author_name: '',
    author_email: '',
    rating: 5,
    title: '',
    content: '',
    status: 'approved',
    created_at: '',
    vibe: '' as VibeId | '',
    tags: [] as TagId[]
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGirls();
  }, []);

  // Helper to toggle tag selection (max 4)
  const toggleTag = (tagId: TagId) => {
    setFormData(prev => {
      const currentTags = prev.tags;
      if (currentTags.includes(tagId)) {
        return { ...prev, tags: currentTags.filter(t => t !== tagId) };
      } else if (currentTags.length < 4) {
        return { ...prev, tags: [...currentTags, tagId] };
      }
      return prev;
    });
  };

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
          created_at: formData.created_at || undefined,
          vibe: formData.vibe || null,
          tags: formData.tags
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Recenze byla úspěšně vytvořena!');
        router.push('/admin/reviews');
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

  return (
    <>
      <AdminHeader title="Přidat novou recenzi" showBack={true} />
      <div className="admin-container">
        <div className="form-card">
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

              {/* VIBE PICKER */}
              <div className="form-group full-width">
                <label>Vibe ✨</label>
                <div className="vibe-picker">
                  {Object.entries(VIBE_OPTIONS).map(([key, vibe]) => {
                    const vibeId = key as VibeId;
                    const isSelected = formData.vibe === vibeId;

                    return (
                      <button
                        key={vibeId}
                        type="button"
                        className={`vibe-option ${isSelected ? 'active' : ''}`}
                        style={{
                          borderColor: isSelected ? vibe.color : 'rgba(255, 255, 255, 0.1)',
                          background: isSelected ? `${vibe.color}20` : 'rgba(255, 255, 255, 0.03)'
                        }}
                        onClick={() => setFormData({ ...formData, vibe: vibeId })}
                      >
                        <span className="vibe-emoji">{vibe.emoji}</span>
                        <span className="vibe-label" style={{ color: isSelected ? vibe.color : '#9ca3af' }}>
                          {vibe.label_cs}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TAG PICKER */}
              <div className="form-group full-width">
                <label>
                  Tagy
                  <span className="tag-info"> ({formData.tags.length}/4)</span>
                </label>
                <div className="tag-picker">
                  {Object.entries(TAG_OPTIONS).map(([key, tag]) => {
                    const tagId = key as TagId;
                    const isSelected = formData.tags.includes(tagId);
                    const isDisabled = !isSelected && formData.tags.length >= 4;

                    return (
                      <button
                        key={tagId}
                        type="button"
                        className={`tag-option ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                        onClick={() => !isDisabled && toggleTag(tagId)}
                        disabled={isDisabled}
                      >
                        <span className="tag-emoji">{tag.emoji}</span>
                        <span className="tag-label">{tag.label_cs}</span>
                      </button>
                    );
                  })}
                </div>
                <small style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                  Můžete vybrat až 4 tagy
                </small>
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
                />
                <small>Nechte prázdné pro aktuální datum</small>
              </div>
            </div>

            {error && (
              <div className="error-message">⚠️ {error}</div>
            )}

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => router.push('/admin/reviews')}
                disabled={submitting}
              >
                Zrušit
              </button>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Vytváření...' : '✓ Vytvořit recenzi'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .admin-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem;
        }

        .form-card {
          background: #1f1f23;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
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

        .form-actions {
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

        /* VIBE PICKER STYLES */
        .vibe-picker {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .vibe-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.03);
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          flex: 1;
          min-width: fit-content;
        }

        .vibe-option:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .vibe-option.active {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25),
                      0 0 0 1px rgba(255, 255, 255, 0.1) inset;
        }

        .vibe-emoji {
          font-size: 1.5rem;
          line-height: 1;
        }

        .vibe-label {
          font-size: 0.9rem;
          font-weight: 600;
          transition: color 0.3s;
          white-space: nowrap;
        }

        /* TAG PICKER STYLES */
        .tag-info {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.85rem;
          font-weight: normal;
        }

        .tag-picker {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 0.75rem;
        }

        .tag-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.03);
          cursor: pointer;
          transition: all 0.2s;
        }

        .tag-option:hover:not(.disabled) {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .tag-option.selected {
          background: rgba(212, 175, 55, 0.2);
          border-color: #d4af37;
          box-shadow: 0 0 0 1px rgba(212, 175, 55, 0.3);
        }

        .tag-option.disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .tag-emoji {
          font-size: 1.25rem;
          line-height: 1;
        }

        .tag-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #e5e7eb;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .admin-container {
            padding: 1rem;
          }

          .form-card {
            padding: 1.5rem;
          }

          .vibe-picker {
            justify-content: space-between;
          }

          .vibe-option {
            flex: 1 1 calc(50% - 0.375rem);
          }

          .tag-picker {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </>
  );
}
