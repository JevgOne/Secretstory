import type { Metadata } from "next";
import { Cormorant, DM_Sans } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import GoogleAnalyticsWrapper from "@/components/GoogleAnalyticsWrapper";

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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'google-site-verification',
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
        {/* Favicon */}
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-icon.svg" />
        {/* Preconnect to external domains for faster resource loading */}
        <link rel="dns-prefetch" href="https://qktyf1ozcve7804i.public.blob.vercel-storage.com" />
        <link rel="preconnect" href="https://qktyf1ozcve7804i.public.blob.vercel-storage.com" crossOrigin="anonymous" />
      </head>
      <body className={`${cormorant.variable} ${dmSans.variable} antialiased`}>
        {/* Google Analytics */}
        <GoogleAnalyticsWrapper measurementId="G-W4W24CVL1L" />
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
