import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Create locations table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        display_name TEXT NOT NULL,
        address TEXT,
        postal_code TEXT,
        city TEXT NOT NULL,
        district TEXT,
        coordinates TEXT,
        phone TEXT,
        email TEXT,
        description TEXT,
        is_active INTEGER DEFAULT 1,
        is_primary INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_locations_active ON locations(is_active)
    `);

    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_locations_city ON locations(city)
    `);

    // Insert default location (Praha 2)
    await db.execute({
      sql: `
        INSERT OR IGNORE INTO locations
        (name, display_name, address, postal_code, city, district, is_active, is_primary)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: ['praha-2', 'Praha 2', 'Vinohrady', '120 00', 'Praha', 'Praha 2', 1, 1]
    });

    return NextResponse.json({
      success: true,
      message: 'Locations table created successfully'
    });
  } catch (error: any) {
    console.error('Setup locations error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
