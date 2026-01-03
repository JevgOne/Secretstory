import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/seo-metadata'

// ISR - Revalidate every 60 seconds for SEO updates
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const pagePath = `/${locale}/discounts`

  // Fallback defaults if database has no SEO data
  const defaults = {
    cs: {
      title: 'Slevy a Akce - Speciální nabídky | LovelyGirls Prague',
      description: 'Aktuální slevy a speciální nabídky. Ušetřete až 800 Kč. First time sleva, věrnostní program, sezónní akce. LovelyGirls Prague.',
      keywords: 'slevy escort praha, akce escort, discount escort prague, věrnostní program, first time discount'
    },
    en: {
      title: 'Discounts & Promotions - Special Offers | LovelyGirls Prague',
      description: 'Current discounts and special offers. Save up to 800 CZK. First time discount, loyalty program, seasonal promotions. LovelyGirls Prague.',
      keywords: 'escort discounts prague, escort promotions, special offers prague'
    },
    de: {
      title: 'Rabatte & Aktionen - Sonderangebote | LovelyGirls Prag',
      description: 'Aktuelle Rabatte und Sonderangebote. Sparen Sie bis zu 800 CZK. Erstbesucherrabatt, Treueprogramm, saisonale Aktionen. LovelyGirls Prag.',
      keywords: 'escort rabatte prag, escort aktionen, sonderangebote prag'
    },
    uk: {
      title: 'Знижки та Акції - Спеціальні пропозиції | LovelyGirls Прага',
      description: 'Поточні знижки та спеціальні пропозиції. Заощадьте до 800 крон. Знижка для нових клієнтів, програма лояльності. LovelyGirls Prague.',
      keywords: 'знижки ескорт прага, акції ескорт, спеціальні пропозиції прага'
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
