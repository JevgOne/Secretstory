import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { db } from '@/lib/db';

/**
 * GET /api/calendar - Get Google Calendar connection status
 */
export async function GET(request: NextRequest) {
  // Require authentication
  const user = await requireAuth(['admin', 'manager', 'girl'], request);
  if (user instanceof NextResponse) return user;

  try {
    // Get token data for user
    const result = await db.execute({
      sql: `
        SELECT
          id,
          calendar_id,
          sync_enabled,
          last_sync_at,
          created_at
        FROM google_calendar_tokens
        WHERE user_id = ?
      `,
      args: [user.id]
    });

    if (result.rows.length === 0) {
      return NextResponse.json({
        success: true,
        connected: false
      });
    }

    const tokenData = result.rows[0];

    return NextResponse.json({
      success: true,
      connected: true,
      calendarId: tokenData.calendar_id,
      syncEnabled: !!tokenData.sync_enabled,
      lastSyncAt: tokenData.last_sync_at,
      connectedAt: tokenData.created_at
    });

  } catch (error) {
    console.error('Get calendar status error:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání stavu kalendáře' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/calendar - Update calendar settings
 */
export async function PATCH(request: NextRequest) {
  // Require authentication
  const user = await requireAuth(['admin', 'manager', 'girl'], request);
  if (user instanceof NextResponse) return user;

  try {
    const body = await request.json();
    const { syncEnabled } = body;

    if (typeof syncEnabled === 'boolean') {
      await db.execute({
        sql: `
          UPDATE google_calendar_tokens
          SET sync_enabled = ?, updated_at = datetime('now')
          WHERE user_id = ?
        `,
        args: [syncEnabled ? 1 : 0, user.id]
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Nastavení uloženo'
    });

  } catch (error) {
    console.error('Update calendar settings error:', error);
    return NextResponse.json(
      { error: 'Chyba při ukládání nastavení' },
      { status: 500 }
    );
  }
}
