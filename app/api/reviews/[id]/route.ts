import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth-helpers';

// GET /api/reviews/:id - Get single review
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await db.execute({
      sql: `
        SELECT
          r.*,
          g.name as girl_name,
          g.color as girl_color
        FROM reviews r
        LEFT JOIN girls g ON r.girl_id = g.id
        WHERE r.id = ?
      `,
      args: [parseInt(id)]
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Recenze nenalezena' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      review: result.rows[0]
    });
  } catch (error) {
    console.error('Get review error:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání recenze' },
      { status: 500 }
    );
  }
}

// PATCH /api/reviews/:id - Update review (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Only admin can update reviews
  const user = await requireAuth(['admin']);
  if (user instanceof NextResponse) return user;

  try {
    const { id } = await params;
    const body = await request.json();
    const updates: string[] = [];
    const args: any[] = [];

    // Build dynamic update query
    const allowedFields = [
      'author_name', 'author_email', 'rating',
      'title', 'content', 'status'
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates.push(`${field} = ?`);
        args.push(body[field]);
      }
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'Žádná data k aktualizaci' },
        { status: 400 }
      );
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    args.push(parseInt(id));

    await db.execute({
      sql: `UPDATE reviews SET ${updates.join(', ')} WHERE id = ?`,
      args
    });

    return NextResponse.json({
      success: true,
      message: 'Recenze aktualizována'
    });
  } catch (error) {
    console.error('Update review error:', error);
    return NextResponse.json(
      { error: 'Chyba při aktualizaci recenze' },
      { status: 500 }
    );
  }
}

// DELETE /api/reviews/:id - Delete review (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Only admin can delete reviews
  const user = await requireAuth(['admin']);
  if (user instanceof NextResponse) return user;

  try {
    const { id } = await params;
    await db.execute({
      sql: 'DELETE FROM reviews WHERE id = ?',
      args: [parseInt(id)]
    });

    return NextResponse.json({
      success: true,
      message: 'Recenze smazána'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    return NextResponse.json(
      { error: 'Chyba při mazání recenze' },
      { status: 500 }
    );
  }
}
