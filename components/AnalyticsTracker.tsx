"use client";

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { getUTMParams } from '@/lib/analytics';

// Store UTM params in sessionStorage for persistence across page loads
function storeUTMParams(): void {
  if (typeof window === 'undefined') return;

  const utmParams = getUTMParams();
  const hasUtm = Object.values(utmParams).some(v => v);

  if (hasUtm) {
    sessionStorage.setItem('utm_params', JSON.stringify(utmParams));
  }
}

// Get stored UTM params
export function getStoredUTMParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};

  try {
    const stored = sessionStorage.getItem('utm_params');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialized = useRef(false);

  useEffect(() => {
    // Store UTM params on first load
    if (!initialized.current) {
      storeUTMParams();
      initialized.current = true;
    }
  }, []);

  useEffect(() => {
    // Check for UTM params on every navigation
    storeUTMParams();
  }, [pathname, searchParams]);

  // This component doesn't render anything
  return null;
}
