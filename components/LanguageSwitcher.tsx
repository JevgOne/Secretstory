"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { locales, localeNames, type Locale } from '@/i18n';

const flags: Record<Locale, string> = {
  cs: '🇨🇿',
  en: '🇬🇧',
  de: '🇩🇪',
  uk: '🇺🇦',
};

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale() as Locale;

  const switchLocale = (newLocale: Locale) => {
    // Remove current locale from pathname and add new one
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '');
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <div className="language-switcher">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          className={`lang-btn ${currentLocale === locale ? 'active' : ''}`}
          title={localeNames[locale]}
        >
          <span className="flag">{flags[locale]}</span>
          <span className="code">{locale.toUpperCase()}</span>
        </button>
      ))}
      <style jsx>{`
        .language-switcher {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .lang-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          color: #e8e8e8;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .lang-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--wine);
        }
        .lang-btn.active {
          background: var(--wine);
          border-color: var(--wine);
          color: white;
        }
        .flag {
          font-size: 1.1rem;
        }
        .code {
          font-weight: 500;
          font-size: 0.75rem;
        }
        @media (max-width: 768px) {
          .code {
            display: none;
          }
          .lang-btn {
            padding: 6px;
          }
        }
      `}</style>
    </div>
  );
}
