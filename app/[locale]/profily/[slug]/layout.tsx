import { Metadata } from 'next'
import { db } from '@/lib/db'

// ISR - Revalidate every 60 seconds for SEO updates
export const revalidate = 60;

interface ProfileLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { slug, locale } = await params

  try {
    const result = await db.execute({
      sql: `SELECT
        name, age, height, weight, bust, bio, nationality,
        meta_title, meta_description, og_title, og_description, og_image,
        meta_title_cs, meta_title_en, meta_title_de, meta_title_uk,
        meta_description_cs, meta_description_en, meta_description_de, meta_description_uk,
        og_title_cs, og_title_en, og_title_de, og_title_uk,
        og_description_cs, og_description_en, og_description_de, og_description_uk
      FROM girls WHERE slug = ? AND status = 'active'`,
      args: [slug]
    })

    const girl = result.rows[0] as any

    if (!girl) {
      return {
        title: 'Profile Not Found',
        description: 'This profile is not available.',
        robots: 'noindex, nofollow'
      }
    }

    // Get language-specific fields with fallback chain
    const getLocalizedField = (fieldPrefix: string) => {
      const localeField = girl[`${fieldPrefix}_${locale}`]
      const genericField = girl[fieldPrefix]
      return localeField || genericField
    }

    const title = getLocalizedField('meta_title') || girl.name
    const description = getLocalizedField('meta_description') || girl.bio || ''
    const ogTitle = getLocalizedField('og_title') || title
    const ogDesc = getLocalizedField('og_description') || description

    const url = `https://www.lovelygirls.cz/${locale}/profily/${slug}`

    // Build OpenGraph config
    const openGraphConfig: any = {
      title: ogTitle,
      description: ogDesc,
      url,
      siteName: 'LovelyGirls Prague',
      locale: locale,
      type: 'profile'
    }

    // Only set custom image if specified in database, otherwise Next.js uses opengraph-image.tsx
    if (girl.og_image) {
      openGraphConfig.images = [
        {
          url: girl.og_image,
          width: 1200,
          height: 630,
          alt: `${girl.name} - Premium Escort Prague`
        }
      ]
    }

    return {
      title,
      description,
      keywords: `${girl.name}, escort prague, premium escort, ${girl.nationality} escort, erotic massage prague, VIP escort czech`,
      authors: [{ name: 'LovelyGirls Prague' }],
      openGraph: openGraphConfig,
      twitter: {
        card: 'summary_large_image',
        title: ogTitle,
        description: ogDesc,
        // Don't specify images for Twitter either if no custom og_image
        ...(girl.og_image && { images: [girl.og_image] })
      },
      alternates: {
        canonical: url,
        languages: {
          'cs': `/cs/profily/${slug}`,
          'en': `/en/profily/${slug}`,
          'de': `/de/profily/${slug}`,
          'uk': `/uk/profily/${slug}`
        }
      }
    }
  } catch (error) {
    console.error('Error generating metadata for girl profile:', error)
    return {
      title: 'LovelyGirls Prague - Premium Escort Services',
      description: 'Premium escort services in Prague'
    }
  }
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return <>{children}</>
}
