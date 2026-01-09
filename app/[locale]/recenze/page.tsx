'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { VIBE_OPTIONS, TAG_OPTIONS } from '@/lib/review-constants';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MobileMenu from '@/components/MobileMenu';
import BigFooter from '@/components/BigFooter';

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
  const pathname = usePathname();
  const t = useTranslations('home');
  const tNav = useTranslations('nav');

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
      {/* MOBILE MENU */}
      <MobileMenu currentPath={pathname} />

      {/* NAVIGATION */}
      <nav className="main-nav">
        <Link href={`/${locale}`} className="logo">
          <span className="logo-L">L</span>
          ovely Girls
        </Link>
        <div className="nav-links">
          <Link href={`/${locale}`}>{tNav('home')}</Link>
          <Link href={`/${locale}/divky`}>{tNav('girls')}</Link>
          <Link href={`/${locale}/cenik`}>{tNav('pricing')}</Link>
          <Link href={`/${locale}/schedule`}>{tNav('schedule')}</Link>
          <Link href={`/${locale}/discounts`}>{tNav('discounts')}</Link>
          <Link href={`/${locale}/faq`}>{tNav('faq')}</Link>
        </div>
        <div className="nav-contact">
          <LanguageSwitcher />
          <a href="https://t.me/+420734332131" className="btn">{tNav('telegram')}</a>
          <a href="https://wa.me/420734332131" className="btn btn-fill">{tNav('whatsapp')}</a>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <section className="reviews-page">
        <div className="container">
          {/* Page Header */}
          <div className="page-header">
            <h1 className="page-title">{t('reviews_title')}</h1>
            <p className="page-subtitle">{t('reviews_subtitle')}</p>
          </div>

          {/* Modern Filters */}
          <div className="reviews-filters">
            <div className="filters-grid">
              {/* Girl Filter */}
              <div className="filter-item">
                <label className="filter-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Dívka
                </label>
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
              <div className="filter-item">
                <label className="filter-label">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  Hodnocení
                </label>
                <select
                  className="filter-select"
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                >
                  <option value="">Všechna hodnocení</option>
                  <option value="5">★★★★★ (5 hvězd)</option>
                  <option value="4">★★★★ (4+ hvězd)</option>
                  <option value="3">★★★ (3+ hvězd)</option>
                </select>
              </div>

              {/* Vibe Filter */}
              <div className="filter-item">
                <label className="filter-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                    <line x1="9" y1="9" x2="9.01" y2="9"/>
                    <line x1="15" y1="9" x2="15.01" y2="9"/>
                  </svg>
                  Atmosféra
                </label>
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
                <div className="filter-item filter-reset">
                  <button className="reset-btn" onClick={resetFilters}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                    Vymazat ({activeFiltersCount})
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Results Count */}
          {!loading && reviews.length > 0 && (
            <div className="results-count">
              Zobrazeno {reviews.length} {reviews.length === 1 ? 'recenze' : reviews.length < 5 ? 'recenze' : 'recenzí'}
            </div>
          )}

          {/* Loading / No Results / Reviews Grid */}
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Načítání recenzí...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="64" height="64">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <p>Žádné recenze nebyly nalezeny.</p>
              {activeFiltersCount > 0 && (
                <button className="reset-btn" onClick={resetFilters}>
                  Vymazat filtry
                </button>
              )}
            </div>
          ) : (
            <div className="reviews-grid">
              {reviews.map((review) => (
                <article key={review.id} className="review-card">
                  {/* Girl Info */}
                  {review.girl_name && (
                    <Link href={`/${locale}/profily/${review.girl_slug}`} className="review-girl">
                      {review.girl_photo && (
                        <img
                          src={review.girl_photo}
                          alt={review.girl_name}
                          className="review-girl-photo"
                        />
                      )}
                      <div className="review-girl-info">
                        <span className="review-girl-name">{review.girl_name}</span>
                        <span className="review-girl-link">{t('view_profile')}</span>
                      </div>
                    </Link>
                  )}

                  {/* Review Header */}
                  <div className="review-header">
                    <div className="review-author">
                      <span className="author-name">{review.author_name}</span>
                      {review.status === 'approved' && (
                        <span className="verified-badge" title="Ověřeno">✓</span>
                      )}
                      <span className="review-date">{formatDate(review.created_at)}</span>
                    </div>
                    <div className="review-stars">
                      {renderStars(review.rating)}
                    </div>
                  </div>

                  {/* Review Content */}
                  {review.title && <h3 className="review-title">{review.title}</h3>}
                  <p className="review-content">{review.content}</p>

                  {/* Vibe and Tags */}
                  <div className="review-tags">
                    {review.vibe && VIBE_OPTIONS[review.vibe as keyof typeof VIBE_OPTIONS] && (
                      <span className="vibe-tag">
                        {VIBE_OPTIONS[review.vibe as keyof typeof VIBE_OPTIONS].emoji}
                      </span>
                    )}
                    {review.tags && JSON.parse(review.tags).map((tagId: string) => {
                      const tag = TAG_OPTIONS[tagId as keyof typeof TAG_OPTIONS];
                      if (!tag) return null;
                      return (
                        <span key={tagId} className="tag">
                          <span>{tag.emoji}</span>
                          <span>{tag.label_cs}</span>
                        </span>
                      );
                    })}
                  </div>

                  {/* Helpful */}
                  <div className="review-helpful">
                    <span>👍</span>
                    <span>Užitečné</span>
                    {review.helpful_count !== undefined && review.helpful_count > 0 && (
                      <span className="helpful-count">{review.helpful_count}</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <BigFooter />
    </>
  );
}
