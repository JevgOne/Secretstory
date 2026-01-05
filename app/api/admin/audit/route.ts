import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { db } from '@/lib/db';

// GET /api/admin/audit?filter=all&limit=50 - Get audit logs
export async function GET(request: NextRequest) {
  const user = await requireAuth(['admin'], request);
  if (user instanceof NextResponse) return user;

  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';
    const limit = parseInt(searchParams.get('limit') || '50');

    // Generate audit logs from database events
    const auditLogs: any[] = [];

    // Get recent bookings
    const bookingsResult = await db.execute({
      sql: `
        SELECT
          bookings.id,
          bookings.created_at,
          bookings.client_name,
          bookings.duration,
          bookings.status,
          girls.name as girl_name,
          users.email as user_email
        FROM bookings
        LEFT JOIN girls ON bookings.girl_id = girls.id
        LEFT JOIN users ON bookings.created_by = users.id
        ORDER BY bookings.created_at DESC
        LIMIT ?
      `,
      args: [limit]
    });

    bookingsResult.rows.forEach((row: any) => {
      if (filter === 'all' || filter === 'booking') {
        auditLogs.push({
          id: `booking-${row.id}`,
          icon: '➕',
          action: 'Nová rezervace',
          user: row.girl_name || 'Systém',
          details: `Klient: ${row.client_name}, ${row.duration} min`,
          time: row.created_at,
          type: 'success'
        });
      }
    });

    // Get recent reviews
    const reviewsResult = await db.execute({
      sql: `
        SELECT
          reviews.id,
          reviews.created_at,
          reviews.rating,
          reviews.status,
          girls.name as girl_name
        FROM reviews
        LEFT JOIN girls ON reviews.girl_id = girls.id
        ORDER BY reviews.created_at DESC
        LIMIT ?
      `,
      args: [Math.min(limit, 20)]
    });

    reviewsResult.rows.forEach((row: any) => {
      if (filter === 'all' || filter === 'system') {
        auditLogs.push({
          id: `review-${row.id}`,
          icon: '💬',
          action: row.status === 'approved' ? 'Recenze schválena' : 'Nová recenze',
          user: 'Systém',
          details: `Recenze pro ${row.girl_name} (${row.rating}⭐)`,
          time: row.created_at,
          type: row.status === 'approved' ? 'success' : 'info'
        });
      }
    });

    // Get recent users (new accounts)
    const usersResult = await db.execute({
      sql: `
        SELECT
          users.id,
          users.created_at,
          users.email,
          users.role
        FROM users
        ORDER BY users.created_at DESC
        LIMIT ?
      `,
      args: [Math.min(limit, 10)]
    });

    usersResult.rows.forEach((row: any) => {
      if (filter === 'all' || filter === 'system') {
        auditLogs.push({
          id: `user-${row.id}`,
          icon: '👥',
          action: 'Nový uživatel',
          user: 'Systém',
          details: `${row.email} (${row.role})`,
          time: row.created_at,
          type: 'success'
        });
      }
    });

    // Sort all logs by time (most recent first)
    auditLogs.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    // Limit to requested number
    const limitedLogs = auditLogs.slice(0, limit);

    // Convert timestamps to relative time
    const logsWithRelativeTime = limitedLogs.map(log => {
      const now = new Date();
      const logTime = new Date(log.time);
      const diffMs = now.getTime() - logTime.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      let relativeTime = '';
      if (diffMins < 1) {
        relativeTime = 'právě teď';
      } else if (diffMins < 60) {
        relativeTime = `před ${diffMins} min`;
      } else if (diffHours < 24) {
        relativeTime = `před ${diffHours} h`;
      } else {
        relativeTime = `před ${diffDays} dny`;
      }

      return {
        ...log,
        timeRelative: relativeTime,
        timeAbsolute: log.time
      };
    });

    // Calculate stats
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(now);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const todayCount = logsWithRelativeTime.filter(log =>
      new Date(log.timeAbsolute) >= todayStart
    ).length;

    const weekCount = logsWithRelativeTime.filter(log =>
      new Date(log.timeAbsolute) >= weekAgo
    ).length;

    const monthCount = logsWithRelativeTime.filter(log =>
      new Date(log.timeAbsolute) >= monthAgo
    ).length;

    const errorCount = logsWithRelativeTime.filter(log =>
      log.type === 'error'
    ).length;

    return NextResponse.json({
      success: true,
      logs: logsWithRelativeTime,
      stats: {
        today: todayCount,
        week: weekCount,
        month: monthCount,
        errors: errorCount
      }
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání audit logu' },
      { status: 500 }
    );
  }
}
