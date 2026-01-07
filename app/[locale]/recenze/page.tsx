'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
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
  helpful_count?: number;
}

interface Girl {
  id: number;
  name: string;
  slug: string;
}

export default function ReviewsPage() {
  const locale = useLocale();
  const t = useTranslations('reviews');
  const tHome = useTranslations('home');

  const [reviews, setReviews] = useState<Review[]>([]);
  const [girls, setGirls] = useState<Girl[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedGirl, setSelectedGirl] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<string>('');
  const [selectedVibe, setSelectedVibe] = useState<string>('');

  // Fetch girls for filter
  useEffect(() => {
    async function fetchGirls() {
      try {
        const response = await fetch('/api/girls?status=active');
        const data = await response.json();
        if (data.success) {
          setGirls(data.girls.map((g: any) => ({ id: g.id, name: g.name, slug: g.slug })));
        }
      } catch (error) {
        console.error('Error fetching girls:', error);
      }
    }
    fetchGirls();
  }, []);

  // Fetch reviews with filters
  useEffect(() => {
    async function fetchReviews() {
      setLoading(true);
      try {
        let url = '/api/reviews?status=approved';
        if (selectedGirl) url += `&girl_id=${selectedGirl}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
          let filtered = data.reviews;

          // Client-side filtering for rating
          if (selectedRating) {
            const minRating = parseInt(selectedRating);
            filtered = filtered.filter((r: Review) => r.rating >= minRating);
          }

          // Client-side filtering for vibe
          if (selectedVibe) {
            filtered = filtered.filter((r: Review) => r.vibe === selectedVibe);
          }

          setReviews(filtered);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [selectedGirl, selectedRating, selectedVibe]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? '#d4af37' : '#4b5563', fontSize: '18px' }}>
        ★
      </span>
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const localeMap: Record<string, string> = {
      cs: 'cs-CZ',
      en: 'en-US',
      de: 'de-DE',
      uk: 'uk-UA'
    };
    const localeCode = localeMap[locale] || 'cs-CZ';
    return date.toLocaleDateString(localeCode, { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const resetFilters = () => {
    setSelectedGirl('');
    setSelectedRating('');
    setSelectedVibe('');
  };

  const activeFiltersCount = [selectedGirl, selectedRating, selectedVibe].filter(Boolean).length;

  return (
    <>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">{tHome('reviews_title')}</h1>
          <p className="page-subtitle">{tHome('reviews_subtitle')}</p>
        </div>

        {/* Filters */}
        <div className="filters-container">
          <div className="filters-grid">
            {/* Girl Filter */}
            <div className="filter-group">
              <label className="filter-label">Dívka</label>
              <select
                className="filter-select"
                value={selectedGirl}
                onChange={(e) => setSelectedGirl(e.target.value)}
              >
                <option value="">Všechny dívky</option>
                {girls.map((girl) => (
                  <option key={girl.id} value={girl.id}>{girl.name}</option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div className="filter-group">
              <label className="filter-label">Hodnocení</label>
              <select
                className="filter-select"
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
              >
                <option value="">Všechna hodnocení</option>
                <option value="5">⭐⭐⭐⭐⭐ (5 hvězd)</option>
                <option value="4">⭐⭐⭐⭐ (4+ hvězd)</option>
                <option value="3">⭐⭐⭐ (3+ hvězd)</option>
              </select>
            </div>

            {/* Vibe Filter */}
            <div className="filter-group">
              <label className="filter-label">Atmosféra</label>
              <select
                className="filter-select"
                value={selectedVibe}
                onChange={(e) => setSelectedVibe(e.target.value)}
              >
                <option value="">Všechny</option>
                {Object.entries(VIBE_OPTIONS).map(([key, vibe]) => (
                  <option key={key} value={key}>
                    {vibe.emoji} {vibe.label_cs}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            {activeFiltersCount > 0 && (
              <div className="filter-group">
                <label className="filter-label">&nbsp;</label>
                <button className="reset-btn" onClick={resetFilters}>
                  ✕ Vymazat filtry ({activeFiltersCount})
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="loading">Načítání recenzí...</div>
        ) : reviews.length === 0 ? (
          <div className="no-reviews">
            <p>Žádné recenze nebyly nalezeny.</p>
            {activeFiltersCount > 0 && (
              <button className="reset-btn-secondary" onClick={resetFilters}>
                Vymazat filtry
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="reviews-count">
              Zobrazeno {reviews.length} {reviews.length === 1 ? 'recenze' : reviews.length < 5 ? 'recenze' : 'recenzí'}
            </div>

            <div className="reviews-grid">
              {reviews.map((review) => (
                <div key={review.id} className="review-card">
                  {/* Girl name with photo at the top */}
                  {review.girl_name && (
                    <Link
                      href={`/${locale}/profily/${review.girl_slug}`}
                      className="review-girl-link"
                    >
                      {review.girl_photo && (
                        <img
                          src={review.girl_photo}
                          alt={review.girl_name}
                          className="review-girl-photo"
                        />
                      )}
                      <div>
                        <div className="review-girl-name">{review.girl_name}</div>
                        <div className="review-view-profile">Zobrazit profil</div>
                      </div>
                    </Link>
                  )}

                  <div className="review-header">
                    <div>
                      <div className="review-author">
                        {review.author_name}
                        {review.status === 'approved' && (
                          <span className="review-verified" title="Ověřeno">✓</span>
                        )}
                        <span className="review-separator">•</span>
                        {formatDate(review.created_at)}
                      </div>
                    </div>
                    <div className="review-stars">
                      {renderStars(review.rating)}
                    </div>
                  </div>

                  {review.title && (
                    <h3 className="review-title">{review.title}</h3>
                  )}

                  <p className="review-content">{review.content}</p>

                  {/* Vibe and Tags */}
                  <div className="review-meta">
                    {review.vibe && VIBE_OPTIONS[review.vibe as keyof typeof VIBE_OPTIONS] && (
                      <div className="review-vibe">
                        {VIBE_OPTIONS[review.vibe as keyof typeof VIBE_OPTIONS].emoji}
                      </div>
                    )}

                    {review.tags && JSON.parse(review.tags).map((tagId: string) => {
                      const tag = TAG_OPTIONS[tagId as keyof typeof TAG_OPTIONS];
                      if (!tag) return null;
                      return (
                        <span key={tagId} className="review-tag">
                          <span>{tag.emoji}</span>
                          <span>{tag.label_cs}</span>
                        </span>
                      );
                    })}
                  </div>

                  {/* Helpful count */}
                  <div className="review-helpful">
                    <span>👍</span>
                    <span>Užitečné</span>
                    {review.helpful_count !== undefined && review.helpful_count > 0 && (
                      <span className="review-helpful-count">{review.helpful_count}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .page-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          min-height: 60vh;
        }

        .page-header {
          text-align: center;
          margin-bottom: 2.5rem;
          padding-top: 1rem;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 0.5rem 0;
          background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .page-subtitle {
          font-size: 1.125rem;
          color: #9ca3af;
          font-weight: 500;
        }

        .filters-container {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          align-items: end;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filter-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .filter-select {
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #ffffff;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-select:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(212, 175, 55, 0.3);
        }

        .filter-select:focus {
          outline: none;
          border-color: var(--gold);
          background: rgba(255, 255, 255, 0.08);
        }

        .reset-btn,
        .reset-btn-secondary {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.8) 0%, rgba(220, 38, 38, 0.8) 100%);
          border: none;
          border-radius: 8px;
          color: #ffffff;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
        }

        .reset-btn:hover,
        .reset-btn-secondary:hover {
          background: linear-gradient(135deg, rgba(239, 68, 68, 1) 0%, rgba(220, 38, 38, 1) 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }

        .reset-btn-secondary {
          margin-top: 1rem;
          max-width: 200px;
        }

        .reviews-count {
          text-align: center;
          color: #9ca3af;
          font-size: 0.95rem;
          font-weight: 500;
          margin-bottom: 1.5rem;
        }

        .loading,
        .no-reviews {
          text-align: center;
          padding: 4rem 2rem;
          color: #9ca3af;
          font-size: 1.125rem;
        }

        .no-reviews {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
        }

        .no-reviews p {
          margin: 0 0 1rem 0;
        }

        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .review-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .review-card:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: var(--gold);
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
        }

        .review-girl-link {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          text-decoration: none;
        }

        .review-girl-photo {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--wine);
        }

        .review-girl-name {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 4px;
        }

        .review-view-profile {
          font-size: 12px;
          color: var(--wine);
          font-weight: 500;
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .review-author {
          color: #9ca3af;
          font-weight: 500;
          font-size: 13px;
        }

        .review-verified {
          margin-left: 6px;
          color: #10b981;
          font-size: 13px;
        }

        .review-separator {
          margin: 0 8px;
          color: #4b5563;
        }

        .review-stars {
          display: flex;
          gap: 2px;
        }

        .review-title {
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .review-content {
          color: #e5e7eb;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 12px;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .review-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          margin-bottom: 12px;
        }

        .review-vibe {
          font-size: 20px;
          padding: 4px 8px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          display: flex;
          align-items: center;
        }

        .review-tag {
          font-size: 12px;
          padding: 4px 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #9ca3af;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .review-helpful {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #9ca3af;
          font-size: 13px;
          font-weight: 500;
        }

        .review-helpful-count {
          background: rgba(212, 175, 55, 0.15);
          color: #d4af37;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .page-container {
            padding: 1.5rem 1rem;
          }

          .page-title {
            font-size: 1.875rem;
          }

          .page-subtitle {
            font-size: 1rem;
          }

          .filters-container {
            padding: 1rem;
          }

          .filters-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .reviews-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .review-card {
            padding: 1.25rem;
          }
        }
      `}</style>
    </>
  );
}
