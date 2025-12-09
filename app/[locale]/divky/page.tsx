"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from 'next-intl';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MobileMenu from '@/components/MobileMenu';
import BottomCTA from '@/components/BottomCTA';
import SkeletonCard from '@/components/SkeletonCard';

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
      <div className={`${playfair.variable} ${dmSans.variable}`}>
        {/* Ambient Background */}
        <div className="ambient-bg"></div>

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
                const badge = girl.id === 1 ? 'new' : girl.id === 2 ? 'top' : girl.id === 3 ? 'recommended' : null;
                const badgeText = badge === 'new' ? t('girls.new') : badge === 'top' ? t('girls.top_reviews') : badge === 'recommended' ? t('girls.recommended') : '';
                const badgeClass = badge === 'new' ? 'badge-new' : badge === 'top' ? 'badge-top' : 'badge-asian';
                const breastSize = getBreastSize(girl.bust);
                const timeRange = getTimeRange();
                const location = getLocation();

                return (
                  <Link href={`/${locale}/profily/${girl.slug}`} key={girl.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <article className="card">
                      <div className="card-image-container">
                        {badge && (
                          <span className={`badge ${badgeClass}`}>{badgeText}</span>
                        )}
                        <div className="card-placeholder">FOTO</div>
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
                            className="action-btn"
                            title="Oblíbené"
                            onClick={(e) => {
                              e.preventDefault();
                              alert('Funkce oblíbených bude brzy dostupná!');
                            }}
                          >
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                          </button>
                        </div>
                      </div>
                      <div className="card-info">
                        <div className="card-header">
                          <h3 className="card-name">
                            {girl.online && <span className="online-dot"></span>}
                            {girl.name}
                          </h3>
                          <span className={`time-badge ${girl.online ? 'available' : 'tomorrow'}`}>{timeRange}</span>
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

        {/* Footer */}
        <footer>
          <div>{t('footer.copyright')} — {t('common.adults_only')}</div>
          <div className="footer-disclaimer">{t('footer.disclaimer')}</div>
          <div className="footer-links">
            <Link href={`/${locale}/blog`}>{t('footer.blog')}</Link>
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
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :global(:root) {
          --bg-dark: #0a0a0f;
          --bg-card: #12121a;
          --accent-rose: #e84a7f;
          --accent-gold: #d4a853;
          --accent-violet: #8b5cf6;
          --text-primary: #f8f8f8;
          --text-secondary: rgba(255,255,255,0.6);
          --glass-bg: rgba(255,255,255,0.03);
          --glass-border: rgba(255,255,255,0.08);
        }

        /* Ambient background */
        .ambient-bg {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 0;
        }

        .ambient-bg::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background:
            radial-gradient(ellipse at 20% 20%, rgba(139,58,92,0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(107,40,71,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(180,80,120,0.05) 0%, transparent 60%);
          animation: ambientMove 20s ease-in-out infinite;
        }

        @keyframes ambientMove {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-2%, -2%) rotate(1deg); }
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 60px 40px;
          position: relative;
          z-index: 1;
        }

        /* Header Section */
        .section-header {
          margin-bottom: 50px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .section-title {
          font-family: var(--font-playfair), 'Playfair Display', serif;
          font-size: 3rem;
          font-weight: 400;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, var(--text-primary) 0%, rgba(255,255,255,0.7) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .section-subtitle {
          margin-top: 12px;
          color: var(--text-secondary);
          font-size: 1rem;
          font-weight: 300;
          letter-spacing: 0.02em;
          font-family: var(--font-dm-sans), 'DM Sans', sans-serif;
        }

        /* Cards Grid */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        /* Card */
        .card {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          background: var(--bg-card);
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 20px;
          padding: 1px;
          background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        .card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow:
            0 20px 40px rgba(0,0,0,0.4),
            0 0 80px rgba(139,58,92,0.2);
        }

        .card:hover .card-placeholder {
          transform: scale(1.08);
        }

        .card:hover .card-overlay {
          opacity: 1;
        }

        .card-image-container {
          position: relative;
          aspect-ratio: 3/4;
          overflow: hidden;
          background: linear-gradient(145deg, #1a1a24 0%, #0f0f15 100%);
        }

        /* Placeholder for demo */
        .card-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(145deg, #8b3a5c 0%, #6b2847 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.2);
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 50%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        /* Badges */
        .badge {
          position: absolute;
          top: 16px;
          left: 16px;
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          backdrop-filter: blur(10px);
          z-index: 2;
        }

        .badge-new {
          background: linear-gradient(135deg, #e85a4f 0%, #ff6b5b 100%);
          box-shadow: 0 4px 20px rgba(232,90,79,0.4);
          animation: badgePulse 2s ease-in-out infinite;
        }

        @keyframes badgePulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(232,90,79,0.4); }
          50% { box-shadow: 0 4px 30px rgba(232,90,79,0.6); }
        }

        .badge-top {
          background: linear-gradient(135deg, var(--accent-gold) 0%, #f0c56e 100%);
          color: #1a1a1a;
          box-shadow: 0 4px 20px rgba(212,168,83,0.4);
        }

        .badge-asian {
          background: linear-gradient(135deg, var(--accent-violet) 0%, #a78bfa 100%);
          box-shadow: 0 4px 20px rgba(139,92,246,0.4);
        }

        /* Online indicator */
        .online-dot {
          width: 8px;
          height: 8px;
          background: #22c55e;
          border-radius: 50%;
          display: inline-block;
          margin-right: 8px;
          box-shadow: 0 0 12px rgba(34,197,94,0.6);
          animation: onlinePulse 2s ease-in-out infinite;
        }

        @keyframes onlinePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Card Info */
        .card-info {
          padding: 20px;
          background: rgba(18, 18, 26, 0.95);
          backdrop-filter: blur(10px);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .card-name {
          font-family: var(--font-playfair), 'Playfair Display', serif;
          font-size: 1.4rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          color: #ffffff;
        }

        .time-badge {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .time-badge.available {
          background: rgba(34,197,94,0.15);
          border-color: rgba(34,197,94,0.4);
          color: #4ade80;
          box-shadow: 0 0 12px rgba(34,197,94,0.2);
        }

        .time-badge.tomorrow {
          background: rgba(251,146,60,0.15);
          border-color: rgba(251,146,60,0.4);
          color: #fb923c;
          box-shadow: 0 0 12px rgba(251,146,60,0.2);
        }

        .card-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-bottom: 12px;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(255,255,255,0.05);
          padding: 8px 6px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.3s ease;
        }

        .stat:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.12);
        }

        .stat-value {
          color: var(--text-primary);
          font-weight: 600;
          font-size: 1.1rem;
          line-height: 1.2;
        }

        .stat-label {
          color: var(--text-secondary);
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 2px;
        }

        .card-location-wrapper {
          text-align: center;
        }

        .card-location {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--text-primary);
          font-size: 0.85rem;
          font-weight: 500;
          background: rgba(139,58,92,0.25);
          padding: 8px 14px;
          border-radius: 20px;
          border: 1px solid rgba(139,58,92,0.4);
        }

        .location-icon {
          width: 14px;
          height: 14px;
          color: #e84a7f;
        }

        /* Quick actions on hover */
        .quick-actions {
          position: absolute;
          bottom: 100px;
          left: 50%;
          transform: translateX(-50%) translateY(20px);
          display: flex;
          gap: 12px;
          opacity: 0;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 3;
        }

        .card:hover .quick-actions {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }

        .action-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          background: #8b3a5c;
          border-color: #8b3a5c;
          transform: scale(1.1);
        }

        .action-btn svg {
          width: 18px;
          height: 18px;
          fill: white;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .cards-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 900px) {
          .cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .section-title {
            font-size: 2.2rem;
          }
        }

        @media (max-width: 600px) {
          .cards-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .container {
            padding: 30px 20px;
          }
          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }
        }
      `}</style>
    </>
  );
}
