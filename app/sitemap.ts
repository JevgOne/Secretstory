import { MetadataRoute } from 'next'
import { db } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.eroticreviews.uk'
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
    girls = []
  }

  // Fetch services
  let services: any[] = []
  try {
    const result = await db.execute({
      sql: "SELECT slug FROM services ORDER BY id"
    })
    services = result.rows as any[]
  } catch (error) {
    console.error('Error fetching services for sitemap:', error)
    services = []
  }

  // Fetch blog posts
  let blogPosts: any[] = []
  try {
    const result = await db.execute({
      sql: "SELECT slug, updated_at FROM blog_posts WHERE status = 'published' ORDER BY created_at DESC"
    })
    blogPosts = result.rows as any[]
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error)
    blogPosts = []
  }

  // Static pages for each locale
  const staticPages = ['', 'divky', 'cenik', 'faq', 'schedule', 'discounts', 'blog', 'sluzby', 'podminky', 'soukromi']

  const staticUrls: MetadataRoute.Sitemap = locales.flatMap(locale =>
    staticPages.map(page => ({
      url: `${baseUrl}/${locale}${page ? '/' + page : ''}`,
      lastModified: new Date(),
      changeFrequency: (page === '' || page === 'divky' || page === 'schedule') ? 'hourly' as const : 'daily' as const,
      priority: page === '' ? 1.0 : page === 'divky' ? 0.9 : 0.7,
    }))
  )

  // Girl profile pages (high priority for SEO)
  const girlUrls: MetadataRoute.Sitemap = locales.flatMap(locale =>
    girls.map(girl => ({
      url: `${baseUrl}/${locale}/profily/${girl.slug}`,
      lastModified: girl.updated_at ? new Date(girl.updated_at) : new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.85,
    }))
  )

  // Service pages
  const serviceUrls: MetadataRoute.Sitemap = locales.flatMap(locale =>
    services.map(service => ({
      url: `${baseUrl}/${locale}/sluzby/${service.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  )

  // Blog pages
  const blogUrls: MetadataRoute.Sitemap = locales.flatMap(locale =>
    blogPosts.map(post => ({
      url: `${baseUrl}/${locale}/blog/${post.slug}`,
      lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }))
  )

  return [...staticUrls, ...girlUrls, ...serviceUrls, ...blogUrls]
}
