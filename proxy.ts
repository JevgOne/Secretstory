import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n';

// Create next-intl middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
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
