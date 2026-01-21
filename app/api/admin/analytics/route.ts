import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { db } from '@/lib/db';

// GET /api/admin/analytics - Get analytics statistics
export async function GET(request: NextRequest) {
  const user = await requireAuth(['admin', 'manager'], request);
  if (user instanceof NextResponse) return user;

  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month'; // day, week, month, year

    // Calculate date range based on period
    let startDate = new Date();
    let previousStartDate = new Date();

    switch (period) {
      case 'day':
        startDate.setHours(0, 0, 0, 0);
        previousStartDate = new Date(startDate);
        previousStartDate.setDate(previousStartDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        previousStartDate.setDate(previousStartDate.getDate() - 14);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        previousStartDate.setFullYear(previousStartDate.getFullYear() - 2);
        break;
      case 'month':
      default:
        startDate.setMonth(startDate.getMonth() - 1);
        previousStartDate.setMonth(previousStartDate.getMonth() - 2);
        break;
    }

    const startDateStr = startDate.toISOString();
    const previousStartDateStr = previousStartDate.toISOString();
    const previousEndDateStr = startDate.toISOString();

    // Get click counts by type for current period
    const clicksResult = await db.execute({
      sql: `
        SELECT
          event_type,
          COUNT(*) as count
        FROM analytics_events
        WHERE created_at >= ? AND event_type LIKE 'click_%'
        GROUP BY event_type
      `,
      args: [startDateStr],
    });

    const clicks = {
      call: 0,
      whatsapp: 0,
      sms: 0,
      telegram: 0,
    };

    clicksResult.rows.forEach((row: any) => {
      const type = row.event_type.replace('click_', '');
      if (type in clicks) {
        clicks[type as keyof typeof clicks] = row.count;
      }
    });

    // Get click counts for previous period (for trend calculation)
    const previousClicksResult = await db.execute({
      sql: `
        SELECT
          event_type,
          COUNT(*) as count
        FROM analytics_events
        WHERE created_at >= ? AND created_at < ? AND event_type LIKE 'click_%'
        GROUP BY event_type
      `,
      args: [previousStartDateStr, previousEndDateStr],
    });

    const previousClicks = {
      call: 0,
      whatsapp: 0,
      sms: 0,
      telegram: 0,
    };

    previousClicksResult.rows.forEach((row: any) => {
      const type = row.event_type.replace('click_', '');
      if (type in previousClicks) {
        previousClicks[type as keyof typeof previousClicks] = row.count;
      }
    });

    // Calculate trends
    const calculateTrend = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const clicksWithTrends = {
      call: { count: clicks.call, trend: calculateTrend(clicks.call, previousClicks.call) },
      whatsapp: { count: clicks.whatsapp, trend: calculateTrend(clicks.whatsapp, previousClicks.whatsapp) },
      sms: { count: clicks.sms, trend: calculateTrend(clicks.sms, previousClicks.sms) },
      telegram: { count: clicks.telegram, trend: calculateTrend(clicks.telegram, previousClicks.telegram) },
    };

    // Get total profile views
    const profileViewsResult = await db.execute({
      sql: `
        SELECT COUNT(*) as count
        FROM analytics_events
        WHERE created_at >= ? AND event_type = 'profile_view'
      `,
      args: [startDateStr],
    });
    const totalProfileViews = (profileViewsResult.rows[0] as any)?.count || 0;

    // Get previous period profile views
    const prevProfileViewsResult = await db.execute({
      sql: `
        SELECT COUNT(*) as count
        FROM analytics_events
        WHERE created_at >= ? AND created_at < ? AND event_type = 'profile_view'
      `,
      args: [previousStartDateStr, previousEndDateStr],
    });
    const prevProfileViews = (prevProfileViewsResult.rows[0] as any)?.count || 0;

    // Get unique visitors count
    const uniqueVisitorsResult = await db.execute({
      sql: `
        SELECT COUNT(DISTINCT visitor_id) as count
        FROM analytics_events
        WHERE created_at >= ?
      `,
      args: [startDateStr],
    });
    const uniqueVisitors = (uniqueVisitorsResult.rows[0] as any)?.count || 0;

    // Get top visited profiles
    const topProfilesResult = await db.execute({
      sql: `
        SELECT
          ae.girl_id,
          g.name,
          g.slug,
          COUNT(*) as views
        FROM analytics_events ae
        JOIN girls g ON ae.girl_id = g.id
        WHERE ae.created_at >= ? AND ae.event_type = 'profile_view' AND ae.girl_id IS NOT NULL
        GROUP BY ae.girl_id, g.name, g.slug
        ORDER BY views DESC
        LIMIT 10
      `,
      args: [startDateStr],
    });

    const topProfiles = topProfilesResult.rows.map((row: any) => ({
      id: row.girl_id,
      name: row.name,
      slug: row.slug,
      views: row.views,
    }));

    // Get traffic sources from referrer
    const sourcesResult = await db.execute({
      sql: `
        SELECT
          CASE
            WHEN referrer IS NULL OR referrer = '' THEN 'direct'
            WHEN referrer LIKE '%google%' THEN 'google'
            WHEN referrer LIKE '%seznam%' THEN 'seznam'
            WHEN referrer LIKE '%bing%' THEN 'bing'
            WHEN referrer LIKE '%facebook%' OR referrer LIKE '%fb.%' THEN 'facebook'
            WHEN referrer LIKE '%instagram%' THEN 'instagram'
            WHEN referrer LIKE '%t.me%' OR referrer LIKE '%telegram%' THEN 'telegram'
            WHEN referrer LIKE '%twitter%' OR referrer LIKE '%x.com%' THEN 'twitter'
            ELSE 'referral'
          END as source,
          COUNT(*) as count
        FROM analytics_events
        WHERE created_at >= ?
        GROUP BY source
        ORDER BY count DESC
      `,
      args: [startDateStr],
    });

    const sources = sourcesResult.rows.map((row: any) => ({
      source: row.source,
      count: row.count,
    }));

    // Categorize sources
    const sourceCategories = {
      direct: 0,
      search: 0,
      social: 0,
      referral: 0,
    };

    sources.forEach((s: any) => {
      if (s.source === 'direct') {
        sourceCategories.direct += s.count;
      } else if (['google', 'seznam', 'bing', 'yahoo', 'duckduckgo'].includes(s.source)) {
        sourceCategories.search += s.count;
      } else if (['facebook', 'instagram', 'twitter', 'telegram', 'tiktok'].includes(s.source)) {
        sourceCategories.social += s.count;
      } else {
        sourceCategories.referral += s.count;
      }
    });

    // Get UTM campaign breakdown
    const utmResult = await db.execute({
      sql: `
        SELECT
          utm_source,
          utm_medium,
          utm_campaign,
          COUNT(*) as count
        FROM analytics_events
        WHERE created_at >= ? AND utm_source IS NOT NULL AND utm_source != ''
        GROUP BY utm_source, utm_medium, utm_campaign
        ORDER BY count DESC
        LIMIT 10
      `,
      args: [startDateStr],
    });

    const utmBreakdown = utmResult.rows.map((row: any) => ({
      source: row.utm_source,
      medium: row.utm_medium,
      campaign: row.utm_campaign,
      count: row.count,
    }));

    // Get top referrers
    const referrersResult = await db.execute({
      sql: `
        SELECT
          referrer,
          COUNT(*) as count
        FROM analytics_events
        WHERE created_at >= ? AND referrer IS NOT NULL AND referrer != ''
        GROUP BY referrer
        ORDER BY count DESC
        LIMIT 10
      `,
      args: [startDateStr],
    });

    const topReferrers = referrersResult.rows.map((row: any) => {
      let domain = row.referrer;
      try {
        domain = new URL(row.referrer).hostname;
      } catch {
        // Keep original if not a valid URL
      }
      return {
        referrer: domain,
        fullUrl: row.referrer,
        count: row.count,
      };
    });

    // Get clicks distribution by day/hour for chart
    const clicksDistributionResult = await db.execute({
      sql: `
        SELECT
          strftime('%Y-%m-%d', created_at) as date,
          strftime('%H', created_at) as hour,
          event_type,
          COUNT(*) as count
        FROM analytics_events
        WHERE created_at >= ? AND event_type LIKE 'click_%'
        GROUP BY date, hour, event_type
        ORDER BY date, hour
      `,
      args: [startDateStr],
    });

    // Aggregate by day for the chart
    const dailyClicksMap = new Map<string, { call: number; whatsapp: number; sms: number; telegram: number }>();

    clicksDistributionResult.rows.forEach((row: any) => {
      const date = row.date;
      if (!dailyClicksMap.has(date)) {
        dailyClicksMap.set(date, { call: 0, whatsapp: 0, sms: 0, telegram: 0 });
      }
      const type = row.event_type.replace('click_', '');
      if (type in dailyClicksMap.get(date)!) {
        dailyClicksMap.get(date)![type as keyof typeof clicks] += row.count;
      }
    });

    const dailyClicks = Array.from(dailyClicksMap.entries()).map(([date, counts]) => ({
      date,
      ...counts,
    }));

    return NextResponse.json({
      success: true,
      analytics: {
        clicks: clicksWithTrends,
        profileViews: {
          total: totalProfileViews,
          trend: calculateTrend(totalProfileViews, prevProfileViews),
          uniqueVisitors,
          avgPerProfile: topProfiles.length > 0
            ? Math.round(totalProfileViews / topProfiles.length)
            : 0,
        },
        topProfiles,
        sources: sourceCategories,
        sourcesDetailed: sources,
        utmBreakdown,
        topReferrers,
        dailyClicks,
      },
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání analytics' },
      { status: 500 }
    );
  }
}
