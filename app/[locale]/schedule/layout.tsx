import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/seo-metadata'

// ISR - Revalidate every 60 seconds for SEO updates
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const pagePath = `/${locale}/schedule`

  // Fallback defaults if database has no SEO data
  const defaults = {
    cs: {
      title: 'Rozvrh - Dostupnost dívek | LovelyGirls Prague',
      description: 'Aktuální dostupnost našich dívek. Živý rozvrh, aktualizovaný v reálném čase. Rezervujte si termín s vaší preferovanou společnicí v Praze.',
      keywords: 'dostupnost escort praha, rozvrh escort, booking escort prague, available girls prague'
    },
    en: {
      title: 'Schedule - Girls Availability | LovelyGirls Prague',
      description: 'Current availability of our girls. Live schedule updated in real-time. Book an appointment with your preferred companion in Prague.',
      keywords: 'escort availability prague, escort schedule, booking escort prague, available girls prague'
    },
    de: {
      title: 'Zeitplan - Verfügbarkeit der Mädchen | LovelyGirls Prag',
      description: 'Aktuelle Verfügbarkeit unserer Mädchen. Live-Zeitplan in Echtzeit aktualisiert. Buchen Sie einen Termin mit Ihrer bevorzugten Begleiterin in Prag.',
      keywords: 'escort verfügbarkeit prag, escort zeitplan, buchung escort prag'
    },
    uk: {
      title: 'Розклад - Доступність дівчат | LovelyGirls Прага',
      description: 'Поточна доступність наших дівчат. Розклад оновлюється в реальному часі. Забронюйте зустріч з вашою улюбленою супутницею в Празі.',
      keywords: 'доступність ескорт прага, розклад ескорт, бронювання ескорт прага'
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
