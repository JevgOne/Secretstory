import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { getAuthUrl } from '@/lib/google-calendar';
import { db } from '@/lib/db';
import crypto from 'crypto';

/**
 * GET /api/auth/google - Initiate Google OAuth flow
 * Redirects user to Google consent screen
 */
export async function GET(request: NextRequest) {
  // Require authentication - manager or girl
  const user = await requireAuth(['admin', 'manager', 'girl']);
  if (user instanceof NextResponse) return user;

  try {
    // Generate secure state token (includes user ID for verification)
    const stateData = {
      userId: user.id,
      timestamp: Date.now(),
      nonce: crypto.randomBytes(16).toString('hex')
    };
    const state = Buffer.from(JSON.stringify(stateData)).toString('base64url');

    // Store state in database for verification (expires in 10 minutes)
    await db.execute({
      sql: `
        INSERT INTO oauth_states (state, user_id, expires_at)
        VALUES (?, ?, datetime('now', '+10 minutes'))
      `,
      args: [state, user.id]
    }).catch(() => {
      // Table might not exist yet, create it
      return db.execute({
        sql: `
          CREATE TABLE IF NOT EXISTS oauth_states (
            state TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            expires_at DATETIME NOT NULL
          )
        `,
        args: []
      }).then(() => {
        return db.execute({
          sql: `
            INSERT INTO oauth_states (state, user_id, expires_at)
            VALUES (?, ?, datetime('now', '+10 minutes'))
          `,
          args: [state, user.id]
        });
      });
    });

    // Get OAuth URL
    const authUrl = getAuthUrl(state);

    // Redirect to Google
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Google OAuth initiation error:', error);
    return NextResponse.json(
      { error: 'Chyba při připojování ke Google' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/auth/google - Disconnect Google Calendar
 */
export async function DELETE(request: NextRequest) {
  // Require authentication
  const user = await requireAuth(['admin', 'manager', 'girl']);
  if (user instanceof NextResponse) return user;

  try {
    // Delete tokens
    await db.execute({
      sql: 'DELETE FROM google_calendar_tokens WHERE user_id = ?',
      args: [user.id]
    });

    return NextResponse.json({
      success: true,
      message: 'Google Calendar odpojen'
    });
  } catch (error) {
    console.error('Google disconnect error:', error);
    return NextResponse.json(
      { error: 'Chyba při odpojování Google Calendar' },
      { status: 500 }
    );
  }
}
