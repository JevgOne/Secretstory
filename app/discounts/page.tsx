"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function DiscountsPage() {
  const discounts = [
    {
      icon: "🌟",
      name: "First Time",
      value: "-200 Kč",
      desc: "Sleva pro nové klienty na první návštěvu. Platí na všechny programy."
    },
    {
      icon: "👯",
      name: "Double Delight",
      value: "-800 Kč",
      desc: "Užijte si zážitek se dvěma dívkami za zvýhodněnou cenu."
    },
    {
      icon: "💝",
      name: "Birthday Treat",
      value: "-500 Kč",
      desc: "Oslavte narozeniny s námi. Ukažte občanku a získejte slevu."
    },
    {
      icon: "🔄",
      name: "Come Back",
      value: "-300 Kč",
      desc: "Sleva na druhou návštěvu do 14 dnů od první."
    },
    {
      icon: "☀️",
      name: "Early Bird",
      value: "-200 Kč",
      desc: "Ranní ptáče. Sleva na návštěvy před 12:00."
    },
    {
      icon: "📅",
      name: "Midweek",
      value: "-150 Kč",
      desc: "Sleva na návštěvy v úterý a ve středu."
    }
  ];

  const loyaltySteps = [
    { num: 3, title: "Bronzová karta", desc: "-5% na každou návštěvu" },
    { num: 5, title: "Stříbrná karta", desc: "-10% na každou návštěvu" },
    { num: 10, title: "Zlatá karta", desc: "-15% na každou návštěvu" },
    { num: 20, title: "VIP karta", desc: "-20% + priority booking" }
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
          <Link href="/schedule">Schedule</Link>
          <Link href="/discounts" className="active">Discounts</Link>
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
        <h1 className="page-title">Discounts</h1>
        <p className="page-subtitle">Speciální nabídky a slevy pro naše klienty. Ušetřete při každé návštěvě.</p>
      </section>

      {/* Featured Offer */}
      <section className="featured">
        <div className="featured-card">
          <div className="featured-content">
            <span className="featured-badge">🎁 Vánoční akce</span>
            <h2>Christmas Special</h2>
            <p>Užijte si vánoční atmosféru s naší speciální nabídkou. 90 minut relaxace včetně sektu a vánočního překvapení.</p>
            <div className="featured-price">
              <span className="featured-old">4 500 Kč</span>
              <span className="featured-new">3 200 Kč</span>
            </div>
            <button className="featured-btn">
              Rezervovat
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="featured-image">PROMO FOTO</div>
        </div>
      </section>

      {/* Discounts Grid */}
      <section className="discounts">
        <h2 className="discounts-title">Aktuální slevy</h2>
        <div className="discounts-grid">
          {discounts.map((discount, i) => (
            <div key={i} className="discount-card">
              <div className="discount-icon">{discount.icon}</div>
              <div className="discount-name">{discount.name}</div>
              <div className="discount-value">{discount.value}</div>
              <p className="discount-desc">{discount.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Loyalty Program */}
      <section className="loyalty">
        <div className="loyalty-inner">
          <h2 className="loyalty-title">Věrnostní program</h2>
          <p className="loyalty-subtitle">Čím víc nás navštívíte, tím víc ušetříte</p>
          <div className="loyalty-steps">
            {loyaltySteps.map((step, i) => (
              <div key={i} className="loyalty-step">
                <div className="loyalty-num">{step.num}</div>
                <div className="loyalty-step-title">{step.title}</div>
                <div className="loyalty-step-desc">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Note */}
      <section className="note">
        <div className="note-box">
          <p className="note-text">
            ⚠️ Slevy nelze kombinovat s jinými akcemi. Pro uplatnění slevy informujte operátora při rezervaci.
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
