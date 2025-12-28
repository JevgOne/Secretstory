import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params

  const titles: Record<string, string> = {
    cs: 'Naše Dívky - Ověřené Profily | LovelyGirls Prague',
    en: 'Our Girls - Verified Profiles | LovelyGirls Prague',
    de: 'Unsere Mädchen - Verifizierte Profile | LovelyGirls Prag',
    uk: 'Наші Дівчата - Перевірені Профілі | LovelyGirls Прага'
  }

  const descriptions: Record<string, string> = {
    cs: 'Prohlédněte si profily našich ověřených společnic v Praze. Profesionální escort služby, erotická masáž, VIP doprovod. Skutečné fotky, diskrétnost garantována.',
    en: 'Browse verified companion profiles in Prague. Professional escort services, erotic massage, VIP companionship. Real photos, discretion guaranteed.',
    de: 'Durchsuchen Sie verifizierte Begleiterprofile in Prag. Professionelle Escort-Services, erotische Massage, VIP-Begleitung. Echte Fotos, Diskretion garantiert.',
    uk: 'Перегляньте профілі наших перевірених супутниць у Празі. Професійні ескорт-послуги, еротичний масаж. Справжні фото, конфіденційність гарантована.'
  }

  const title = titles[locale] || titles.cs
  const description = descriptions[locale] || descriptions.cs
  const url = `https://www.lovelygirls.cz/${locale}/divky`

  return {
    title,
    description,
    keywords: 'escort praha, erotická masáž praha, VIP escort prague, verified escorts, luxury companions prague, tantra massage',
    authors: [{ name: 'LovelyGirls Prague' }],
    openGraph: {
      title,
      description,
      url,
      siteName: 'LovelyGirls Prague',
      locale: locale,
      type: 'website',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'LovelyGirls Prague - Premium Escort Services'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.jpg']
    },
    alternates: {
      canonical: url,
      languages: {
        'cs': '/cs/divky',
        'en': '/en/divky',
        'de': '/de/divky',
        'uk': '/uk/divky'
      }
    }
  }
}

export default function DivkyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
