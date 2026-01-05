import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { db } from '@/lib/db';

// GET /api/admin/users - Get all users
export async function GET(request: NextRequest) {
  const user = await requireAuth(['admin'], request);
  if (user instanceof NextResponse) return user;

  try {
    const searchParams = request.nextUrl.searchParams;
    const count = searchParams.get('count') === 'true';

    // If only count is requested, return count for faster dashboard loading
    if (count) {
      const result = await db.execute('SELECT COUNT(*) as count FROM users');
      return NextResponse.json({
        success: true,
        count: result.rows[0].count
      });
    }

    // Get all users with left join to girls table for name
    const result = await db.execute(`
      SELECT
        users.id,
        users.email,
        users.role,
        users.girl_id,
        users.created_at,
        girls.name as girl_name,
        girls.status as girl_status
      FROM users
      LEFT JOIN girls ON users.girl_id = girls.id
      ORDER BY users.created_at DESC
    `);

    const users = result.rows.map((row: any) => {
      let name = '';
      let status = 'active';

      if (row.role === 'girl' && row.girl_name) {
        name = row.girl_name;
        status = row.girl_status || 'pending';
      } else if (row.role === 'admin') {
        name = 'Admin User';
      } else if (row.role === 'manager') {
        name = 'Manager User';
      } else {
        // Fallback to email username
        name = row.email.split('@')[0];
      }

      return {
        id: row.id,
        name,
        email: row.email,
        role: row.role,
        status,
        girl_id: row.girl_id,
        created_at: row.created_at
      };
    });

    return NextResponse.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání uživatelů' },
      { status: 500 }
    );
  }
}
