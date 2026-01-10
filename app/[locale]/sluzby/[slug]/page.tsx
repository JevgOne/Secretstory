"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { getServiceBySlug, SERVICES } from '@/lib/services-data';
import { parseMarkdown } from '@/lib/markdown';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MobileMenu from '@/components/MobileMenu';
import { useLocations } from '@/lib/hooks/useLocations';

interface Girl {
  id: number;
  name: string;
  slug: string;
  age: number;
  online: boolean;
  location?: string;
  services: string[];
}

export default function ServicePage() {
  const { primaryLocation } = useLocations();
  const params = useParams();
  const locale = useLocale();
  const t = useTranslations();
  const tServices = useTranslations('services');
  const tCommon = useTranslations('common');
  const slug = params.slug as string;

  const [girls, setGirls] = useState<Girl[]>([]);
  const [loading, setLoading] = useState(true);

  const service = getServiceBySlug(slug);

  useEffect(() => {
    async function fetchGirls() {
      try {
        const response = await fetch('/api/girls?status=active');
        const data = await response.json();
        if (data.success) {
          // Filter girls who offer this service
          const filtered = data.girls.filter((girl: Girl) =>
            girl.services && girl.services.includes(slug)
          );
          setGirls(filtered);
        }
      } catch (error) {
        console.error('Error fetching girls:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchGirls();
  }, [slug]);

  if (!service) {
    return (
      <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h1>{tServices('service_not_found')}</h1>
        <Link href={`/${locale}/sluzby`} className="btn">{tServices('back_to_services')}</Link>
      </div>
    );
  }

  const serviceName = service.name[locale as keyof typeof service.name];
  const serviceContent = service.content[locale as keyof typeof service.content];
  const serviceDescription = service.description[locale as keyof typeof service.description];

  return (
    <>
      {/* Navigation - copy from divky page */}
      <nav className="main-nav">
        <Link href={`/${locale}`} className="logo">
          <span className="logo-L">
            <svg className="santa-hat" viewBox="0 0 16 14" fill="none">
              <path d="M2 12C4 11 6 7 9 5C8 3 9 1.5 10 1" stroke="#c41e3a" strokeWidth="2" strokeLinecap="round" />
              <circle cx="10" cy="1.5" r="1.5" fill="#fff" />
              <path d="M1 12C3 11.5 6 11 9 11" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
            L
          </span>
          ovely Girls
        </Link>
        <div className="nav-links">
          <Link href={`/${locale}`}>{t('nav.home')}</Link>
          <Link href={`/${locale}/divky`}>{t('nav.girls')}</Link>
          <Link href={`/${locale}/schedule`}>{t('nav.schedule')}</Link>
          <Link href={`/${locale}/cenik`}>{t('nav.pricing')}</Link>
          <Link href={`/${locale}/faq`}>{t('nav.faq')}</Link>
        </div>
        <div className="nav-contact">
          <LanguageSwitcher />
          <a href="https://t.me/+420734332131" className="btn">{t('nav.telegram')}</a>
          <a href="https://wa.me/420734332131" className="btn btn-fill">{t('nav.whatsapp')}</a>
        </div>
        <MobileMenu currentPath={`/${locale}/sluzby/${slug}`} />
      </nav>

      <main className="service-page">
        {/* Hero Section */}
        <section className="service-hero">
          <div className="container">
            <div className="breadcrumbs">
              <Link href={`/${locale}`}>{tServices('breadcrumb_home')}</Link>
              <span>/</span>
              <Link href={`/${locale}/sluzby`}>{tServices('breadcrumb_services')}</Link>
              <span>/</span>
              <span>{serviceName}</span>
            </div>
            <h1 className="service-title">{serviceName}</h1>
            <p className="service-lead">{serviceDescription}</p>
          </div>
        </section>

        {/* Content Section */}
        <section className="service-content">
          <div className="container">
            <div className="content-grid">
              <div className="main-content">
                {parseMarkdown(serviceContent)}
              </div>

              <aside className="sidebar">
                <div className="sidebar-card">
                  <h3>{tServices('quick_booking')}</h3>
                  <p>{tServices('contact_for_confirmation')}</p>
                  <a href="https://wa.me/420734332131" className="btn btn-fill">WhatsApp</a>
                  <a href="https://t.me/+420734332131" className="btn">Telegram</a>
                </div>

                <div className="sidebar-card">
                  <h3>{tServices('related_services')}</h3>
                  <ul className="related-services">
                    {SERVICES.filter(s => s.category === service.category && s.id !== service.id).slice(0, 5).map(s => (
                      <li key={s.id}>
                        <Link href={`/${locale}/sluzby/${s.slug}`}>
                          {s.name[locale as keyof typeof s.name]}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Girls offering this service */}
        <section className="service-girls">
          <div className="container">
            <h2 className="section-title">{tServices('girls_offering')} {serviceName}</h2>
            {loading ? (
              <div className="loading">{tServices('loading_ellipsis')}</div>
            ) : girls.length === 0 ? (
              <p className="no-results">{tServices('no_girls_offering')}</p>
            ) : (
              <div className="cards-grid">
                {girls.map(girl => (
                  <Link href={`/${locale}/profily/${girl.slug}`} key={girl.id}>
                    <article className="card">
                      <div className="card-image-container" style={{ width: '100%', aspectRatio: '3/4', position: 'relative', overflow: 'hidden' }}>
                        {girl.online && <span className="badge badge-online">{tServices('online_badge')}</span>}
                        <div className="card-placeholder" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>{tServices('photo_placeholder')}</div>
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
                            <span className="stat-value">{girl.age}</span>
                            <span className="stat-label">{tServices('years_label')}</span>
                          </span>
                        </div>
                        <div className="card-location-wrapper">
                          <div className="card-location">
                            <svg className="location-icon" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                            </svg>
                            {girl.location || primaryLocation?.display_name || 'Praha 2'}
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="service-cta">
          <div className="container">
            <h2>{tServices('interested_in')} {serviceName}?</h2>
            <p>{tServices('contact_for_booking')}</p>
            <div className="cta-buttons">
              <a href="https://wa.me/420734332131" className="btn btn-fill">WhatsApp</a>
              <a href="https://t.me/+420734332131" className="btn">Telegram</a>
              <Link href={`/${locale}/divky`} className="btn">{tServices('view_all_girls')}</Link>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        .service-page {
          padding-top: 80px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .service-hero {
          padding: 4rem 0 3rem;
          background: linear-gradient(180deg, rgba(139,58,92,0.1) 0%, transparent 100%);
        }

        .breadcrumbs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .breadcrumbs a {
          color: var(--text-secondary);
          transition: color 0.3s;
        }

        .breadcrumbs a:hover {
          color: var(--wine);
        }

        .service-title {
          font-size: 3rem;
          font-family: var(--font-playfair), serif;
          margin-bottom: 1rem;
          color: var(--white);
        }

        .service-lead {
          font-size: 1.2rem;
          color: var(--text-secondary);
          max-width: 800px;
        }

        .service-content {
          padding: 3rem 0;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 3rem;
        }

        .main-content {
          color: var(--text-primary);
          line-height: 1.8;
        }

        .main-content :global(h1),
        .main-content :global(h2),
        .main-content :global(h3) {
          font-family: var(--font-playfair), serif;
          color: var(--white);
          margin: 2rem 0 1rem;
        }

        .main-content :global(h1) { font-size: 2.5rem; }
        .main-content :global(h2) { font-size: 2rem; }
        .main-content :global(h3) { font-size: 1.5rem; }

        .main-content :global(p) {
          margin-bottom: 1.5rem;
        }

        .main-content :global(ul) {
          margin: 1.5rem 0;
          padding-left: 2rem;
        }

        .main-content :global(li) {
          margin-bottom: 0.5rem;
        }

        .sidebar {
          position: sticky;
          top: 100px;
          height: fit-content;
        }

        .sidebar-card {
          background: var(--bg-card);
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .sidebar-card h3 {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          color: var(--white);
        }

        .sidebar-card p {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }

        .sidebar-card .btn {
          width: 100%;
          margin-bottom: 0.75rem;
          justify-content: center;
        }

        .related-services {
          list-style: none;
          padding: 0;
        }

        .related-services li {
          margin-bottom: 0.75rem;
        }

        .related-services a {
          color: var(--text-primary);
          transition: color 0.3s;
          display: block;
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .related-services a:hover {
          color: var(--wine);
        }

        .service-girls {
          padding: 4rem 0;
          background: rgba(0,0,0,0.2);
        }

        .service-girls .section-title {
          text-align: center;
          margin-bottom: 3rem;
        }

        .loading, .no-results {
          text-align: center;
          padding: 3rem 0;
          color: var(--text-secondary);
        }

        .service-cta {
          padding: 5rem 0;
          text-align: center;
          background: linear-gradient(180deg, transparent 0%, rgba(139,58,92,0.1) 100%);
        }

        .service-cta h2 {
          font-size: 2.5rem;
          font-family: var(--font-playfair), serif;
          margin-bottom: 1rem;
        }

        .service-cta p {
          font-size: 1.2rem;
          color: var(--text-secondary);
          margin-bottom: 2rem;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        @media (max-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr;
          }

          .sidebar {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .service-title {
            font-size: 2rem;
          }

          .service-hero {
            padding: 2rem 0;
          }
        }
      `}</style>
    </>
  );
}
