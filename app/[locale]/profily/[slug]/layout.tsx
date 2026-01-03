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
      sql: `SELECT name, age, height, weight, bust, bio, nationality, meta_title, meta_description, og_title, og_description, og_image FROM girls WHERE slug = ? AND status = 'active'`,
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

    // If no SEO metadata, return basic info (no noindex)
    if (!girl.meta_title || !girl.meta_description) {
      return {
        title: girl.name,
        description: girl.bio || ''
      }
    }

    // Use custom SEO fields (only when both are filled)
    const title = girl.meta_title
    const description = girl.meta_description
    const ogImage = girl.og_image || '/og-image.jpg'

    const url = `https://www.lovelygirls.cz/${locale}/profily/${slug}`

    // Separate OG title and description
    const ogTitle = girl.og_title || title
    const ogDesc = girl.og_description || description

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
