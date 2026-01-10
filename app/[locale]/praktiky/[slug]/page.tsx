"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { getServiceById, getServiceName, SERVICES } from "@/lib/services";
import { useFavorites } from '@/contexts/FavoritesContext';

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
  location?: string;
  primary_photo?: string;
  thumbnail?: string;
  services?: string[];
}

export default function PraktikaDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const locale = useLocale();
  const t = useTranslations();
  const tGirls = useTranslations('girls');
  const [girls, setGirls] = useState<Girl[]>([]);
  const [loading, setLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();

  // Find the service by slug (which is the service ID)
  const service = getServiceById(slug);

  useEffect(() => {
    async function fetchGirls() {
      try {
        const response = await fetch(`/api/girls?status=active&service=${slug}`);
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

    if (service) {
      fetchGirls();
    } else {
      setLoading(false);
    }
  }, [slug, service]);

  if (!service) {
    return (
      <div className="container" style={{ padding: "100px 20px", textAlign: "center" }}>
        <h1>Praktika nenalezena</h1>
        <Link href={`/${locale}/praktiky`}>← Zpět na všechny praktiky</Link>
      </div>
    );
  }

  const serviceName = getServiceName(slug, locale);

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

  return (
    <div className="container" style={{ padding: "100px 20px", maxWidth: "1200px", margin: "0 auto" }}>
      <Link href={`/${locale}/profily`} style={{ display: "inline-block", marginBottom: "2rem", color: "var(--wine)" }}>
        ← Zpět na všechny dívky
      </Link>

      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "var(--wine)" }}>
        #{serviceName}
      </h1>

      <div style={{
        background: "rgba(139, 41, 66, 0.1)",
        padding: "2rem",
        borderRadius: "12px",
        marginTop: "2rem",
        marginBottom: "2rem"
      }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>O této praktice</h2>
        <p style={{ lineHeight: "1.8", color: "rgba(255,255,255,0.8)" }}>
          {serviceName} je jedna z praktik které nabízejí naše escort dívky.
          Níže najdete profily všech holek, které tuto službu poskytují.
        </p>
      </div>

      {/* All Services Hashtags */}
      <div style={{ marginBottom: "3rem" }}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "rgba(255,255,255,0.9)" }}>
          Všechny praktiky
        </h3>
        <div className="hashtags">
          {SERVICES.map((service) => (
            <Link
              href={`/${locale}/praktiky/${service.id}`}
              key={service.id}
              className={`hashtag ${service.id === slug ? 'active' : ''}`}
            >
              #{getServiceName(service.id, locale)}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: "1.8rem", marginBottom: "1.5rem" }}>
          Dívky nabízející {serviceName} ({girls.length})
        </h2>

        {loading ? (
          <p style={{ color: "rgba(255,255,255,0.6)", textAlign: "center", padding: "3rem" }}>
            Načítání...
          </p>
        ) : girls.length === 0 ? (
          <p style={{ color: "rgba(255,255,255,0.6)", textAlign: "center", padding: "3rem" }}>
            Zatím žádné holky nenabízejí tuto službu.
          </p>
        ) : (
          <div className="cards-grid">
            {girls.map((girl) => {
              const breastSize = getBreastSize(girl.bust);
              const location = girl.location || 'Praha';

              return (
                <Link
                  href={`/${locale}/profily/${girl.slug}`}
                  key={girl.id}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <article className="card">
                    <div className="card-image-container">
                      {girl.primary_photo || girl.thumbnail ? (
                        <img
                          src={girl.thumbnail || girl.primary_photo}
                          alt={girl.name}
                          className="card-image"
                        />
                      ) : (
                        <div className="card-placeholder">FOTO</div>
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
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                        </button>
                        <button
                          className={`action-btn ${isFavorite(girl.id) ? 'favorite-active' : ''}`}
                          title={isFavorite(girl.id) ? 'Odebrat z oblíbených' : 'Přidat do oblíbených'}
                          onClick={(e) => {
                            e.preventDefault();
                            toggleFavorite(girl.id);
                          }}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill={isFavorite(girl.id) ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="card-info">
                      <div className="card-header">
                        <h3 className="card-name">
                          {girl.online && <span className="online-dot"></span>}
                          {girl.name}
                        </h3>
                      </div>
                      <div className="card-stats">
                        <span className="stat">
                          <span className="stat-value">{girl.age || '?'}</span>
                          <span className="stat-label">{tGirls('age_years')}</span>
                        </span>
                        <span className="stat">
                          <span className="stat-value">{girl.height || '?'}</span>
                          <span className="stat-label">cm</span>
                        </span>
                        <span className="stat">
                          <span className="stat-value">{girl.weight || '?'}</span>
                          <span className="stat-label">kg</span>
                        </span>
                        <span className="stat">
                          <span className="stat-value">{girl.bust || '?'}</span>
                          <span className="stat-label">{tGirls('bust')}</span>
                        </span>
                      </div>
                      <div className="card-location-wrapper">
                        <div className="card-location">
                          <svg className="location-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                          </svg>
                          {location}
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
