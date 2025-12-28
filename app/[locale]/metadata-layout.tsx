import { Metadata } from 'next'
import { OrganizationSchema, ServiceSchema } from '@/components/StructuredData'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params

  const titles: Record<string, string> = {
    cs: 'LovelyGirls Prague - Prémiové Escort Služby & Erotická Masáž',
    en: 'LovelyGirls Prague - Premium Escort Services & Erotic Massage',
    de: 'LovelyGirls Prag - Premium Escort Service & Erotische Massage',
    uk: 'LovelyGirls Prague - Преміум Ескорт Послуги'
  }

  const descriptions: Record<string, string> = {
    cs: 'Luxusní escort služby a erotická masáž v Praze. Ověřené profily, profesionální společnice, diskrétní služby 24/7. VIP doprovod, tantra masáž.',
    en: 'Luxury escort services and erotic massage in Prague. Verified profiles, professional companions, discreet services 24/7. VIP companionship, tantra massage.',
    de: 'Luxuriöse Escort-Dienste und erotische Massage in Prag. Verifizierte Profile, professionelle Begleiterinnen, diskrete Dienste 24/7.',
    uk: 'Люксові ескорт-послуги та еротичний масаж у Празі. Перевірені профілі, професійні супутниці, конфіденційні послуги 24/7.'
  }

  const title = titles[locale] || titles.cs
  const description = descriptions[locale] || descriptions.cs
  const url = `https://www.lovelygirls.cz/${locale}`

  return {
    title,
    description,
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
    alternates: {
      canonical: url,
      languages: {
        'cs': '/cs',
        'en': '/en',
        'de': '/de',
        'uk': '/uk'
      }
    }
  }
}

export default function HomeMetadataLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  return (
    <>
      <OrganizationSchema />
      <ServiceSchema />
      {children}
    </>
  )
}
