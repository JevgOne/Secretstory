"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

interface MobileMenuProps {
  currentPath?: string;
}

export default function MobileMenu({ currentPath }: MobileMenuProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        className={`mobile-menu-btn ${isOpen ? 'open' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="mobile-menu-backdrop"
          onClick={closeMenu}
        />
      )}

      {/* Menu Panel */}
      <div className={`mobile-menu-panel ${isOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <Link href={`/${locale}`} className="mobile-menu-logo" onClick={closeMenu}>
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
        </div>

        <nav className="mobile-menu-nav">
          <Link
            href={`/${locale}`}
            className={`mobile-menu-link ${currentPath === `/${locale}` ? 'active' : ''}`}
            onClick={closeMenu}
          >
            {t('nav.home')}
          </Link>
          <Link
            href={`/${locale}/divky`}
            className={`mobile-menu-link ${currentPath?.includes('/divky') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            {t('nav.girls')}
          </Link>
          <Link
            href={`/${locale}/cenik`}
            className={`mobile-menu-link ${currentPath?.includes('/cenik') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            {t('nav.pricing')}
          </Link>
          <Link
            href={`/${locale}/schedule`}
            className={`mobile-menu-link ${currentPath?.includes('/schedule') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            {t('nav.schedule')}
          </Link>
          <Link
            href={`/${locale}/discounts`}
            className={`mobile-menu-link ${currentPath?.includes('/discounts') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            {t('nav.discounts')}
          </Link>
          <Link
            href={`/${locale}/faq`}
            className={`mobile-menu-link ${currentPath?.includes('/faq') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            {t('nav.faq')}
          </Link>
        </nav>

        <div className="mobile-menu-footer">
          <div className="mobile-menu-lang">
            <LanguageSwitcher />
          </div>
          <div className="mobile-menu-actions">
            <a href="tel:+420734332131" className="mobile-menu-btn call">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              {t('nav.phone')}
            </a>
            <a href="https://wa.me/420734332131" className="mobile-menu-btn whatsapp">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              {t('nav.whatsapp')}
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Hamburger Button */
        .mobile-menu-btn {
          display: none;
          flex-direction: column;
          justify-content: space-around;
          width: 44px;
          height: 44px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 10px;
          z-index: 101;
        }

        .mobile-menu-btn span {
          width: 24px;
          height: 2px;
          background: var(--white);
          transition: all 0.3s ease;
          border-radius: 2px;
        }

        .mobile-menu-btn.open span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .mobile-menu-btn.open span:nth-child(2) {
          opacity: 0;
        }

        .mobile-menu-btn.open span:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -6px);
        }

        /* Backdrop */
        .mobile-menu-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          z-index: 99;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Menu Panel */
        .mobile-menu-panel {
          position: fixed;
          top: 0;
          right: -100%;
          width: 85%;
          max-width: 400px;
          height: 100vh;
          background: var(--bg);
          z-index: 100;
          transition: right 0.3s ease;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          box-shadow: -4px 0 20px rgba(0, 0, 0, 0.5);
        }

        .mobile-menu-panel.open {
          right: 0;
        }

        .mobile-menu-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .mobile-menu-logo {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 1.3rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #fff;
        }

        .mobile-menu-nav {
          flex: 1;
          padding: 2rem 0;
        }

        .mobile-menu-link {
          display: block;
          padding: 1rem 1.5rem;
          font-size: 1.1rem;
          color: var(--gray);
          transition: all 0.3s;
          border-left: 3px solid transparent;
        }

        .mobile-menu-link:active {
          background: rgba(255, 255, 255, 0.05);
        }

        .mobile-menu-link.active {
          color: var(--white);
          border-left-color: var(--wine);
          background: rgba(139, 41, 66, 0.1);
        }

        .mobile-menu-footer {
          padding: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .mobile-menu-lang {
          margin-bottom: 1rem;
          display: flex;
          justify-content: center;
        }

        .mobile-menu-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .mobile-menu-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.3s;
          min-height: 48px;
        }

        .mobile-menu-btn svg {
          width: 20px;
          height: 20px;
        }

        .mobile-menu-btn.call {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .mobile-menu-btn.call:active {
          background: rgba(59, 130, 246, 0.2);
        }

        .mobile-menu-btn.whatsapp {
          background: var(--green);
          color: white;
          border: 1px solid var(--green);
        }

        .mobile-menu-btn.whatsapp:active {
          background: #1ea84d;
        }

        /* Hide mobile menu elements on desktop */
        @media (min-width: 769px) {
          .mobile-menu-btn,
          .mobile-menu-panel,
          .mobile-menu-backdrop {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: flex;
          }
        }
      `}</style>
    </>
  );
}
