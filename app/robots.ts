import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Google and major search engines - full access with rate limiting
      {
        userAgent: ['Googlebot', 'Googlebot-Image', 'Googlebot-Mobile'],
        allow: '/',
        disallow: [
          '/admin/',
          '/*/join',
          '/cs/join',
          '/en/join',
          '/de/join',
          '/uk/join',
        ],
        crawlDelay: 0,
      },
      // Bing
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/admin/',
          '/*/join',
          '/cs/join',
          '/en/join',
          '/de/join',
          '/uk/join',
        ],
        crawlDelay: 0,
      },
      // Yandex
      {
        userAgent: 'Yandex',
        allow: '/',
        disallow: [
          '/admin/',
          '/*/join',
          '/cs/join',
          '/en/join',
          '/de/join',
          '/uk/join',
        ],
        crawlDelay: 1,
      },
      // Social media bots - allow for link previews
      {
        userAgent: ['facebookexternalhit', 'Twitterbot', 'LinkedInBot', 'WhatsApp'],
        allow: '/',
        disallow: [
          '/admin/',
        ],
      },
      // Bad bots and aggressive crawlers - block completely
      {
        userAgent: [
          'SemrushBot',
          'AhrefsBot',
          'MJ12bot',
          'DotBot',
          'BLEXBot',
          'DataForSeoBot',
        ],
        disallow: '/',
      },
      // All other bots - limited access with crawl delay
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/*/join',
          '/cs/join',
          '/en/join',
          '/de/join',
          '/uk/join',
        ],
        crawlDelay: 2,
      },
    ],
    sitemap: 'https://www.lovelygirls.cz/sitemap.xml',
    host: 'https://www.lovelygirls.cz',
  }
}
