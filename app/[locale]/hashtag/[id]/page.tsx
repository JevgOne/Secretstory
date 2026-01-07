'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { getHashtagById, getHashtagName } from '@/lib/hashtags';

interface Girl {
  id: number;
  name: string;
  slug: string;
  age: number;
  height: number;
  weight: number;
  bust: string;
  online: boolean;
  badge_type?: 'new' | 'top' | 'asian' | 'recommended' | null;
  primary_photo?: string | null;
  secondary_photo?: string | null;
  thumbnail?: string | null;
}

export default function HashtagPage() {
  const params = useParams();
  const locale = useLocale();
  const t = useTranslations('girls');
  const tCommon = useTranslations('common');

  const id = params.id as string;
  const [girls, setGirls] = useState<Girl[]>([]);
  const [loading, setLoading] = useState(true);

  const hashtag = getHashtagById(id);
  const hashtagName = getHashtagName(id, locale);

  useEffect(() => {
    async function fetchGirls() {
      try {
        const response = await fetch(`/api/girls?status=active&hashtag=${id}`);
        const data = await response.json();
        if (data.success) {
          setGirls(data.girls);
        }
      } catch (error) {
        console.error('Error fetching girls:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchGirls();
  }, [id]);

  if (!hashtag) {
    return (
      <div className="page-container">
        <h1>Hashtag nenalezen</h1>
      </div>
    );
  }

  return (
    <>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">{hashtagName}</h1>
          <p className="page-subtitle">
            {loading && 'Načítání...'}
            {!loading && girls.length === 0 && 'Žádné dívky s tímto hashtagem'}
            {!loading && girls.length === 1 && '1 dívka'}
            {!loading && girls.length > 1 && girls.length < 5 && `${girls.length} dívky`}
            {!loading && girls.length >= 5 && `${girls.length} dívek`}
          </p>
        </div>

        {!loading && girls.length > 0 && (
          <div className="girls-grid">
            {girls.map((girl) => (
              <article key={girl.id} className="card">
                <div className="card-image-container">
                  {girl.badge_type && (
                    <span className={`badge ${girl.badge_type === 'new' ? 'badge-new' : girl.badge_type === 'top' ? 'badge-top' : girl.badge_type === 'asian' ? 'badge-asian' : 'badge-recommended'}`}>
                      {girl.badge_type === 'new' ? t('new') : girl.badge_type === 'top' ? t('top_reviews') : girl.badge_type === 'recommended' ? t('recommended') : tCommon('asian')}
                    </span>
                  )}

                  {/* 3D Flip Container */}
                  {girl.secondary_photo ? (
                    <div className="card-flip-inner">
                      {/* Front Side */}
                      <div className="card-flip-front">
                        {girl.primary_photo || girl.thumbnail ? (
                          <img
                            src={girl.thumbnail || girl.primary_photo || ''}
                            alt={girl.name}
                            className="card-image"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="card-placeholder">FOTO</div>
                        )}
                      </div>

                      {/* Back Side */}
                      <div className="card-flip-back">
                        <img
                          src={girl.secondary_photo}
                          alt={`${girl.name} - back view`}
                          className="card-image"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </div>
                  ) : (
                    // No secondary photo - just show primary
                    girl.primary_photo || girl.thumbnail ? (
                      <img
                        src={girl.thumbnail || girl.primary_photo || ''}
                        alt={girl.name}
                        className="card-image"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="card-placeholder">FOTO</div>
                    )
                  )}

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
                      title="Přidat do oblíbených"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <Link href={`/${locale}/profily/${girl.slug}`} className="card-content">
                  <div className="card-header">
                    <h2 className="card-name">{girl.name}</h2>
                    <div className="card-meta">
                      {girl.age} let · {girl.height}cm
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .page-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        .page-header {
          text-align: center;
          margin-bottom: 3rem;
          padding-top: 1rem;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 0.5rem 0;
          background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .page-subtitle {
          font-size: 1.125rem;
          color: #9ca3af;
          font-weight: 500;
        }

        .girls-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
          padding-bottom: 2rem;
        }

        .card {
          position: relative;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4),
                      0 0 0 1px rgba(212, 175, 55, 0.3);
          border-color: rgba(212, 175, 55, 0.5);
        }

        .card-image-container {
          position: relative;
          width: 100%;
          padding-top: 133.33%;
          overflow: hidden;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(139, 21, 56, 0.1) 100%);
        }

        /* 3D Flip Effect */
        .card-flip-inner {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
        }

        .card:hover .card-flip-inner {
          transform: rotateY(180deg);
        }

        .card-flip-front,
        .card-flip-back {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .card-flip-back {
          transform: rotateY(180deg);
        }

        .card-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(139, 21, 56, 0.2) 100%);
          color: rgba(255, 255, 255, 0.3);
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: 0.2em;
        }

        .badge {
          position: absolute;
          top: 12px;
          left: 12px;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          z-index: 10;
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .badge-new {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.9) 100%);
          color: #ffffff;
        }

        .badge-top {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.9) 0%, rgba(244, 208, 63, 0.9) 100%);
          color: #1f1f23;
        }

        .badge-asian {
          background: linear-gradient(135deg, rgba(147, 51, 234, 0.9) 0%, rgba(126, 34, 206, 0.9) 100%);
          color: #ffffff;
        }

        .badge-recommended {
          background: linear-gradient(135deg, rgba(139, 21, 56, 0.9) 0%, rgba(176, 27, 71, 0.9) 100%);
          color: #ffffff;
        }

        .card-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 50%;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .card:hover .card-overlay {
          opacity: 1;
        }

        .quick-actions {
          position: absolute;
          bottom: 16px;
          right: 16px;
          display: flex;
          gap: 8px;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 10;
        }

        .card:hover .quick-actions {
          opacity: 1;
          transform: translateY(0);
        }

        .action-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.95);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .action-btn:hover {
          background: var(--wine);
          transform: scale(1.1);
        }

        .action-btn svg {
          width: 20px;
          height: 20px;
          color: var(--wine);
        }

        .action-btn:hover svg {
          color: #ffffff;
        }

        .card-content {
          padding: 1.25rem;
          text-decoration: none;
          display: block;
        }

        .card-header {
          margin-bottom: 0.75rem;
        }

        .card-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 0.25rem 0;
          transition: color 0.2s ease;
        }

        .card:hover .card-name {
          color: var(--gold);
        }

        .card-meta {
          font-size: 0.875rem;
          color: #9ca3af;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .page-container {
            padding: 1.5rem 1rem;
          }

          .page-title {
            font-size: 1.875rem;
          }

          .page-subtitle {
            font-size: 1rem;
          }

          .girls-grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 1rem;
          }

          .card-image-container {
            padding-top: 140%;
          }

          .card-name {
            font-size: 1.125rem;
          }

          .card-meta {
            font-size: 0.8125rem;
          }
        }
      `}</style>
    </>
  );
}
