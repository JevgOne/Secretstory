import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n';

// Create next-intl middleware
// localePrefix: 'always' ensures every locale (including default 'cs') keeps its
// URL prefix. This is critical for SEO — with 'as-needed', /cs was stripped to /
// and then re-negotiated via Accept-Language, causing Googlebot to land on /en.
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true,
});

export default function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url);

  // Exclude admin and manager routes from i18n (they don't need locale prefix)
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/manager') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static')
  ) {
    return;
  }

  // Apply i18n middleware to all other routes
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for:
  // - API routes
  // - Static files (images, fonts, etc.)
  // - Next.js internals
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
