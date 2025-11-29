import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/reviews - Get all reviews (with filters)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const girlId = searchParams.get('girl_id');
    const status = searchParams.get('status');

    let sql = `
      SELECT
        r.*,
        g.name as girl_name,
        g.color as girl_color
      FROM reviews r
      LEFT JOIN girls g ON r.girl_id = g.id
      WHERE 1=1
    `;
    const args: any[] = [];

    if (girlId) {
      sql += ' AND r.girl_id = ?';
      args.push(parseInt(girlId));
    }

    if (status) {
      sql += ' AND r.status = ?';
      args.push(status);
    }

    sql += ' ORDER BY r.created_at DESC';

    const result = await db.execute({ sql, args });

    return NextResponse.json({
      success: true,
      reviews: result.rows
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání recenzí' },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Create new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      girl_id,
      booking_id,
      author_name,
      author_email,
      rating,
      title,
      content
    } = body;

    // Validate required fields
    if (!girl_id || !author_name || !rating || !content) {
      return NextResponse.json(
        { error: 'Chybí povinné údaje' },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Hodnocení musí být 1-5' },
        { status: 400 }
      );
    }

    // Insert review with status 'pending' (needs admin approval)
    const result = await db.execute({
      sql: `
        INSERT INTO reviews (
          girl_id, booking_id, author_name, author_email,
          rating, title, content, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
      `,
      args: [
        girl_id,
        booking_id || null,
        author_name,
        author_email || null,
        rating,
        title || null,
        content
      ]
    });

    // TODO: Create notification for admin
    // await createNotification(admin_user_id, 'review_new', ...)

    return NextResponse.json({
      success: true,
      review_id: result.lastInsertRowid,
      message: 'Recenze vytvořena a čeká na schválení'
    });
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: 'Chyba při vytváření recenze' },
      { status: 500 }
    );
  }
}
