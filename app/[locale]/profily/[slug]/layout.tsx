import { Metadata } from 'next'
import { db } from '@/lib/db'

interface ProfileLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { slug, locale } = await params

  try {
    const result = await db.execute({
      sql: `SELECT name, age, height, weight, bust, bio, nationality, meta_title, meta_description, og_image FROM girls WHERE slug = ? AND status = 'active'`,
      args: [slug]
    })

    const girl = result.rows[0] as any

    if (!girl) {
      return {
        title: 'Profile Not Found | LovelyGirls Prague',
        description: 'This profile is not available.',
        robots: 'noindex, nofollow'
      }
    }

    // Use custom SEO fields if available, otherwise fallback to generated defaults
    const title = girl.meta_title || `${girl.name} - ${girl.age} years | Premium Escort Prague | LovelyGirls`
    const description = girl.meta_description || (girl.bio
      ? girl.bio.substring(0, 155) + '...'
      : `Meet ${girl.name}, ${girl.age} years old, ${girl.height}cm. Premium escort services in Prague. Available for incall & outcall. Book now via WhatsApp or call.`)
    const ogImage = girl.og_image || '/og-image.jpg'

    const url = `https://lovelygirls.cz/${locale}/profily/${slug}`

    return {
      title,
      description,
      keywords: `${girl.name}, escort prague, premium escort, ${girl.nationality} escort, erotic massage prague, VIP escort czech`,
      authors: [{ name: 'LovelyGirls Prague' }],
      openGraph: {
        title,
        description,
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
        title,
        description,
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
