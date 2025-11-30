"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const girls = [
  {
    id: 1,
    name: "Natalie",
    age: 24,
    breast: 3,
    height: 170,
    weight: 52,
    location: "Praha 2",
    time: "10:00 - 18:00",
    badge: "new",
    online: true,
  },
  {
    id: 2,
    name: "Victoria",
    age: 26,
    breast: 2,
    height: 175,
    weight: 58,
    location: "Praha 3",
    time: "12:00 - 20:00",
    badge: "top",
    online: true,
  },
  {
    id: 3,
    name: "Isabella",
    age: 23,
    breast: 2,
    height: 168,
    weight: 50,
    location: "Praha 2",
    time: "14:00 - 22:00",
    badge: "asian",
    online: true,
  },
  {
    id: 4,
    name: "Sophie",
    age: 25,
    breast: 3,
    height: 172,
    weight: 55,
    location: "Praha 2",
    time: "10:00 - 16:00",
    online: true,
  },
];

export default function Home() {
  const t = useTranslations();
  const locale = useLocale();
  const [showAgeModal, setShowAgeModal] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ageConfirmed = localStorage.getItem("age");
      if (ageConfirmed) {
        setShowAgeModal(false);
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
      {/* AGE MODAL */}
      {showAgeModal && (
        <div className="age-modal">
          <div className="age-box">
            <h2>{t('home.age_modal_title')}</h2>
            <p>{t('home.age_modal_text')}</p>
            <div className="age-buttons">
              <button className="age-btn yes" onClick={confirmAge}>
                {t('home.age_enter')}
              </button>
              <button className="age-btn no" onClick={denyAge}>
                {t('home.age_leave')}
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
        <button className="mobile-menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <h1>{t('home.hero_title')}</h1>
        <p>{t('home.hero_subtitle')}</p>
        <Link href={`/${locale}/divky`} className="btn btn-fill btn-large">
          {t('home.hero_cta')} →
        </Link>
      </section>

      {/* FEATURED GIRLS */}
      <section className="profiles">
        <h2 className="section-title">{t('home.featured_girls')}</h2>
        <div className="profiles-grid">
          {girls.map((girl) => (
            <Link key={girl.id} href={`/${locale}/divky`} className="profile-card">
              <div className="profile-img">
                <div className="placeholder">FOTO</div>
                {girl.badge && (
                  <div className={`profile-badge ${girl.badge}`}>
                    {girl.badge === 'new' && t('girls.new')}
                    {girl.badge === 'top' && t('girls.top_reviews')}
                    {girl.badge === 'asian' && t('girls.recommended')}
                  </div>
                )}
              </div>
              <div className="profile-info">
                <div className="profile-name-row">
                  {girl.online && <span className="online-dot"></span>}
                  <span className="profile-name">{girl.name}</span>
                  <span className="profile-time">{girl.time}</span>
                </div>
                <div className="profile-stats">
                  <div className="profile-stat">
                    <span className="profile-stat-value">{girl.age}</span> {t('girls.age_years')}
                  </div>
                  <div className="profile-stat">
                    {t('girls.bust')} <span className="profile-stat-value">{girl.breast}</span>
                  </div>
                  <div className="profile-stat">
                    <span className="profile-stat-value">{girl.height}</span> {t('girls.height_cm')}
                  </div>
                  <div className="profile-stat">
                    <span className="profile-stat-value">{girl.weight}</span> {t('girls.weight_kg')}
                  </div>
                </div>
                <div className="profile-location">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {girl.location}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center" style={{ marginTop: '40px' }}>
          <Link href={`/${locale}/divky`} className="btn btn-outline btn-large">
            {t('home.view_all_girls')} →
          </Link>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="features">
        <h2 className="section-title">{t('home.why_choose_us')}</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">✓</div>
            <h3>{t('home.verified_profiles')}</h3>
            <p>{t('home.verified_desc')}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>{t('home.discrete_safe')}</h3>
            <p>{t('home.discrete_desc')}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>{t('home.professional')}</h3>
            <p>{t('home.professional_desc')}</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div>{t('common.brand')} Prague © 2025 — {t('common.adults_only')}</div>
        <div className="footer-links">
          <Link href={`/${locale}/podminky`}>{t('footer.terms')}</Link>
          <Link href={`/${locale}/soukromi`}>{t('footer.privacy')}</Link>
        </div>
      </footer>
    </>
  );
}
