import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { ToasterProvider } from '@/components/ToasterProvider';
import { Metadata } from 'next';
import { generatePageMetadata, getDefaultSEO } from '@/lib/seo-metadata';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const pagePath = `/${locale}`;

  // Load SEO from database (no fallback - noindex if not in DB)
  const metadata = await generatePageMetadata(pagePath);

  // Add hreflang alternates
  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      languages: {
        'cs': 'https://www.lovelygirls.cz/cs',
        'en': 'https://www.lovelygirls.cz/en',
        'de': 'https://www.lovelygirls.cz/de',
        'uk': 'https://www.lovelygirls.cz/uk'
      }
    }
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <FavoritesProvider>
        {children}
        <ToasterProvider />
      </FavoritesProvider>
    </NextIntlClientProvider>
  );
}
