import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth-helpers';

// POST /api/admin/migrate-soft-delete - Add soft delete columns to bookings (Admin only)
export async function POST(request: NextRequest) {
  const user = await requireAuth(['admin']);
  if (user instanceof NextResponse) return user;

  try {
    // Check if columns already exist
    const tableInfo = await db.execute(`PRAGMA table_info(bookings)`);
    const columns = tableInfo.rows.map((row: any) => row.name);

    if (!columns.includes('deleted_at')) {
      await db.execute(`
        ALTER TABLE bookings ADD COLUMN deleted_at DATETIME DEFAULT NULL
      `);
      console.log('✓ Added deleted_at column');
    }

    if (!columns.includes('deleted_by')) {
      await db.execute(`
        ALTER TABLE bookings ADD COLUMN deleted_by INTEGER DEFAULT NULL
      `);
      console.log('✓ Added deleted_by column');
    }

    return NextResponse.json({
      success: true,
      message: 'Soft delete migration completed'
    });
  } catch (error) {
    console.error('Error migrating soft delete:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to migrate soft delete' },
      { status: 500 }
    );
  }
}
