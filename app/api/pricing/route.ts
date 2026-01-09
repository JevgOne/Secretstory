import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cache } from '@/lib/cache';

// Force dynamic rendering (uses searchParams)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/pricing - Get pricing data for public pages
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lang = searchParams.get('lang') || 'cs';

    // Create cache key
    const cacheKey = `pricing-${lang}`;
    const cached = cache.get(cacheKey, 3600000); // 1 hour cache
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
          'X-Cache': 'HIT'
        }
      });
    }

    // Get all pricing plans with their features
    const plansResult = await db.execute(
      'SELECT * FROM pricing_plans WHERE is_active = 1 ORDER BY display_order ASC'
    );

    const plans = [];
    for (const plan of plansResult.rows) {
      const featuresResult = await db.execute({
        sql: 'SELECT * FROM pricing_plan_features WHERE plan_id = ? ORDER BY display_order ASC',
        args: [plan.id]
      });

      // Map to localized format
      plans.push({
        id: plan.id,
        duration: plan.duration,
        price: plan.price,
        is_popular: Boolean(plan.is_popular),
        title: plan[`title_${lang}`] || plan.title_cs,
        features: featuresResult.rows.map((f: any) => f[`feature_${lang}`] || f.feature_cs)
      });
    }

    // Get all extras
    const extrasResult = await db.execute(
      'SELECT * FROM pricing_extras WHERE is_active = 1 ORDER BY display_order ASC'
    );

    const extras = extrasResult.rows.map((extra: any) => ({
      id: extra.id,
      name: extra[`name_${lang}`] || extra.name_cs,
      price: extra.price
    }));

    const responseData = {
      success: true,
      plans,
      extras
    };

    // Cache the response
    cache.set(cacheKey, responseData);

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        'X-Cache': 'MISS'
      }
    });
  } catch (error) {
    console.error('Get pricing error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pricing data' },
      { status: 500 }
    );
  }
}
