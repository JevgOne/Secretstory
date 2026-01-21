import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';

// Valid event types
const VALID_EVENT_TYPES = [
  'click_call',
  'click_whatsapp',
  'click_sms',
  'click_telegram',
  'profile_view',
];

// Generate anonymous visitor ID from IP and User-Agent
function generateVisitorId(ip: string, userAgent: string): string {
  const data = `${ip}:${userAgent}`;
  return crypto.createHash('sha256').update(data).digest('hex').substring(0, 32);
}

// POST /api/analytics/track - Record an analytics event
export async function POST(request: NextRequest) {
  try {
    // Get IP address
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor?.split(',')[0]?.trim() || 'unknown';
    const userAgent = request.headers.get('user-agent') || '';

    // Generate anonymous visitor ID
    const visitorId = generateVisitorId(ip, userAgent);

    // Parse request body
    let body;
    const contentType = request.headers.get('content-type');

    if (contentType?.includes('text/plain')) {
      // Handle sendBeacon with blob (comes as text/plain)
      const text = await request.text();
      body = JSON.parse(text);
    } else {
      body = await request.json();
    }

    const {
      event_type,
      girl_id,
      page_url,
      referrer,
      utm_source,
      utm_medium,
      utm_campaign,
    } = body;

    // Validate event type
    if (!event_type || !VALID_EVENT_TYPES.includes(event_type)) {
      return NextResponse.json(
        { error: 'Invalid event type' },
        { status: 400 }
      );
    }

    // Insert event into database
    await db.execute({
      sql: `
        INSERT INTO analytics_events (
          event_type,
          girl_id,
          page_url,
          referrer,
          utm_source,
          utm_medium,
          utm_campaign,
          visitor_id,
          user_agent
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        event_type,
        girl_id || null,
        page_url || null,
        referrer || null,
        utm_source || null,
        utm_medium || null,
        utm_campaign || null,
        visitorId,
        userAgent.substring(0, 500), // Limit user agent length
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    // Return success anyway to not break client-side experience
    return NextResponse.json({ success: true });
  }
}

// Disable body size limit for sendBeacon
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1kb',
    },
  },
};
