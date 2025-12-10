"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from 'next-intl';
import { Cormorant, DM_Sans } from 'next/font/google';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MobileMenu from '@/components/MobileMenu';
import BottomCTA from '@/components/BottomCTA';

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

const girls = [
  {
    id: 1,
    name: "Natalie",
    slug: "natalie",
    age: 24,
    bust: "3",
    height: 170,
    weight: 52,
    location: "Praha 2",
    badge: "new",
  },
  {
    id: 2,
    name: "Victoria",
    slug: "victoria",
    age: 26,
    bust: "2",
    height: 175,
    weight: 58,
    location: "Praha 3",
    badge: "top",
  },
  {
    id: 3,
    name: "Isabella",
    slug: "isabella",
    age: 23,
    bust: "2",
    height: 168,
    weight: 50,
    location: "Praha 2",
    badge: "asian",
  },
  {
    id: 4,
    name: "Sophie",
    slug: "sophie",
    age: 25,
    bust: "3",
    height: 172,
    weight: 55,
    location: "Praha 2",
    time: "10:00 - 16:00",
    online: true,
  },
];

export default function Home() {
  const t = useTranslations();
  const tHome = useTranslations('home');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const tFooter = useTranslations('footer');
  const locale = useLocale();
  const pathname = usePathname();
  const [showAgeModal, setShowAgeModal] = useState(false);

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

  const denyAge = () => {
    if (typeof window !== "undefined") {
      window.location.href = "https://google.com";
    }
  };

  return (
    <>
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

        {/* NAVIGATION */}
        <nav>
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
        <div className="nav-links">
          <Link href={`/${locale}`} className="active">{t('nav.home')}</Link>
          <Link href={`/${locale}/divky`}>{t('nav.girls')}</Link>
          <Link href={`/${locale}/cenik`}>{t('nav.pricing')}</Link>
          <Link href={`/${locale}/schedule`}>{t('nav.schedule')}</Link>
          <Link href={`/${locale}/discounts`}>{t('nav.discounts')}</Link>
          <Link href={`/${locale}/faq`}>{t('nav.faq')}</Link>
        </div>
        <div className="nav-contact">
          <LanguageSwitcher />
          <a href="tel:+420734332131" className="btn">{t('nav.phone')}</a>
          <a href="https://wa.me/420734332131" className="btn btn-fill">{t('nav.whatsapp')}</a>
        </div>
        <MobileMenu currentPath={pathname} />
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
          <div className="hero-new">
            <div className="new-label">✦ {tHome('new_label')}</div>
            <div className="new-girl-card">
              <div className="new-girl-img">
                <div className="placeholder">FOTO</div>
                <span className="new-badge">{tHome('new_badge')}</span>
              </div>
              <div className="new-girl-info">
                <div className="new-girl-name">{tHome('new_girl_name')}</div>
                <div className="new-girl-meta">{tHome('new_girl_meta')}</div>
                <div className="new-girl-desc">{tHome('new_girl_desc')}</div>
                <a href={`/${locale}/divky`} className="btn btn-fill" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>{tHome('view_profile')}</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROFILES */}
      <section className="profiles" id="profiles">
        <div className="profiles-header">
          <div>
            <h2 className="section-title">{tHome('profiles_title')}</h2>
            <p className="section-subtitle">{tHome('profiles_subtitle')}</p>
          </div>
          <Link href={`/${locale}/divky`} className="btn">{tHome('view_all')}</Link>
        </div>
        <div className="profiles-grid">
          {girls.map((girl) => {
            const badgeText = girl.badge === 'new' ? tHome('badge_new') : girl.badge === 'top' ? tHome('badge_top') : tHome('badge_asian');

            // Determine online status and time for specific girls (matches HTML)
            const online = girl.id === 1 || girl.id === 2 || girl.id === 3; // Natalie, Victoria, Isabella are online
            const timeRange = girl.id === 1 ? '10:00 - 18:00' : girl.id === 2 ? '12:00 - 20:00' : girl.id === 3 ? '14:00 - 22:00' : girl.id === 4 ? '10:00 - 16:00' : null;
            const isAvailableNow = girl.id !== 4; // Sophie is tomorrow

            return (
              <div key={girl.id} className="profile-card">
                <div className="profile-img">
                  <div className="placeholder">FOTO</div>
                  {girl.badge && (
                    <div className={`profile-badge ${girl.badge}`}>{badgeText}</div>
                  )}
                </div>
                <div className="profile-info">
                  <div className="profile-name-row">
                    {online && <span className="online-dot"></span>}
                    <span className="profile-name">{girl.name}</span>
                    {timeRange && (
                      <span className="profile-time">
                        {timeRange}
                      </span>
                    )}
                  </div>
                  <div className="profile-stats">
                    <div className="profile-stat">
                      <span className="profile-stat-value">{girl.age}</span> {tHome('stat_years')}
                    </div>
                    <div className="profile-stat">
                      {tHome('stat_bust')} <span className="profile-stat-value">{girl.bust}</span>
                    </div>
                    <div className="profile-stat">
                      <span className="profile-stat-value">{girl.height}</span> {tHome('stat_cm')}
                    </div>
                    <div className="profile-stat">
                      <span className="profile-stat-value">{girl.weight}</span> {tHome('stat_kg')}
                    </div>
                  </div>
                  <div className="profile-location">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {girl.location}
                  </div>
                </div>
              </div>
            );
          })}
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
          <div className="location-card">
            <div className="location-img"></div>
            <div className="location-content">
              <div className="location-label">{tHome('location_main_label')}</div>
              <div className="location-name">{tHome('location_main_name')}</div>
              <div className="location-address">{tHome('location_main_address')}</div>
              <div className="location-time">{tHome('location_main_hours')}</div>
            </div>
          </div>
          <div className="location-card">
            <div className="location-img"></div>
            <div className="location-content">
              <div className="location-label">{tHome('location_new_label')}</div>
              <div className="location-name">{tHome('location_new_name')}</div>
              <div className="location-address">{tHome('location_new_address')}</div>
              <div className="location-time">{tHome('location_new_hours')}</div>
            </div>
          </div>
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

      {/* FOOTER */}
      <footer>
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-brand">
              <h3 className="footer-brand-name">LovelyGirls</h3>
              <p className="footer-brand-tagline">Prague Premium Escort</p>
            </div>
          </div>

          <div className="footer-grid">
            {/* About Column */}
            <div className="footer-col">
              <div className="footer-heading-wrapper">
                <svg className="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
                <h4 className="footer-heading">{t('footer.about_us')}</h4>
              </div>
              <p className="footer-text">{t('footer.about_text')}</p>
              <div className="footer-features">
                <div className="footer-feature">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  <span>100% Diskrétní</span>
                </div>
                <div className="footer-feature">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>Ověřené Profily</span>
                </div>
                <div className="footer-feature">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span>24/7 Dostupnost</span>
                </div>
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="footer-col">
              <div className="footer-heading-wrapper">
                <svg className="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6"/>
                  <line x1="8" y1="12" x2="21" y2="12"/>
                  <line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/>
                  <line x1="3" y1="12" x2="3.01" y2="12"/>
                  <line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
                <h4 className="footer-heading">{t('footer.quick_links')}</h4>
              </div>
              <nav className="footer-nav">
                <Link href={`/${locale}/divky`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  {tNav('girls')}
                </Link>
                <Link href={`/${locale}/cenik`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23"/>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                  {tNav('pricing')}
                </Link>
                <Link href={`/${locale}/schedule`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  {tNav('schedule')}
                </Link>
                <Link href={`/${locale}/discounts`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                    <line x1="7" y1="7" x2="7.01" y2="7"/>
                  </svg>
                  {tNav('discounts')}
                </Link>
                <Link href={`/${locale}/faq`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  {tNav('faq')}
                </Link>
              </nav>
            </div>

            {/* Contact Column */}
            <div className="footer-col">
              <div className="footer-heading-wrapper">
                <svg className="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <h4 className="footer-heading">{t('footer.contact')}</h4>
              </div>
              <div className="footer-contact">
                <a href="tel:+420734332131" className="footer-btn footer-btn-primary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  {t('footer.call_us')}
                </a>
                <a href="https://wa.me/420734332131" className="footer-btn footer-btn-secondary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                  </svg>
                  {t('footer.whatsapp')}
                </a>
                <div className="footer-info">
                  <div className="footer-info-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <div>
                      <span className="footer-info-label">{t('footer.hours')}</span>
                      <span className="footer-info-value">{t('footer.hours_value')}</span>
                    </div>
                  </div>
                  <div className="footer-info-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <div>
                      <span className="footer-info-label">{t('footer.location')}</span>
                      <span className="footer-info-value">{t('footer.location_value')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Legal Column */}
            <div className="footer-col">
              <div className="footer-heading-wrapper">
                <svg className="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
                <h4 className="footer-heading">{t('footer.legal')}</h4>
              </div>
              <nav className="footer-nav">
                <Link href={`/${locale}/blog`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 19l7 3-2-7 6-6H17l-5-4-5 4H1l6 6-2 7 7-3z"/>
                  </svg>
                  {t('footer.blog')}
                </Link>
                <Link href={`/${locale}/podminky`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  {t('footer.terms')}
                </Link>
                <Link href={`/${locale}/soukromi`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  {t('footer.privacy')}
                </Link>
              </nav>
              <div className="footer-copyright">
                {t('footer.copyright')} — {t('common.adults_only')}
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="footer-disclaimer">
            {t('footer.disclaimer')}
          </div>
        </div>
      </footer>

        {/* MOBILE BOTTOM CTA */}
        <BottomCTA
          translations={{
            browse_girls: t('nav.girls'),
            whatsapp: t('nav.whatsapp'),
            call: t('nav.phone')
          }}
        />
      </div>
    </>
  );
}
