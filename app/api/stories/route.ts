import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.DATABASE_URL || 'libsql://lg-jevgone.aws-ap-south-1.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjU3NDkzMjUsImlkIjoiNjQwZWQxZTktNGU4My00MTM5LWE0OWYtNDQwMmI3NTQ5ZGZlIiwicmlkIjoiZTU3MWYzN2ItNGUxYS00ZDlkLTg5MTUtMDFmMDk2OTY2YTQzIn0.I9PeGSQo286itiWpa9Fn-8Vw00KiZcxLjJ7jKOyvQa4PIvuQtQWb10E_HSQZ5Zxfd3UEDL1JaaSqIk3QF18-Ag',
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const girlId = searchParams.get('girl_id');

    let sql = `
      SELECT
        s.*,
        g.name as girl_name,
        g.slug as girl_slug
      FROM stories s
      JOIN girls g ON s.girl_id = g.id
      WHERE s.is_active = 1
      AND (s.expires_at IS NULL OR s.expires_at > datetime('now'))
    `;

    const args: any[] = [];

    if (girlId) {
      sql += ' AND s.girl_id = ?';
      args.push(parseInt(girlId));
    }

    sql += ' ORDER BY s.created_at DESC';

    const result = await db.execute({ sql, args });

    // Group stories by girl
    const storiesByGirl: Record<number, any> = {};

    result.rows.forEach((row: any) => {
      if (!storiesByGirl[row.girl_id]) {
        storiesByGirl[row.girl_id] = {
          girl_id: row.girl_id,
          girl_name: row.girl_name,
          girl_slug: row.girl_slug,
          stories: []
        };
      }

      storiesByGirl[row.girl_id].stories.push({
        id: row.id,
        media_url: row.media_url,
        media_type: row.media_type,
        thumbnail_url: row.thumbnail_url,
        duration: row.duration,
        views_count: row.views_count,
        created_at: row.created_at
      });
    });

    const grouped = Object.values(storiesByGirl);

    return NextResponse.json({
      success: true,
      stories: grouped,
      total: result.rows.length
    });

  } catch (error: any) {
    console.error('Stories API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
