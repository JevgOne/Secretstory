import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n';

// Paths that existed in the old WordPress site (without locale prefix)
const LEGACY_PATHS = [
  'schedule', 'divky', 'cenik', 'faq', 'blog',
  'sluzby', 'podminky', 'soukromi', 'discounts', 'recenze',
  'praktiky', 'profily', 'hashtag'
];

// Create next-intl middleware
// localePrefix: 'always' ensures every locale (including default 'cs') keeps its
// URL prefix. This is critical for SEO — with 'as-needed', /cs was stripped to /
// and then re-negotiated via Accept-Language, causing Googlebot to land on /en.
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  // Disable automatic locale detection — we handle it ourselves below
  // to ensure /cs is the default for lovelygirls.cz (Czech business)
  localeDetection: false,
});

/**
 * Parse Accept-Language header and return the best matching locale.
 * Returns 'cs' (default) if no supported language is found.
 */
function detectLocaleFromHeader(request: NextRequest): string {
  const acceptLang = request.headers.get('accept-language');
  if (!acceptLang) return defaultLocale;

  // Parse Accept-Language: "en-US,en;q=0.9,cs;q=0.8,de;q=0.7"
  const languages = acceptLang
    .split(',')
    .map(part => {
      const [lang, q] = part.trim().split(';q=');
      return {
        lang: lang.trim().split('-')[0].toLowerCase(), // "en-US" -> "en"
        quality: q ? parseFloat(q) : 1.0
      };
    })
    .sort((a, b) => b.quality - a.quality);

  // Find the first matching locale
  for (const { lang } of languages) {
    if (locales.includes(lang as any)) {
      return lang;
    }
  }

  return defaultLocale; // Default to Czech
}

export default function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url);

  // ─── Exclude non-page routes ───────────────────────────────────
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/manager') ||
    pathname.startsWith('/girl') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/test')
  ) {
    return;
  }

  // ─── 301: Old WordPress URLs with post_type=slecny ─────────────
  const url = new URL(request.url);
  if (url.searchParams.get('post_type') === 'slecny') {
    return NextResponse.redirect(new URL('/cs/divky', request.url), 301);
  }

  // ─── 301: Legacy paths without locale prefix ───────────────────
  // e.g. /divky -> /cs/divky, /schedule -> /cs/schedule
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0] || '';
  const isLocalePrefix = locales.includes(firstSegment as any);

  if (!isLocalePrefix && firstSegment && LEGACY_PATHS.includes(firstSegment)) {
    const newPath = `/cs${pathname}`;
    return NextResponse.redirect(new URL(newPath, request.url), 301);
  }

  // ─── Root path: detect locale from Accept-Language ─────────────
  // For the root path (/), redirect to the detected locale
  // Default is /cs for Czech business — only override for explicit matches
  if (pathname === '/') {
    const detectedLocale = detectLocaleFromHeader(request);
    return NextResponse.redirect(new URL(`/${detectedLocale}`, request.url), 302);
  }

  // ─── Apply next-intl middleware for all other routes ────────────
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for:
  // - API routes
  // - Static files (images, fonts, etc.)
  // - Next.js internals
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
