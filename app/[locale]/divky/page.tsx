"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from 'next-intl';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MobileMenu from '@/components/MobileMenu';
import BottomCTA from '@/components/BottomCTA';
import SkeletonCard from '@/components/SkeletonCard';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useLocations } from '@/lib/hooks/useLocations';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-playfair'
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
  languages?: string;
  is_new?: boolean;
  is_top?: boolean;
  is_featured?: boolean;
  badge_type?: string;
  created_at?: string;
  featured_section?: string;
  primary_photo?: string | null;
  thumbnail?: string | null;
  schedule_status?: 'working' | 'later' | null;
  schedule_from?: string | null;
  schedule_to?: string | null;
}

export default function GirlsPage() {
  const { locationNames } = useLocations();
  const t = useTranslations();
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const tHome = useTranslations('home');
  const tFooter = useTranslations('footer');
  const locale = useLocale();
  const pathname = usePathname();
  const [girls, setGirls] = useState<Girl[]>([]);
  const [loading, setLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    fetchGirls();
  }, []);

  const fetchGirls = async () => {
    try {
      const response = await fetch('/api/girls?status=active', {
        cache: 'no-store' // Force fresh data, bypass browser cache
      });
      const data = await response.json();
      console.log('[DIVKY DEBUG] API response:', { success: data.success, girlsCount: data.girls?.length });
      if (data.success) {
        setGirls(data.girls);
        console.log('[DIVKY DEBUG] Girls set, count:', data.girls.length);
      } else {
        console.warn('[DIVKY DEBUG] API returned success=false');
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

  // Removed getTimeRange() - now using real schedule data from API

  const getLocation = (): string => {
    const locations = locationNames.length > 0 ? locationNames : [tHome('default_location'), tHome('location_new_name')];
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

  // Schema.org structured data
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        "name": t('girls.title'),
        "description": t('girls.subtitle'),
        "numberOfItems": girls.length,
        "itemListElement": girls.map((girl, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Person",
            "name": girl.name,
            "image": girl.primary_photo || girl.thumbnail,
            "url": `https://www.lovelygirls.cz/${locale}/profily/${girl.slug}`
          }
        }))
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://www.lovelygirls.cz/#business",
        "name": "LovelyGirls Prague",
        "description": t('girls.subtitle'),
        "url": `https://www.lovelygirls.cz/${locale}/divky`,
        "telephone": "+420734332131",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Prague",
          "addressCountry": "CZ"
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "10:00",
          "closes": "04:00"
        },
        "priceRange": "$$$$",
        "servesCuisine": "Adult Entertainment"
      },
      {
        "@type": "WebPage",
        "@id": `https://www.lovelygirls.cz/${locale}/divky#webpage`,
        "url": `https://www.lovelygirls.cz/${locale}/divky`,
        "name": t('girls.title'),
        "description": t('girls.subtitle'),
        "inLanguage": locale,
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://www.lovelygirls.cz/#website",
          "name": "LovelyGirls Prague",
          "url": "https://www.lovelygirls.cz"
        }
      }
    ]
  };

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className={`${playfair.variable} ${dmSans.variable}`}>
        {/* Ambient Background */}
        <div className="ambient-bg"></div>

        {/* Mobile Menu - outside nav for proper z-index */}
        <MobileMenu currentPath={pathname} />

        {/* Navigation */}
        <nav className="main-nav">
          <Link href={`/${locale}`} className="logo">
            <span className="logo-L">
              <svg className="santa-hat" viewBox="0 0 16 14" fill="none">
                <path d="M2 12C4 11 6 7 9 5C8 3 9 1.5 10 1" stroke="#c41e3a" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="10" cy="1.5" r="1.5" fill="#fff"/>
                <path d="M1 12C3 11.5 6 11 9 11" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              L
            </span>
            {tCommon('brand_suffix')}
          </Link>
          <div className="nav-links">
            <Link href={`/${locale}`}>{tNav('home')}</Link>
            <Link href={`/${locale}/divky`} className="active">{tNav('girls')}</Link>
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

        {/* Main Container */}
        <div className="container">
          {/* Section Header */}
          <header className="section-header">
            <div>
              <h1 className="section-title">{t('girls.title')}</h1>
              <p className="section-subtitle">{t('girls.subtitle')}</p>
            </div>
          </header>

          {/* Cards Grid */}
          <div className="cards-grid">
            {loading ? (
              <>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </>
            ) : girls.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: '#9a8a8e' }}>
                {t('girls.no_girls')}
              </div>
            ) : (
              girls.map((girl) => {
                // Badge logic: Only show if explicitly set in admin panel via badge_type
                // Auto-detection disabled - importing old profiles from original site
                const badge = girl.badge_type || null;
                const badgeText = badge === 'new' ? t('girls.new') : badge === 'top' ? t('girls.top_reviews') : badge === 'recommended' ? t('girls.recommended') : badge === 'asian' ? tCommon('asian') : '';
                const badgeClass = badge === 'new' ? 'badge-new' : badge === 'top' ? 'badge-top' : 'badge-asian';
                const breastSize = getBreastSize(girl.bust);
                // Use schedule data from API (same as homepage)
                const timeRange = girl.schedule_from && girl.schedule_to ? `${girl.schedule_from} - ${girl.schedule_to}` : null;
                const isWorking = girl.schedule_status === 'working';
                const location = getLocation();

                return (
                  <Link href={`/${locale}/profily/${girl.slug}`} key={girl.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <article className="card">
                      <div className="card-image-container">
                        {badge && (
                          <span className={`badge ${badgeClass}`}>{badgeText}</span>
                        )}
                        {girl.thumbnail || girl.primary_photo ? (
                          <img
                            src={girl.thumbnail || girl.primary_photo || ''}
                            alt={girl.name}
                            className="card-image"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="card-placeholder">{tCommon('photo')}</div>
                        )}
                        <div className="card-overlay"></div>
                        <div className="quick-actions">
                          <button
                            className="action-btn"
                            title={tCommon('profile')}
                            onClick={(e) => {
                              e.preventDefault();
                              window.location.href = `/${locale}/profily/${girl.slug}`;
                            }}
                          >
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                          </button>
                          <button
                            className={`action-btn ${isFavorite(girl.id) ? 'favorite-active' : ''}`}
                            title={isFavorite(girl.id) ? t('favorites.remove') : t('favorites.add')}
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
                          <span className="stat"><span className="stat-value">{girl.age}</span><span className="stat-label">{t('girls.age_years')}</span></span>
                          <span className="stat"><span className="stat-value">{girl.height}</span><span className="stat-label">cm</span></span>
                          <span className="stat"><span className="stat-value">{girl.weight}</span><span className="stat-label">kg</span></span>
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
        </div>

        {/* FOOTER */}
        <footer>
          <div className="footer-container">
            <div className="footer-main">
              <div className="footer-brand-section">
                <Link href={`/${locale}`} className="footer-logo">
                  <span className="logo-L">
                    <svg className="santa-hat" viewBox="0 0 16 14" fill="none">
                      <path d="M2 12C4 11 6 7 9 5C8 3 9 1.5 10 1" stroke="#c41e3a" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="10" cy="1.5" r="1.5" fill="#fff"/>
                      <path d="M1 12C3 11.5 6 11 9 11" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    L
                  </span>
                  {tCommon('brand_suffix')}
                </Link>
                <p className="footer-tagline">{tFooter('tagline')}</p>
                <p className="footer-desc">{tFooter('about_text')}</p>
              </div>

              <div className="footer-links-grid">
                {/* Services */}
                <div className="footer-links-col">
                  <h4 className="footer-links-title">{tFooter('practices')}</h4>
                  <nav className="footer-links">
                    <Link href={`/${locale}/divky`}>{tNav('girls')}</Link>
                    <Link href={`/${locale}/cenik`}>{tNav('pricing')}</Link>
                    <Link href={`/${locale}/schedule`}>{tNav('schedule')}</Link>
                    <Link href={`/${locale}/discounts`}>{tNav('discounts')}</Link>
                    <Link href={`/${locale}/faq`}>{tNav('faq')}</Link>
                    <Link href={`/${locale}/blog`}>{tFooter('blog')}</Link>
                  </nav>
                </div>

                {/* Contact */}
                <div className="footer-links-col">
                  <h4 className="footer-links-title">{tFooter('contact')}</h4>
                  <div className="footer-contact-info">
                    <div className="footer-contact-item">
                      <span className="label">{tFooter('hours')}</span>
                      <span className="value">{tFooter('hours_value')}</span>
                    </div>
                    <div className="footer-contact-item">
                      <span className="label">{tFooter('location')}</span>
                      <span className="value">{tFooter('location_value')}</span>
                    </div>
                  </div>
                  <div className="footer-contact-actions">
                    <a href="tel:+420734332131" className="footer-contact-btn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      {tFooter('call')}
                    </a>
                    <a href="https://wa.me/420734332131?text=Ahoj%2C%20m%C3%A1te%20dneska%20voln%C3%BD%20term%C3%ADn%3F" className="footer-contact-btn whatsapp">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      {tFooter('whatsapp')}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="footer-bottom">
              <div className="footer-bottom-left">
                <span>{tFooter('copyright')}</span>
                <span className="dot">•</span>
                <span>{tCommon('adults_only')}</span>
              </div>
              <div className="footer-bottom-right">
                <Link href={`/${locale}/podminky`}>{tFooter('terms')}</Link>
                <Link href={`/${locale}/soukromi`}>{tFooter('privacy')}</Link>
              </div>
            </div>

            {/* Legal Disclaimer */}
            <div className="footer-disclaimer">
              <p>{tFooter('disclaimer')}</p>
            </div>
          </div>
        </footer>

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

      {/* Using global CSS from globals.css */}
    </>
  );
}
