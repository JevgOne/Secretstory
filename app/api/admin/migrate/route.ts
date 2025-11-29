import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST() {
  try {
    console.log('Starting migration: Adding tattoo, piercing, and languages fields...');

    const migrations = [
      {
        name: 'tattoo_percentage',
        sql: 'ALTER TABLE girls ADD COLUMN tattoo_percentage INTEGER DEFAULT 0'
      },
      {
        name: 'tattoo_description',
        sql: 'ALTER TABLE girls ADD COLUMN tattoo_description TEXT'
      },
      {
        name: 'piercing',
        sql: 'ALTER TABLE girls ADD COLUMN piercing INTEGER DEFAULT 0'
      },
      {
        name: 'piercing_description',
        sql: 'ALTER TABLE girls ADD COLUMN piercing_description TEXT'
      },
      {
        name: 'languages',
        sql: 'ALTER TABLE girls ADD COLUMN languages TEXT'
      }
    ];

    const results = [];

    for (const migration of migrations) {
      try {
        await db.execute(migration.sql);
        results.push({ column: migration.name, status: 'success' });
        console.log(`✅ Added ${migration.name} column`);
      } catch (error: any) {
        // Column might already exist
        if (error.message && error.message.includes('duplicate column name')) {
          results.push({ column: migration.name, status: 'already_exists' });
          console.log(`⚠️  ${migration.name} column already exists`);
        } else {
          results.push({ column: migration.name, status: 'error', error: error.message });
          console.error(`❌ Failed to add ${migration.name}:`, error);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Migration completed',
      results
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Migration failed', details: error.message },
      { status: 500 }
    );
  }
}
