import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { exchangeCodeForTokens, listEvents } from '@/lib/google-calendar';

/**
 * GET /api/auth/google/callback - Handle Google OAuth callback
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  // Handle errors from Google
  if (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.redirect(
      new URL('/manager/settings/calendar?error=google_denied', request.url)
    );
  }

  // Validate required params
  if (!code || !state) {
    return NextResponse.redirect(
      new URL('/manager/settings/calendar?error=missing_params', request.url)
    );
  }

  try {
    // Verify state and get user ID
    const stateResult = await db.execute({
      sql: `
        SELECT user_id FROM oauth_states
        WHERE state = ? AND expires_at > datetime('now')
      `,
      args: [state]
    });

    if (stateResult.rows.length === 0) {
      return NextResponse.redirect(
        new URL('/manager/settings/calendar?error=invalid_state', request.url)
      );
    }

    const userId = stateResult.rows[0].user_id as number;

    // Delete used state
    await db.execute({
      sql: 'DELETE FROM oauth_states WHERE state = ?',
      args: [state]
    });

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);

    // Get user's primary calendar ID (optional, for verification)
    let calendarId = 'primary';
    try {
      // Try to list events to verify access and get calendar info
      await listEvents(tokens.access_token, 'primary', {
        maxResults: 1
      });
    } catch (err) {
      console.error('Failed to verify calendar access:', err);
    }

    // Store tokens in database
    await db.execute({
      sql: `
        INSERT INTO google_calendar_tokens (
          user_id, access_token, refresh_token, token_type,
          expires_at, scope, calendar_id, sync_enabled, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))
        ON CONFLICT(user_id) DO UPDATE SET
          access_token = excluded.access_token,
          refresh_token = excluded.refresh_token,
          token_type = excluded.token_type,
          expires_at = excluded.expires_at,
          scope = excluded.scope,
          updated_at = datetime('now')
      `,
      args: [
        userId,
        tokens.access_token,
        tokens.refresh_token,
        tokens.token_type,
        tokens.expires_at.toISOString(),
        tokens.scope,
        calendarId
      ]
    });

    // Get user role to redirect to appropriate settings page
    const userResult = await db.execute({
      sql: 'SELECT role FROM users WHERE id = ?',
      args: [userId]
    });

    const userRole = userResult.rows[0]?.role as string || 'manager';
    const redirectPath = userRole === 'girl'
      ? '/girl/settings/calendar?success=connected'
      : '/manager/settings/calendar?success=connected';

    return NextResponse.redirect(new URL(redirectPath, request.url));

  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/manager/settings/calendar?error=exchange_failed', request.url)
    );
  }
}
