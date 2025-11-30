import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

export const locales = ['cs', 'en', 'de', 'uk'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'cs';

export const localeNames: Record<Locale, string> = {
  cs: 'Čeština',
  en: 'English',
  de: 'Deutsch',
  uk: 'Українська',
};

// Import all messages statically to avoid dynamic import issues in Edge Runtime
import csMessages from './messages/cs.json';
import enMessages from './messages/en.json';
import deMessages from './messages/de.json';
import ukMessages from './messages/uk.json';

const messages = {
  cs: csMessages,
  en: enMessages,
  de: deMessages,
  uk: ukMessages,
};

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: messages[locale as Locale],
  };
});
