import type { Metadata } from "next";
import { Cormorant, DM_Sans } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://lovelygirls.cz'),
  title: {
    default: "LovelyGirls Prague - Premium Escort & Erotic Massage Services",
    template: "%s | LovelyGirls Prague"
  },
  description: "Premium escort services in Prague. Professional companions, erotic massage, VIP services. Verified profiles, discreet, available 24/7. Incall & outcall.",
  keywords: "escort prague, erotic massage prague, VIP escort czech, luxury companions, tantra massage praha, premium escort services",
  authors: [{ name: "LovelyGirls Prague" }],
  creator: "LovelyGirls Prague",
  publisher: "LovelyGirls Prague",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    url: 'https://lovelygirls.cz',
    siteName: 'LovelyGirls Prague',
    title: 'LovelyGirls Prague - Premium Escort & Erotic Massage',
    description: 'Premium escort services in Prague. Verified profiles, professional companions, discreet service available 24/7.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'LovelyGirls Prague - Premium Escort Services'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LovelyGirls Prague - Premium Escort Services',
    description: 'Premium escort services in Prague. Verified profiles, discreet, available 24/7.',
    images: ['/og-image.jpg']
  },
  verification: {
    // Add verification codes when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  alternates: {
    canonical: 'https://lovelygirls.cz',
    languages: {
      'cs': 'https://lovelygirls.cz/cs',
      'en': 'https://lovelygirls.cz/en',
      'de': 'https://lovelygirls.cz/de',
      'uk': 'https://lovelygirls.cz/uk'
    }
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            if (typeof window !== 'undefined') {
              // NUCLEAR STRENGTH - Hide Next.js dev indicators
              const hideNextIndicators = () => {
                // Target ALL fixed positioned elements at bottom-left AND bottom-right
                document.querySelectorAll('body > div').forEach(el => {
                  const style = window.getComputedStyle(el);
                  if (style.position === 'fixed') {
                    const bottom = parseInt(style.bottom) || 0;
                    const left = parseInt(style.left) || 0;
                    const right = parseInt(style.right) || 0;

                    // Check BOTH bottom-left (0-100px) AND bottom-right (0-100px)
                    const isBottomLeft = bottom >= 0 && bottom <= 100 && left >= 0 && left <= 100;
                    const isBottomRight = bottom >= 0 && bottom <= 100 && right >= 0 && right <= 100;

                    if (isBottomLeft || isBottomRight) {
                      // NUCLEAR hiding
                      el.style.display = 'none';
                      el.style.visibility = 'hidden';
                      el.style.opacity = '0';
                      el.style.pointerEvents = 'none';
                      el.style.width = '0';
                      el.style.height = '0';
                      el.style.transform = 'scale(0)';
                      el.style.zIndex = '-9999';
                      el.style.position = 'absolute';
                      el.style.left = '-9999px';
                      el.style.top = '-9999px';
                      el.remove(); // Just remove it entirely
                    }
                  }
                });

                // Also target by common Next.js attributes
                const selectors = [
                  '[id*="next"]',
                  '[class*="next-dev"]',
                  'button[title*="Next"]',
                  'button[aria-label*="Next"]',
                  'svg[aria-label*="Next"]'
                ];

                selectors.forEach(selector => {
                  document.querySelectorAll(selector).forEach(el => {
                    const parent = el.parentElement;
                    if (parent && parent.style.position === 'fixed') {
                      parent.remove();
                    }
                    el.remove();
                  });
                });
              };

              // Run immediately
              hideNextIndicators();

              // Run after DOM loads
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', hideNextIndicators);
              }

              // Run AGGRESSIVELY every 100ms
              setInterval(hideNextIndicators, 100);

              // ALSO keep watching for new elements
              const observer = new MutationObserver(hideNextIndicators);
              observer.observe(document.documentElement, { childList: true, subtree: true });
            }
          `
        }} />
      </head>
      <body className={`${cormorant.variable} ${dmSans.variable} antialiased`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
