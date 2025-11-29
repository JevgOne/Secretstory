"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const girls = [
  {
    id: 1,
    name: "Natalie",
    age: 24,
    breast: 3,
    height: 170,
    weight: 52,
    location: "Praha 2",
    time: "10:00 - 18:00",
    badge: "new",
    online: true,
  },
  {
    id: 2,
    name: "Victoria",
    age: 26,
    breast: 2,
    height: 175,
    weight: 58,
    location: "Praha 3",
    time: "12:00 - 20:00",
    badge: "top",
    online: true,
  },
  {
    id: 3,
    name: "Isabella",
    age: 23,
    breast: 2,
    height: 168,
    weight: 50,
    location: "Praha 2",
    time: "14:00 - 22:00",
    badge: "asian",
    online: true,
  },
  {
    id: 4,
    name: "Sophie",
    age: 25,
    breast: 3,
    height: 172,
    weight: 55,
    location: "Praha 2",
    time: "10:00 - 16:00",
    online: true,
  },
];

export default function Home() {
  const [showAgeModal, setShowAgeModal] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ageConfirmed = localStorage.getItem("age");
      if (ageConfirmed) {
        setShowAgeModal(false);
      }
    }
  }, []);

  const confirmAge = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("age", "1");
      setShowAgeModal(false);
    }
  };

  const denyAge = () => {
    if (typeof window !== "undefined") {
      window.location.href = "https://google.com";
    }
  };

  return (
    <>
      {/* AGE MODAL */}
      {showAgeModal && (
        <div className="age-modal">
          <div className="age-box">
            <h2>18+</h2>
            <p>
              Tento web je určen pouze pro dospělé. Vstupem potvrzujete, že vám
              je 18 let nebo více.
            </p>
            <div className="age-buttons">
              <button className="age-btn yes" onClick={confirmAge}>
                Vstoupit
              </button>
              <button className="age-btn no" onClick={denyAge}>
                Odejít
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav>
        <Link href="/" className="logo">
          <span className="logo-L">
            <svg className="santa-hat" viewBox="0 0 16 14" fill="none">
              <path
                d="M2 12C4 11 6 7 9 5C8 3 9 1.5 10 1"
                stroke="#c41e3a"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="10" cy="1.5" r="1.5" fill="#fff" />
              <path
                d="M1 12C3 11.5 6 11 9 11"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            L
          </span>
          ovely Girls
        </Link>
        <div className="nav-links">
          <Link href="/">Home</Link>
          <Link href="#profiles">Dívky</Link>
          <Link href="/cenik">Ceník</Link>
          <Link href="/schedule">Schedule</Link>
          <Link href="/discounts">Discounts</Link>
          <Link href="/faq">FAQ</Link>
        </div>
        <div className="nav-contact">
          <a href="tel:+420734332131" className="btn">
            +420 734 332 131
          </a>
          <a href="https://wa.me/420734332131" className="btn btn-fill">
            WhatsApp
          </a>
        </div>
        <button className="mobile-menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-text">
            <h1>
              Luxusní <em>escort</em>
              <br />v Praze
            </h1>
            <p>
              Diskrétní společnice na nejvyšší úrovni. Ověřené profily, rychlá
              rezervace.
            </p>
            <div className="hero-buttons">
              <a href="#profiles" className="btn btn-fill">
                Zobrazit dívky
              </a>
              <a href="#booking" className="btn">
                Jak rezervovat
              </a>
            </div>
          </div>
          <div className="hero-new">
            <div className="new-label">✦ Nově na webu</div>
            <div className="new-girl-card">
              <div className="new-girl-img">
                <div className="placeholder">FOTO</div>
                <span className="new-badge">NEW</span>
              </div>
              <div className="new-girl-info">
                <div className="new-girl-name">Kristýna</div>
                <div className="new-girl-meta">23 let • 172 cm</div>
                <div className="new-girl-desc">
                  Nová společnice právě přidána do našeho týmu
                </div>
                <Link
                  href="/profily/5"
                  className="btn btn-fill"
                  style={{ marginTop: "1rem", width: "100%", justifyContent: "center", display: "inline-flex" }}
                >
                  Zobrazit profil
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROFILES */}
      <section className="profiles" id="profiles">
        <div className="profiles-header">
          <div>
            <h2 className="section-title">Naše dívky</h2>
            <p className="section-subtitle">
              Vyberte si a kontaktujte nás pro rezervaci
            </p>
          </div>
          <a href="#" className="btn">
            Zobrazit všechny
          </a>
        </div>
        <div className="profiles-grid">
          {girls.map((girl) => (
            <Link key={girl.id} href={`/profily/${girl.id}`} className="profile-card">
              <div className="profile-img">
                <div className="placeholder">FOTO</div>
                {girl.badge && (
                  <div className={`profile-badge ${girl.badge}`}>
                    {girl.badge === "new" && "Nová"}
                    {girl.badge === "top" && "Top recenze"}
                    {girl.badge === "asian" && "Asiatka"}
                  </div>
                )}
              </div>
              <div className="profile-info">
                <div className="profile-name-row">
                  {girl.online && <span className="online-dot"></span>}
                  <span className="profile-name">{girl.name}</span>
                  <span className="profile-time">{girl.time}</span>
                </div>
                <div className="profile-stats">
                  <div className="profile-stat">
                    <span className="profile-stat-value">{girl.age}</span> let
                  </div>
                  <div className="profile-stat">
                    Prsa <span className="profile-stat-value">{girl.breast}</span>
                  </div>
                  <div className="profile-stat">
                    <span className="profile-stat-value">{girl.height}</span> cm
                  </div>
                  <div className="profile-stat">
                    <span className="profile-stat-value">{girl.weight}</span> kg
                  </div>
                </div>
                <div className="profile-location">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {girl.location}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* INFO STRIP */}
      <section className="info-strip">
        <div className="info-strip-inner">
          <div className="info-item">
            <div className="info-icon">✓</div>
            <div className="info-title">Ověřené profily</div>
            <div className="info-text">Aktuální fotky a video u každé dívky</div>
          </div>
          <div className="info-item">
            <div className="info-icon">⚡</div>
            <div className="info-title">Rychlá rezervace</div>
            <div className="info-text">Potvrzení do 5 minut přes WhatsApp</div>
          </div>
          <div className="info-item">
            <div className="info-icon">🔒</div>
            <div className="info-title">Diskrétnost</div>
            <div className="info-text">Soukromé apartmány, bez evidence</div>
          </div>
          <div className="info-item">
            <div className="info-icon">💎</div>
            <div className="info-title">Slevy pro stálé</div>
            <div className="info-text">Věrnostní program a výhodné balíčky</div>
          </div>
        </div>
      </section>

      {/* LOCATIONS */}
      <section className="locations" id="locations">
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 className="section-title">Lokace</h2>
          <p className="section-subtitle">Diskrétní apartmány v centru Prahy</p>
        </div>
        <div className="locations-grid">
          <div className="location-card">
            <div className="location-img"></div>
            <div className="location-content">
              <div className="location-label">Hlavní</div>
              <div className="location-name">Praha 2 — Nové Město</div>
              <div className="location-address">
                5 min od Václavského náměstí
              </div>
              <div className="location-time">10:00 — 22:00</div>
            </div>
          </div>
          <div className="location-card">
            <div className="location-img"></div>
            <div className="location-content">
              <div className="location-label">Nové</div>
              <div className="location-name">Praha 3 — Žižkov</div>
              <div className="location-address">Klidná lokalita, parkování</div>
              <div className="location-time">12:00 — 20:00</div>
            </div>
          </div>
        </div>
      </section>

      {/* BOOKING */}
      <section className="booking" id="booking">
        <div className="booking-inner">
          <h2 className="section-title">Jak rezervovat</h2>
          <p className="section-subtitle">Jednoduchý proces bez komplikací</p>
          <div className="booking-steps">
            <div className="step">
              <div className="step-num">01</div>
              <div className="step-title">Vyberte dívku</div>
              <div className="step-text">
                Prohlédněte si profily a zjistěte dostupnost
              </div>
            </div>
            <div className="step">
              <div className="step-num">02</div>
              <div className="step-title">Kontaktujte nás</div>
              <div className="step-text">WhatsApp, Telegram nebo telefon</div>
            </div>
            <div className="step">
              <div className="step-num">03</div>
              <div className="step-title">Užijte si</div>
              <div className="step-text">Obdržíte adresu a přijďte</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2 className="cta-title">Rezervujte nyní</h2>
        <p className="cta-text">Kontaktujte nás pro okamžité potvrzení</p>
        <div className="cta-buttons">
          <a href="https://wa.me/420734332131" className="cta-btn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
          <a href="https://t.me/lovelygirls_prague" className="cta-btn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
            Telegram
          </a>
          <a href="tel:+420734332131" className="cta-btn">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Zavolat
          </a>
        </div>
      </section>

      {/* FOOTER */}
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
