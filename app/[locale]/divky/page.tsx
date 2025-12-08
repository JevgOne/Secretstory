"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MobileMenu from '@/components/MobileMenu';
import BottomCTA from '@/components/BottomCTA';
import GirlCard from '@/components/GirlCard';
import SkeletonCard from '@/components/SkeletonCard';

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
  const pathname = usePathname();
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
        <MobileMenu currentPath={pathname} />
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
            <>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </>
          ) : girls.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: '#9a8a8e' }}>
              {t('girls.no_girls')}
            </div>
          ) : (
            girls.map((girl) => (
              <GirlCard
                key={girl.id}
                girl={girl}
                badge={girl.id <= 3 ? (girl.id === 1 ? 'new' : girl.id === 2 ? 'top' : 'recommended') : null}
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
