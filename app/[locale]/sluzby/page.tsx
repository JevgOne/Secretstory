"use client";

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { SERVICES, SERVICE_CATEGORIES } from '@/lib/services-data';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MobileMenu from '@/components/MobileMenu';

export default function ServicesPage() {
  const locale = useLocale();
  const t = useTranslations();
  const tServices = useTranslations('services');
  const tFooter = useTranslations('footer');

  // Group services by category
  const servicesByCategory = SERVICES.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, typeof SERVICES>);

  return (
    <>
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
        <MobileMenu currentPath={`/${locale}/sluzby`} />
      </nav>

      <main className="services-page">
        <section className="page-hero">
          <div className="hero-container">
            <div className="hero-content">
              <div className="hero-badge">{tServices('page_badge')}</div>
              <h1 className="page-title">{tServices('page_title')}</h1>
              <p className="page-subtitle">
                {tServices('page_subtitle')}
              </p>
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number">{SERVICES.length}+</div>
                  <div className="stat-label">{tServices('stat_services')}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">24/7</div>
                  <div className="stat-label">{tServices('stat_availability')}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">100%</div>
                  <div className="stat-label">{tServices('stat_discretion')}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="services-content">
          <div className="container">
            {Object.entries(servicesByCategory).map(([category, services]) => (
              <div key={category} className="category-section">
                <div className="category-header">
                  <div className="category-icon">
                    {category === 'basic' && '💫'}
                    {category === 'oral' && '💋'}
                    {category === 'special' && '✨'}
                    {category === 'massage' && '💆'}
                    {category === 'extras' && '🎁'}
                    {category === 'types' && '🌟'}
                  </div>
                  <div>
                    <h2 className="category-title">
                      {SERVICE_CATEGORIES[category as keyof typeof SERVICE_CATEGORIES][locale as 'cs']}
                    </h2>
                    <p className="category-subtitle">{services.length} {tServices('services_available')}</p>
                  </div>
                </div>
                <div className="services-grid">
                  {services.map(service => (
                    <Link
                      href={`/${locale}/sluzby/${service.slug}`}
                      key={service.id}
                      className="service-card"
                    >
                      <div className="service-card-content">
                        <div className="service-header">
                          <h3 className="service-name">
                            {service.name[locale as keyof typeof service.name]}
                          </h3>
                          <div className="service-arrow">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M7 17L17 7M17 7H7M17 7V17"/>
                            </svg>
                          </div>
                        </div>
                        <p className="service-description">
                          {service.description[locale as keyof typeof service.description]}
                        </p>
                        <div className="service-footer">
                          <span className="service-link">
                            {tServices('learn_more')}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="services-cta">
          <div className="container">
            <h2>{tServices('have_questions')}</h2>
            <p>{tServices('contact_for_info')}</p>
            <div className="cta-buttons">
              <a href="https://wa.me/420734332131" className="btn btn-fill">WhatsApp</a>
              <a href="https://t.me/+420734332131" className="btn">Telegram</a>
            </div>
          </div>
        </section>
      </main>

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
              <p className="footer-desc">{t('footer.about_text')}</p>
            </div>

            <div className="footer-links-grid">
              <div className="footer-links-col">
                <h4 className="footer-links-title">{tServices('practices')}</h4>
                <nav className="footer-links">
                  <Link href={`/${locale}/divky`}>{t('nav.girls')}</Link>
                  <Link href={`/${locale}/sluzby`}>{tServices('practices')}</Link>
                  <Link href={`/${locale}/cenik`}>{t('nav.pricing')}</Link>
                  <Link href={`/${locale}/schedule`}>{t('nav.schedule')}</Link>
                  <Link href={`/${locale}/discounts`}>{t('nav.discounts')}</Link>
                  <Link href={`/${locale}/faq`}>{t('nav.faq')}</Link>
                  <Link href={`/${locale}/blog`}>{t('footer.blog')}</Link>
                </nav>
              </div>

              <div className="footer-links-col">
                <h4 className="footer-links-title">{t('footer.contact')}</h4>
                <div className="footer-contact-info">
                  <div className="footer-contact-item">
                    <span className="label">{t('footer.hours')}</span>
                    <span className="value">{t('footer.hours_value')}</span>
                  </div>
                  <div className="footer-contact-item">
                    <span className="label">{t('footer.location')}</span>
                    <span className="value">{t('footer.location_value')}</span>
                  </div>
                </div>
                <div className="footer-contact-actions">
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

          {/* Legal Disclaimer */}
          <div className="footer-disclaimer">
            <p>{tFooter('disclaimer')}</p>
          </div>

          <div className="footer-bottom">
            <div className="footer-bottom-left">
              <span>{t('footer.copyright')}</span>
              <span className="dot">•</span>
              <span>{t('common.adults_only')}</span>
            </div>
            <div className="footer-bottom-right">
              <Link href={`/${locale}/podminky`}>{t('footer.terms')}</Link>
              <Link href={`/${locale}/soukromi`}>{t('footer.privacy')}</Link>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .services-page {
          padding-top: 80px;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .hero-container {
          max-width: 1600px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .page-hero {
          padding: 6rem 0 4rem;
          background:
            radial-gradient(ellipse at top, rgba(139,58,92,0.15) 0%, transparent 60%),
            linear-gradient(180deg, rgba(139,58,92,0.05) 0%, transparent 100%);
          position: relative;
          overflow: hidden;
        }

        .page-hero::before {
          content: '';
          position: absolute;
          top: -50%;
          left: 50%;
          transform: translateX(-50%);
          width: 150%;
          height: 200%;
          background: radial-gradient(circle, rgba(139,58,92,0.1) 0%, transparent 70%);
          animation: pulse 8s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.8; transform: translateX(-50%) scale(1.1); }
        }

        .hero-content {
          position: relative;
          z-index: 1;
          text-align: center;
        }

        .hero-badge {
          display: inline-block;
          padding: 0.5rem 1.5rem;
          background: rgba(139,58,92,0.2);
          border: 1px solid rgba(139,58,92,0.4);
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #e84a7f;
          margin-bottom: 2rem;
          backdrop-filter: blur(10px);
        }

        .page-title {
          font-size: 4.5rem;
          font-family: var(--font-playfair), serif;
          margin-bottom: 1.5rem;
          color: var(--white);
          font-weight: 700;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .page-subtitle {
          font-size: 1.3rem;
          color: var(--text-secondary);
          max-width: 700px;
          margin: 0 auto 3rem;
          line-height: 1.8;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 4rem;
          margin-top: 3rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--wine);
          font-family: var(--font-playfair), serif;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.9rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .services-content {
          padding: 5rem 0;
        }

        .category-section {
          margin-bottom: 5rem;
        }

        .category-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .category-icon {
          font-size: 3rem;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(139,58,92,0.2) 0%, rgba(139,58,92,0.05) 100%);
          border-radius: 20px;
          border: 1px solid rgba(139,58,92,0.3);
          backdrop-filter: blur(10px);
        }

        .category-title {
          font-size: 2.2rem;
          font-family: var(--font-playfair), serif;
          color: var(--white);
          margin-bottom: 0.25rem;
          font-weight: 600;
        }

        .category-subtitle {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
        }

        .service-card {
          background: linear-gradient(135deg, rgba(26,18,22,0.9) 0%, rgba(18,14,16,0.9) 100%);
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .card-glow {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(139,58,92,0.15) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.4s;
          pointer-events: none;
          z-index: 0;
        }

        .service-card:hover .card-glow {
          opacity: 1;
        }

        .service-card:hover {
          transform: translateY(-8px);
          box-shadow:
            0 20px 40px rgba(0,0,0,0.5),
            0 0 60px rgba(139,58,92,0.3),
            inset 0 1px 0 rgba(255,255,255,0.1);
          border-color: rgba(139,58,92,0.6);
        }

        .service-card-content {
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 1;
        }

        .service-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .service-name {
          font-size: 1.5rem;
          font-family: var(--font-playfair), serif;
          color: var(--white);
          font-weight: 600;
          flex: 1;
          line-height: 1.3;
        }

        .service-arrow {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(139,58,92,0.15);
          border-radius: 12px;
          border: 1px solid rgba(139,58,92,0.3);
          transition: all 0.3s;
        }

        .service-arrow svg {
          width: 20px;
          height: 20px;
          color: var(--wine);
          transition: transform 0.3s;
        }

        .service-card:hover .service-arrow {
          background: rgba(139,58,92,0.3);
          border-color: rgba(139,58,92,0.6);
        }

        .service-card:hover .service-arrow svg {
          transform: translate(2px, -2px);
        }

        .service-description {
          color: var(--text-secondary);
          line-height: 1.7;
          flex: 1;
          margin-bottom: 1.5rem;
          font-size: 1rem;
        }

        .service-footer {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .service-link {
          color: var(--wine);
          font-weight: 500;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s;
        }

        .service-card:hover .service-link {
          transform: translateX(4px);
        }

        .services-cta {
          padding: 5rem 0;
          text-align: center;
          background: linear-gradient(180deg, transparent 0%, rgba(139,58,92,0.1) 100%);
        }

        .services-cta h2 {
          font-size: 2.5rem;
          font-family: var(--font-playfair), serif;
          margin-bottom: 1rem;
        }

        .services-cta p {
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

        @media (max-width: 768px) {
          .page-title {
            font-size: 2.5rem;
          }

          .services-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
