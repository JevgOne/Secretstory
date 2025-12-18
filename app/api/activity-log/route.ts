import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.DATABASE_URL || 'libsql://lg-jevgone.aws-ap-south-1.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjU3NDkzMjUsImlkIjoiNjQwZWQxZTktNGU4My00MTM5LWE0OWYtNDQwMmI3NTQ5ZGZlIiwicmlkIjoiZTU3MWYzN2ItNGUxYS00ZDlkLTg5MTUtMDFmMDk2OTY2YTQzIn0.I9PeGSQo286itiWpa9Fn-8Vw00KiZcxLjJ7jKOyvQa4PIvuQtQWb10E_HSQZ5Zxfd3UEDL1JaaSqIk3QF18-Ag',
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const sql = `
      SELECT
        a.*,
        g.name as girl_name,
        g.slug as girl_slug
      FROM activity_log a
      JOIN girls g ON a.girl_id = g.id
      WHERE a.is_visible = 1
      ORDER BY a.created_at DESC
      LIMIT ?
    `;

    const result = await db.execute({ sql, args: [limit] });

    return NextResponse.json({
      success: true,
      activities: result.rows,
      total: result.rows.length
    });

  } catch (error: any) {
    console.error('Activity Log API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
