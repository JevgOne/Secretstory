import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import { requireAuth } from '@/lib/auth-helpers';
import { isValidVibe, validateTags } from '@/lib/review-constants';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!
});

// POST /api/admin/reviews - Create new review with custom date (admin only)
export async function POST(request: NextRequest) {
  // Require admin authentication
  const user = await requireAuth(['admin', 'manager'], request);
  if (user instanceof NextResponse) return user;

  try {
    const body = await request.json();
    const {
      girl_id,
      author_name,
      author_email,
      rating,
      title,
      content,
      vibe,
      tags = [],
      status = 'approved', // Admin can set status directly
      created_at // Custom date for old reviews
    } = body;

    // Validate required fields
    if (!girl_id || !author_name || !content || !rating) {
      return NextResponse.json(
        { success: false, error: 'Chybí povinné údaje (girl_id, author_name, content, rating)' },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Hodnocení musí být 1-5' },
        { status: 400 }
      );
    }

    // Validate vibe if provided
    if (vibe && !isValidVibe(vibe)) {
      return NextResponse.json(
        { success: false, error: 'Neplatný vibe' },
        { status: 400 }
      );
    }

    // Validate tags
    if (!validateTags(tags)) {
      return NextResponse.json(
        { success: false, error: 'Neplatné tagy. Maximálně 4 tagy ze seznamu.' },
        { status: 400 }
      );
    }

    // Validate girl exists
    const girlCheck = await db.execute({
      sql: 'SELECT id, name FROM girls WHERE id = ?',
      args: [parseInt(girl_id)]
    });

    if (girlCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Dívka nenalezena' },
        { status: 404 }
      );
    }

    console.log('[ADMIN REVIEW] Creating review:', {
      girl_id,
      author_name,
      rating,
      created_at: created_at || 'current'
    });

    // Insert review with optional custom date
    let sql, args: any[];

    if (created_at) {
      sql = `
        INSERT INTO reviews (
          girl_id, author_name, author_email,
          rating, title, content, vibe, tags,
          status, approved_by, approved_at, ip_address, helpful_count, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), ?, 0, ?, ?)
      `;
      args = [
        parseInt(girl_id),
        author_name,
        author_email || null,
        parseInt(rating),
        title || null,
        content,
        vibe || null,
        JSON.stringify(tags),
        status,
        user.id,
        'admin-review',
        created_at,
        created_at
      ];
    } else {
      sql = `
        INSERT INTO reviews (
          girl_id, author_name, author_email,
          rating, title, content, vibe, tags,
          status, approved_by, approved_at, ip_address, helpful_count
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), ?, 0)
      `;
      args = [
        parseInt(girl_id),
        author_name,
        author_email || null,
        parseInt(rating),
        title || null,
        content,
        vibe || null,
        JSON.stringify(tags),
        status,
        user.id,
        'admin-review'
      ];
    }

    const result = await db.execute({ sql, args });

    console.log('[ADMIN REVIEW] Review created successfully, ID:', result.lastInsertRowid);

    return NextResponse.json({
      success: true,
      review_id: Number(result.lastInsertRowid),
      message: 'Recenze byla úspěšně vytvořena'
    });
  } catch (error) {
    console.error('[ADMIN REVIEW] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Chyba při vytváření recenze',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
