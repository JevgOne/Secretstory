import { Metadata } from 'next';
import { db } from '@/lib/db';

interface SEOData {
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  og_type?: string;
  twitter_card?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  canonical_url?: string;
  robots_index?: boolean;
  robots_follow?: boolean;
}

/**
 * Fetch SEO metadata from database for a given page path
 */
export async function getSEOMetadata(pagePath: string): Promise<SEOData | null> {
  try {
    const result = await db.execute({
      sql: 'SELECT * FROM seo_metadata WHERE page_path = ? LIMIT 1',
      args: [pagePath]
    });

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0] as SEOData;
  } catch (error) {
    console.error('Error fetching SEO metadata:', error);
    return null;
  }
}

/**
 * Generate Next.js Metadata object from database SEO data
 * Returns noindex if no SEO data found in database
 */
export async function generatePageMetadata(pagePath: string): Promise<Metadata> {
  const seoData = await getSEOMetadata(pagePath);

  // If no SEO data in database -> return empty (no noindex)
  if (!seoData || !seoData.meta_title || !seoData.meta_description) {
    return {
      title: '',
      description: ''
    };
  }

  // Use database SEO data
  const title = seoData.meta_title;
  const description = seoData.meta_description;
  const keywords = seoData.meta_keywords;
  const ogImage = seoData.og_image || 'https://www.lovelygirls.cz/og-image.jpg';
  const canonicalUrl = seoData.canonical_url || `https://www.lovelygirls.cz${pagePath}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title: seoData.og_title || title,
      description: seoData.og_description || description,
      url: canonicalUrl,
      siteName: 'LovelyGirls Prague',
      type: (seoData.og_type as any) || 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: (seoData.twitter_card as any) || 'summary_large_image',
      title: seoData.twitter_title || title,
      description: seoData.twitter_description || description,
      images: [seoData.twitter_image || ogImage]
    },
    robots: {
      index: seoData.robots_index !== false,
      follow: seoData.robots_follow !== false,
      googleBot: {
        index: seoData.robots_index !== false,
        follow: seoData.robots_follow !== false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    }
  };
}

/**
 * Get default SEO values by locale
 */
export function getDefaultSEO(locale: string) {
  const defaults: Record<string, { title: string; description: string; keywords: string }> = {
    cs: {
      title: 'Luxusní Escort Praha | Ověřené Dívky | LovelyGirls',
      description: 'Prémiové escort služby v Praze. Ověřené profily, diskrétní setkání, rychlá rezervace přes WhatsApp. Elegantní společnice pro náročné gentlemany.',
      keywords: 'escort praha, escort služby praha, luxusní escort, ověřené dívky, společnice praha, diskrétní escort'
    },
    en: {
      title: 'Luxury Escort Prague | Verified Girls | LovelyGirls',
      description: 'Premium escort services in Prague. Verified profiles, discreet meetings, fast booking via WhatsApp. Elegant companions for discerning gentlemen.',
      keywords: 'escort prague, escort services prague, luxury escort, verified girls, companions prague, discreet escort'
    },
    de: {
      title: 'Luxus-Escort Prag | Verifizierte Mädchen | LovelyGirls',
      description: 'Premium-Escort-Services in Prag. Verifizierte Profile, diskrete Treffen, schnelle Buchung über WhatsApp. Elegante Begleiterinnen für anspruchsvolle Gentlemen.',
      keywords: 'escort prag, escort-services prag, luxus-escort, verifizierte mädchen, begleiterinnen prag'
    },
    uk: {
      title: 'Люксовий Ескорт Прага | Перевірені Дівчата | LovelyGirls',
      description: 'Преміум ескорт послуги в Празі. Перевірені профілі, дискретні зустрічі, швидке бронювання через WhatsApp. Елегантні супутниці для вимогливих джентльменів.',
      keywords: 'ескорт прага, ескорт послуги прага, люксовий ескорт, перевірені дівчата'
    }
  };

  return defaults[locale] || defaults.cs;
}
