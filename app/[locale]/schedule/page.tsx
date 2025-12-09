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
          <Link href={`/${locale}`}>{tNav('home')}</Link>
          <Link href={`/${locale}/divky`}>{tNav('girls')}</Link>
          <Link href={`/${locale}/cenik`}>{tNav('pricing')}</Link>
          <Link href={`/${locale}/schedule`} className="active">{tNav('schedule')}</Link>
          <Link href={`/${locale}/discounts`}>{tNav('discounts')}</Link>
          <Link href={`/${locale}/faq`}>{tNav('faq')}</Link>
        </div>
        <div className="nav-contact">
          <LanguageSwitcher />
          <a href="tel:+420734332131" className="btn">{tNav('phone')}</a>
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

      {/* Footer */}
      <footer>
        <div>{tCommon('brand')} Prague © 2025 — {tCommon('adults_only')}</div>
        <div className="footer-links">
          <Link href={`/${locale}/podminky`}>{tFooter('terms')}</Link>
          <Link href={`/${locale}/soukromi`}>{tFooter('privacy')}</Link>
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
