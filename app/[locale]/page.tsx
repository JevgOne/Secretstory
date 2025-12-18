"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from 'next-intl';
import { Cormorant, DM_Sans } from 'next/font/google';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MobileMenu from '@/components/MobileMenu';
import BottomCTA from '@/components/BottomCTA';
import Stories from '@/components/Stories';
import ActivityTimeline from '@/components/ActivityTimeline';
import ReviewsSection from '@/components/ReviewsSection';
import { useFavorites } from '@/contexts/FavoritesContext';
import { LocalBusinessSchema, OrganizationSchema, WebSiteSchema } from '@/components/JsonLd';
import { HASHTAGS, getHashtagName } from '@/lib/hashtags';

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
  status: string;
  color: string;
  location?: string;
  is_new?: boolean;
  is_top?: boolean;
  is_featured?: boolean;
  badge_type?: string;
  featured_section?: string;
  primary_photo?: string;
  thumbnail?: string;
  schedule_status?: 'working' | 'later' | null;
  schedule_from?: string | null;
  schedule_to?: string | null;
}

interface Location {
  id: number;
  name: string;
  display_name: string;
  address?: string;
  city: string;
  district?: string;
  description?: string;
  opening_hours?: string;
  is_active: number;
  is_primary: number;
}

export default function Home() {
  const [girls, setGirls] = useState<Girl[]>([]);
  const [featuredGirl, setFeaturedGirl] = useState<Girl | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations();
  const tHome = useTranslations('home');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const tGirls = useTranslations('girls');
  const tFooter = useTranslations('footer');
  const locale = useLocale();
  const pathname = usePathname();
  const [showAgeModal, setShowAgeModal] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ageConfirmed = localStorage.getItem("age");
      if (!ageConfirmed) {
        setShowAgeModal(true);
      }
    }
  }, []);

  const confirmAge = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("age", "1");
      setShowAgeModal(false);
    }
  };

  // ONE OPTIMIZED API CALL - fetch everything at once!
  useEffect(() => {
    async function fetchHomepageData() {
      try {
        const response = await fetch('/api/homepage');
        const data = await response.json();
        if (data.success) {
          setGirls(data.girls);
          setFeaturedGirl(data.featuredGirl);
          setLocations(data.locations);
          setStories(data.stories);
          setActivities(data.activities);
        }
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchHomepageData();
  }, []);

  const denyAge = () => {
    if (typeof window !== "undefined") {
      window.location.href = "https://google.com";
    }
  };

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <LocalBusinessSchema
        name="LovelyGirls Prague"
        description="Premium escort services in Prague. Professional companions, erotic massage, VIP services."
        telephone="+420734332131"
        address={{
          streetAddress: tHome('location_main_address'),
          addressLocality: tHome('default_location'),
          postalCode: "120 00",
          addressCountry: "CZ"
        }}
        openingHours={['Mo-Su 10:00-22:00']}
        priceRange="$$$$"
      />
      <OrganizationSchema />
      <WebSiteSchema />

      <div className={`${cormorant.variable} ${dmSans.variable}`}>
        {/* Ambient Background */}
        <div className="ambient-bg"></div>

        {/* AGE MODAL */}
        {showAgeModal && (
          <div className="age-modal">
            <div className="age-box">
              <h2>{tHome('age_modal_title')}</h2>
              <p>{tHome('age_modal_text')}</p>
              <div className="age-buttons">
                <button className="age-btn yes" onClick={confirmAge}>
                  {tHome('age_enter')}
                </button>
                <button className="age-btn no" onClick={denyAge}>
                  {tHome('age_leave')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MOBILE MENU - outside nav for proper z-index */}
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
          <Link href={`/${locale}`} className="active">{t('nav.home')}</Link>
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

        <style jsx>{`
          @media (min-width: 769px) {
            .nav-links[data-mobile-hide],
            .nav-contact[data-mobile-hide] {
              display: flex !important;
            }
          }
        `}</style>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-text">
            <h1 dangerouslySetInnerHTML={{ __html: tHome('hero_title') }}></h1>
            <p>{tHome('hero_subtitle')}</p>
            <div className="hero-buttons">
              <a href="#profiles" className="btn btn-fill">{tHome('hero_cta_primary')}</a>
              <a href="#booking" className="btn">{tHome('hero_cta_secondary')}</a>
            </div>
          </div>
          {featuredGirl && (
            <div className="hero-new">
              <div className="new-label">✦ {tHome('new_label')}</div>
              <div className="new-girl-card">
                <div className="new-girl-img">
                  {featuredGirl.primary_photo ? (
                    <img src={featuredGirl.primary_photo} alt={featuredGirl.name} />
                  ) : (
                    <div className="placeholder">FOTO</div>
                  )}
                  <span className="new-badge">{tHome('new_badge')}</span>
                </div>
                <div className="new-girl-info">
                  <div className="new-girl-name">{featuredGirl.name}</div>
                  <div className="new-girl-meta">{featuredGirl.age} let • {featuredGirl.height} cm</div>
                  <div className="new-girl-desc">{tHome('new_girl_desc')}</div>
                  <Link href={`/${locale}/profily/${featuredGirl.slug}`} className="btn btn-fill" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>{tHome('view_profile')}</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* STORIES */}
      <Stories initialStories={stories} />

      {/* PROFILES */}
      <section className="profiles" id="profiles">
        <div className="profiles-header">
          <div>
            <h2 className="section-title">{tHome('profiles_title')}</h2>
            <p className="section-subtitle">{tHome('profiles_subtitle')}</p>
          </div>
          <Link href={`/${locale}/divky`} className="btn">{tHome('view_all')}</Link>
        </div>
        <div className="cards-grid">
          {loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: '#9a8a8e' }}>
              {tCommon('loading')}
            </div>
          ) : girls.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: '#9a8a8e', fontSize: '1.2rem' }}>
              {tHome('closed_today')}
            </div>
          ) : (
            girls.map((girl) => {
            const badge = girl.badge_type || null;
            const badgeText = badge === 'new' ? tGirls('new') : badge === 'top' ? tGirls('top_reviews') : badge === 'recommended' ? tGirls('recommended') : badge === 'asian' ? 'Asian' : '';
            const badgeClass = badge === 'new' ? 'badge-new' : badge === 'top' ? 'badge-top' : 'badge-asian';

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

            const breastSize = getBreastSize(girl.bust);
            // Use schedule data from API
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
                    {girl.primary_photo || girl.thumbnail ? (
                      <img src={girl.thumbnail || girl.primary_photo} alt={girl.name} className="card-image" />
                    ) : (
                      <div className="card-placeholder">FOTO</div>
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
                        <svg className="location-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                        {location}
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })
          )}
        </div>
      </section>

      {/* ACTIVITY TIMELINE */}
      <ActivityTimeline initialActivities={activities} />

      {/* REVIEWS */}
      <ReviewsSection />

      {/* POPULAR HASHTAGS */}
      <section style={{ padding: '4rem 0', background: 'rgba(139, 41, 66, 0.03)' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="section-title">Populární vyhledávání</h2>
            <p className="section-subtitle">Najděte holky podle vašich preferencí</p>
          </div>
          <div className="hashtags" style={{ justifyContent: 'center' }}>
            {HASHTAGS.map((hashtag) => (
              <Link
                href={`/${locale}/hashtag/${hashtag.id}`}
                key={hashtag.id}
                className="hashtag"
              >
                #{getHashtagName(hashtag.id, locale)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* INFO STRIP */}
      <section className="info-strip">
        <div className="info-strip-inner">
          <div className="info-item">
            <div className="info-icon">✓</div>
            <div className="info-title">{tHome('info_verified_title')}</div>
            <div className="info-text">{tHome('info_verified_text')}</div>
          </div>
          <div className="info-item">
            <div className="info-icon">⚡</div>
            <div className="info-title">{tHome('info_fast_title')}</div>
            <div className="info-text">{tHome('info_fast_text')}</div>
          </div>
          <div className="info-item">
            <div className="info-icon">🔒</div>
            <div className="info-title">{tHome('info_discrete_title')}</div>
            <div className="info-text">{tHome('info_discrete_text')}</div>
          </div>
          <div className="info-item">
            <div className="info-icon">💎</div>
            <div className="info-title">{tHome('info_discounts_title')}</div>
            <div className="info-text">{tHome('info_discounts_text')}</div>
          </div>
        </div>
      </section>

      {/* LOCATIONS */}
      <section className="locations" id="locations">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="section-title">{tHome('locations_title')}</h2>
          <p className="section-subtitle">{tHome('locations_subtitle')}</p>
        </div>
        <div className="locations-grid">
          {locations.length > 0 ? (
            locations.map((location) => (
              <div key={location.id} className="location-card">
                <div className="location-img"></div>
                <div className="location-content">
                  <div className="location-label">
                    {location.is_primary ? tHome('location_main_label') : tHome('location_new_label')}
                  </div>
                  <div className="location-name">{location.display_name}</div>
                  <div className="location-address">
                    {location.address || `${location.district || location.city}`}
                  </div>
                  <div className="location-time">
                    {location.opening_hours || location.description || '10:00 — 22:00'}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="location-card">
              <div className="location-img"></div>
              <div className="location-content">
                <div className="location-label">{tHome('location_main_label')}</div>
                <div className="location-name">{tHome('location_main_name')}</div>
                <div className="location-address">{tHome('location_main_address')}</div>
                <div className="location-time">{tHome('location_main_hours')}</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* BOOKING */}
      <section className="booking" id="booking">
        <div className="booking-inner">
          <h2 className="section-title">{tHome('booking_title')}</h2>
          <p className="section-subtitle">{tHome('booking_subtitle')}</p>
          <div className="booking-steps">
            <div className="step">
              <div className="step-num">{tHome('booking_step1_num')}</div>
              <div className="step-title">{tHome('booking_step1_title')}</div>
              <div className="step-text">{tHome('booking_step1_text')}</div>
            </div>
            <div className="step">
              <div className="step-num">{tHome('booking_step2_num')}</div>
              <div className="step-title">{tHome('booking_step2_title')}</div>
              <div className="step-text">{tHome('booking_step2_text')}</div>
            </div>
            <div className="step">
              <div className="step-num">{tHome('booking_step3_num')}</div>
              <div className="step-title">{tHome('booking_step3_title')}</div>
              <div className="step-text">{tHome('booking_step3_text')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2 className="cta-title">{tHome('cta_title')}</h2>
        <p className="cta-text">{tHome('cta_text')}</p>
        <div className="cta-buttons">
          <a href="https://wa.me/420734332131" className="cta-btn">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            {tHome('cta_whatsapp')}
          </a>
          <a href="https://t.me/lovelygirls_prague" className="cta-btn">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
            {tHome('cta_telegram')}
          </a>
          <a href="tel:+420734332131" className="cta-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
            {tHome('cta_call')}
          </a>
        </div>
      </section>

      {/* FOOTER - COMPACT */}
      <footer style={{ background: 'rgba(0, 0, 0, 0.3)', borderTop: '1px solid rgba(255, 255, 255, 0.1)', padding: '2rem 0 1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            {/* Brand */}
            <div>
              <Link href={`/${locale}`} className="footer-logo" style={{ fontSize: '1.5rem', fontWeight: '600', color: '#fff', textDecoration: 'none', display: 'inline-block', marginBottom: '0.5rem' }}>
                <span style={{ color: '#8b2942' }}>L</span>ovely Girls
              </Link>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', lineHeight: '1.5' }}>{t('footer.tagline')}</p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{ color: '#fff', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem' }}>{t('footer.practices')}</h4>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link href={`/${locale}/divky`} style={{ color: '#9ca3af', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.3s' }}>{tNav('girls')}</Link>
                <Link href={`/${locale}/cenik`} style={{ color: '#9ca3af', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.3s' }}>{tNav('pricing')}</Link>
                <Link href={`/${locale}/faq`} style={{ color: '#9ca3af', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.3s' }}>{tNav('faq')}</Link>
              </nav>
            </div>

            {/* Contact */}
            <div>
              <h4 style={{ color: '#fff', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem' }}>{t('footer.contact')}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <a href="tel:+420734332131" style={{ color: '#9ca3af', fontSize: '0.875rem', textDecoration: 'none' }}>+420 734 332 131</a>
                <a href="https://wa.me/420734332131" style={{ color: '#9ca3af', fontSize: '0.875rem', textDecoration: 'none' }}>WhatsApp</a>
                <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>{t('footer.hours_value')}</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              <span>{t('footer.copyright')}</span>
              <span style={{ margin: '0 0.5rem' }}>•</span>
              <span>{t('common.adults_only')}</span>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link href={`/${locale}/podminky`} style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none' }}>{t('footer.terms')}</Link>
              <Link href={`/${locale}/soukromi`} style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none' }}>{t('footer.privacy')}</Link>
            </div>
          </div>
        </div>
      </footer>

        {/* MOBILE BOTTOM CTA */}
        <BottomCTA
          translations={{
            call: t('nav.phone'),
            whatsapp: t('nav.whatsapp'),
            branches: 'Branches',
            discounts: t('nav.discounts')
          }}
        />
      </div>
    </>
  );
}
