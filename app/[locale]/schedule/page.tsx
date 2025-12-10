"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
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
  description: string;
  online: boolean;
}

interface ScheduleResponse {
  success: boolean;
  current_time: string;
  day: string;
  timezone: string;
  girls: Girl[];
}

export default function SchedulePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: paramsLocale } = use(params);
  const locale = useLocale();
  const t = useTranslations('schedule');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const tFooter = useTranslations('footer');
  const [girls, setGirls] = useState<Girl[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [selectedDate, setSelectedDate] = useState(0); // 0 = today, 1 = tomorrow, etc.

  // Generate 7 days starting from today
  const getDays = () => {
    const days = [];
    const dayNames = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push({
        index: i,
        dayName: i === 0 ? t('days.today_short') : dayNames[date.getDay() === 0 ? 6 : date.getDay() - 1],
        dayNum: date.getDate(),
        date: date
      });
    }
    return days;
  };

  useEffect(() => {
    // Calculate the target date based on selectedDate
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + selectedDate);
    const dateString = targetDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    setLoading(true);
    fetch(`/api/schedule?lang=${locale}&date=${dateString}`)
      .then(res => res.json())
      .then((data: ScheduleResponse) => {
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
  }, [locale, selectedDate]);

  return (
    <>
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
        <MobileMenu currentPath={`/${locale}/schedule`} />
      </nav>

      {/* Page Header */}
      <section className="page-header">
        <h1 className="page-title">{t('title')}</h1>
        <p className="page-subtitle">{t('subtitle')}</p>
      </section>

      {/* Date Selector */}
      <section className="date-selector">
        <div className="date-tabs">
          {getDays().map((day) => (
            <button
              key={day.index}
              className={`date-tab ${selectedDate === day.index ? 'active' : ''} ${day.index === 0 ? 'today' : ''}`}
              onClick={() => setSelectedDate(day.index)}
            >
              <span className="date-day">{day.dayName}</span>
              <span className="date-num">{day.dayNum}</span>
            </button>
          ))}
        </div>
      </section>

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
            <p>{t('no_girls')}</p>
          </div>
        )}

        {!loading && !error && girls.length > 0 && (
          <div className="schedule-grid">
            {girls.map((girl) => {
              const isWorking = girl.status === 'working';
              const statusText = isWorking
                ? t('status.online')
                : t('status.available_from', { time: girl.shift.from });

              return (
                <Link
                  key={girl.id}
                  href={`/${locale}/profily/${girl.slug}`}
                  className={`schedule-card ${!isWorking ? "unavailable" : ""}`}
                >
                  <div className="schedule-img">
                    {girl.photos && girl.photos[0] && (
                      <img src={girl.photos[0]} alt={girl.name} />
                    )}
                    <div className="schedule-status">
                      <span className={`status-dot ${isWorking ? "online" : "offline"}`}></span>
                      {statusText}
                    </div>
                  </div>
                  <div className="schedule-info">
                    <div className="schedule-name">{girl.name}</div>
                    <div className="schedule-time">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: '14px', height: '14px'}}>
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      {girl.shift.from} - {girl.shift.to}
                    </div>
                    <div className="schedule-location">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      {girl.location}
                    </div>
                  </div>
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

      {/* MOBILE BOTTOM CTA */}
      <BottomCTA
        translations={{
          browse_girls: tNav('girls'),
          whatsapp: tNav('whatsapp'),
          call: tNav('phone')
        }}
      />
    </>
  );
}
