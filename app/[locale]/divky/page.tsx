"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';

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
  languages?: string;
}

export default function GirlsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [girls, setGirls] = useState<Girl[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGirls();
  }, []);

  const fetchGirls = async () => {
    try {
      const response = await fetch('/api/girls?status=active');
      const data = await response.json();
      if (data.success) {
        setGirls(data.girls);
      }
    } catch (error) {
      console.error('Error fetching girls:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const getTimeRange = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "10:00 - 18:00";
    if (hour < 18) return "12:00 - 20:00";
    return "14:00 - 22:00";
  };

  const getLocation = (): string => {
    const locations = ["Praha 2", "Praha 3"];
    return locations[Math.floor(Math.random() * locations.length)];
  };

  const getLanguageName = (code: string): string => {
    const names: Record<string, Record<string, string>> = {
      cs: { cs: 'Čeština', en: 'Czech', de: 'Tschechisch', uk: 'Чеська' },
      en: { cs: 'Angličtina', en: 'English', de: 'Englisch', uk: 'Англійська' },
      de: { cs: 'Němčina', en: 'German', de: 'Deutsch', uk: 'Німецька' },
      uk: { cs: 'Ukrajinština', en: 'Ukrainian', de: 'Ukrainisch', uk: 'Українська' },
      ru: { cs: 'Ruština', en: 'Russian', de: 'Russisch', uk: 'Російська' }
    };
    return names[code]?.[locale] || code;
  };

  return (
    <>
      {/* Navigation */}
      <nav>
        <Link href={`/${locale}`} className="logo">
          <span className="logo-L">
            <svg className="santa-hat" viewBox="0 0 16 14" fill="none">
              <path d="M2 12C4 11 6 7 9 5C8 3 9 1.5 10 1" stroke="#c41e3a" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="10" cy="1.5" r="1.5" fill="#fff"/>
              <path d="M1 12C3 11.5 6 11 9 11" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            L
          </span>
          ovely Girls
        </Link>
        <div className="nav-links">
          <Link href={`/${locale}`}>{t('nav.home')}</Link>
          <Link href={`/${locale}/divky`} className="active">{t('nav.girls')}</Link>
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

      {/* Page Header */}
      <section className="page-header">
        <h1 className="page-title">{t('girls.title')}</h1>
        <p className="page-subtitle">{t('girls.subtitle')}</p>
      </section>

      {/* Profiles Grid */}
      <section className="profiles">
        <div className="profiles-grid">
          {loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: '#9a8a8e' }}>
              {t('girls.loading_profiles')}
            </div>
          ) : girls.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: '#9a8a8e' }}>
              {t('girls.no_girls')}
            </div>
          ) : (
            girls.map((girl) => (
              <Link key={girl.id} href={`/${locale}/profily/${girl.slug}`} className="profile-card">
                <div className="profile-img">
                  <div className="placeholder">FOTO</div>
                  {girl.id <= 3 && (
                    <div className={`profile-badge ${girl.id === 1 ? 'new' : girl.id === 2 ? 'top' : 'asian'}`}>
                      {girl.id === 1 && t('girls.new')}
                      {girl.id === 2 && t('girls.top_reviews')}
                      {girl.id === 3 && t('girls.recommended')}
                    </div>
                  )}
                </div>
                <div className="profile-info">
                  <div className="profile-name-row">
                    {girl.online && <span className="online-dot"></span>}
                    <span className="profile-name">{girl.name}</span>
                    <span className="profile-time">{getTimeRange()}</span>
                  </div>
                  <div className="profile-stats">
                    <div className="profile-stat">
                      <span className="profile-stat-value">{girl.age}</span> {t('girls.age_years')}
                    </div>
                    <div className="profile-stat">
                      {t('girls.bust')} <span className="profile-stat-value">{getBreastSize(girl.bust)}</span>
                    </div>
                    <div className="profile-stat">
                      <span className="profile-stat-value">{girl.height}</span> {t('girls.height_cm')}
                    </div>
                    <div className="profile-stat">
                      <span className="profile-stat-value">{girl.weight}</span> {t('girls.weight_kg')}
                    </div>
                  </div>
                  {girl.languages && (
                    <div className="profile-languages" style={{ fontSize: '0.75rem', color: '#9a8a8e', marginTop: '8px' }}>
                      {t('girls.languages_spoken')}: {JSON.parse(girl.languages).map((code: string) => getLanguageName(code)).join(', ')}
                    </div>
                  )}
                  <div className="profile-location">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {getLocation()}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Footer */}
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
