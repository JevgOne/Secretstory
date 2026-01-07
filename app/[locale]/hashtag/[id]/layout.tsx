import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/seo-metadata'

// ISR - Revalidate every 60 seconds for SEO updates
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const { locale, id } = await params
  const pagePath = `/${locale}/hashtag/${id}`

  // Load SEO from database (no fallback - noindex if not in DB)
  const metadata = await generatePageMetadata(pagePath)

  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      languages: {
        'cs': `/cs/hashtag/${id}`,
        'en': `/en/hashtag/${id}`,
        'de': `/de/hashtag/${id}`,
        'uk': `/uk/hashtag/${id}`
      }
    }
  }
}

export default function HashtagLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
