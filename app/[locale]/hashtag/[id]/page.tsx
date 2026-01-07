'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Cormorant, DM_Sans } from 'next/font/google';
import { getHashtagById, getHashtagName } from '@/lib/hashtags';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MobileMenu from '@/components/MobileMenu';
import BigFooter from '@/components/BigFooter';
import BottomCTA from '@/components/BottomCTA';
import { useFavorites } from '@/contexts/FavoritesContext';

const cormorant = Cormorant({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant'
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-dm-sans'
});

interface Girl {
  id: number;
  name: string;
  slug: string;
  age: number;
  height: number;
  weight: number;
  bust: string;
  online: boolean;
  badge_type?: 'new' | 'top' | 'asian' | 'recommended' | null;
  primary_photo?: string | null;
  secondary_photo?: string | null;
  thumbnail?: string | null;
  location?: string;
  schedule_status?: 'working' | 'later' | null;
  schedule_from?: string | null;
  schedule_to?: string | null;
}

export default function HashtagPage() {
  const params = useParams();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();
  const tGirls = useTranslations('girls');
  const tCommon = useTranslations('common');
  const tHome = useTranslations('home');

  const id = params.id as string;
  const [girls, setGirls] = useState<Girl[]>([]);
  const [loading, setLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();

  const hashtag = getHashtagById(id);
  const hashtagName = getHashtagName(id, locale);

  useEffect(() => {
    async function fetchGirls() {
      try {
        const response = await fetch(`/api/girls?status=active&hashtag=${id}`);
        const data = await response.json();
        if (data.success) {
          setGirls(data.girls);
        }
      } catch (error) {
        console.error('Error fetching girls:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchGirls();
  }, [id]);

  if (!hashtag) {
    return (
      <div className="page-container">
        <h1>Hashtag nenalezen</h1>
      </div>
    );
  }

  // Calculate breast size from bust measurement
  const getBreastSize = (bust: string): number => {
    if (!bust) return 2;
    if (bust.includes('-')) {
      const size = parseInt(bust.split('-')[0]);
      if (size >= 95) return 3;
      if (size >= 85) return 2;
      return 1;
    }
    const cups: Record<string, number> = { 'A': 1, 'B': 2, 'C': 3, 'D': 3, 'DD': 3 };
    return cups[bust] || 2;
  };

  return (
    <>
      <div className={`${cormorant.variable} ${dmSans.variable}`}>
        {/* Ambient Background */}
        <div className="ambient-bg"></div>

        {/* MOBILE MENU */}
        <MobileMenu currentPath={pathname} />

        {/* NAVIGATION */}
        <nav className="main-nav">
          <Link href={`/${locale}`} className="logo">
            <span className="logo-L">
              <svg className="santa-hat" viewBox="0 0 16 14" fill="none">
                <path d="M2 12C4 11 6 7 9 5C8 3 9 1.5 10 1" stroke="#c41e3a" strokeWidth="2" strokeLinecap="round" />
                <circle cx="10" cy="1.5" r="1.5" fill="#fff" />
                <path d="M1 12C3 11.5 6 11 9 11" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              </svg>
              L
            </span>
            ovely Girls
          </Link>
          <div className="nav-links" style={{ display: 'none' }} data-mobile-hide="true">
            <Link href={`/${locale}`}>{t('nav.home')}</Link>
            <Link href={`/${locale}/divky`}>{t('nav.girls')}</Link>
            <Link href={`/${locale}/cenik`}>{t('nav.pricing')}</Link>
            <Link href={`/${locale}/schedule`}>{t('nav.schedule')}</Link>
            <Link href={`/${locale}/discounts`}>{t('nav.discounts')}</Link>
            <Link href={`/${locale}/faq`}>{t('nav.faq')}</Link>
          </div>
          <div className="nav-contact" style={{ display: 'none' }} data-mobile-hide="true">
            <LanguageSwitcher />
            <a href="https://t.me/+420734332131" className="btn">{t('nav.telegram')}</a>
            <a href="https://wa.me/420734332131" className="btn btn-fill">{t('nav.whatsapp')}</a>
          </div>
        </nav>

        {/* HASHTAG PAGE CONTENT */}
        <section className="profiles hashtag-page" id="profiles">
          <div className="profiles-header">
            <div>
              <h1 className="section-title">{hashtagName}</h1>
              <h2 className="section-subtitle" style={{ fontWeight: 400, fontSize: '1.1rem', marginTop: '0.5rem' }}>
                {loading && 'Načítání...'}
                {!loading && girls.length === 0 && 'Žádné dívky s tímto hashtagem'}
                {!loading && girls.length === 1 && 'Luxusní erotické služby v centru Prahy'}
                {!loading && girls.length > 1 && `Prohlédni si ${girls.length} dívek - ověřené profily, profesionální služby`}
              </h2>
            </div>
          </div>

          {!loading && girls.length > 0 && (
            <div className="cards-grid">
              {girls.map((girl) => {
                const badge = girl.badge_type || null;
                const badgeText = badge === 'new' ? tGirls('new') : badge === 'top' ? tGirls('top_reviews') : badge === 'recommended' ? tGirls('recommended') : badge === 'asian' ? 'Asian' : '';
                const badgeClass = badge === 'new' ? 'badge-new' : badge === 'top' ? 'badge-top' : badge === 'asian' ? 'badge-asian' : 'badge-recommended';

                const breastSize = getBreastSize(girl.bust);
                const timeRange = girl.schedule_from && girl.schedule_to ? `${girl.schedule_from} - ${girl.schedule_to}` : null;
                const isWorking = girl.schedule_status === 'working';
                const location = girl.location || tHome('default_location');

                return (
                  <Link href={`/${locale}/profily/${girl.slug}`} key={girl.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <article className="card">
                      <div className="card-image-container">
                        {badge && (
                          <span className={`badge ${badgeClass}`}>{badgeText}</span>
                        )}

                        {/* 3D Flip Container */}
                        {girl.secondary_photo ? (
                          <div className="card-flip-inner">
                            {/* Front Side */}
                            <div className="card-flip-front">
                              {girl.primary_photo || girl.thumbnail ? (
                                <img
                                  src={girl.thumbnail || girl.primary_photo || ''}
                                  alt={girl.name}
                                  className="card-image"
                                  loading="lazy"
                                  decoding="async"
                                />
                              ) : (
                                <div className="card-placeholder">FOTO</div>
                              )}
                            </div>

                            {/* Back Side */}
                            <div className="card-flip-back">
                              <img
                                src={girl.secondary_photo}
                                alt={`${girl.name} - back view`}
                                className="card-image"
                                loading="lazy"
                                decoding="async"
                              />
                            </div>
                          </div>
                        ) : (
                          // No secondary photo - just show primary
                          girl.primary_photo || girl.thumbnail ? (
                            <img
                              src={girl.thumbnail || girl.primary_photo || ''}
                              alt={girl.name}
                              className="card-image"
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            <div className="card-placeholder">FOTO</div>
                          )
                        )}

                        <div className="card-overlay"></div>
                        <div className="quick-actions">
                          <button
                            className="action-btn"
                            title="Profil"
                            onClick={(e) => {
                              e.preventDefault();
                              window.location.href = `/${locale}/profily/${girl.slug}`;
                            }}
                          >
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                          </button>
                          <button
                            className={`action-btn ${isFavorite(girl.id) ? 'favorite-active' : ''}`}
                            title={isFavorite(girl.id) ? 'Odebrat z oblíbených' : 'Přidat do oblíbených'}
                            onClick={(e) => {
                              e.preventDefault();
                              toggleFavorite(girl.id);
                            }}
                          >
                            <svg viewBox="0 0 24 24" fill={isFavorite(girl.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="card-info">
                        <div className="card-header">
                          <h3 className="card-name">
                            {isWorking && <span className="online-dot"></span>}
                            {girl.name}
                          </h3>
                          {timeRange && <span className={`time-badge ${isWorking ? 'available' : 'tomorrow'}`}>{timeRange}</span>}
                        </div>
                        <div className="card-stats">
                          <span className="stat"><span className="stat-value">{girl.age || '?'}</span><span className="stat-label">{t('girls.age_years')}</span></span>
                          <span className="stat"><span className="stat-value">{girl.height || '?'}</span><span className="stat-label">cm</span></span>
                          <span className="stat"><span className="stat-value">{girl.weight || '?'}</span><span className="stat-label">kg</span></span>
                          <span className="stat"><span className="stat-value">{breastSize}</span><span className="stat-label">{t('girls.bust')}</span></span>
                        </div>
                        <div className="card-location-wrapper">
                          <div className="card-location">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                              <circle cx="12" cy="10" r="3"/>
                            </svg>
                            <span>{location}</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* BIG FOOTER */}
        <BigFooter />

        {/* MOBILE BOTTOM CTA */}
        <BottomCTA
          translations={{
            call: tHome('cta_call'),
            whatsapp: tHome('cta_whatsapp'),
            telegram: tHome('cta_telegram'),
            sms: tHome('cta_sms'),
            branches: tHome('cta_branches'),
            discounts: tHome('cta_discounts'),
            whatsapp_warning: tHome('cta_whatsapp_warning'),
            recommended: tHome('cta_recommended')
          }}
        />
      </div>
    </>
  );
}
