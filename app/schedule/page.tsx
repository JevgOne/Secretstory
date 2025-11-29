"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";

export default function SchedulePage() {
  const [activeDate, setActiveDate] = useState(0);

  const dates = [
    { day: "Dnes", num: 29, today: true },
    { day: "So", num: 30 },
    { day: "Ne", num: 1 },
    { day: "Po", num: 2 },
    { day: "Út", num: 3 },
    { day: "St", num: 4 },
    { day: "Čt", num: 5 }
  ];

  const girls = [
    { id: 1, name: "Natalie", time: "10:00 - 18:00", location: "Praha 2", online: true },
    { id: 2, name: "Victoria", time: "12:00 - 20:00", location: "Praha 3", online: true },
    { id: 3, name: "Isabella", time: "14:00 - 22:00", location: "Praha 2", online: true },
    { id: 4, name: "Sophie", time: "16:00 - 22:00", location: "Praha 2", online: false, status: "Od 16:00" },
    { id: 5, name: "Emma", time: "10:00 - 16:00", location: "Praha 2", online: true },
    { id: 6, name: "Mia", time: "—", location: "Praha 3", online: false, status: "Volno" },
    { id: 7, name: "Kristýna", time: "11:00 - 19:00", location: "Praha 2", online: true },
    { id: 8, name: "Laura", time: "13:00 - 21:00", location: "Praha 3", online: true }
  ];

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
        <h1 className="page-title">Schedule</h1>
        <p className="page-subtitle">Podívejte se, které dívky jsou dnes k dispozici a v jakých hodinách.</p>
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
        <div className="schedule-grid">
          {girls.map((girl) => (
            <div
              key={girl.id}
              className={`schedule-card ${!girl.online ? "unavailable" : ""}`}
            >
              <div className="schedule-img">
                <div className="schedule-status">
                  <span className={`status-dot ${girl.online ? "online" : "offline"}`}></span>
                  {girl.online ? "Online" : girl.status}
                </div>
              </div>
              <div className="schedule-info">
                <div className="schedule-name">{girl.name}</div>
                <div className="schedule-time">{girl.time}</div>
                <div className="schedule-location">
                  <MapPin size={12} />
                  {girl.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Legend */}
      <section className="legend">
        <div className="legend-item">
          <span className="legend-dot online"></span>
          Právě k dispozici
        </div>
        <div className="legend-item">
          <span className="legend-dot offline"></span>
          Později / Volno
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
