import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/seo-metadata'

// ISR - Revalidate every 60 seconds for SEO updates
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const pagePath = `/${locale}/discounts`

  // Load SEO from database (no fallback - noindex if not in DB)
  const metadata = await generatePageMetadata(pagePath)

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
