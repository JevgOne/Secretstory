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
          <Link href={`/${locale}/schedule`}>{tNav('schedule')}</Link>
          <Link href={`/${locale}/discounts`} className="active">{tNav('discounts')}</Link>
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
            <button className="featured-btn">
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
