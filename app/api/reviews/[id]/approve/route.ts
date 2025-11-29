import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST /api/reviews/:id/approve - Approve review (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { approved_by } = body;

    if (!approved_by) {
      return NextResponse.json(
        { error: 'Chybí ID schvalovatele' },
        { status: 400 }
      );
    }

    // Update review status to approved
    await db.execute({
      sql: `
        UPDATE reviews
        SET status = 'approved',
            approved_by = ?,
            approved_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      args: [approved_by, parseInt(id)]
    });

    // Get girl_id to update stats
    const reviewResult = await db.execute({
      sql: 'SELECT girl_id FROM reviews WHERE id = ?',
      args: [parseInt(id)]
    });

    if (reviewResult.rows.length > 0) {
      const girlId = reviewResult.rows[0].girl_id;

      // Update girl's review count and average rating
      const statsResult = await db.execute({
        sql: `
          SELECT
            COUNT(*) as count,
            AVG(rating) as avg_rating
          FROM reviews
          WHERE girl_id = ? AND status = 'approved'
        `,
        args: [girlId]
      });

      if (statsResult.rows.length > 0) {
        const stats = statsResult.rows[0];
        await db.execute({
          sql: `
            UPDATE girls
            SET reviews_count = ?,
                rating = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `,
          args: [stats.count, stats.avg_rating || 0, girlId]
        });
      }

      // TODO: Create notification for the girl
      // await createNotification(girl_user_id, 'review_approved', ...)
    }

    return NextResponse.json({
      success: true,
      message: 'Recenze schválena'
    });
  } catch (error) {
    console.error('Approve review error:', error);
    return NextResponse.json(
      { error: 'Chyba při schvalování recenze' },
      { status: 500 }
    );
  }
}

// POST /api/reviews/:id/reject - Reject review (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { approved_by } = body;

    if (!approved_by) {
      return NextResponse.json(
        { error: 'Chybí ID schvalovatele' },
        { status: 400 }
      );
    }

    // Update review status to rejected
    await db.execute({
      sql: `
        UPDATE reviews
        SET status = 'rejected',
            approved_by = ?,
            approved_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      args: [approved_by, parseInt(id)]
    });

    return NextResponse.json({
      success: true,
      message: 'Recenze zamítnuta'
    });
  } catch (error) {
    console.error('Reject review error:', error);
    return NextResponse.json(
      { error: 'Chyba při zamítání recenze' },
      { status: 500 }
    );
  }
}
