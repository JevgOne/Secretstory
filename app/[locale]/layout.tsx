import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { ToasterProvider } from '@/components/ToasterProvider';
import { Metadata } from 'next';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  const metadataByLocale: Record<string, { title: string; description: string; url: string }> = {
    cs: {
      title: 'Luxusní Escort Praha | Ověřené Dívky | LovelyGirls',
      description: 'Prémiové escort služby v Praze. Ověřené profily, diskrétní setkání, rychlá rezervace přes WhatsApp. Elegantní společnice pro náročné gentlemany.',
      url: 'https://www.eroticreviews.uk/cs'
    },
    en: {
      title: 'Luxury Escort Prague | Verified Girls | LovelyGirls',
      description: 'Premium escort services in Prague. Verified profiles, discreet meetings, fast booking via WhatsApp. Elegant companions for discerning gentlemen.',
      url: 'https://www.eroticreviews.uk/en'
    },
    de: {
      title: 'Luxus-Escort Prag | Verifizierte Mädchen | LovelyGirls',
      description: 'Premium-Escort-Services in Prag. Verifizierte Profile, diskrete Treffen, schnelle Buchung über WhatsApp. Elegante Begleiterinnen für anspruchsvolle Gentlemen.',
      url: 'https://www.eroticreviews.uk/de'
    },
    uk: {
      title: 'Люксовий Ескорт Прага | Перевірені Дівчата | LovelyGirls',
      description: 'Преміум ескорт послуги в Празі. Перевірені профілі, дискретні зустрічі, швидке бронювання через WhatsApp. Елегантні супутниці для вимогливих джентльменів.',
      url: 'https://www.eroticreviews.uk/uk'
    }
  };

  const metadata = metadataByLocale[locale] || metadataByLocale.cs;

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: locale === 'cs'
      ? 'escort praha, escort služby praha, luxusní escort, ověřené dívky, společnice praha, diskrétní escort'
      : locale === 'en'
      ? 'escort prague, escort services prague, luxury escort, verified girls, companions prague, discreet escort'
      : locale === 'de'
      ? 'escort prag, escort-services prag, luxus-escort, verifizierte mädchen, begleiterinnen prag'
      : 'ескорт прага, ескорт послуги прага, люксовий ескорт, перевірені дівчата',
    alternates: {
      canonical: metadata.url,
      languages: {
        'cs': 'https://www.eroticreviews.uk/cs',
        'en': 'https://www.eroticreviews.uk/en',
        'de': 'https://www.eroticreviews.uk/de',
        'uk': 'https://www.eroticreviews.uk/uk'
      }
    },
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: metadata.url,
      siteName: 'LovelyGirls Prague',
      locale: locale,
      type: 'website',
      images: [
        {
          url: 'https://www.eroticreviews.uk/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'LovelyGirls Prague - Luxury Escort Services'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
      images: ['https://www.eroticreviews.uk/og-image.jpg']
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
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
