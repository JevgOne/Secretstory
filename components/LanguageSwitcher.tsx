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
    </div>
  );
}
