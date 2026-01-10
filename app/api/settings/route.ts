import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Force dynamic
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/settings - Get site settings
export async function GET(request: NextRequest) {
  try {
    // Try to get settings from database
    const result = await db.execute(
      'SELECT key, value FROM site_settings'
    );

    // Convert to object
    const settings: Record<string, any> = {};
    for (const row of result.rows) {
      const key = row.key as string;
      const value = row.value as string;
      // Parse JSON values
      try {
        settings[key] = JSON.parse(value);
      } catch {
        settings[key] = value;
      }
    }

    return NextResponse.json({
      success: true,
      settings
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (error: any) {
    // If table doesn't exist, create it and return defaults
    if (error.message?.includes('no such table')) {
      try {
        await db.execute(`
          CREATE TABLE IF NOT EXISTS site_settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Insert default settings
        await db.execute({
          sql: 'INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)',
          args: ['whatsapp_blocked', 'true']
        });

        return NextResponse.json({
          success: true,
          settings: {
            whatsapp_blocked: true
          }
        });
      } catch (createError) {
        console.error('Error creating settings table:', createError);
      }
    }

    console.error('Get settings error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// POST /api/settings - Update site settings (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key) {
      return NextResponse.json(
        { error: 'Key is required' },
        { status: 400 }
      );
    }

    // Ensure table exists
    await db.execute(`
      CREATE TABLE IF NOT EXISTS site_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Update or insert setting
    await db.execute({
      sql: 'INSERT OR REPLACE INTO site_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
      args: [key, JSON.stringify(value)]
    });

    return NextResponse.json({
      success: true,
      message: 'Setting updated'
    });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
