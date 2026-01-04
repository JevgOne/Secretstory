"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
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
import { getHashtagById, getHashtagName } from '@/lib/hashtags';
import { SERVICES, getServiceName } from '@/lib/services';
import type { Service } from '@/lib/services';

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

interface ScheduleItem {
  day_of_week: number;
  start_time: string;
  end_time: string;
}

interface Photo {
  id: number;
  url: string;
  thumbnail_url: string | null;
  is_primary: boolean;
  display_order: number;
  alt_text?: string | null;
  alt_text_cs?: string | null;
  alt_text_en?: string | null;
  alt_text_de?: string | null;
  alt_text_uk?: string | null;
}

interface Video {
  id: number;
  url: string;
  thumbnail_url: string | null;
  display_order: number;
  duration: number | null;
}

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
  hashtags?: string[]; // Array of hashtag IDs
  bio: string;
  bio_cs?: string;
  bio_de?: string;
  bio_uk?: string;
  subtitle_cs?: string;
  subtitle_en?: string;
  subtitle_de?: string;
  subtitle_uk?: string;
  tattoo_percentage?: number;
  tattoo_description?: string;
  piercing?: boolean;
  piercing_description?: string;
  meta_title?: string;
  meta_description?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  languages?: string; // JSON array: ["cs", "en", "de", "uk"]
  is_new?: boolean;
  is_top?: boolean;
  is_featured?: boolean;
  badge_type?: string;
  created_at?: string;
  schedule?: ScheduleItem[];
  photos?: Photo[];
  videos?: Video[];
  // For online girls list
  primary_photo?: string;
  is_working_now?: boolean;
  schedule_from?: string;
  schedule_to?: string;
}

export default function ProfileDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const tFooter = useTranslations('footer');
  const tSchedule = useTranslations('schedule');
  const tHome = useTranslations('home');
  const locale = useLocale();
  const [activeGalleryMode, setActiveGalleryMode] = useState<"photo" | "video">("photo");
  const [activeThumb, setActiveThumb] = useState(0);
  const [profile, setProfile] = useState<Girl | null>(null);
  const [onlineGirls, setOnlineGirls] = useState<Girl[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  // Reset active thumbnail when switching between photo/video modes
  useEffect(() => {
    setActiveThumb(0);
  }, [activeGalleryMode]);

  const fetchProfile = async () => {
    try {
      const resolvedParams = await params;

      // PARALLEL FETCH - both requests at same time
      const [profileResponse, onlineResponse] = await Promise.all([
        fetch(`/api/girls/${resolvedParams.slug}`),
        fetch(`/api/girls/online-today?limit=4`).catch(() => null)
      ]);

      const profileData = await profileResponse.json();

      if (profileData.success) {
        setProfile(profileData.girl);

        // Process online girls if fetched
        if (onlineResponse) {
          const onlineData = await onlineResponse.json();
          if (onlineData.success) {
            // Filter out current girl from online list
            setOnlineGirls((onlineData.girls || []).filter((g: Girl) => g.id !== profileData.girl.id));
          }
        }
      } else {
        setError(profileData.error || t('detail.not_found'));
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

  // Get today's schedule time range if exists
  const getTodayTimeRange = () => {
    if (!profile.schedule || profile.schedule.length === 0) {
      return null; // No schedule = no time display
    }

    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    const todaySchedule = profile.schedule.find(s => {
      // Convert day_of_week (0=Monday) to JS day (0=Sunday)
      const scheduleDayJS = s.day_of_week === 6 ? 0 : s.day_of_week + 1;
      return scheduleDayJS === today;
    });

    if (todaySchedule) {
      return `${todaySchedule.start_time} – ${todaySchedule.end_time}`;
    }

    return null; // No schedule for today
  };

  // Check if girl is working right now based on schedule
  const isWorkingNow = () => {
    if (!profile.schedule || profile.schedule.length === 0) {
      return false;
    }

    const now = new Date();
    const today = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentTime = now.toLocaleTimeString('cs-CZ', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    const todaySchedule = profile.schedule.find(s => {
      // Convert day_of_week (0=Monday) to JS day (0=Sunday)
      const scheduleDayJS = s.day_of_week === 6 ? 0 : s.day_of_week + 1;
      return scheduleDayJS === today;
    });

    if (!todaySchedule) {
      return false; // No schedule for today
    }

    // Compare times (HH:MM format)
    return currentTime >= todaySchedule.start_time && currentTime <= todaySchedule.end_time;
  };

  // Check if shift has ended for today
  const isClosedToday = () => {
    if (!profile.schedule || profile.schedule.length === 0) {
      return false;
    }

    const now = new Date();
    const today = now.getDay();
    const currentTime = now.toLocaleTimeString('cs-CZ', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    const todaySchedule = profile.schedule.find(s => {
      const scheduleDayJS = s.day_of_week === 6 ? 0 : s.day_of_week + 1;
      return scheduleDayJS === today;
    });

    if (!todaySchedule) {
      return false; // No schedule = not closed, just not working
    }

    // If current time is past end time, it's closed
    return currentTime > todaySchedule.end_time;
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

  const breadcrumbItems = [
    { name: t('breadcrumb.home'), url: `https://www.lovelygirls.cz/${locale}` },
    { name: t('breadcrumb.girls'), url: `https://www.lovelygirls.cz/${locale}/divky` },
    { name: profile.name, url: `https://www.lovelygirls.cz/${locale}/profily/${profile.slug}` }
  ];

  return (
    <>
      <Head>
        <title>{
          (locale === 'cs' && profile.meta_title_cs) ||
          (locale === 'en' && profile.meta_title_en) ||
          (locale === 'de' && profile.meta_title_de) ||
          (locale === 'uk' && profile.meta_title_uk) ||
          profile.meta_title ||
          `${profile.name}, ${profile.age} | LovelyGirls`
        }</title>
        <meta name="description" content={
          (locale === 'cs' && profile.meta_description_cs) ||
          (locale === 'en' && profile.meta_description_en) ||
          (locale === 'de' && profile.meta_description_de) ||
          (locale === 'uk' && profile.meta_description_uk) ||
          profile.meta_description ||
          `${profile.name} - ${profile.age} let, ${profile.nationality}. ${profile.bio || ''}`
        } />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="profile" />
        <meta property="og:title" content={
          (locale === 'cs' && profile.og_title_cs) ||
          (locale === 'en' && profile.og_title_en) ||
          (locale === 'de' && profile.og_title_de) ||
          (locale === 'uk' && profile.og_title_uk) ||
          profile.og_title ||
          profile.meta_title ||
          `${profile.name}, ${profile.age} | LovelyGirls`
        } />
        <meta property="og:description" content={
          (locale === 'cs' && profile.og_description_cs) ||
          (locale === 'en' && profile.og_description_en) ||
          (locale === 'de' && profile.og_description_de) ||
          (locale === 'uk' && profile.og_description_uk) ||
          profile.og_description ||
          profile.meta_description ||
          `${profile.name} - ${profile.age} let, ${profile.nationality}.`
        } />
        {profile.og_image && <meta property="og:image" content={profile.og_image} />}
        {!profile.og_image && profile.photos && profile.photos[0] && (
          <meta property="og:image" content={profile.photos[0].url} />
        )}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={
          (locale === 'cs' && profile.og_title_cs) ||
          (locale === 'en' && profile.og_title_en) ||
          (locale === 'de' && profile.og_title_de) ||
          (locale === 'uk' && profile.og_title_uk) ||
          profile.og_title ||
          profile.meta_title ||
          `${profile.name}, ${profile.age} | LovelyGirls`
        } />
        <meta name="twitter:description" content={
          (locale === 'cs' && profile.og_description_cs) ||
          (locale === 'en' && profile.og_description_en) ||
          (locale === 'de' && profile.og_description_de) ||
          (locale === 'uk' && profile.og_description_uk) ||
          profile.og_description ||
          profile.meta_description ||
          `${profile.name} - ${profile.age} let, ${profile.nationality}.`
        } />
      </Head>

      <PersonSchema girl={profile} locale={locale} />
      <BreadcrumbSchema items={breadcrumbItems} />

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
          <a href="tel:+420734332131" className="contact-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span>{tNav('call_us')}</span>
          </a>
          <a href="https://wa.me/420734332131" className="contact-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span>{tNav('whatsapp')}</span>
          </a>
          <Link href={`/${locale}/locations`} className="contact-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>{tNav('branches')}</span>
          </Link>
          <Link href={`/${locale}/discounts`} className="contact-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="8" width="18" height="12" rx="2"/>
              <path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/>
              <circle cx="9" cy="13" r="1"/>
              <circle cx="15" cy="16" r="1"/>
              <path d="M8 16l8-6"/>
            </svg>
            <span>{tNav('discounts')}</span>
          </Link>
        </div>
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
              {profile.verified && <span className="gallery-badge verified">{t('girls.verified')}</span>}
              {(() => {
                // Badge logic: Only show if explicitly set in admin panel via badge_type
                // Auto-detection disabled - importing old profiles from original site
                const badge = profile.badge_type || null;

                if (!badge) return null;

                const badgeText = badge === 'new' ? t('girls.new') : badge === 'top' ? t('girls.top_reviews') : badge === 'recommended' ? t('girls.recommended') : tCommon('asian');

                return (
                  <span className={`gallery-badge badge-${badge}`}>
                    {badgeText}
                  </span>
                );
              })()}
              {activeGalleryMode === "photo" ? (
                profile.photos && profile.photos.length > 0 && profile.photos[activeThumb] ? (
                  <img
                    src={profile.photos[activeThumb].url}
                    alt={(() => {
                      const photo = profile.photos[activeThumb];
                      // Get locale-specific alt text
                      if (locale === 'cs' && photo.alt_text_cs) return photo.alt_text_cs;
                      if (locale === 'en' && photo.alt_text_en) return photo.alt_text_en;
                      if (locale === 'de' && photo.alt_text_de) return photo.alt_text_de;
                      if (locale === 'uk' && photo.alt_text_uk) return photo.alt_text_uk;
                      // Fallback to generic alt_text or default
                      return photo.alt_text || `${profile.name} - ${t('detail.photo')} ${activeThumb + 1}`;
                    })()}
                    className="gallery-image"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                ) : (
                  <div className="gallery-placeholder">{tCommon('no_photos')}</div>
                )
              ) : (
                profile.videos && profile.videos.length > 0 && profile.videos[activeThumb] ? (
                  <video
                    src={profile.videos[activeThumb].url}
                    controls
                    className="gallery-video"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                    poster={profile.videos[activeThumb].thumbnail_url || undefined}
                  />
                ) : (
                  <div className="gallery-placeholder">{tCommon('no_videos')}</div>
                )
              )}
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
              {activeGalleryMode === "photo" ? (
                profile.photos && profile.photos.length > 0 ? (
                  profile.photos.map((photo, index) => (
                    <div
                      key={photo.id}
                      className={`gallery-thumb ${activeThumb === index ? "active" : ""}`}
                      onClick={() => setActiveThumb(index)}
                      style={{
                        backgroundImage: `url(${photo.thumbnail_url || photo.url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                  ))
                ) : (
                  <div className="gallery-thumb">{tCommon('no_photos')}</div>
                )
              ) : (
                profile.videos && profile.videos.length > 0 ? (
                  profile.videos.map((video, index) => (
                    <div
                      key={video.id}
                      className={`gallery-thumb video ${activeThumb === index ? "active" : ""}`}
                      onClick={() => setActiveThumb(index)}
                      style={{
                        backgroundImage: video.thumbnail_url ? `url(${video.thumbnail_url})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      {!video.thumbnail_url && '▶'}
                    </div>
                  ))
                ) : (
                  <div className="gallery-thumb video">{tCommon('no_videos')}</div>
                )
              )}
            </div>

            {/* Schedule Section */}
            {profile.schedule && profile.schedule.length > 0 && (
            <div className="schedule-section">
              <h3 className="schedule-title">{tSchedule('weekly_schedule')}</h3>
              <div className="schedule-week">
                {profile.schedule.map((item, index) => {
                  const dayNames = [
                    tSchedule('days.mon'),
                    tSchedule('days.tue'),
                    tSchedule('days.wed'),
                    tSchedule('days.thu'),
                    tSchedule('days.fri'),
                    tSchedule('days.sat'),
                    tSchedule('days.sun')
                  ];
                  // Determine if this is today
                  const now = new Date();
                  const today = now.getDay();
                  const todayIndex = today === 0 ? 6 : today - 1;
                  const isToday = item.day_of_week === todayIndex;

                  // Check if closed for today
                  const currentTime = now.toLocaleTimeString('cs-CZ', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  });
                  const isClosedNow = isToday && currentTime > item.end_time;

                  return (
                    <div className={`schedule-card ${isToday ? 'today' : ''} ${isClosedNow ? 'closed' : ''}`} key={index}>
                      <div className="schedule-card-header">
                        <span className="schedule-card-day">{dayNames[item.day_of_week]}</span>
                        {isToday && <span className="today-badge">{tSchedule('today')}</span>}
                      </div>
                      <div className="schedule-card-time">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M12 6v6l4 2"/>
                        </svg>
                        {isClosedNow ? t('girls.closed') : `${item.start_time} – ${item.end_time}`}
                      </div>
                      <div className="schedule-card-location">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        {tHome('default_location')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            )}
          </div>

          {/* Header - Separate element for flexible ordering */}
          <div className="profile-header">
            <div className="profile-top-row">
              <div className="profile-status">
                {isWorkingNow() && <span className="online-dot"></span>}
                <span className="status-text">
                  {isWorkingNow()
                    ? t('girls.online')
                    : isClosedToday()
                      ? t('girls.closed')
                      : t('girls.offline')
                  }
                </span>
              </div>
              {getTodayTimeRange() && !isClosedToday() && (
                <div className="profile-time">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                  {getTodayTimeRange()}
                </div>
              )}
            </div>
            <h1 className={`profile-name ${cormorant.className}`}>{profile.name}</h1>
            <p className="profile-tagline">
              {locale === 'cs' && profile.subtitle_cs ? profile.subtitle_cs :
               locale === 'en' && profile.subtitle_en ? profile.subtitle_en :
               locale === 'de' && profile.subtitle_de ? profile.subtitle_de :
               locale === 'uk' && profile.subtitle_uk ? profile.subtitle_uk :
               t('detail.tagline')}
            </p>
          </div>

          {/* Profile Content - Scrollable */}
          <div className="profile-content">
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
            {profile.hashtags && profile.hashtags.length > 0 && (
              <div className="hashtags-section">
                <div className="hashtags">
                  {profile.hashtags.map((hashtagId) => {
                    const hashtag = getHashtagById(hashtagId);
                    if (!hashtag) return null;
                    return (
                      <Link
                        href={`/${locale}/hashtag/${hashtagId}`}
                        key={hashtagId}
                        className="hashtag"
                      >
                        #{getHashtagName(hashtagId, locale)}
                      </Link>
                    );
                  })}
                </div>
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

            {/* About Me - Modern Design */}
            <div className="profile-section">
              <h3 className={`section-title ${cormorant.className}`}>{t('profile.about_me')}</h3>
              <div className="about-me-card">
                <div className="about-me-content">
                  <p className="profile-description">
                    {(() => {
                      // Select bio based on current locale with fallback
                      const bioMap: Record<string, string | undefined> = {
                        cs: profile.bio_cs || profile.bio,
                        en: profile.bio || profile.bio_cs,
                        de: profile.bio_de || profile.bio_cs || profile.bio,
                        uk: profile.bio_uk || profile.bio_cs || profile.bio
                      };
                      const localeBio = bioMap[locale] || profile.bio;
                      return localeBio || t('profile.default_bio', { name: profile.name, age: profile.age });
                    })()}
                  </p>
                </div>
              </div>
            </div>

            {/* Tattoo & Piercing - Premium Cards */}
            {(profile.tattoo_percentage && profile.tattoo_percentage > 0) || profile.piercing ? (
              <div className="profile-section">
                <h3 className={`section-title ${cormorant.className}`}>{t('profile.tattoo_piercing')}</h3>
                <div className="body-art-grid">
                  {profile.tattoo_percentage && profile.tattoo_percentage > 0 && (
                    <div className="body-art-card">
                      <div className="body-art-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                        </svg>
                      </div>
                      <div className="body-art-details">
                        <div className="body-art-label">{t('profile.tattoo')}</div>
                        <div className="body-art-value">{profile.tattoo_percentage}% {t('profile.body_coverage')}</div>
                        {profile.tattoo_description && (
                          <div className="body-art-description">{profile.tattoo_description}</div>
                        )}
                      </div>
                    </div>
                  )}
                  {profile.piercing && (
                    <div className="body-art-card">
                      <div className="body-art-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <circle cx="12" cy="12" r="3" fill="currentColor"/>
                        </svg>
                      </div>
                      <div className="body-art-details">
                        <div className="body-art-label">{t('profile.piercing')}</div>
                        <div className="body-art-value">{t('profile.yes')}</div>
                        {profile.piercing_description && (
                          <div className="body-art-description">{profile.piercing_description}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {/* Services Section */}
            {profile.services && profile.services.length > 0 && (() => {
              // Separate services into basic (included) and extra
              const basicServices: Service[] = [];
              const extraServices: Service[] = [];

              profile.services.forEach((serviceId: string) => {
                const service = SERVICES.find(s => s.id === serviceId);
                if (!service) return;

                if (service.category === 'extra') {
                  extraServices.push(service);
                } else {
                  basicServices.push(service);
                }
              });

              return (
                <>
                  {/* Basic Services (Included in price) */}
                  {basicServices.length > 0 && (
                    <div className="profile-section">
                      <h3 className={`section-title ${cormorant.className}`}>{t('profile.services')}</h3>
                      <div className="services-grid">
                        {basicServices.map((service) => (
                          <div key={service.id} className="service-card basic">
                            <div className="service-name">
                              {service.translations[locale as 'cs' | 'en' | 'de' | 'uk']}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Extra Services */}
                  {extraServices.length > 0 && (
                    <div className="profile-section">
                      <h3 className={`section-title ${cormorant.className}`}>{t('profile.extra_services')}</h3>
                      <div className="services-grid">
                        {extraServices.map((service) => (
                          <div key={service.id} className="service-card extra">
                            <div className="service-name">
                              {service.translations[locale as 'cs' | 'en' | 'de' | 'uk']}
                            </div>
                            <span className="service-badge">Extra</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}

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

      {/* Working Today Section */}
      {onlineGirls.length > 0 && (
        <section className="working-today-section">
          <div className="working-today-container">
            <h3 className={`working-today-title ${cormorant.className}`}>
              {t('profile.working_today_title') || 'Dnes také pracují'}
            </h3>
            <p className="working-today-subtitle">
              {t('profile.working_today_subtitle') || 'Další dívky dostupné ve stejný den'}
            </p>
            <div className="working-today-grid">
              {onlineGirls.map((girl) => {
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
                const timeRange = girl.schedule_from && girl.schedule_to ? `${girl.schedule_from} - ${girl.schedule_to}` : null;
                const isWorking = girl.is_working_now;

                return (
                  <Link href={`/${locale}/profily/${girl.slug}`} key={girl.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <article className="card">
                      <div className="card-image-container">
                        {girl.verified && <span className="badge badge-top">{t('girls.verified')}</span>}
                        {girl.primary_photo ? (
                          <img src={girl.primary_photo} alt={girl.name} className="card-image" />
                        ) : (
                          <div className="card-placeholder">FOTO</div>
                        )}
                        <div className="card-overlay"></div>
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
                            {t('home.default_location')}
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <section className="reviews-section">
        <div className="reviews-header">
          <h2 className={`reviews-title ${cormorant.className}`}>{t('reviews.title')}</h2>
          {profile.reviews_count > 0 && (
            <div className="reviews-rating">
              <span className="rating-stars">★★★★★</span>
              <span className="rating-value">{profile.rating || 4.9}</span>
              <span className="rating-count">({profile.reviews_count} {t('reviews.reviews_count')})</span>
            </div>
          )}
        </div>

        {/* Existing Reviews First */}
        <div className="reviews-grid" style={{ marginBottom: '3rem' }}>
          <ReviewsList
            girlId={profile.id}
            limit={3}
            translations={{
              title: t('reviews.title') || 'Recenze od klientů',
              no_reviews: t('reviews.no_reviews') || 'Zatím žádné recenze. Buďte první!',
              loading: t('reviews.loading'),
              verified_booking: t('reviews.verified_booking') || 'Ověřená rezervace',
              reviewed_on: t('reviews.reviewed_on') || 'Hodnoceno'
            }}
          />
        </div>

        {/* Write Review Form - Now Below Reviews */}
        <div>
          <ReviewForm
            girlId={profile.id}
            girlName={profile.name}
            translations={{
              title: t('reviews.write_title') || 'Napište recenzi',
              subtitle: t('reviews.write_subtitle')?.replace('{name}', profile.name) || `Sdílejte svou zkušenost s ${profile.name}`,
              your_name: t('reviews.your_name') || 'Vaše jméno',
              your_name_placeholder: t('reviews.your_name_placeholder') || 'Jak vám máme říkat?',
              rating_label: t('reviews.rating_label') || 'Hodnocení',
              vibe_label: t('reviews.vibe_label') || 'Jak byla celková vibe?',
              review_title: t('reviews.review_title') || 'Nadpis',
              review_title_placeholder: t('reviews.review_title_placeholder') || 'Shrňte svou zkušenost',
              review_content: t('reviews.review_content') || 'Vaše recenze',
              review_content_placeholder: t('reviews.review_content_placeholder') || 'Popište svou zkušenost podrobněji (min. 10 znaků)',
              submit: t('reviews.submit') || 'Odeslat recenzi',
              submitting: t('reviews.submitting') || 'Odesílání...',
              success_message: t('reviews.success_message') || 'Děkujeme! Vaše recenze byla odeslána a čeká na schválení.',
              approval_pending: t('reviews.approval_pending') || 'Vaše recenze čeká na schválení',
              optional: t('reviews.optional') || 'nepovinné',
              error_message: t('reviews.error_message') || 'Něco se pokazilo. Zkuste to prosím znovu.',
              write_another: t('reviews.write_another') || 'Napsat další recenzi'
            }}
          />
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
        .main-nav {
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
          gap: 1rem;
          align-items: center;
        }

        .nav-contact :global(.contact-item) {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.3s ease;
          min-width: 60px;
        }

        .nav-contact :global(.contact-item svg) {
          width: 20px;
          height: 20px;
          color: var(--primary);
        }

        .nav-contact :global(.contact-item span) {
          white-space: nowrap;
          font-weight: 500;
          text-align: center;
        }

        .nav-contact :global(.contact-item:hover) {
          background: rgba(236, 72, 153, 0.1);
          color: var(--white);
          transform: translateY(-2px);
        }

        .nav-contact :global(.contact-item:hover svg) {
          color: var(--primary-hover);
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
          padding-top: 0; /* Breadcrumb already has top padding */
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 500px 1fr;
          grid-template-areas:
            "gallery header"
            "gallery content";
          gap: 0 3rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .gallery {
          grid-area: gallery;
        }

        .profile-header {
          grid-area: header;
          padding-top: 2rem;
        }

        .profile-content {
          grid-area: content;
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
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.4rem 0.8rem;
          border-radius: 100px;
          text-transform: uppercase;
          backdrop-filter: blur(10px);
          z-index: 2;
        }

        .gallery-badge.verified {
          left: 1rem;
          background: var(--wine-light);
          color: #fff;
        }

        .gallery-badge.badge-new {
          left: 1rem;
          background: linear-gradient(135deg, #e85a4f 0%, #ff6b5b 100%);
          color: #fff;
          box-shadow: 0 4px 20px rgba(232,90,79,0.4);
          animation: badgePulse 2s ease-in-out infinite;
        }

        .gallery-badge.badge-top {
          left: 1rem;
          background: linear-gradient(135deg, var(--accent-gold) 0%, #f0c56e 100%);
          color: #1a1a1a;
          box-shadow: 0 4px 20px rgba(212,168,83,0.4);
        }

        .gallery-badge.badge-recommended,
        .gallery-badge.badge-asian {
          left: 1rem;
          background: linear-gradient(135deg, var(--accent-violet) 0%, #a78bfa 100%);
          color: #fff;
          box-shadow: 0 4px 20px rgba(139,92,246,0.4);
        }

        /* If both verified and badge exist, offset them */
        .gallery-badge.verified ~ .gallery-badge {
          left: auto;
          right: 1rem;
        }

        @keyframes badgePulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(232,90,79,0.4); }
          50% { box-shadow: 0 4px 30px rgba(232,90,79,0.6); }
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
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .schedule-title {
          font-family: 'Cormorant', serif;
          font-size: 1.5rem;
          font-weight: 400;
          margin-bottom: 1.25rem;
          color: var(--white);
        }

        .schedule-week {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 1rem;
        }

        .schedule-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 1rem;
          transition: all 0.3s ease;
        }

        .schedule-card:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(139, 41, 66, 0.3);
          transform: translateY(-2px);
        }

        .schedule-card.today {
          background: rgba(139, 41, 66, 0.15);
          border-color: rgba(139, 41, 66, 0.4);
        }

        .schedule-card.closed {
          background: rgba(255, 255, 255, 0.02);
          border-color: rgba(255, 255, 255, 0.05);
        }

        .schedule-card.closed .schedule-card-time {
          color: var(--gray);
        }

        .schedule-card.closed .schedule-card-time svg {
          color: var(--gray);
        }

        .schedule-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .schedule-card-day {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--wine-light);
        }

        .today-badge {
          font-size: 0.65rem;
          background: var(--wine);
          color: white;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-weight: 600;
        }

        .schedule-card-time {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--white);
          margin-bottom: 0.5rem;
        }

        .schedule-card-time svg {
          width: 16px;
          height: 16px;
          color: var(--wine-light);
        }

        .schedule-card-location {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: var(--gray);
        }

        .schedule-card-location svg {
          width: 14px;
          height: 14px;
          color: var(--wine-light);
        }

        /* Working Today Section */
        .working-today-section {
          padding: 4rem 0;
          background: rgba(0, 0, 0, 0.2);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .working-today-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .working-today-title {
          font-size: 2.5rem;
          font-weight: 400;
          margin-bottom: 0.5rem;
          color: var(--white);
          text-align: center;
        }

        .working-today-subtitle {
          font-size: 1.1rem;
          color: var(--gray);
          margin-bottom: 3rem;
          text-align: center;
        }

        .working-today-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }

        @media (max-width: 1200px) {
          .working-today-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .working-today-section {
            padding: 3rem 0;
          }

          .working-today-container {
            padding: 0 1.5rem;
          }

          .working-today-title {
            font-size: 2rem;
          }

          .working-today-subtitle {
            font-size: 1rem;
            margin-bottom: 2rem;
          }

          .working-today-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
          }

          .working-today-grid .card {
            font-size: 0.85rem;
          }

          .working-today-grid .card-name {
            font-size: 1rem;
          }

          .working-today-grid .stat-value {
            font-size: 0.9rem;
          }

          .working-today-grid .stat-label {
            font-size: 0.7rem;
          }
        }

        @media (max-width: 480px) {
          .working-today-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }

          .working-today-grid .card {
            font-size: 0.75rem;
          }

          .working-today-grid .card-name {
            font-size: 0.9rem;
          }
        }

        /* Profile Content */
        .profile-content {
          padding-top: 2rem;
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
          padding: 0.4rem 0.8rem;
          border-radius: 100px;
        }

        /* Online status - green */
        .profile-status:has(.online-dot) {
          background: rgba(34, 197, 94, 0.1);
        }

        /* Offline status - red (when no .online-dot exists) */
        .profile-status:not(:has(.online-dot)) {
          background: rgba(239, 68, 68, 0.1);
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
          font-weight: 500;
        }

        /* Green text for online */
        .profile-status:has(.online-dot) .status-text {
          color: var(--green);
        }

        /* Red text for offline */
        .profile-status:not(:has(.online-dot)) .status-text {
          color: #ef4444;
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
        .hashtags-section {
          margin-bottom: 2rem;
        }

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
          margin-bottom: 1.25rem;
        }

        /* Hashtags */
        .profile-hashtags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }

        .profile-hashtag {
          font-size: 0.8rem;
          color: var(--wine-light);
          background: rgba(139, 41, 66, 0.1);
          border: 1px solid rgba(139, 41, 66, 0.2);
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .profile-hashtag:hover {
          background: rgba(139, 41, 66, 0.2);
          border-color: rgba(139, 41, 66, 0.4);
          transform: scale(1.05);
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
          font-size: 0.65rem;
          font-weight: 500;
          margin-bottom: 0.1rem;
        }

        .location-address {
          font-size: 1.05rem;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
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
          white-space: pre-line;
        }

        /* About Me Card - Premium Design */
        .about-me-card {
          background: linear-gradient(135deg, rgba(139, 41, 66, 0.08) 0%, rgba(35, 26, 30, 0.5) 100%);
          border: 1px solid rgba(163, 51, 82, 0.15);
          border-radius: 16px;
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        .about-me-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--wine-light), var(--wine), var(--wine-light));
          opacity: 0.6;
        }

        .about-me-content {
          position: relative;
          z-index: 1;
        }

        /* Body Art Grid - Premium Cards */
        .body-art-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
        }

        .body-art-card {
          background: linear-gradient(135deg, rgba(139, 41, 66, 0.05) 0%, rgba(35, 26, 30, 0.3) 100%);
          border: 1px solid rgba(163, 51, 82, 0.12);
          border-radius: 14px;
          padding: 1.5rem;
          display: flex;
          gap: 1.25rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .body-art-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(180deg, var(--wine-light), var(--wine));
          opacity: 0;
          transition: opacity 0.3s;
        }

        .body-art-card:hover {
          border-color: rgba(163, 51, 82, 0.3);
          background: linear-gradient(135deg, rgba(139, 41, 66, 0.12) 0%, rgba(35, 26, 30, 0.5) 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(139, 41, 66, 0.15);
        }

        .body-art-card:hover::before {
          opacity: 1;
        }

        .body-art-icon {
          width: 48px;
          height: 48px;
          min-width: 48px;
          background: rgba(139, 41, 66, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }

        .body-art-icon svg {
          width: 24px;
          height: 24px;
          color: var(--wine-light);
          transition: all 0.3s;
        }

        .body-art-card:hover .body-art-icon {
          background: rgba(163, 51, 82, 0.3);
          transform: scale(1.05);
        }

        .body-art-card:hover .body-art-icon svg {
          color: #e8b4c0;
        }

        .body-art-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .body-art-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--gray);
          font-weight: 600;
        }

        .body-art-value {
          font-size: 1.1rem;
          font-weight: 500;
          color: #fff;
          line-height: 1.3;
        }

        .body-art-description {
          font-size: 0.85rem;
          color: #c9b8bd;
          line-height: 1.5;
          margin-top: 0.25rem;
          font-style: italic;
        }

        /* Services - Modern Grid */
        .services-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .service-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1.1rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        .service-card.basic {
          border-left: 3px solid rgba(139, 41, 66, 0.5);
        }

        .service-card.extra {
          border-left: 3px solid rgba(251, 146, 60, 0.6);
          background: rgba(251, 146, 60, 0.05);
        }

        .service-card:hover {
          background: rgba(255,255,255,0.06);
          transform: translateX(4px);
        }

        .service-card .service-name {
          font-size: 0.9rem;
          color: var(--white);
          flex: 1;
        }

        .service-badge {
          font-size: 0.65rem;
          background: rgba(251, 146, 60, 0.2);
          color: #fb923c;
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
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

        .girl-card {
          background: var(--bg);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s;
          border: 1px solid rgba(255,255,255,0.05);
          text-decoration: none;
          color: var(--white);
        }

        .girl-card:hover {
          transform: translateY(-4px);
          border-color: rgba(139, 41, 66, 0.3);
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }

        .girl-card-image {
          position: relative;
          aspect-ratio: 3/4;
          background: var(--wine-dark);
          overflow: hidden;
        }

        .girl-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .girl-card-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.3);
          font-size: 0.8rem;
          letter-spacing: 0.15em;
        }

        .girl-badge {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          font-size: 0.65rem;
          font-weight: 600;
          padding: 0.35rem 0.7rem;
          border-radius: 100px;
          text-transform: uppercase;
          backdrop-filter: blur(10px);
          z-index: 2;
        }

        .girl-badge.verified {
          background: var(--wine-light);
          color: #fff;
        }

        .girl-badge.working {
          left: auto;
          right: 0.75rem;
          background: rgba(34, 197, 94, 0.9);
          color: #fff;
        }

        .girl-card-info {
          padding: 1.25rem;
        }

        .girl-name {
          font-family: 'Cormorant', serif;
          font-size: 1.5rem;
          font-weight: 400;
          margin-bottom: 0.5rem;
        }

        .girl-meta {
          font-size: 0.85rem;
          color: var(--gray);
          margin-bottom: 0.75rem;
        }

        .girl-schedule {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: var(--wine-light);
        }

        .girl-schedule :global(svg) {
          color: var(--wine-light);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .detail-grid {
            grid-template-columns: 1fr;
            grid-template-areas:
              "header"
              "gallery"
              "content";
            gap: 2rem;
          }

          .profile-header {
            padding: 0 4%;
            padding-top: 0;
          }

          .gallery {
            position: relative;
            top: 0;
          }

          .profile-content {
            padding-top: 0;
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
          .main-nav {
            padding: 1rem 4%;
          }
          .nav-links,
          .nav-contact {
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
          .location-name {
            font-size: 0.75rem;
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
