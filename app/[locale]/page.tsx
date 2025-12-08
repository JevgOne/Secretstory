"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MobileMenu from '@/components/MobileMenu';
import BottomCTA from '@/components/BottomCTA';
import GirlCard from '@/components/GirlCard';

const girls = [
  {
    id: 1,
    name: "Natalie",
    slug: "natalie",
    age: 24,
    bust: "95-C",
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
    slug: "victoria",
    age: 26,
    bust: "85-B",
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
    slug: "isabella",
    age: 23,
    bust: "85-B",
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
    slug: "sophie",
    age: 25,
    bust: "95-C",
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
  const pathname = usePathname();
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
        <MobileMenu currentPath={pathname} />
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
            <GirlCard
              key={girl.id}
              girl={girl}
              badge={girl.badge as 'new' | 'top' | 'recommended' | null}
              badgeText={{
                new: t('girls.new'),
                top: t('girls.top_reviews'),
                recommended: t('girls.recommended')
              }}
              translations={{
                age_years: t('girls.age_years'),
                bust: t('girls.bust'),
                height_cm: t('girls.height_cm'),
                weight_kg: t('girls.weight_kg'),
                languages_spoken: t('girls.languages_spoken')
              }}
              showQuickActions={true}
            />
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

      {/* MOBILE BOTTOM CTA */}
      <BottomCTA
        translations={{
          browse_girls: t('nav.girls'),
          whatsapp: t('nav.whatsapp'),
          call: t('nav.phone')
        }}
      />
    </>
  );
}
