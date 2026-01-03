import { Metadata } from 'next'

// ISR - Revalidate every 60 seconds for SEO updates
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params

  const titles: Record<string, string> = {
    cs: 'Ceník - Transparentní ceny | LovelyGirls Prague',
    en: 'Pricing - Transparent Prices | LovelyGirls Prague',
    de: 'Preise - Transparente Preise | LovelyGirls Prag',
    uk: 'Ціни - Прозорі ціни | LovelyGirls Прага'
  }

  const descriptions: Record<string, string> = {
    cs: 'Transparentní ceník prémiových služeb v Praze. Od 1500 Kč. Klasická masáž, erotická masáž, tantra. Žádné skryté poplatky. Platba hotově i kartou.',
    en: 'Transparent pricing for premium services in Prague. From 1500 CZK. Classic massage, erotic massage, tantra. No hidden fees. Cash and card payment.',
    de: 'Transparente Preise für Premium-Dienstleistungen in Prag. Ab 1500 CZK. Klassische Massage, erotische Massage, Tantra. Keine versteckten Gebühren.',
    uk: 'Прозорі ціни на преміум послуги в Празі. Від 1500 крон. Класичний масаж, еротичний масаж, тантра. Без прихованих платежів.'
  }

  const title = titles[locale] || titles.cs
  const description = descriptions[locale] || descriptions.cs
  const url = `https://www.lovelygirls.cz/${locale}/cenik`

  return {
    title,
    description,
    keywords: 'ceník escort praha, ceny erotická masáž, tantra masáž praha cena, erotic massage price prague, escort pricing',
    authors: [{ name: 'LovelyGirls Prague' }],
    openGraph: {
      title,
      description,
      url,
      siteName: 'LovelyGirls Prague',
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: url,
      languages: {
        'cs': '/cs/cenik',
        'en': '/en/cenik',
        'de': '/de/cenik',
        'uk': '/uk/cenik'
      }
    }
  }
}

export default function CenikLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
