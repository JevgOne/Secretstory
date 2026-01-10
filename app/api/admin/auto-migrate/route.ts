import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST /api/admin/auto-migrate - Auto-run pending migrations
export async function POST(request: NextRequest) {
  try {
    const results: string[] = [];

    const migrations = [
      // Multilingual tattoo descriptions
      { sql: 'ALTER TABLE girls ADD COLUMN tattoo_description_cs TEXT', name: 'tattoo_description_cs' },
      { sql: 'ALTER TABLE girls ADD COLUMN tattoo_description_en TEXT', name: 'tattoo_description_en' },
      { sql: 'ALTER TABLE girls ADD COLUMN tattoo_description_de TEXT', name: 'tattoo_description_de' },
      { sql: 'ALTER TABLE girls ADD COLUMN tattoo_description_uk TEXT', name: 'tattoo_description_uk' },
      // Multilingual piercing descriptions
      { sql: 'ALTER TABLE girls ADD COLUMN piercing_description_cs TEXT', name: 'piercing_description_cs' },
      { sql: 'ALTER TABLE girls ADD COLUMN piercing_description_en TEXT', name: 'piercing_description_en' },
      { sql: 'ALTER TABLE girls ADD COLUMN piercing_description_de TEXT', name: 'piercing_description_de' },
      { sql: 'ALTER TABLE girls ADD COLUMN piercing_description_uk TEXT', name: 'piercing_description_uk' },
    ];

    for (const migration of migrations) {
      try {
        await db.execute(migration.sql);
        results.push(`✅ Added: ${migration.name}`);
      } catch (error: any) {
        if (error.message?.includes('duplicate column') || error.message?.includes('already exists')) {
          results.push(`⏭️ Exists: ${migration.name}`);
        } else {
          results.push(`❌ Failed: ${migration.name} - ${error.message}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Migration completed',
      results
    });
  } catch (error) {
    console.error('Auto-migrate error:', error);
    return NextResponse.json(
      { error: 'Migration failed', details: String(error) },
      { status: 500 }
    );
  }
}

// GET for easy browser access
export async function GET(request: NextRequest) {
  return POST(request);
}
