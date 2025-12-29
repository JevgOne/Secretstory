'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      // Build full URL with search params
      const searchString = searchParams.toString()
      let pageUrl = pathname
      if (searchString) {
        pageUrl = pathname + '?' + searchString
      }

      // Send page_view event
      (window as any).gtag('event', 'page_view', {
        page_path: pageUrl,
        page_location: window.location.href,
        page_title: document.title
      })

      console.log('[GA4] Page view tracked:', pageUrl)
    }
  }, [pathname, searchParams, measurementId])

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_path: window.location.pathname + window.location.search,
            send_page_view: true
          });
        `}
      </Script>
    </>
  )
}
