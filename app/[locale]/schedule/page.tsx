"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

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

export default function SchedulePage({ params }: { params: { locale: string } }) {
  const t = useTranslations('schedule');
  const [girls, setGirls] = useState<Girl[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [activeDate, setActiveDate] = useState(0);

  const dates = [
    { day: t('days.today_short'), num: new Date().getDate(), today: true }
  ];

  useEffect(() => {
    fetch(`/api/schedule?lang=${params.locale}`)
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
  }, [params.locale]);

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
          <Link href="/schedule" className="active">Schedule</Link>
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

      {/* Page Header */}
      <section className="page-header">
        <h1 className="page-title">{t('title')}</h1>
        <p className="page-subtitle">{t('subtitle')}</p>
      </section>

      {/* Date Selector */}
      <section className="date-selector">
        <div className="date-tabs">
          {dates.map((date, i) => (
            <div
              key={i}
              className={`date-tab ${activeDate === i ? "active" : ""} ${date.today ? "today" : ""}`}
              onClick={() => setActiveDate(i)}
            >
              <span className="date-day">{date.day}</span>
              <span className="date-num">{date.num}</span>
            </div>
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
                  href={`/${params.locale}/divky/${girl.slug}`}
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
                    <div className="schedule-time">{girl.shift.from} - {girl.shift.to}</div>
                    <div className="schedule-location">
                      <MapPin size={12} />
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
        <div>LovelyGirls Prague © 2025 — Pouze 18+</div>
        <div className="footer-links">
          <Link href="/podminky">Podmínky</Link>
          <Link href="/soukromi">Soukromí</Link>
        </div>
      </footer>
    </>
  );
}
