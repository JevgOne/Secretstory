import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cache } from '@/lib/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/discounts - Get discounts data for public pages
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lang = searchParams.get('lang') || 'cs';

    // Create cache key
    const cacheKey = `discounts-${lang}`;
    const cached = cache.get(cacheKey, 3600000); // 1 hour cache
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
          'X-Cache': 'HIT'
        }
      });
    }

    // Get all discounts
    const discountsResult = await db.execute(
      'SELECT * FROM discounts WHERE is_active = 1 ORDER BY display_order ASC'
    );

    const discounts = discountsResult.rows.map((discount: any) => ({
      id: discount.id,
      icon: discount.icon,
      discount_type: discount.discount_type,
      discount_value: discount.discount_value,
      is_featured: Boolean(discount.is_featured),
      name: discount[`name_${lang}`] || discount.name_cs,
      description: discount[`description_${lang}`] || discount.description_cs
    }));

    // Get featured discount (if any)
    const featuredDiscount = discounts.find((d: any) => d.is_featured) || null;

    // Get all loyalty tiers
    const loyaltyResult = await db.execute(
      'SELECT * FROM loyalty_tiers ORDER BY display_order ASC'
    );

    const loyalty_tiers = loyaltyResult.rows.map((tier: any) => ({
      id: tier.id,
      visits_required: tier.visits_required,
      discount_percentage: tier.discount_percentage,
      tier_level: tier.tier_level,
      title: tier[`title_${lang}`] || tier.title_cs,
      description: tier[`description_${lang}`] || tier.description_cs
    }));

    const responseData = {
      success: true,
      discounts,
      featured_discount: featuredDiscount,
      loyalty_tiers
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
    console.error('Get discounts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch discounts data' },
      { status: 500 }
    );
  }
}
