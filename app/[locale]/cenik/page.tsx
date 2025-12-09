"use client";

import Link from "next/link";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MobileMenu from '@/components/MobileMenu';

export default function PricingPage() {
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const tFooter = useTranslations('footer');
  const tPricing = useTranslations('pricing');
  const locale = useLocale();
  const pathname = usePathname();

  // Pricing plans from translations
  const pricingPlans = [
    {
      key: "quick_relax",
      duration: tPricing('plans.quick_relax.duration'),
      title: tPricing('plans.quick_relax.title'),
      price: tPricing('plans.quick_relax.price'),
      features: [
        tPricing('plans.quick_relax.features.0'),
        tPricing('plans.quick_relax.features.1'),
        tPricing('plans.quick_relax.features.2')
      ]
    },
    {
      key: "classic_experience",
      duration: tPricing('plans.classic_experience.duration'),
      title: tPricing('plans.classic_experience.title'),
      price: tPricing('plans.classic_experience.price'),
      popular: true,
      features: [
        tPricing('plans.classic_experience.features.0'),
        tPricing('plans.classic_experience.features.1'),
        tPricing('plans.classic_experience.features.2'),
        tPricing('plans.classic_experience.features.3'),
        tPricing('plans.classic_experience.features.4')
      ]
    },
    {
      key: "premium_pleasure",
      duration: tPricing('plans.premium_pleasure.duration'),
      title: tPricing('plans.premium_pleasure.title'),
      price: tPricing('plans.premium_pleasure.price'),
      features: [
        tPricing('plans.premium_pleasure.features.0'),
        tPricing('plans.premium_pleasure.features.1'),
        tPricing('plans.premium_pleasure.features.2'),
        tPricing('plans.premium_pleasure.features.3'),
        tPricing('plans.premium_pleasure.features.4')
      ]
    }
  ];

  // Extras from translations
  const extras = [
    { name: tPricing('extras.nuru_massage.name'), price: tPricing('extras.nuru_massage.price') },
    { name: tPricing('extras.tantra_massage.name'), price: tPricing('extras.tantra_massage.price') },
    { name: tPricing('extras.duo_massage.name'), price: tPricing('extras.duo_massage.price') },
    { name: tPricing('extras.extension_30min.name'), price: tPricing('extras.extension_30min.price') },
    { name: tPricing('extras.prostate_massage.name'), price: tPricing('extras.prostate_massage.price') },
    { name: tPricing('extras.roleplay.name'), price: tPricing('extras.roleplay.price') },
    { name: tPricing('extras.dominance_light.name'), price: tPricing('extras.dominance_light.price') },
    { name: tPricing('extras.foot_fetish.name'), price: tPricing('extras.foot_fetish.price') }
  ];

  // Schema.org structured data
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Erotic Massage",
    "provider": {
      "@type": "LocalBusiness",
      "name": "LovelyGirls Prague",
      "telephone": "+420734332131"
    },
    "areaServed": {
      "@type": "City",
      "name": "Praha"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Massage Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Quick Relax",
            "description": "30 minut - Erotická masáž, společná sprcha, uvolnění na závěr"
          },
          "price": "1500",
          "priceCurrency": "CZK"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Classic Experience",
            "description": "60 minut - Klasická + erotická masáž, body to body, společná sprcha, líbání"
          },
          "price": "2500",
          "priceCurrency": "CZK"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Premium Pleasure",
            "description": "90 minut - Vše z Classic Experience, tantra elementy, delší relaxace, sklenka sektu"
          },
          "price": "3500",
          "priceCurrency": "CZK"
        }
      ]
    }
  };

  return (
    <>
      {/* Schema.org structured data */}
      <Script
        id="pricing-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

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
          <Link href={`/${locale}/cenik`} className="active">{tNav('pricing')}</Link>
          <Link href={`/${locale}/schedule`}>{tNav('schedule')}</Link>
          <Link href={`/${locale}/discounts`}>{tNav('discounts')}</Link>
          <Link href={`/${locale}/faq`}>{tNav('faq')}</Link>
        </div>
        <div className="nav-contact">
          <LanguageSwitcher />
          <a href="tel:+420734332131" className="btn">{tNav('phone')}</a>
          <a href="https://wa.me/420734332131" className="btn btn-fill">{tNav('whatsapp')}</a>
        </div>
        <MobileMenu currentPath={pathname} />
      </nav>

      {/* Page Header */}
      <section className="page-header">
        <h1 className="page-title">{tPricing('title')}</h1>
        <p className="page-subtitle">{tPricing('subtitle')}</p>
      </section>

      {/* Pricing */}
      <section className="pricing">
        <div className="pricing-grid">
          {pricingPlans.map((plan, i) => (
            <div key={i} className={`pricing-card ${plan.popular ? "popular" : ""}`}>
              {plan.popular && <div className="pricing-badge">{tPricing('most_popular')}</div>}
              <div className="pricing-duration">{plan.duration} {tPricing('duration')}</div>
              <div className="pricing-title">{plan.title}</div>
              <div className="pricing-price">
                <span className="pricing-amount">{plan.price}</span>
                <span className="pricing-currency">{tPricing('currency')}</span>
              </div>
              <ul className="pricing-features">
                {plan.features.map((feature, j) => (
                  <li key={j}>{feature}</li>
                ))}
              </ul>
              <button
                className="pricing-btn"
                onClick={() => window.open(`https://wa.me/420734332131?text=${encodeURIComponent(`Zajímá mě: ${plan.title}`)}`, '_blank')}
              >
                {tPricing('reserve')}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Extras */}
      <section className="extras">
        <h2 className="extras-title">{tPricing('extras_title')}</h2>
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
          <div className="note-title">💳 {tPricing('note_title')}</div>
          <p className="note-text">
            {tPricing('note_text')}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div>{tFooter('copyright')} — {tCommon('adults_only')}</div>
        <div className="footer-disclaimer">{tFooter('disclaimer')}</div>
        <div className="footer-links">
          <Link href={`/${locale}/blog`}>{tFooter('blog')}</Link>
          <Link href={`/${locale}/podminky`}>{tFooter('terms')}</Link>
          <Link href={`/${locale}/soukromi`}>{tFooter('privacy')}</Link>
        </div>
      </footer>
    </>
  );
}
