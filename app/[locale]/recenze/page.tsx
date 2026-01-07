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
  const t = useTranslations('home');

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
    <section style={{ padding: '2.5rem 0', background: 'rgba(0, 0, 0, 0.2)', minHeight: '70vh' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 className="section-title">{t('reviews_title')}</h2>
          <p className="section-subtitle">{t('reviews_subtitle')}</p>
        </div>

        {/* Filters */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            alignItems: 'end'
          }}>
            {/* Girl Filter */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dívka</label>
              <select
                style={{
                  padding: '0.75rem 1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  cursor: 'pointer'
                }}
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Hodnocení</label>
              <select
                style={{
                  padding: '0.75rem 1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  cursor: 'pointer'
                }}
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
              >
                <option value="">Všechna hodnocení</option>
                <option value="5">⭐⭐⭐⭐⭐ Z5 (5 hvězd)</option>
                <option value="4">⭐⭐⭐⭐ (4+ hvězd)</option>
                <option value="3">⭐⭐⭐ (3+ hvězd)</option>
              </select>
            </div>

            {/* Vibe Filter */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Atmosféra</label>
              <select
                style={{
                  padding: '0.75rem 1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  cursor: 'pointer'
                }}
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'transparent', textTransform: 'uppercase', letterSpacing: '0.5px' }}>.</label>
                <button
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'rgba(139, 21, 56, 0.8)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={resetFilters}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(139, 21, 56, 1)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(139, 21, 56, 0.8)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  ✕ Vymazat ({activeFiltersCount})
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Loading / No Results */}
        {loading ? (
          <div style={{ textAlign: 'center', color: '#9ca3af', padding: '3rem 0' }}>Načítání recenzí...</div>
        ) : reviews.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#9ca3af', padding: '3rem 0' }}>
            <p style={{ marginBottom: '1rem' }}>Žádné recenze nebyly nalezeny.</p>
            {activeFiltersCount > 0 && (
              <button
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgba(139, 21, 56, 0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
                onClick={resetFilters}
              >
                Vymazat filtry
              </button>
            )}
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.95rem', fontWeight: '500', marginBottom: '1.5rem' }}>
              Zobrazeno {reviews.length} {reviews.length === 1 ? 'recenze' : reviews.length < 5 ? 'recenze' : 'recenzí'}
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
          </>
        )}
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
