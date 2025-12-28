import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/manager/',
          '/girl/',
          '/register/',
        ],
      },
    ],
    sitemap: 'https://www.lovelygirls.cz/sitemap.xml',
  }
}
