import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params

  const titles: Record<string, string> = {
    cs: 'Rozvrh - Dostupnost dívek | LovelyGirls Prague',
    en: 'Schedule - Girls Availability | LovelyGirls Prague',
    de: 'Zeitplan - Verfügbarkeit der Mädchen | LovelyGirls Prag',
    uk: 'Розклад - Доступність дівчат | LovelyGirls Прага'
  }

  const descriptions: Record<string, string> = {
    cs: 'Aktuální dostupnost našich dívek. Živý rozvrh, aktualizovaný v reálném čase. Rezervujte si termín s vaší preferovanou společnicí v Praze.',
    en: 'Current availability of our girls. Live schedule updated in real-time. Book an appointment with your preferred companion in Prague.',
    de: 'Aktuelle Verfügbarkeit unserer Mädchen. Live-Zeitplan in Echtzeit aktualisiert. Buchen Sie einen Termin mit Ihrer bevorzugten Begleiterin in Prag.',
    uk: 'Поточна доступність наших дівчат. Розклад оновлюється в реальному часі. Забронюйте зустріч з вашою улюбленою супутницею в Празі.'
  }

  const title = titles[locale] || titles.cs
  const description = descriptions[locale] || descriptions.cs
  const url = `https://lovelygirls.cz/${locale}/schedule`

  return {
    title,
    description,
    keywords: 'dostupnost escort praha, rozvrh escort, booking escort prague, available girls prague',
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
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: url,
      languages: {
        'cs': '/cs/schedule',
        'en': '/en/schedule',
        'de': '/de/schedule',
        'uk': '/uk/schedule'
      }
    }
  }
}

export default function ScheduleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
