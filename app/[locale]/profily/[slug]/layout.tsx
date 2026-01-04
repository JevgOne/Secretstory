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

    // Get primary photo from gallery for automatic OG image
    let primaryPhoto = null
    try {
      const photoResult = await db.execute({
        sql: `SELECT url FROM photos WHERE girl_id = (SELECT id FROM girls WHERE slug = ?) AND is_primary = 1 LIMIT 1`,
        args: [slug]
      })
      if (photoResult.rows[0]) {
        primaryPhoto = (photoResult.rows[0] as any).url
      }
    } catch (error) {
      console.error('Error fetching primary photo:', error)
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
    // Use custom og_image if set, otherwise use primary photo from gallery, finally fallback
    const ogImage = girl.og_image || primaryPhoto || '/og-image.jpg'

    const url = `https://www.lovelygirls.cz/${locale}/profily/${slug}`

    return {
      title,
      description,
      keywords: `${girl.name}, escort prague, premium escort, ${girl.nationality} escort, erotic massage prague, VIP escort czech`,
      authors: [{ name: 'LovelyGirls Prague' }],
      openGraph: {
        title: ogTitle,
        description: ogDesc,
        url,
        siteName: 'LovelyGirls Prague',
        locale: locale,
        type: 'profile',
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: `${girl.name} - Premium Escort Prague`
          }
        ]
      },
      twitter: {
        card: 'summary_large_image',
        title: ogTitle,
        description: ogDesc,
        images: [ogImage]
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
