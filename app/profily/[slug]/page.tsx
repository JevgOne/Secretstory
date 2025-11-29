"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Clock,
  MapPin,
  Phone as PhoneIcon,
  Image as ImageIcon,
  Play
} from "lucide-react";

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
}

export default function ProfileDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
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
        setError(data.error || 'Profil nenalezen');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Chyba při načítání profilu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9a8a8e' }}>
        Načítání profilu...
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
        <div style={{ color: '#ef4444', fontSize: '1.2rem' }}>{error || 'Profil nenalezen'}</div>
        <Link href="/divky" className="btn btn-fill">Zpět na přehled</Link>
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

  const includedServices = [
    { name: "Klasická masáž" },
    { name: "Erotická masáž" },
    { name: "Body to body" },
    { name: "Společná sprcha" },
    { name: "Líbání" },
    { name: "Striptýz" }
  ];

  const extraServices = [
    { name: "Nuru masáž", price: "+500 Kč" },
    { name: "Tantra masáž", price: "+800 Kč" },
    { name: "Masáž ve dvou", price: "+1500 Kč" },
    { name: "Prodloužení 30 min", price: "+1000 Kč" }
  ];

  return (
    <>
      {/* Navigation */}
      <nav>
        <Link href="/" className="logo">
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
          <Link href="/">Home</Link>
          <Link href="/divky">Dívky</Link>
          <Link href="/cenik">Ceník</Link>
          <Link href="/schedule">Schedule</Link>
          <Link href="/discounts">Discounts</Link>
          <Link href="/faq">FAQ</Link>
        </div>
        <div className="nav-contact">
          <a href="tel:+420734332131" className="btn">+420 734 332 131</a>
          <a href="https://wa.me/420734332131" className="btn btn-fill">WhatsApp</a>
        </div>
        <button className="mobile-menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span>›</span>
        <Link href="/divky">Dívky</Link>
        <span>›</span>
        {profile.name}
      </div>

      {/* Detail Section */}
      <section className="detail">
        <div className="detail-grid">
          {/* Gallery - Sticky */}
          <div className="gallery">
            <div className="gallery-main">
              {profile.verified && <span className="gallery-badge">Ověřená</span>}
              HLAVNÍ FOTO / VIDEO
              <div className="gallery-toggle">
                <button
                  className={`toggle-btn ${activeGalleryMode === "photo" ? "active" : ""}`}
                  onClick={() => setActiveGalleryMode("photo")}
                >
                  <ImageIcon size={14} />
                  Foto
                </button>
                <button
                  className={`toggle-btn ${activeGalleryMode === "video" ? "active" : ""}`}
                  onClick={() => setActiveGalleryMode("video")}
                >
                  <Play size={14} />
                  Video
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
          </div>

          {/* Profile Content - Scrollable */}
          <div className="profile-content">
            {/* Header */}
            <div className="profile-header">
              <div className="profile-top-row">
                <div className="profile-status">
                  {profile.online && <span className="online-dot"></span>}
                  <span className="status-text">{profile.online ? 'Online' : 'Offline'}</span>
                </div>
                <div className="profile-time">
                  <Clock size={14} />
                  {getTimeRange()}
                </div>
              </div>
              <h1 className="profile-name">{profile.name}</h1>
              <p className="profile-tagline">Elegantní společnice pro náročné gentlemany</p>
            </div>

            {/* Stats + Languages */}
            <div className="stats-section">
              <div className="stats-row">
                <div className="stat-item">
                  <div className="stat-value">{profile.age}</div>
                  <div className="stat-label">let</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <div className="stat-value">{profile.height}</div>
                  <div className="stat-label">cm</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <div className="stat-value">{profile.weight}</div>
                  <div className="stat-label">kg</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <div className="stat-value">{getBreastSize()}</div>
                  <div className="stat-label">prsa</div>
                </div>
              </div>
              <div className="languages-row">
                <span className="lang-label">Mluvím</span>
                <div className="lang-flags">
                  <div className="lang-flag" title="Čeština">
                    <CzechFlag />
                    <span>CZ</span>
                  </div>
                  <div className="lang-flag" title="English">
                    <UKFlag />
                    <span>EN</span>
                  </div>
                  <div className="lang-flag" title="Русский">
                    <RussianFlag />
                    <span>RU</span>
                  </div>
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
                <MapPin size={18} />
              </div>
              <div className="location-text">
                <div className="location-name">Praha 2 — Nové Město</div>
                <div className="location-address">5 min od metra Můstek • Diskrétní apartmán</div>
              </div>
            </div>

            {/* Description */}
            <div className="profile-section">
              <h3 className="section-title">O mně</h3>
              <p className="profile-description" style={{ whiteSpace: "pre-line" }}>
                {profile.bio || `Vítejte na mém profilu. Jsem ${profile.name} — ${profile.age}letá společnice, která věří, že pravý luxus spočívá v detailech a autentickém prožitku.

Ráda vytvářím atmosféru, kde se budete cítit uvolněně a výjimečně. Každé setkání je pro mě jedinečné — ať už hledáte relaxační masáž po náročném dni nebo příjemnou společnost na večer.

Mluvím plynule česky a anglicky. Těším se na vás.`}
              </p>
            </div>

            {/* Services - Included */}
            <div className="profile-section">
              <h3 className="section-title">V ceně</h3>
              <div className="services-grid">
                {includedServices.map((service, i) => (
                  <div key={i} className="service-item">
                    <div className="service-name">
                      <div className="service-icon">✓</div>
                      {service.name}
                    </div>
                    <span className="service-price included">Zahrnuto</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Services - Extra */}
            <div className="profile-section">
              <h3 className="section-title">Extra služby</h3>
              <div className="services-grid">
                {extraServices.map((service, i) => (
                  <div key={i} className="service-item extra">
                    <div className="service-name">
                      <div className="service-icon">+</div>
                      {service.name}
                    </div>
                    <span className="service-price extra">{service.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="profile-cta">
              <a href="https://wa.me/420734332131" className="cta-btn whatsapp">
                <WhatsAppIcon />
                WhatsApp
              </a>
              <a href="https://t.me/lovelygirls_prague" className="cta-btn telegram">
                <TelegramIcon />
                Telegram
              </a>
              <a href="tel:+420734332131" className="cta-btn phone">
                <PhoneIcon size={24} />
                Zavolat
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div>LovelyGirls Prague © 2025 — Pouze 18+</div>
        <div className="footer-links">
          <Link href="/podminky">Podmínky</Link>
          <Link href="/soukromi">Soukromí</Link>
        </div>
      </footer>
    </>
  );
}
