"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MobileMenu from '@/components/MobileMenu';
import { PersonSchema, BreadcrumbSchema } from '@/components/StructuredData';
import { Cormorant } from 'next/font/google';
import {
  Clock,
  MapPin,
  Phone as PhoneIcon,
  Image as ImageIcon,
  Play
} from "lucide-react";
import ReviewsList from '@/components/ReviewsList';
import ReviewForm from '@/components/ReviewForm';
import ReviewStars from '@/components/ReviewStars';

const cormorant = Cormorant({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
});

// Flag SVG Components
const CzechFlag = () => (
  <svg viewBox="0 0 32 24">
    <rect fill="#fff" width="32" height="24"/>
    <rect fill="#d7141a" y="12" width="32" height="12"/>
    <polygon fill="#11457e" points="0,0 16,12 0,24"/>
  </svg>
);

const UKFlag = () => (
  <svg viewBox="0 0 32 24">
    <rect fill="#012169" width="32" height="24"/>
    <path fill="#fff" d="M0,0 L32,24 M32,0 L0,24" stroke="#fff" strokeWidth="3"/>
    <path fill="#C8102E" d="M0,0 L32,24 M32,0 L0,24" stroke="#C8102E" strokeWidth="2"/>
    <path fill="#fff" d="M14,0 v24 M0,12 h32" stroke="#fff" strokeWidth="6"/>
    <path fill="#C8102E" d="M14,0 v24 M0,12 h32" stroke="#C8102E" strokeWidth="3"/>
  </svg>
);

const RussianFlag = () => (
  <svg viewBox="0 0 32 24">
    <rect fill="#fff" width="32" height="8"/>
    <rect fill="#0039A6" y="8" width="32" height="8"/>
    <rect fill="#D52B1E" y="16" width="32" height="8"/>
  </svg>
);

const UkrainianFlag = () => (
  <svg viewBox="0 0 32 24">
    <rect fill="#005BBB" width="32" height="12"/>
    <rect fill="#FFD500" y="12" width="32" height="12"/>
  </svg>
);

const GermanFlag = () => (
  <svg viewBox="0 0 32 24">
    <rect fill="#000" width="32" height="8"/>
    <rect fill="#D00" y="8" width="32" height="8"/>
    <rect fill="#FFCE00" y="16" width="32" height="8"/>
  </svg>
);

// WhatsApp Icon
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// Telegram Icon
const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

interface Girl {
  id: number;
  name: string;
  slug: string;
  age: number;
  height: number;
  weight: number;
  bust: string;
  hair: string;
  eyes: string;
  nationality: string;
  online: boolean;
  verified: boolean;
  rating: number;
  reviews_count: number;
  services: string[];
  bio: string;
  tattoo_percentage?: number;
  tattoo_description?: string;
  piercing?: boolean;
  piercing_description?: string;
  languages?: string; // JSON array: ["cs", "en", "de", "uk"]
}

export default function ProfileDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const tFooter = useTranslations('footer');
  const locale = useLocale();
  const [activeGalleryMode, setActiveGalleryMode] = useState<"photo" | "video">("photo");
  const [activeThumb, setActiveThumb] = useState(0);
  const [profile, setProfile] = useState<Girl | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const resolvedParams = await params;
      const response = await fetch(`/api/girls/${resolvedParams.slug}`);
      const data = await response.json();

      if (data.success) {
        setProfile(data.girl);
      } else {
        setError(data.error || t('detail.not_found'));
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(t('detail.error'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9a8a8e' }}>
        {t('detail.loading')}
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
        <div style={{ color: '#ef4444', fontSize: '1.2rem' }}>{error || t('detail.not_found')}</div>
        <Link href={`/${locale}/divky`} className="btn btn-fill">{t('detail.back_to_list')}</Link>
      </div>
    );
  }

  const getTimeRange = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "10:00 – 18:00";
    if (hour < 18) return "12:00 – 20:00";
    return "14:00 – 22:00";
  };

  const getBreastSize = (): string => {
    if (!profile.bust) return '2';
    if (profile.bust.includes('-')) {
      const size = parseInt(profile.bust.split('-')[0]);
      if (size >= 95) return '3';
      if (size >= 85) return '2';
      return '1';
    }
    return profile.bust;
  };

  const getLanguages = (): Array<{ code: string; name: string; flag: React.ReactNode }> => {
    const languageMap: Record<string, { name: string; flag: React.ReactNode }> = {
      'cs': { name: 'Čeština', flag: <CzechFlag /> },
      'en': { name: 'English', flag: <UKFlag /> },
      'de': { name: 'Deutsch', flag: <GermanFlag /> },
      'uk': { name: 'Українська', flag: <UkrainianFlag /> },
      'ru': { name: 'Русский', flag: <RussianFlag /> }
    };

    if (!profile.languages) {
      // Default to Czech if no languages specified
      return [{ code: 'cs', name: 'Čeština', flag: <CzechFlag /> }];
    }

    try {
      const codes: string[] = JSON.parse(profile.languages);
      return codes
        .filter(code => languageMap[code])
        .map(code => ({ code, ...languageMap[code] }));
    } catch {
      return [{ code: 'cs', name: 'Čeština', flag: <CzechFlag /> }];
    }
  };

  const includedServices = [
    { code: "classic_massage" },
    { code: "erotic_massage" },
    { code: "body_to_body" },
    { code: "shared_shower" },
    { code: "kissing" },
    { code: "striptease" }
  ];

  const extraServices = [
    { code: "nuru_massage", price: "+500 Kč" },
    { code: "tantra_massage", price: "+800 Kč" },
    { code: "duo", price: "+1500 Kč" }
  ];

  const breadcrumbItems = [
    { name: t('breadcrumb.home'), url: `https://lovelygirls.cz/${locale}` },
    { name: t('breadcrumb.girls'), url: `https://lovelygirls.cz/${locale}/divky` },
    { name: profile.name, url: `https://lovelygirls.cz/${locale}/profily/${profile.slug}` }
  ];

  return (
    <>
      <PersonSchema girl={profile} locale={locale} />
      <BreadcrumbSchema items={breadcrumbItems} />

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
        <MobileMenu currentPath={pathname} />
      </nav>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link href={`/${locale}`}>{t('breadcrumb.home')}</Link>
        <span>›</span>
        <Link href={`/${locale}/divky`}>{t('breadcrumb.girls')}</Link>
        <span>›</span>
        {profile.name}
      </div>

      {/* Detail Section */}
      <section className="detail">
        <div className="detail-grid">
          {/* Gallery - Sticky */}
          <div className="gallery">
            <div className="gallery-main">
              {profile.verified && <span className="gallery-badge">{t('girls.verified')}</span>}
              HLAVNÍ FOTO / VIDEO
              <div className="gallery-toggle">
                <button
                  className={`toggle-btn ${activeGalleryMode === "photo" ? "active" : ""}`}
                  onClick={() => setActiveGalleryMode("photo")}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  {t('detail.photo')}
                </button>
                <button
                  className={`toggle-btn ${activeGalleryMode === "video" ? "active" : ""}`}
                  onClick={() => setActiveGalleryMode("video")}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                  {t('detail.video')}
                </button>
              </div>
            </div>
            <div className="gallery-thumbs">
              <div className={`gallery-thumb ${activeThumb === 0 ? "active" : ""}`} onClick={() => setActiveThumb(0)}>1</div>
              <div className={`gallery-thumb ${activeThumb === 1 ? "active" : ""}`} onClick={() => setActiveThumb(1)}>2</div>
              <div className={`gallery-thumb ${activeThumb === 2 ? "active" : ""}`} onClick={() => setActiveThumb(2)}>3</div>
              <div className={`gallery-thumb video ${activeThumb === 3 ? "active" : ""}`} onClick={() => setActiveThumb(3)}>▶</div>
              <div className={`gallery-thumb video ${activeThumb === 4 ? "active" : ""}`} onClick={() => setActiveThumb(4)}>▶</div>
            </div>

            {/* Schedule Section */}
            {/* TODO: Load schedule from bookings API - only show days with actual bookings */}
            {/* If no bookings in current week, show nothing */}
            {false && (
            <div className="schedule-section">
              <div className="schedule-grid">
                {/* Schedule items should be dynamically generated from bookings */}
                {/* Example: */}
                {/* {weekBookings.map(booking => (
                  <div className="schedule-item" key={booking.id}>
                    <span className="schedule-day">{getDayAbbr(booking.date)}</span>
                    <div className="schedule-info">
                      <span className={`schedule-time ${getTimeClass(booking.date)}`}>
                        {booking.start_time} - {booking.end_time}
                      </span>
                      <span className="schedule-location">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        {booking.location}
                      </span>
                    </div>
                  </div>
                ))} */}
              </div>
            </div>
            )}
          </div>

          {/* Profile Content - Scrollable */}
          <div className="profile-content">
            {/* Header */}
            <div className="profile-header">
              <div className="profile-top-row">
                <div className="profile-status">
                  {profile.online && <span className="online-dot"></span>}
                  <span className="status-text">{profile.online ? t('girls.online') : t('girls.offline')}</span>
                </div>
                <div className="profile-time">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                  {getTimeRange()}
                </div>
              </div>
              <h1 className={`profile-name ${cormorant.className}`}>{profile.name}</h1>
              <p className="profile-tagline">{t('detail.tagline')}</p>
            </div>

            {/* Stats + Languages */}
            <div className="stats-section">
              <div className="stats-row">
                <div className="stat-item">
                  <div className={`stat-value ${cormorant.className}`}>{profile.age}</div>
                  <div className="stat-label">{t('girls.age_years')}</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <div className={`stat-value ${cormorant.className}`}>{profile.height}</div>
                  <div className="stat-label">{t('girls.height_cm')}</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <div className={`stat-value ${cormorant.className}`}>{profile.weight}</div>
                  <div className="stat-label">{t('girls.weight_kg')}</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <div className={`stat-value ${cormorant.className}`}>{getBreastSize()}</div>
                  <div className="stat-label">{t('girls.bust')}</div>
                </div>
              </div>
              <div className="languages-row">
                <span className="lang-label">{t('girls.languages_spoken')}</span>
                <div className="lang-flags">
                  {getLanguages().map((lang) => (
                    <div key={lang.code} className="lang-flag" title={lang.name}>
                      {lang.flag}
                      <span>{lang.code.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hashtags */}
            {profile.services && profile.services.length > 0 && (
              <div className="hashtags">
                {profile.services.map((tag, i) => (
                  <a href="#" key={i} className="hashtag">{tag}</a>
                ))}
              </div>
            )}

            {/* Location */}
            <div className="location-row">
              <div className="location-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div className="location-text">
                <div className="location-name">{t('detail.location_prague')}</div>
                <div className="location-address">{t('detail.location_details')}</div>
              </div>
            </div>

            {/* Description */}
            <div className="profile-section">
              <h3 className={`section-title ${cormorant.className}`}>{t('profile.about_me')}</h3>
              <p className="profile-description" style={{ whiteSpace: "pre-line" }}>
                {profile.bio || `Vítejte na mém profilu. Jsem ${profile.name} — ${profile.age}letá společnice, která věří, že pravý luxus spočívá v detailech a autentickém prožitku.

Ráda vytvářím atmosféru, kde se budete cítit uvolněně a výjimečně. Každé setkání je pro mě jedinečné — ať už hledáte relaxační masáž po náročném dni nebo příjemnou společnost na večer.

Mluvím plynule česky a anglicky. Těším se na vás.`}
              </p>
            </div>

            {/* Tattoo & Piercing Section */}
            {(profile.tattoo_percentage && profile.tattoo_percentage > 0) || profile.piercing ? (
              <div className="profile-section">
                <h3 className={`section-title ${cormorant.className}`}>{t('profile.tattoo_piercing')}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {profile.tattoo_percentage && profile.tattoo_percentage > 0 && (
                    <div>
                      <div style={{ fontSize: '14px', color: '#9a8a8e', marginBottom: '4px' }}>
                        {t('profile.tattoo')}: <strong style={{ color: '#fff' }}>{profile.tattoo_percentage}{t('profile.tattoo_percentage')}</strong>
                      </div>
                      {profile.tattoo_description && (
                        <div style={{ fontSize: '14px', color: '#c9b8bd', lineHeight: '1.5' }}>
                          {profile.tattoo_description}
                        </div>
                      )}
                    </div>
                  )}
                  {profile.piercing && (
                    <div>
                      <div style={{ fontSize: '14px', color: '#9a8a8e', marginBottom: '4px' }}>
                        {t('profile.piercing')}: <strong style={{ color: '#fff' }}>{t('profile.yes')}</strong>
                      </div>
                      {profile.piercing_description && (
                        <div style={{ fontSize: '14px', color: '#c9b8bd', lineHeight: '1.5' }}>
                          {profile.piercing_description}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {/* Services - Included */}
            <div className="profile-section">
              <h3 className={`section-title ${cormorant.className}`}>{t('profile.included')}</h3>
              <div className="services-grid">
                {includedServices.map((service, i) => (
                  <div key={i} className="service-item">
                    <div className="service-name">
                      <div className="service-icon">✓</div>
                      {t(`services.${service.code}`)}
                    </div>
                    <span className="service-price included">{t('profile.included')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Services - Extra */}
            <div className="profile-section">
              <h3 className={`section-title ${cormorant.className}`}>{t('profile.extra_services')}</h3>
              <div className="services-grid">
                {extraServices.map((service, i) => (
                  <div key={i} className="service-item extra">
                    <div className="service-name">
                      <div className="service-icon">+</div>
                      {t(`services.${service.code}`)}
                    </div>
                    <span className="service-price extra">{service.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="profile-cta">
              <a href={`https://wa.me/420734332131?text=Ahoj%20${encodeURIComponent(profile.name)}%2C%20m%C3%A1%C5%A1%20dneska%20%C4%8Das%3F`} className="cta-btn whatsapp">
                <WhatsAppIcon />
                WhatsApp
              </a>
              <a href="https://t.me/lovelygirls_prague" className="cta-btn telegram">
                <TelegramIcon />
                Telegram
              </a>
              <a href="tel:+420734332131" className="cta-btn phone">
                <PhoneIcon size={24} />
                {t('profile.call')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews-section">
        <div className="reviews-header">
          <h2 className={`reviews-title ${cormorant.className}`}>Recenze</h2>
          {profile.reviews_count > 0 && (
            <div className="reviews-rating">
              <span className="rating-stars">★★★★★</span>
              <span className="rating-value">{profile.rating || 4.9}</span>
              <span className="rating-count">({profile.reviews_count} recenzí)</span>
            </div>
          )}
        </div>
        <div className="reviews-grid">
          <ReviewsList
            girlId={profile.id}
            limit={3}
            translations={{
              title: 'Recenze od klientů',
              no_reviews: 'Zatím žádné recenze. Buďte první!',
              loading: 'Načítání recenzí...',
              verified_booking: 'Ověřená rezervace',
              reviewed_on: 'Hodnoceno'
            }}
          />
        </div>
      </section>

      {/* Similar Girls Section */}
      <section className="similar-section">
        <div className="similar-header">
          <h2 className={`similar-title ${cormorant.className}`}>Podobné dívky</h2>
        </div>
        <div className="similar-grid">
          {/* Similar girls cards will be populated here */}
        </div>
      </section>

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
                ovely Girls
              </Link>
              <p className="footer-tagline">Prague Premium Escort</p>
              <p className="footer-desc">{tFooter('about_text')}</p>
            </div>

            <div className="footer-links-grid">
              {/* Services */}
              <div className="footer-links-col">
                <h4 className="footer-links-title">Služby</h4>
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
                    Zavolat
                  </a>
                  <a href="https://wa.me/420734332131?text=Ahoj%2C%20m%C3%A1te%20dneska%20voln%C3%BD%20term%C3%ADn%3F" className="footer-contact-btn whatsapp">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    WhatsApp
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
        </div>
      </footer>

      {/* Styled JSX */}
      <style jsx>{`
        /* CSS Variables */
        :global(:root) {
          --black: #1a1216;
          --bg: #231a1e;
          --white: #ffffff;
          --gray: #9a8a8e;
          --gray-light: #ccc;
          --gray-dark: #4a3a3e;
          --wine: #8b2942;
          --wine-light: #a33352;
          --wine-dark: #5c1c2e;
          --green: #22c55e;
        }

        /* Navigation */
        nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 4%;
          background: rgba(26, 18, 22, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .logo {
          font-family: 'DM Sans', sans-serif;
          font-size: 1.3rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #fff;
        }

        .logo-L {
          position: relative;
          display: inline-block;
        }

        .santa-hat {
          position: absolute;
          top: -8px;
          left: 0px;
          width: 14px;
          height: 12px;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
        }

        .nav-links :global(a) {
          font-size: 0.85rem;
          color: var(--gray);
          transition: color 0.3s;
        }

        .nav-links :global(a:hover) {
          color: var(--white);
        }

        .nav-contact {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        :global(.btn) {
          padding: 0.7rem 1.4rem;
          font-size: 0.8rem;
          font-weight: 500;
          border: 1px solid rgba(255,255,255,0.2);
          background: transparent;
          color: var(--white);
          cursor: pointer;
          transition: all 0.3s;
          border-radius: 6px;
          text-decoration: none;
        }

        :global(.btn:hover) {
          background: var(--wine);
          border-color: var(--wine);
        }

        :global(.btn-fill) {
          background: var(--wine);
          color: var(--white);
          border-color: var(--wine);
        }

        :global(.btn-fill:hover) {
          background: var(--wine-light);
          border-color: var(--wine-light);
        }


        /* Breadcrumb */
        .breadcrumb {
          padding: 100px 4% 1rem;
          font-size: 0.8rem;
          color: var(--gray);
        }

        .breadcrumb :global(a) {
          color: var(--gray);
          transition: color 0.3s;
        }

        .breadcrumb :global(a:hover) {
          color: var(--white);
        }

        .breadcrumb span {
          margin: 0 0.5rem;
        }

        /* Detail Layout */
        .detail {
          padding: 1rem 4% 4rem;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 500px 1fr;
          gap: 3rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Gallery - Sticky */
        .gallery {
          position: sticky;
          top: 100px;
          height: fit-content;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .gallery-main {
          aspect-ratio: 3/4;
          background: var(--wine-dark);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.3);
          font-size: 0.8rem;
          letter-spacing: 0.15em;
          position: relative;
          overflow: hidden;
        }

        .gallery-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: var(--wine-light);
          color: #fff;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .gallery-toggle {
          position: absolute;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(10px);
          border-radius: 100px;
          padding: 4px;
          gap: 4px;
        }

        .toggle-btn {
          padding: 0.5rem 1.25rem;
          font-size: 0.75rem;
          font-weight: 500;
          border: none;
          background: transparent;
          color: var(--gray);
          cursor: pointer;
          border-radius: 100px;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .toggle-btn svg {
          width: 14px;
          height: 14px;
        }

        .toggle-btn.active {
          background: var(--wine);
          color: #fff;
        }

        .toggle-btn:hover:not(.active) {
          color: #fff;
        }

        .gallery-thumbs {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.5rem;
        }

        .gallery-thumb {
          aspect-ratio: 1;
          background: var(--wine-dark);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.5rem;
          color: rgba(255,255,255,0.3);
          position: relative;
          overflow: hidden;
        }

        .gallery-thumb:hover {
          opacity: 0.7;
        }

        .gallery-thumb.active {
          outline: 2px solid var(--wine-light);
          outline-offset: 2px;
        }

        .gallery-thumb.video::after {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          background: rgba(0,0,0,0.7);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gallery-thumb.video::before {
          content: '';
          position: absolute;
          z-index: 1;
          border-style: solid;
          border-width: 5px 0 5px 8px;
          border-color: transparent transparent transparent #fff;
          margin-left: 2px;
        }

        /* Schedule Section */
        .schedule-section {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .schedule-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .schedule-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .schedule-day {
          background: rgba(255,255,255,0.08);
          color: var(--white);
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.4rem 0.6rem;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          min-width: 42px;
          text-align: center;
        }

        .schedule-info {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .schedule-time {
          font-size: 0.8rem;
          font-weight: 500;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          display: inline-block;
          width: fit-content;
        }

        .schedule-time.available {
          background: rgba(34, 197, 94, 0.15);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #4ade80;
        }

        .schedule-time.tomorrow {
          background: rgba(251, 146, 60, 0.15);
          border: 1px solid rgba(251, 146, 60, 0.3);
          color: #fb923c;
        }

        .schedule-time.future {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: var(--gray-light);
        }

        .schedule-location {
          font-size: 0.75rem;
          color: var(--gray);
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .schedule-location svg {
          width: 12px;
          height: 12px;
          color: var(--wine-light);
        }

        /* Profile Content */
        .profile-content {
          padding-bottom: 4rem;
        }

        .profile-header {
          margin-bottom: 2.5rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .profile-top-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }

        .profile-status {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(34, 197, 94, 0.1);
          padding: 0.4rem 0.8rem;
          border-radius: 100px;
        }

        .online-dot {
          width: 8px;
          height: 8px;
          background: var(--green);
          border-radius: 50%;
          animation: blink 1.5s ease-in-out infinite;
          box-shadow: 0 0 8px var(--green);
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .status-text {
          font-size: 0.75rem;
          color: var(--green);
          font-weight: 500;
        }

        .profile-time {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: var(--white);
          font-size: 0.75rem;
          font-weight: 500;
          padding: 0.4rem 0.8rem;
          border-radius: 100px;
        }

        .profile-time svg {
          width: 14px;
          height: 14px;
          color: var(--gray);
        }

        .profile-name {
          font-size: 3.5rem;
          font-weight: 300;
          margin-bottom: 0.75rem;
          line-height: 1.1;
        }

        .profile-tagline {
          font-size: 1.1rem;
          color: var(--gray);
          font-weight: 300;
        }

        /* Stats + Languages */
        .stats-section {
          background: var(--bg);
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .stats-row {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .stat-item {
          text-align: center;
          padding: 0 1.5rem;
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: rgba(255,255,255,0.1);
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 400;
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.7rem;
          color: var(--gray);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .languages-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding-top: 1.25rem;
        }

        .lang-label {
          font-size: 0.75rem;
          color: var(--gray);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .lang-flags {
          display: flex;
          gap: 0.5rem;
        }

        .lang-flag {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255,255,255,0.05);
          padding: 0.4rem 0.75rem;
          border-radius: 100px;
          font-size: 0.75rem;
          color: var(--white);
          transition: all 0.3s;
        }

        .lang-flag:hover {
          background: rgba(255,255,255,0.1);
        }

        .lang-flag svg {
          width: 20px;
          height: 15px;
          border-radius: 2px;
          overflow: hidden;
        }

        .lang-flag span {
          font-weight: 500;
        }

        /* Hashtags - Modern */
        .hashtags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          margin-bottom: 2rem;
        }

        .hashtag {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.6rem 1.1rem;
          background: linear-gradient(135deg, rgba(139, 41, 66, 0.2) 0%, rgba(163, 51, 82, 0.1) 100%);
          border: 1px solid rgba(163, 51, 82, 0.25);
          border-radius: 12px;
          font-size: 0.8rem;
          color: #e8b4c0;
          font-weight: 500;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .hashtag::before {
          content: '#';
          color: var(--wine-light);
          font-weight: 600;
          opacity: 0.7;
        }

        .hashtag::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transition: left 0.5s;
        }

        .hashtag:hover {
          border-color: var(--wine-light);
          background: linear-gradient(135deg, rgba(139, 41, 66, 0.35) 0%, rgba(163, 51, 82, 0.2) 100%);
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(139, 41, 66, 0.25);
        }

        .hashtag:hover::after {
          left: 100%;
        }

        .hashtag:hover::before {
          opacity: 1;
        }

        /* Location */
        .location-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2.5rem;
        }

        .location-icon {
          width: 40px;
          height: 40px;
          background: var(--bg);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .location-icon svg {
          width: 18px;
          height: 18px;
          color: var(--wine-light);
        }

        .location-text {
          flex: 1;
        }

        .location-name {
          font-size: 0.95rem;
          font-weight: 500;
          margin-bottom: 0.1rem;
        }

        .location-address {
          font-size: 0.8rem;
          color: var(--gray);
        }

        /* Description */
        .profile-section {
          margin-bottom: 2.5rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 400;
          margin-bottom: 1rem;
        }

        .profile-description {
          font-size: 1rem;
          color: var(--gray-light);
          line-height: 1.9;
        }

        /* Services - Modern Grid */
        .services-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .service-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          background: var(--bg);
          border-radius: 10px;
          transition: all 0.3s;
        }

        .service-item:hover {
          background: rgba(255,255,255,0.05);
        }

        .service-name {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.9rem;
        }

        .service-icon {
          width: 32px;
          height: 32px;
          background: rgba(34, 197, 94, 0.15);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--green);
          font-size: 0.9rem;
        }

        .service-item.extra .service-icon {
          background: rgba(139, 41, 66, 0.3);
          color: var(--wine-light);
        }

        .service-price {
          font-size: 0.85rem;
          color: var(--gray);
        }

        .service-price.included {
          color: var(--green);
          font-weight: 500;
        }

        .service-price.extra {
          color: var(--wine-light);
          font-weight: 500;
        }

        /* CTA */
        .profile-cta {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          margin-top: 2.5rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .cta-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1.25rem 1rem;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.3s;
          border: none;
          cursor: pointer;
          text-decoration: none;
        }

        .cta-btn :global(svg) {
          width: 24px;
          height: 24px;
        }

        .cta-btn.whatsapp {
          background: #25D366;
          color: #fff;
        }

        .cta-btn.whatsapp:hover {
          background: #20bd5a;
          transform: translateY(-2px);
        }

        .cta-btn.telegram {
          background: #0088cc;
          color: #fff;
        }

        .cta-btn.telegram:hover {
          background: #0077b5;
          transform: translateY(-2px);
        }

        .cta-btn.phone {
          background: var(--bg);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .cta-btn.phone:hover {
          background: var(--wine);
          border-color: var(--wine);
          transform: translateY(-2px);
        }

        /* Reviews Section */
        .reviews-section {
          padding: 4rem 4%;
          background: var(--bg);
        }

        .reviews-header {
          max-width: 1200px;
          margin: 0 auto 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .reviews-title {
          font-size: 1.75rem;
          font-weight: 300;
        }

        .reviews-rating {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .rating-stars {
          color: #fbbf24;
          font-size: 1.1rem;
        }

        .rating-value {
          font-size: 1.25rem;
          font-weight: 500;
        }

        .rating-count {
          font-size: 0.85rem;
          color: var(--gray);
        }

        .reviews-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }

        /* Similar Section */
        .similar-section {
          padding: 4rem 4%;
        }

        .similar-header {
          max-width: 1200px;
          margin: 0 auto 2rem;
        }

        .similar-title {
          font-size: 1.75rem;
          font-weight: 300;
        }

        .similar-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }

        /* Footer */
        footer {
          padding: 2rem 4%;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          color: var(--gray);
        }

        .footer-links {
          display: flex;
          gap: 2rem;
        }

        .footer-links :global(a:hover) {
          color: var(--white);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .detail-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .gallery {
            position: relative;
            top: 0;
          }
          .reviews-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .similar-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .services-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          nav {
            padding: 1rem 4%;
          }
          .nav-links {
            display: none;
          }
          .gallery-thumbs {
            grid-template-columns: repeat(5, 1fr);
          }
          .stats-row {
            flex-wrap: wrap;
            gap: 0;
          }
          .stat-item {
            padding: 0.75rem 1rem;
          }
          .stat-divider {
            display: none;
          }
          .profile-cta {
            grid-template-columns: 1fr;
          }
          .reviews-grid {
            grid-template-columns: 1fr;
          }
          .similar-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .profile-name {
            font-size: 2.5rem;
          }
          .languages-row {
            flex-direction: column;
            gap: 0.75rem;
          }
          .schedule-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .profile-name {
            font-size: 2rem;
          }
          .similar-grid {
            grid-template-columns: 1fr;
          }
          .gallery-thumbs {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      `}</style>
    </>
  );
}
