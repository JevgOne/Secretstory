import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { db } from '@/lib/db';

// GET /api/admin/stats?period=month - Get statistics
export async function GET(request: NextRequest) {
  const user = await requireAuth(['admin', 'manager'], request);
  if (user instanceof NextResponse) return user;

  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month'; // day, week, month, year

    // Calculate date range based on period
    let startDate = new Date();
    let previousStartDate = new Date();

    switch (period) {
      case 'day':
        startDate.setHours(0, 0, 0, 0);
        previousStartDate = new Date(startDate);
        previousStartDate.setDate(previousStartDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        previousStartDate.setDate(previousStartDate.getDate() - 14);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        previousStartDate.setFullYear(previousStartDate.getFullYear() - 2);
        break;
      case 'month':
      default:
        startDate.setMonth(startDate.getMonth() - 1);
        previousStartDate.setMonth(previousStartDate.getMonth() - 2);
        break;
    }

    const startDateStr = startDate.toISOString();
    const previousStartDateStr = previousStartDate.toISOString();
    const previousEndDateStr = startDate.toISOString();

    // Get bookings count for current period
    const currentBookingsResult = await db.execute({
      sql: `SELECT COUNT(*) as count FROM bookings WHERE created_at >= ?`,
      args: [startDateStr]
    });
    const currentBookings = (currentBookingsResult.rows[0] as any).count || 0;

    // Get bookings count for previous period
    const previousBookingsResult = await db.execute({
      sql: `SELECT COUNT(*) as count FROM bookings WHERE created_at >= ? AND created_at < ?`,
      args: [previousStartDateStr, previousEndDateStr]
    });
    const previousBookings = (previousBookingsResult.rows[0] as any).count || 0;

    // Calculate percentage change
    const bookingsChange = previousBookings > 0
      ? Math.round(((currentBookings - previousBookings) / previousBookings) * 100)
      : 0;

    // Get active girls count
    const activeGirlsResult = await db.execute(`
      SELECT COUNT(*) as count FROM girls WHERE status = 'active'
    `);
    const activeGirls = (activeGirlsResult.rows[0] as any).count || 0;

    // Get total reviews count
    const totalReviewsResult = await db.execute(`
      SELECT COUNT(*) as count FROM reviews WHERE status = 'approved'
    `);
    const totalReviews = (totalReviewsResult.rows[0] as any).count || 0;

    // Get new reviews this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const newReviewsResult = await db.execute({
      sql: `SELECT COUNT(*) as count FROM reviews WHERE created_at >= ? AND status = 'approved'`,
      args: [weekAgo.toISOString()]
    });
    const newReviews = (newReviewsResult.rows[0] as any).count || 0;

    // Get average duration
    const avgDurationResult = await db.execute({
      sql: `SELECT AVG(duration) as avg FROM bookings WHERE created_at >= ?`,
      args: [startDateStr]
    });
    const avgDuration = Math.round((avgDurationResult.rows[0] as any).avg || 0);

    // Get most common duration
    const commonDurationResult = await db.execute({
      sql: `
        SELECT duration, COUNT(*) as count
        FROM bookings
        WHERE created_at >= ?
        GROUP BY duration
        ORDER BY count DESC
        LIMIT 1
      `,
      args: [startDateStr]
    });
    const mostCommonDuration = (commonDurationResult.rows[0] as any)?.duration || 60;

    // Get top performers (girls by bookings count)
    const topGirlsResult = await db.execute({
      sql: `
        SELECT
          girls.id,
          girls.name,
          girls.color,
          COUNT(bookings.id) as bookings_count
        FROM girls
        LEFT JOIN bookings ON girls.id = bookings.girl_id AND bookings.created_at >= ?
        WHERE girls.status = 'active'
        GROUP BY girls.id, girls.name, girls.color
        ORDER BY bookings_count DESC
        LIMIT 10
      `,
      args: [startDateStr]
    });

    const topGirls = topGirlsResult.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      color: row.color || '#ec4899',
      bookings: row.bookings_count || 0,
      trend: '+0' // Would need previous period data to calculate actual trend
    }));

    // Get booking distribution by duration
    const distributionResult = await db.execute({
      sql: `
        SELECT
          duration,
          COUNT(*) as count
        FROM bookings
        WHERE created_at >= ?
        GROUP BY duration
        ORDER BY duration
      `,
      args: [startDateStr]
    });

    // Group into categories
    const distribution = {
      '30': 0,
      '45': 0,
      '60': 0,
      '90+': 0
    };

    let totalCount = 0;
    distributionResult.rows.forEach((row: any) => {
      const duration = row.duration;
      const count = row.count;
      totalCount += count;

      if (duration === 30) {
        distribution['30'] += count;
      } else if (duration === 45) {
        distribution['45'] += count;
      } else if (duration === 60) {
        distribution['60'] += count;
      } else if (duration >= 90) {
        distribution['90+'] += count;
      }
    });

    // Calculate percentages
    const distributionWithPercentages = Object.entries(distribution).map(([duration, count]) => ({
      duration: duration === '90+' ? '90+ min' : `${duration} min`,
      count,
      percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0,
      color: duration === '30' ? '#3b82f6' : duration === '45' ? '#8b5cf6' : duration === '60' ? '#ec4899' : '#f97316'
    }));

    return NextResponse.json({
      success: true,
      stats: {
        bookings: {
          count: currentBookings,
          change: bookingsChange,
          changeDirection: bookingsChange >= 0 ? 'up' : 'down'
        },
        activeGirls,
        reviews: {
          total: totalReviews,
          newThisWeek: newReviews
        },
        avgDuration: {
          avg: avgDuration,
          mostCommon: mostCommonDuration
        },
        topGirls,
        distribution: distributionWithPercentages
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání statistik' },
      { status: 500 }
    );
  }
}
