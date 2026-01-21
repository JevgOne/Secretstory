// Analytics event types
export type AnalyticsEventType =
  | 'click_call'
  | 'click_whatsapp'
  | 'click_sms'
  | 'click_telegram'
  | 'profile_view';

export interface AnalyticsEvent {
  event_type: AnalyticsEventType;
  girl_id?: number | null;
  page_url?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

// Get UTM parameters from URL
export function getUTMParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
  };
}

// Track analytics event (client-side)
export async function trackEvent(
  eventType: AnalyticsEventType,
  girlId?: number | null
): Promise<void> {
  try {
    const utmParams = getUTMParams();

    const payload: AnalyticsEvent = {
      event_type: eventType,
      girl_id: girlId,
      page_url: typeof window !== 'undefined' ? window.location.pathname : undefined,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      ...utmParams,
    };

    // Use sendBeacon for better reliability (doesn't block navigation)
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });

    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/track', blob);
    } else {
      // Fallback to fetch
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {
        // Silently fail - analytics should not break user experience
      });
    }
  } catch {
    // Silently fail - analytics should not break user experience
  }
}

// Track click event (shorthand)
export function trackClick(
  type: 'call' | 'whatsapp' | 'sms' | 'telegram',
  girlId?: number | null
): void {
  const eventType = `click_${type}` as AnalyticsEventType;
  trackEvent(eventType, girlId);
}

// Track profile view
export function trackProfileView(girlId: number): void {
  trackEvent('profile_view', girlId);
}

// Parse referrer to get source category
export function parseReferrerSource(referrer: string | null): string {
  if (!referrer) return 'direct';

  try {
    const url = new URL(referrer);
    const hostname = url.hostname.toLowerCase();

    // Search engines
    if (hostname.includes('google')) return 'google';
    if (hostname.includes('bing')) return 'bing';
    if (hostname.includes('yahoo')) return 'yahoo';
    if (hostname.includes('duckduckgo')) return 'duckduckgo';
    if (hostname.includes('seznam')) return 'seznam';

    // Social media
    if (hostname.includes('facebook') || hostname.includes('fb.')) return 'facebook';
    if (hostname.includes('instagram')) return 'instagram';
    if (hostname.includes('twitter') || hostname.includes('x.com')) return 'twitter';
    if (hostname.includes('tiktok')) return 'tiktok';
    if (hostname.includes('reddit')) return 'reddit';

    // Messaging
    if (hostname.includes('t.me') || hostname.includes('telegram')) return 'telegram';
    if (hostname.includes('whatsapp')) return 'whatsapp';

    return 'referral';
  } catch {
    return 'direct';
  }
}

// Group referrer sources for reporting
export function getSourceCategory(source: string): string {
  const searchEngines = ['google', 'bing', 'yahoo', 'duckduckgo', 'seznam'];
  const socialMedia = ['facebook', 'instagram', 'twitter', 'tiktok', 'reddit'];
  const messaging = ['telegram', 'whatsapp'];

  if (source === 'direct') return 'Direct';
  if (searchEngines.includes(source)) return 'Search';
  if (socialMedia.includes(source)) return 'Social';
  if (messaging.includes(source)) return 'Messaging';
  return 'Referral';
}
