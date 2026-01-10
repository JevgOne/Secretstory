"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MobileMenu from '@/components/MobileMenu';
import BottomCTA from '@/components/BottomCTA';

interface Girl {
  id: number;
  name: string;
  slug: string;
  status: "working" | "later";
  shift: {
    from: string;
    to: string;
  };
  location: string;
  photos: string[];
  age: number;
  height: number;
  weight: number;
  bust: number;
  description: string;
  online: boolean;
  badge_type: string | null;
}

interface ScheduleClientProps {
  locale: string;
  initialGirls: Girl[];
  initialCurrentTime: string;
  schemaData: any;
}

export default function ScheduleClient({
  locale,
  initialGirls,
  initialCurrentTime,
  schemaData
}: ScheduleClientProps) {
  const t = useTranslations('schedule');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const tFooter = useTranslations('footer');
  const tGirls = useTranslations('girls');
  const tHome = useTranslations('home');

  const [girls, setGirls] = useState<Girl[]>(initialGirls);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialCurrentTime);
  const [selectedDate, setSelectedDate] = useState(0); // 0 = today, 1 = tomorrow, etc.

  // Helper function for breast size - returns number (1, 2, 3)
  const getBreastSize = (bust: number): number => {
    if (bust < 80) return 1;
    if (bust < 90) return 2;
    return 3;
  };

  // Generate days from today until end of week (Sunday)
  const getDays = () => {
    const days = [];
    const dayNames = [t('days.mon'), t('days.tue'), t('days.wed'), t('days.thu'), t('days.fri'), t('days.sat'), t('days.sun')];

    const today = new Date();
    const currentDayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Convert to our format: 0 = Monday, 6 = Sunday
    const currentDay = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;

    // Calculate how many days until Sunday
    const daysUntilSunday = 6 - currentDay;

    // Generate days from today to Sunday
    for (let i = 0; i <= daysUntilSunday; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1;

      days.push({
        index: i,
        dayName: i === 0 ? t('days.today_short') : dayNames[dayOfWeek],
        dayNum: date.getDate(),
        date: date,
        available: 0 // Number of girls available - will be updated later
      });
    }
    return days;
  };

  useEffect(() => {
    // Only fetch if not showing today's data
    if (selectedDate === 0) {
      setGirls(initialGirls);
      setCurrentTime(initialCurrentTime);
      return;
    }

    // Calculate the target date based on selectedDate
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + selectedDate);
    const dateString = targetDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    setLoading(true);
    fetch(`/api/schedule?lang=${locale}&date=${dateString}`)
      .then(res => res.json())
      .then((data) => {
        if (data.success) {
          setGirls(data.girls);
          setCurrentTime(data.current_time);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch schedule:", err);
        setError(true);
        setLoading(false);
      });
  }, [locale, selectedDate, initialGirls, initialCurrentTime]);

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Mobile Menu - outside nav for proper z-index */}
      <MobileMenu currentPath={`/${locale}/schedule`} />

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
          <Link href={`/${locale}/schedule`} className="active">{tNav('schedule')}</Link>
          <Link href={`/${locale}/discounts`}>{tNav('discounts')}</Link>
          <Link href={`/${locale}/faq`}>{tNav('faq')}</Link>
        </div>
        <div className="nav-contact">
          <LanguageSwitcher />
          <a href="https://t.me/+420734332131" className="btn">{tNav('telegram')}</a>
          <a href="https://wa.me/420734332131" className="btn btn-fill">{tNav('whatsapp')}</a>
        </div>
      </nav>

      {/* Page Header */}
      <section className="schedule-page-header">
        <h1 className="schedule-page-title">{t('title')}</h1>
        {t('subtitle') && <p className="schedule-page-subtitle">{t('subtitle')}</p>}
      </section>

      <style jsx>{`
        .schedule-page-header {
          text-align: center;
          padding: 140px 20px 16px;
        }
        .schedule-page-title {
          font-family: 'Cormorant', serif;
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 300;
          color: var(--wine-light);
          margin: 0 0 6px 0;
          letter-spacing: 0.02em;
        }
        .schedule-page-subtitle {
          font-size: 0.9rem;
          color: var(--gray);
          margin: 0 auto;
          max-width: 500px;
        }
        @media (max-width: 768px) {
          .schedule-page-header {
            padding: 120px 16px 12px;
          }
          .schedule-page-title {
            font-size: 1.5rem;
          }
          .schedule-page-subtitle {
            font-size: 0.8rem;
          }
        }
      `}</style>

      {/* Modern Date Selector - Mobile-first with horizontal scroll */}
      <section className="schedule-date-selector">
        <div className="date-scroll-container">
          <div className="date-pills">
            {getDays().map((day) => (
              <button
                key={day.index}
                onClick={() => setSelectedDate(day.index)}
                className={`date-pill ${selectedDate === day.index ? 'active' : ''}`}
              >
                <span className="day-label">{day.dayName}</span>
                <span className="day-number">{day.dayNum}</span>
                {selectedDate === day.index && <span className="active-indicator" />}
              </button>
            ))}
          </div>
        </div>

      </section>

      <style jsx>{`
        .schedule-date-selector {
          max-width: 1200px;
          margin: 0 auto 20px;
          padding: 0 20px;
        }

        .date-scroll-container {
          display: flex;
          justify-content: center;
          overflow: visible;
        }

        .date-pills {
          display: inline-flex;
          gap: 12px;
          padding: 8px;
        }

        .date-pill {
          position: relative;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          min-width: 85px;
          padding: 16px 20px;
          background: linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(20, 20, 20, 0.9));
          border: 1.5px solid rgba(139, 58, 74, 0.15);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .date-pill:hover {
          transform: translateY(-2px);
          border-color: rgba(139, 58, 74, 0.4);
          box-shadow: 0 4px 12px rgba(139, 58, 74, 0.2);
        }

        .date-pill.active {
          background: linear-gradient(135deg, #8b3a4a 0%, #6b2a3a 100%);
          border-color: var(--wine);
          box-shadow: 0 4px 16px rgba(139, 58, 74, 0.4), inset 0 1px 2px rgba(255,255,255,0.1);
        }

        .day-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255, 255, 255, 0.6);
          transition: color 0.3s ease;
        }

        .date-pill.active .day-label {
          color: #d4af37;
        }

        .day-number {
          font-size: 28px;
          font-weight: 800;
          color: #fff;
          line-height: 1;
        }

        .active-indicator {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 24px;
          height: 3px;
          background: linear-gradient(90deg, #d4af37, #f4cf67);
          border-radius: 2px;
          box-shadow: 0 0 8px rgba(212, 175, 55, 0.6);
        }

        @media (max-width: 768px) {
          .schedule-date-selector {
            margin-bottom: 24px;
            padding: 0 16px;
          }

          .date-scroll-container {
            justify-content: flex-start;
            margin: 0 -16px;
            padding: 0 16px 8px;
          }

          .date-pills {
            gap: 10px;
          }

          .date-pill {
            min-width: 75px;
            padding: 14px 16px;
          }

          .day-number {
            font-size: 26px;
          }
        }

        @media (max-width: 480px) {
          .date-pill {
            min-width: 70px;
            padding: 12px 14px;
          }

          .day-label {
            font-size: 10px;
          }

          .day-number {
            font-size: 24px;
          }
        }
      `}</style>

      {/* Schedule Grid */}
      <section className="schedule">
        {loading && (
          <div className="text-center py-8">
            <p>{t('loading')}</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-500">{t('error')}</p>
          </div>
        )}

        {!loading && !error && girls.length === 0 && (
          <div className="text-center py-8">
            <p style={{ fontSize: '1.2rem', color: '#9a8a8e' }}>{t('closed_today')}</p>
          </div>
        )}

        {!loading && !error && girls.length > 0 && (
          <div className="cards-grid">
            {girls.map((girl) => {
              const isWorking = girl.status === 'working';
              const breastSize = getBreastSize(girl.bust);
              const badge = girl.badge_type || null;
              const badgeText = badge === 'new' ? tGirls('new') : badge === 'top' ? tGirls('top_reviews') : badge === 'recommended' ? tGirls('recommended') : '';
              const badgeClass = badge === 'new' ? 'badge-new' : badge === 'top' ? 'badge-top' : 'badge-asian';

              return (
                <Link
                  key={girl.id}
                  href={`/${locale}/profily/${girl.slug}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <article className="card">
                    <div className="card-image-container">
                      {badge && (
                        <span className={`badge ${badgeClass}`}>{badgeText}</span>
                      )}
                      {girl.photos && girl.photos.length > 0 ? (
                        <img
                          src={girl.photos[0]}
                          alt={girl.name}
                          className="card-image"
                        />
                      ) : (
                        <div className="card-placeholder">{tCommon('photo')}</div>
                      )}
                      <div className="card-overlay"></div>
                    </div>
                    <div className="card-info">
                      <div className="card-header">
                        <h3 className="card-name">
                          {isWorking && <span className="online-dot"></span>}
                          {girl.name}
                        </h3>
                        <span className={`time-badge ${isWorking ? 'available' : 'tomorrow'}`}>
                          {girl.shift.from} - {girl.shift.to}
                        </span>
                      </div>
                      <div className="card-stats">
                        <span className="stat"><span className="stat-label">{tGirls('age_years')}</span><span className="stat-value">{girl.age}</span></span>
                        <span className="stat"><span className="stat-label">cm</span><span className="stat-value">{girl.height}</span></span>
                        <span className="stat"><span className="stat-label">kg</span><span className="stat-value">{girl.weight}</span></span>
                        <span className="stat"><span className="stat-label">{tGirls('bust')}</span><span className="stat-value">{girl.bust || '?'}</span></span>
                      </div>
                      <div className="card-location-wrapper">
                        <div className="card-location">
                          <svg className="location-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                          </svg>
                          {girl.location}
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Legend */}
      <section className="legend">
        <div className="legend-item">
          <span className="legend-dot online"></span>
          {t('legend.available')}
        </div>
        <div className="legend-item">
          <span className="legend-dot offline"></span>
          {t('legend.later')}
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
    </>
  );
}
