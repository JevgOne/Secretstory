"use client";

import Link from "next/link";

export default function PricingPage() {
  const pricingPlans = [
    {
      duration: "30 minut",
      title: "Quick Relax",
      price: "1 500",
      features: [
        "Erotická masáž",
        "Společná sprcha",
        "Uvolnění na závěr"
      ]
    },
    {
      duration: "60 minut",
      title: "Classic Experience",
      price: "2 500",
      popular: true,
      features: [
        "Klasická + erotická masáž",
        "Body to body",
        "Společná sprcha",
        "Líbání",
        "Neomezený happy end"
      ]
    },
    {
      duration: "90 minut",
      title: "Premium Pleasure",
      price: "3 500",
      features: [
        "Vše z Classic Experience",
        "Tantra elementy",
        "Delší relaxace",
        "Sklenka sektu",
        "Bez spěchu"
      ]
    }
  ];

  const extras = [
    { name: "Nuru masáž", price: "+500 Kč" },
    { name: "Tantra masáž", price: "+800 Kč" },
    { name: "Masáž ve dvou", price: "+1 500 Kč" },
    { name: "Prodloužení 30 min", price: "+1 000 Kč" },
    { name: "Prostatová masáž", price: "+500 Kč" },
    { name: "Roleplay", price: "+500 Kč" },
    { name: "Dominance light", price: "+800 Kč" },
    { name: "Foot fetish", price: "+300 Kč" }
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
          <Link href="/cenik" className="active">Ceník</Link>
          <Link href="/schedule">Schedule</Link>
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
        <h1 className="page-title">Ceník</h1>
        <p className="page-subtitle">Transparentní ceny bez skrytých poplatků. Vyberte si program, který vám vyhovuje.</p>
      </section>

      {/* Pricing */}
      <section className="pricing">
        <div className="pricing-grid">
          {pricingPlans.map((plan, i) => (
            <div key={i} className={`pricing-card ${plan.popular ? "popular" : ""}`}>
              {plan.popular && <div className="pricing-badge">Nejoblíbenější</div>}
              <div className="pricing-duration">{plan.duration}</div>
              <div className="pricing-title">{plan.title}</div>
              <div className="pricing-price">
                <span className="pricing-amount">{plan.price}</span>
                <span className="pricing-currency">Kč</span>
              </div>
              <ul className="pricing-features">
                {plan.features.map((feature, j) => (
                  <li key={j}>{feature}</li>
                ))}
              </ul>
              <button className="pricing-btn">Rezervovat</button>
            </div>
          ))}
        </div>
      </section>

      {/* Extras */}
      <section className="extras">
        <h2 className="extras-title">Extra služby</h2>
        <div className="extras-grid">
          {extras.map((extra, i) => (
            <div key={i} className="extra-item">
              <span className="extra-name">{extra.name}</span>
              <span className="extra-price">{extra.price}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Note */}
      <section className="note">
        <div className="note-box">
          <div className="note-title">💳 Platba</div>
          <p className="note-text">
            Přijímáme hotovost i platební karty. Platba probíhá vždy předem na začátku návštěvy.
            Ceny jsou konečné a zahrnují vše uvedené v popisu programu.
          </p>
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
