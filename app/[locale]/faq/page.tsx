"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MobileMenu from '@/components/MobileMenu';

// WhatsApp Icon
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const tFooter = useTranslations('footer');
  const tFaq = useTranslations('faq');
  const locale = useLocale();
  const pathname = usePathname();
  const [activeCategory, setActiveCategory] = useState("all");
  const [openItems, setOpenItems] = useState<number[]>([0]); // První otázka otevřená

  // Load FAQ items from translations
  const faqKeys = [
    'booking_how',
    'booking_advance',
    'payment_methods',
    'discretion_how',
    'services_included',
    'booking_cancel',
    'discretion_location',
    'services_couples'
  ];

  const faqs: FAQItem[] = faqKeys.map(key => ({
    question: tFaq(`items.${key}.question`),
    answer: tFaq(`items.${key}.answer`),
    category: tFaq(`items.${key}.category`)
  }));

  const categories = [
    { key: "all", label: tFaq('category_all') },
    { key: "booking", label: tFaq('category_booking') },
    { key: "services", label: tFaq('category_services') },
    { key: "payment", label: tFaq('category_payment') },
    { key: "discretion", label: tFaq('category_discretion') }
  ];

  const filteredFAQs = activeCategory === "all"
    ? faqs
    : faqs.filter(faq => faq.category === activeCategory);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? [] // Close if already open (accordion behavior)
        : [index] // Open only this one
    );
  };

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
          <Link href={`/${locale}/discounts`}>{tNav('discounts')}</Link>
          <Link href={`/${locale}/faq`} className="active">{tNav('faq')}</Link>
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
        <h1 className="page-title">{tFaq('title')}</h1>
        <p className="page-subtitle">{tFaq('subtitle')}</p>
      </section>

      {/* FAQ Section */}
      <section className="faq">
        {/* Categories */}
        <div className="faq-categories">
          {categories.map((cat) => (
            <button
              key={cat.key}
              className={`faq-cat ${activeCategory === cat.key ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Grid */}
        <div className="faq-grid">
          {filteredFAQs.map((faq, i) => (
            <div key={i} className={`faq-item ${openItems.includes(i) ? "open" : ""}`}>
              <button className="faq-question" onClick={() => toggleItem(i)}>
                {faq.question}
                <span className="faq-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                </span>
              </button>
              <div className="faq-answer">
                <div className="faq-answer-inner">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="contact-cta">
        <div className="contact-inner">
          <h2 className="contact-title">{tFaq('contact_title')}</h2>
          <p className="contact-subtitle">{tFaq('contact_subtitle')}</p>
          <div className="contact-buttons">
            <a href="https://wa.me/420734332131" className="contact-btn whatsapp">
              <WhatsAppIcon />
              {tNav('whatsapp')}
            </a>
            <a href="tel:+420734332131" className="contact-btn phone">
              <Phone size={20} />
              {tNav('phone')}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div>{tFooter('copyright')} — {tCommon('adults_only')}</div>
        <div className="footer-links">
          <Link href={`/${locale}/podminky`}>{tFooter('terms')}</Link>
          <Link href={`/${locale}/soukromi`}>{tFooter('privacy')}</Link>
        </div>
      </footer>
    </>
  );
}
