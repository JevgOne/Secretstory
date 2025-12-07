import { MetadataRoute } from 'next'
import { db } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://lovelygirls.cz'
  const locales = ['cs', 'en', 'de', 'uk']

  // Fetch active girls
  let girls: any[] = []
  try {
    const result = await db.execute({
      sql: "SELECT slug, updated_at FROM girls WHERE status = 'active' ORDER BY created_at DESC"
    })
    girls = result.rows as any[]
  } catch (error) {
    console.error('Error fetching girls for sitemap:', error)
  }

  // Static pages for each locale
  const staticPages = ['', 'divky', 'cenik', 'faq', 'schedule', 'discounts', 'blog']

  const staticUrls: MetadataRoute.Sitemap = locales.flatMap(locale =>
    staticPages.map(page => ({
      url: `${baseUrl}/${locale}${page ? '/' + page : ''}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: page === '' ? 1.0 : 0.8,
    }))
  )

  // Girl profile pages (high priority for SEO)
  const girlUrls: MetadataRoute.Sitemap = locales.flatMap(locale =>
    girls.map(girl => ({
      url: `${baseUrl}/${locale}/profily/${girl.slug}`,
      lastModified: girl.updated_at ? new Date(girl.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))
  )

  return [...staticUrls, ...girlUrls]
}
