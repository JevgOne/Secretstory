"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MobileMenu from '@/components/MobileMenu';

export default function DiscountsPage() {
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const tFooter = useTranslations('footer');
  const tDiscounts = useTranslations('discounts');
  const locale = useLocale();
  const pathname = usePathname();

  // Generate discounts array from translations
  const discounts = [
    {
      icon: "🌟",
      name: tDiscounts('first_time_name'),
      value: tDiscounts('first_time_value'),
      desc: tDiscounts('first_time_desc')
    },
    {
      icon: "👯",
      name: tDiscounts('double_delight_name'),
      value: tDiscounts('double_delight_value'),
      desc: tDiscounts('double_delight_desc')
    },
    {
      icon: "💝",
      name: tDiscounts('birthday_name'),
      value: tDiscounts('birthday_value'),
      desc: tDiscounts('birthday_desc')
    },
    {
      icon: "🔄",
      name: tDiscounts('come_back_name'),
      value: tDiscounts('come_back_value'),
      desc: tDiscounts('come_back_desc')
    },
    {
      icon: "☀️",
      name: tDiscounts('early_bird_name'),
      value: tDiscounts('early_bird_value'),
      desc: tDiscounts('early_bird_desc')
    },
    {
      icon: "📅",
      name: tDiscounts('midweek_name'),
      value: tDiscounts('midweek_value'),
      desc: tDiscounts('midweek_desc')
    }
  ];

  // Generate loyalty steps array from translations
  const loyaltySteps = [
    {
      num: tDiscounts('loyalty_bronze_num'),
      title: tDiscounts('loyalty_bronze_title'),
      desc: tDiscounts('loyalty_bronze_desc')
    },
    {
      num: tDiscounts('loyalty_silver_num'),
      title: tDiscounts('loyalty_silver_title'),
      desc: tDiscounts('loyalty_silver_desc')
    },
    {
      num: tDiscounts('loyalty_gold_num'),
      title: tDiscounts('loyalty_gold_title'),
      desc: tDiscounts('loyalty_gold_desc')
    },
    {
      num: tDiscounts('loyalty_vip_num'),
      title: tDiscounts('loyalty_vip_title'),
      desc: tDiscounts('loyalty_vip_desc')
    }
  ];

  // Schema.org structured data
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "OfferCatalog",
        "name": tDiscounts('title'),
        "description": tDiscounts('subtitle'),
        "itemListElement": discounts.map((discount, index) => ({
          "@type": "Offer",
          "position": index + 1,
          "name": discount.name,
          "description": discount.desc,
          "discount": discount.value,
          "priceCurrency": "CZK",
          "seller": {
            "@type": "LocalBusiness",
            "name": "LovelyGirls Prague"
          }
        }))
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://lovelygirls.cz/#business",
        "name": "LovelyGirls Prague",
        "url": `https://lovelygirls.cz/${locale}/discounts`,
        "telephone": "+420734332131",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Prague",
          "addressCountry": "CZ"
        },
        "priceRange": "$$$$"
      },
      {
        "@type": "WebPage",
        "@id": `https://lovelygirls.cz/${locale}/discounts#webpage`,
        "url": `https://lovelygirls.cz/${locale}/discounts`,
        "name": tDiscounts('title'),
        "description": tDiscounts('subtitle'),
        "inLanguage": locale,
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://lovelygirls.cz/#website",
          "name": "LovelyGirls Prague",
          "url": "https://lovelygirls.cz"
        }
      }
    ]
  };

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
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
          ovely Girls
        </Link>
        <div className="nav-links">
          <Link href={`/${locale}`}>{tNav('home')}</Link>
          <Link href={`/${locale}/divky`}>{tNav('girls')}</Link>
          <Link href={`/${locale}/cenik`}>{tNav('pricing')}</Link>
          <Link href={`/${locale}/schedule`}>{tNav('schedule')}</Link>
          <Link href={`/${locale}/discounts`} className="active">{tNav('discounts')}</Link>
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
        <h1 className="page-title">{tDiscounts('title')}</h1>
        <p className="page-subtitle">{tDiscounts('subtitle')}</p>
      </section>

      {/* Featured Offer */}
      <section className="featured">
        <div className="featured-card">
          <div className="featured-content">
            <span className="featured-badge">🎁 {tDiscounts('featured_badge')}</span>
            <h2>{tDiscounts('featured_title')}</h2>
            <p>{tDiscounts('featured_desc')}</p>
            <div className="featured-price">
              <span className="featured-old">{tDiscounts('featured_old_price')}</span>
              <span className="featured-new">{tDiscounts('featured_new_price')}</span>
            </div>
            <button
              className="featured-btn"
              onClick={() => window.open('https://wa.me/420734332131?text=' + encodeURIComponent('Zajímá mě speciální nabídka'), '_blank')}
            >
              {tDiscounts('featured_btn')}
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="featured-image">PROMO FOTO</div>
        </div>
      </section>

      {/* Discounts Grid */}
      <section className="discounts">
        <h2 className="discounts-title">{tDiscounts('current_title')}</h2>
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
          <h2 className="loyalty-title">{tDiscounts('loyalty_title')}</h2>
          <p className="loyalty-subtitle">{tDiscounts('loyalty_subtitle')}</p>
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
            ⚠️ {tDiscounts('note')}
          </p>
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
    </>
  );
}
