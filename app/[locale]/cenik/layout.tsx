import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/seo-metadata'

// ISR - Revalidate every 60 seconds for SEO updates
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const pagePath = `/${locale}/cenik`

  // Fallback defaults if database has no SEO data
  const defaults = {
    cs: {
      title: 'Ceník - Transparentní ceny | LovelyGirls Prague',
      description: 'Transparentní ceník prémiových služeb v Praze. Od 1500 Kč. Klasická masáž, erotická masáž, tantra. Žádné skryté poplatky. Platba hotově i kartou.',
      keywords: 'ceník escort praha, ceny erotická masáž, tantra masáž praha cena, erotic massage price prague, escort pricing'
    },
    en: {
      title: 'Pricing - Transparent Prices | LovelyGirls Prague',
      description: 'Transparent pricing for premium services in Prague. From 1500 CZK. Classic massage, erotic massage, tantra. No hidden fees. Cash and card payment.',
      keywords: 'escort pricing prague, erotic massage prices, service rates prague'
    },
    de: {
      title: 'Preise - Transparente Preise | LovelyGirls Prag',
      description: 'Transparente Preise für Premium-Dienstleistungen in Prag. Ab 1500 CZK. Klassische Massage, erotische Massage, Tantra. Keine versteckten Gebühren.',
      keywords: 'escort preise prag, erotische massage preise, service tarife prag'
    },
    uk: {
      title: 'Ціни - Прозорі ціни | LovelyGirls Прага',
      description: 'Прозорі ціни на преміум послуги в Празі. Від 1500 крон. Класичний масаж, еротичний масаж, тантра. Без прихованих платежів.',
      keywords: 'ціни ескорт прага, ціни еротичний масаж, тарифи послуг прага'
    }
  }

  const fallback = defaults[locale as keyof typeof defaults] || defaults.cs

  // Load SEO from database, fallback to defaults
  const metadata = await generatePageMetadata(pagePath, fallback)

  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
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
