'use client'

import { Suspense } from 'react'
import GoogleAnalytics from './GoogleAnalytics'

export default function GoogleAnalyticsWrapper({ measurementId }: { measurementId: string }) {
  return (
    <Suspense fallback={null}>
      <GoogleAnalytics measurementId={measurementId} />
    </Suspense>
  )
}
