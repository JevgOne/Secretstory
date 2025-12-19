import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calculateReviewSummary } from '@/lib/review-constants';

// GET /api/reviews/[girl_id]/summary - Get aggregated review summary
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ girl_id: string }> }
) {
  try {
    const { girl_id } = await params;
    const girlId = parseInt(girl_id);

    if (isNaN(girlId)) {
      return NextResponse.json(
        { error: 'Neplatné ID slečny' },
        { status: 400 }
      );
    }

    // Get approved reviews with vibe and tags
    const result = await db.execute({
      sql: `
        SELECT vibe, tags
        FROM reviews
        WHERE girl_id = ? AND status = 'approved' AND vibe IS NOT NULL
      `,
      args: [girlId]
    });

    if (result.rows.length === 0) {
      return NextResponse.json({
        success: true,
        summary: {
          totalReviews: 0,
          dominantVibe: null,
          vibeDistribution: {
            unforgettable: 0,
            magical: 0,
            great: 0,
            nice: 0,
            meh: 0
          },
          topTags: []
        }
      });
    }

    // Parse tags from JSON strings
    const reviews = result.rows.map((row: any) => ({
      vibe: row.vibe,
      tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : (row.tags || [])
    }));

    const summary = calculateReviewSummary(reviews);

    return NextResponse.json({
      success: true,
      summary
    });
  } catch (error) {
    console.error('Get review summary error:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání souhrnu recenzí' },
      { status: 500 }
    );
  }
}
