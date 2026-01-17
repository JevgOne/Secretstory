import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth-helpers';

// POST /api/admin/migrate-stories - Fix stories table (admin only)
export async function POST(request: NextRequest) {
  // Only admin can run migrations
  const user = await requireAuth(['admin'], request);
  if (user instanceof NextResponse) return user;

  try {
    console.log('Starting stories table migration...');

    // Check current schema
    const tableInfo = await db.execute('PRAGMA table_info(stories)');
    const columns = tableInfo.rows.map((r: any) => r.name);
    console.log('Current columns:', columns.join(', '));

    const results = [];

    // Add is_active column if not exists
    if (!columns.includes('is_active')) {
      try {
        await db.execute('ALTER TABLE stories ADD COLUMN is_active INTEGER DEFAULT 1');
        results.push({ column: 'is_active', status: 'added' });
        console.log('✅ Added column: is_active');
      } catch (error: any) {
        results.push({ column: 'is_active', status: 'error', error: error.message });
      }
    } else {
      results.push({ column: 'is_active', status: 'exists' });
    }

    // Add views_count column if not exists
    if (!columns.includes('views_count')) {
      try {
        await db.execute('ALTER TABLE stories ADD COLUMN views_count INTEGER DEFAULT 0');
        results.push({ column: 'views_count', status: 'added' });
        console.log('✅ Added column: views_count');
      } catch (error: any) {
        results.push({ column: 'views_count', status: 'error', error: error.message });
      }
    } else {
      results.push({ column: 'views_count', status: 'exists' });
    }

    // Add created_at column if not exists
    if (!columns.includes('created_at')) {
      try {
        await db.execute('ALTER TABLE stories ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP');
        results.push({ column: 'created_at', status: 'added' });
        console.log('✅ Added column: created_at');
      } catch (error: any) {
        results.push({ column: 'created_at', status: 'error', error: error.message });
      }
    } else {
      results.push({ column: 'created_at', status: 'exists' });
    }

    // Fix NULL values
    console.log('Fixing NULL values...');

    const isActiveResult = await db.execute(`UPDATE stories SET is_active = 1 WHERE is_active IS NULL`);
    results.push({ fix: 'is_active NULL', rowsAffected: isActiveResult.rowsAffected });

    const viewsResult = await db.execute(`UPDATE stories SET views_count = 0 WHERE views_count IS NULL`);
    results.push({ fix: 'views_count NULL', rowsAffected: viewsResult.rowsAffected });

    const createdAtResult = await db.execute(`UPDATE stories SET created_at = datetime('now') WHERE created_at IS NULL`);
    results.push({ fix: 'created_at NULL', rowsAffected: createdAtResult.rowsAffected });

    // Verify final schema
    const finalInfo = await db.execute('PRAGMA table_info(stories)');

    // Count active stories
    const storyCount = await db.execute('SELECT COUNT(*) as count FROM stories WHERE is_active = 1');

    return NextResponse.json({
      success: true,
      message: 'Stories migration completed',
      results,
      columns: finalInfo.rows.map((row: any) => ({ name: row.name, type: row.type })),
      activeStories: storyCount.rows[0]?.count || 0
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Chyba při migraci stories tabulky', details: error.message },
      { status: 500 }
    );
  }
}
