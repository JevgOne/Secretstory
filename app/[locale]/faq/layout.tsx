import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params

  const titles: Record<string, string> = {
    cs: 'FAQ - Časté otázky | LovelyGirls Prague',
    en: 'FAQ - Frequently Asked Questions | LovelyGirls Prague',
    de: 'FAQ - Häufig gestellte Fragen | LovelyGirls Prag',
    uk: 'FAQ - Часті питання | LovelyGirls Прага'
  }

  const descriptions: Record<string, string> = {
    cs: 'Odpovědi na časté otázky o našich službách. Rezervace, platba, diskrétnost, programy. Vše co potřebujete vědět o LovelyGirls Prague.',
    en: 'Answers to frequently asked questions about our services. Booking, payment, discretion, programs. Everything you need to know about LovelyGirls Prague.',
    de: 'Antworten auf häufig gestellte Fragen zu unseren Dienstleistungen. Buchung, Zahlung, Diskretion, Programme. Alles über LovelyGirls Prag.',
    uk: 'Відповіді на часті питання про наші послуги. Бронювання, оплата, конфіденційність, програми. Все про LovelyGirls Prague.'
  }

  const title = titles[locale] || titles.cs
  const description = descriptions[locale] || descriptions.cs
  const url = `https://lovelygirls.cz/${locale}/faq`

  return {
    title,
    description,
    keywords: 'faq escort prague, časté otázky, rezervace escort, platba escort, diskrétnost',
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
