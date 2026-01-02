"use client";

import Link from "next/link";
import { useLocale, useTranslations } from 'next-intl';
import { useLocations } from '@/lib/hooks/useLocations';

interface GirlCardProps {
  girl: {
    id: number;
    name: string;
    slug: string;
    age: number;
    height: number;
    weight: number;
    bust: string;
    online: boolean;
    languages?: string;
    location?: string;
  };
  badge?: 'new' | 'top' | 'recommended' | null;
  badgeText?: {
    new?: string;
    top?: string;
    recommended?: string;
  };
  translations: {
    age_years: string;
    bust: string;
    height_cm: string;
    weight_kg: string;
    languages_spoken: string;
    photo?: string;
    whatsapp?: string;
    call?: string;
  };
  showQuickActions?: boolean;
}

export default function GirlCard({
  girl,
  badge,
  badgeText,
  translations,
  showQuickActions = true
}: GirlCardProps) {
  const locale = useLocale();
  const t = useTranslations('common');
  const { locationNames, primaryLocation } = useLocations();

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

  // Removed fake time - real schedule should come from database

  const getLocation = (): string => {
    // Use location from database if available
    if (girl.location) return girl.location;
    // Otherwise fallback to primary location
    if (locationNames.length === 0) return primaryLocation?.display_name || 'Praha 2';
    return locationNames[Math.floor(Math.random() * locationNames.length)];
  };

  const getLanguageName = (code: string): string => {
    return t(`languages.${code}` as any) || code;
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open('https://wa.me/420734332131', '_blank');
  };

  const handleCall = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = 'tel:+420734332131';
  };

  return (
    <div className="girl-card-wrapper">
      <Link href={`/${locale}/profily/${girl.slug}`} className="girl-card">
        <div className="girl-card-image">
          <div className="girl-card-placeholder">{translations.photo || 'PHOTO'}</div>
          {badge && badgeText && (
            <div className={`girl-card-badge ${badge}`}>
              {badge === 'new' && badgeText.new}
              {badge === 'top' && badgeText.top}
              {badge === 'recommended' && badgeText.recommended}
            </div>
          )}
        </div>

        <div className="girl-card-info">
          <div className="girl-card-header">
            <span className="girl-card-name">{girl.name}</span>
          </div>

          <div className="girl-card-stats">
            <div className="girl-card-stat">
              <span className="girl-card-stat-value">{girl.age}</span>
              <span className="girl-card-stat-label">{translations.age_years}</span>
            </div>
            <div className="girl-card-stat">
              <span className="girl-card-stat-label">{translations.bust}</span>
              <span className="girl-card-stat-value">{getBreastSize(girl.bust)}</span>
            </div>
            <div className="girl-card-stat">
              <span className="girl-card-stat-value">{girl.height}</span>
              <span className="girl-card-stat-label">{translations.height_cm}</span>
            </div>
            <div className="girl-card-stat">
              <span className="girl-card-stat-value">{girl.weight}</span>
              <span className="girl-card-stat-label">{translations.weight_kg}</span>
            </div>
          </div>

          {girl.languages && (
            <div className="girl-card-languages">
              {translations.languages_spoken}: {JSON.parse(girl.languages).map((code: string) => getLanguageName(code)).join(', ')}
            </div>
          )}

          <div className="girl-card-location">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {getLocation()}
          </div>
        </div>
      </Link>

      {showQuickActions && (
        <div className="girl-card-actions">
          <button
            className="girl-card-action whatsapp"
            onClick={handleWhatsApp}
            aria-label={translations.whatsapp || "WhatsApp"}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            {translations.whatsapp || "WhatsApp"}
          </button>
          <button
            className="girl-card-action call"
            onClick={handleCall}
            aria-label={translations.call || "Call"}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            {translations.call || "Call"}
          </button>
        </div>
      )}

      <style jsx>{`
        .girl-card-wrapper {
          position: relative;
        }

        .girl-card {
          display: block;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .girl-card:active {
          transform: scale(0.98);
          background: rgba(255, 255, 255, 0.05);
        }

        .girl-card-image {
          position: relative;
          aspect-ratio: 3 / 4;
          background: linear-gradient(135deg, #2a1f23 0%, #1a1216 100%);
          overflow: hidden;
        }

        .girl-card-placeholder {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 2rem;
          color: rgba(255, 255, 255, 0.1);
          font-weight: 500;
        }

        .girl-card-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .girl-card-badge.new {
          background: var(--wine);
          color: white;
        }

        .girl-card-badge.top {
          background: var(--accent);
          color: var(--black);
        }

        .girl-card-badge.recommended {
          background: rgba(139, 41, 66, 0.9);
          color: white;
        }

        .girl-card-info {
          padding: 1rem;
        }

        .girl-card-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 0.75rem;
        }

        .girl-card-name {
          font-size: 1.25rem;
          font-weight: 500;
          color: var(--white);
        }

        .schedule-time {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(34, 197, 94, 0.15);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #22c55e;
          font-size: 0.75rem;
          font-weight: 500;
          padding: 0.35rem 0.7rem;
          border-radius: 6px;
        }

        .schedule-time svg {
          width: 14px;
          height: 14px;
          flex-shrink: 0;
        }

        .girl-card-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .girl-card-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .girl-card-stat-value {
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--white);
        }

        .girl-card-stat-label {
          font-size: 0.7rem;
          color: var(--gray);
          margin-top: 2px;
        }

        .girl-card-languages {
          font-size: 0.75rem;
          color: var(--gray);
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }

        .girl-card-location {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.95rem;
          color: var(--gray);
          font-weight: 500;
        }

        .girl-card-location svg {
          width: 16px;
          height: 16px;
        }

        .girl-card-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          padding: 0 0.75rem 0.75rem;
        }

        .girl-card-action {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 0.75rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          min-height: 44px;
        }

        .girl-card-action svg {
          width: 18px;
          height: 18px;
        }

        .girl-card-action.whatsapp {
          background: var(--green);
          color: white;
        }

        .girl-card-action.whatsapp:active {
          background: #1ea84d;
          transform: scale(0.95);
        }

        .girl-card-action.call {
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .girl-card-action.call:active {
          background: rgba(59, 130, 246, 0.3);
          transform: scale(0.95);
        }

        @media (min-width: 769px) {
          .girl-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
          }

          .girl-card-action:hover {
            transform: translateY(-2px);
          }

          .girl-card-action.whatsapp:hover {
            background: #1ea84d;
          }

          .girl-card-action.call:hover {
            background: rgba(59, 130, 246, 0.3);
          }
        }
      `}</style>
    </div>
  );
}
