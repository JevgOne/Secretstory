import type { Metadata } from "next";
import { Cormorant, DM_Sans } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import GoogleAnalytics from "@/components/GoogleAnalytics";

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
  metadataBase: new URL('https://www.lovelygirls.cz'),
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
    url: 'https://www.lovelygirls.cz',
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
    // Add your Google Search Console verification code here
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    // yandex: 'your-yandex-verification-code', // Optional: Yandex verification
  },
  alternates: {
    canonical: 'https://www.lovelygirls.cz',
    languages: {
      'cs': 'https://www.lovelygirls.cz/cs',
      'en': 'https://www.lovelygirls.cz/en',
      'de': 'https://www.lovelygirls.cz/de',
      'uk': 'https://www.lovelygirls.cz/uk'
    }
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/apple-icon.svg', type: 'image/svg+xml' }
    ],
    shortcut: ['/icon.svg']
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
        {/* Preconnect to external domains for faster resource loading */}
        <link rel="dns-prefetch" href="https://qktyf1ozcve7804i.public.blob.vercel-storage.com" />
        <link rel="preconnect" href="https://qktyf1ozcve7804i.public.blob.vercel-storage.com" crossOrigin="anonymous" />

        {/* Google Analytics */}
        <GoogleAnalytics measurementId="G-W4W24CVL1L" />
      </head>
      <body className={`${cormorant.variable} ${dmSans.variable} antialiased`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
