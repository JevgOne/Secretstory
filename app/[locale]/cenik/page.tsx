"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MobileMenu from '@/components/MobileMenu';
import BottomCTA from '@/components/BottomCTA';

interface PricingPlan {
  id: number;
  duration: number;
  price: number;
  is_popular: boolean;
  title: string;
  features: string[];
}

interface PricingExtra {
  id: number;
  name: string;
  price: number;
}

export default function PricingPage() {
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const tFooter = useTranslations('footer');
  const tPricing = useTranslations('pricing');
  const t = useTranslations('home');
  const locale = useLocale();
  const pathname = usePathname();

  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [extras, setExtras] = useState<PricingExtra[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch pricing data from API
  useEffect(() => {
    async function fetchPricing() {
      try {
        const response = await fetch(`/api/pricing?lang=${locale}`);
        const data = await response.json();
        if (data.success) {
          setPricingPlans(data.plans);
          setExtras(data.extras);
        }
      } catch (error) {
        console.error('Error fetching pricing:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPricing();
  }, [locale]);

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

      {/* Mobile Menu - outside nav for proper z-index */}
      <MobileMenu currentPath={pathname} />

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
          {tCommon('brand_suffix')}
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
          <a href="https://t.me/+420734332131" className="btn">{tNav('telegram')}</a>
          <a href="https://wa.me/420734332131" className="btn btn-fill">{tNav('whatsapp')}</a>
        </div>
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
                onClick={() => window.open(`https://wa.me/420734332131?text=${encodeURIComponent(`${tPricing('whatsapp_inquiry')} ${plan.title}`)}`, '_blank')}
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

      {/* Bottom CTA Bar */}
      <BottomCTA translations={{
        call: t('cta_call'),
        whatsapp: t('cta_whatsapp'),
        telegram: t('cta_telegram'),
        sms: t('cta_sms'),
        branches: t('cta_branches'),
        discounts: t('cta_discounts'),
        whatsapp_warning: t('cta_whatsapp_warning'),
        recommended: t('cta_recommended')
      }} />

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
                {tCommon('brand_suffix')}
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
    </>
  );
}
