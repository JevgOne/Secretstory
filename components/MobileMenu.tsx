"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

interface MobileMenuProps {
  currentPath?: string;
}

export default function MobileMenu({ currentPath }: MobileMenuProps) {
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  console.log('MobileMenu rendered, isOpen:', isOpen);

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
      {isOpen && <div className="mobile-menu-panel open">
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
            {tNav('home')}
          </Link>
          <Link
            href={`/${locale}/divky`}
            className={`mobile-menu-link ${currentPath?.includes('/divky') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            {tNav('girls')}
          </Link>
          <Link
            href={`/${locale}/cenik`}
            className={`mobile-menu-link ${currentPath?.includes('/cenik') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            {tNav('pricing')}
          </Link>
          <Link
            href={`/${locale}/schedule`}
            className={`mobile-menu-link ${currentPath?.includes('/schedule') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            {tNav('schedule')}
          </Link>
          <Link
            href={`/${locale}/discounts`}
            className={`mobile-menu-link ${currentPath?.includes('/discounts') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            {tNav('discounts')}
          </Link>
          <Link
            href={`/${locale}/faq`}
            className={`mobile-menu-link ${currentPath?.includes('/faq') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            {tNav('faq')}
          </Link>
        </nav>

        <div className="mobile-menu-footer">
          <div className="mobile-menu-lang">
            <LanguageSwitcher />
          </div>
          <div className="mobile-menu-actions">
            <a href="https://t.me/+420734332131" className="mobile-contact-btn telegram">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.324-.437.892-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.14.121.099.155.232.171.326.016.095.036.312.02.482z"/>
              </svg>
              {tNav('telegram')}
            </a>
            <a href="https://wa.me/420734332131" className="mobile-contact-btn whatsapp">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              {tNav('whatsapp')}
            </a>
          </div>
        </div>
      </div>}
    </>
  );
}
// Force rebuild
