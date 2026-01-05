import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth-helpers';

// POST /api/admin/migrate - Run database migrations (admin only)
export async function POST(request: NextRequest) {
  // Only admin can run migrations
  const user = await requireAuth(['admin'], request);
  if (user instanceof NextResponse) return user;

  try {
    console.log('Starting migration for girls table...');

    const migrations = [
      // Tattoo and piercing fields
      {
        sql: 'ALTER TABLE girls ADD COLUMN tattoo_percentage INTEGER DEFAULT 0',
        name: 'tattoo_percentage'
      },
      {
        sql: 'ALTER TABLE girls ADD COLUMN tattoo_description TEXT',
        name: 'tattoo_description'
      },
      {
        sql: 'ALTER TABLE girls ADD COLUMN piercing BOOLEAN DEFAULT 0',
        name: 'piercing'
      },
      {
        sql: 'ALTER TABLE girls ADD COLUMN piercing_description TEXT',
        name: 'piercing_description'
      },
      // Language support
      {
        sql: 'ALTER TABLE girls ADD COLUMN languages TEXT',
        name: 'languages'
      },
      // Badge and featured fields
      {
        sql: 'ALTER TABLE girls ADD COLUMN is_new BOOLEAN DEFAULT 0',
        name: 'is_new'
      },
      {
        sql: 'ALTER TABLE girls ADD COLUMN is_top BOOLEAN DEFAULT 0',
        name: 'is_top'
      },
      {
        sql: 'ALTER TABLE girls ADD COLUMN is_featured BOOLEAN DEFAULT 0',
        name: 'is_featured'
      },
      {
        sql: 'ALTER TABLE girls ADD COLUMN featured_section TEXT',
        name: 'featured_section'
      },
      {
        sql: 'ALTER TABLE girls ADD COLUMN badge_type TEXT',
        name: 'badge_type'
      }
    ];

    const results = [];

    for (const migration of migrations) {
      try {
        await db.execute(migration.sql);
        results.push({ column: migration.name, status: 'added' });
        console.log(`✅ Added column: ${migration.name}`);
      } catch (error: any) {
        if (error.message?.includes('duplicate column name')) {
          results.push({ column: migration.name, status: 'exists' });
          console.log(`⏭️  Column already exists: ${migration.name}`);
        } else {
          results.push({ column: migration.name, status: 'error', error: error.message });
          console.error(`❌ Error adding column ${migration.name}:`, error.message);
        }
      }
    }

    // Verify table structure
    const tableInfo = await db.execute('PRAGMA table_info(girls)');

    return NextResponse.json({
      success: true,
      message: 'Migration completed',
      results,
      columns: tableInfo.rows.map((row: any) => ({ name: row.name, type: row.type }))
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Chyba při migraci databáze' },
      { status: 500 }
    );
  }
}
