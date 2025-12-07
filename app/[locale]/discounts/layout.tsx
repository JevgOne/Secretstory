import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params

  const titles: Record<string, string> = {
    cs: 'Slevy a Akce - Speciální nabídky | LovelyGirls Prague',
    en: 'Discounts & Promotions - Special Offers | LovelyGirls Prague',
    de: 'Rabatte & Aktionen - Sonderangebote | LovelyGirls Prag',
    uk: 'Знижки та Акції - Спеціальні пропозиції | LovelyGirls Прага'
  }

  const descriptions: Record<string, string> = {
    cs: 'Aktuální slevy a speciální nabídky. Ušetřete až 800 Kč. First time sleva, věrnostní program, sezónní akce. LovelyGirls Prague.',
    en: 'Current discounts and special offers. Save up to 800 CZK. First time discount, loyalty program, seasonal promotions. LovelyGirls Prague.',
    de: 'Aktuelle Rabatte und Sonderangebote. Sparen Sie bis zu 800 CZK. Erstbesucherrabatt, Treueprogramm, saisonale Aktionen. LovelyGirls Prag.',
    uk: 'Поточні знижки та спеціальні пропозиції. Заощадьте до 800 крон. Знижка для нових клієнтів, програма лояльності. LovelyGirls Prague.'
  }

  const title = titles[locale] || titles.cs
  const description = descriptions[locale] || descriptions.cs
  const url = `https://lovelygirls.cz/${locale}/discounts`

  return {
    title,
    description,
    keywords: 'slevy escort praha, akce escort, discount escort prague, věrnostní program, first time discount',
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
        'cs': '/cs/discounts',
        'en': '/en/discounts',
        'de': '/de/discounts',
        'uk': '/uk/discounts'
      }
    }
  }
}

export default function DiscountsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
