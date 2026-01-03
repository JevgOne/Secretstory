import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/seo-metadata'

// ISR - Revalidate every 60 seconds for SEO updates
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const pagePath = `/${locale}/faq`

  // Fallback defaults if database has no SEO data
  const defaults = {
    cs: {
      title: 'FAQ - Časté otázky | LovelyGirls Prague',
      description: 'Odpovědi na časté otázky o našich službách. Rezervace, platba, diskrétnost, programy. Vše co potřebujete vědět o LovelyGirls Prague.',
      keywords: 'faq escort prague, časté otázky, rezervace escort, platba escort, diskrétnost'
    },
    en: {
      title: 'FAQ - Frequently Asked Questions | LovelyGirls Prague',
      description: 'Answers to frequently asked questions about our services. Booking, payment, discretion, programs. Everything you need to know about LovelyGirls Prague.',
      keywords: 'escort faq prague, frequently asked questions, booking escort, payment'
    },
    de: {
      title: 'FAQ - Häufig gestellte Fragen | LovelyGirls Prag',
      description: 'Antworten auf häufig gestellte Fragen zu unseren Dienstleistungen. Buchung, Zahlung, Diskretion, Programme. Alles über LovelyGirls Prag.',
      keywords: 'escort faq prag, häufig gestellte fragen, buchung escort'
    },
    uk: {
      title: 'FAQ - Часті питання | LovelyGirls Прага',
      description: 'Відповіді на часті питання про наші послуги. Бронювання, оплата, конфіденційність, програми. Все про LovelyGirls Prague.',
      keywords: 'ескорт faq прага, часті питання, бронювання ескорт'
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
        'cs': '/cs/faq',
        'en': '/en/faq',
        'de': '/de/faq',
        'uk': '/uk/faq'
      }
    }
  }
}

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
