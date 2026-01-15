import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { fullSync, importFromGoogleCalendar, syncAllBookingsForGirl } from '@/lib/calendar-sync';

/**
 * POST /api/calendar/sync - Trigger calendar synchronization
 */
export async function POST(request: NextRequest) {
  // Require authentication
  const user = await requireAuth(['admin', 'manager', 'girl']);
  if (user instanceof NextResponse) return user;

  try {
    const body = await request.json().catch(() => ({}));
    const { direction = 'both', girlId } = body;

    // Determine girl ID
    let targetGirlId: number;

    if (user.role === 'girl') {
      // Girls can only sync their own bookings
      targetGirlId = user.girlId!;
    } else if (girlId) {
      // Managers can specify which girl to sync
      targetGirlId = parseInt(girlId);
    } else {
      return NextResponse.json(
        { error: 'Není specifikována dívka pro synchronizaci' },
        { status: 400 }
      );
    }

    let result;

    const userId = parseInt(user.id);

    switch (direction) {
      case 'import':
        // Only import from Google
        result = await importFromGoogleCalendar(userId, targetGirlId);
        break;

      case 'export':
        // Only export to Google
        result = await syncAllBookingsForGirl(targetGirlId, userId);
        break;

      case 'both':
      default:
        // Full bidirectional sync
        result = await fullSync(userId, targetGirlId);
        break;
    }

    return NextResponse.json({
      success: result.success,
      message: result.success ? 'Synchronizace dokončena' : 'Synchronizace dokončena s chybami',
      stats: {
        eventsCreated: result.eventsCreated,
        eventsUpdated: result.eventsUpdated,
        eventsDeleted: result.eventsDeleted,
        bookingsCreated: result.bookingsCreated,
        bookingsUpdated: result.bookingsUpdated
      },
      errors: result.errors.length > 0 ? result.errors : undefined
    });

  } catch (error) {
    console.error('Calendar sync error:', error);
    return NextResponse.json(
      { error: 'Chyba při synchronizaci kalendáře' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/calendar/sync - Get sync status
 */
export async function GET(request: NextRequest) {
  // Require authentication
  const user = await requireAuth(['admin', 'manager', 'girl']);
  if (user instanceof NextResponse) return user;

  try {
    // Get last sync info
    const tokenResult = await db.execute({
      sql: 'SELECT last_sync_at, sync_token FROM google_calendar_tokens WHERE user_id = ?',
      args: [user.id]
    });

    if (tokenResult.rows.length === 0) {
      return NextResponse.json({
        success: true,
        connected: false
      });
    }

    // Count pending sync items
    const pendingResult = await db.execute({
      sql: `
        SELECT COUNT(*) as count FROM bookings
        WHERE (sync_status IS NULL OR sync_status = 'pending')
        AND status NOT IN ('cancelled', 'rejected')
      `,
      args: []
    });

    const errorResult = await db.execute({
      sql: `
        SELECT COUNT(*) as count FROM bookings
        WHERE sync_status = 'error'
      `,
      args: []
    });

    return NextResponse.json({
      success: true,
      connected: true,
      lastSyncAt: tokenResult.rows[0].last_sync_at,
      hasSyncToken: !!tokenResult.rows[0].sync_token,
      pendingCount: pendingResult.rows[0].count,
      errorCount: errorResult.rows[0].count
    });

  } catch (error) {
    console.error('Get sync status error:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání stavu synchronizace' },
      { status: 500 }
    );
  }
}
