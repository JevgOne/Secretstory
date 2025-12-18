import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function createBookingsTable() {
  console.log('🚀 Creating bookings table...\n');

  try {
    // Create bookings table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        girl_id INTEGER NOT NULL,
        client_name TEXT NOT NULL,
        client_email TEXT,
        client_phone TEXT NOT NULL,
        date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        duration INTEGER NOT NULL,
        service_type TEXT NOT NULL,
        total_price INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        payment_status TEXT DEFAULT 'unpaid',
        notes TEXT,
        admin_notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (girl_id) REFERENCES girls(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Created bookings table');

    // Create index on girl_id and date for faster queries
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_bookings_girl_date
      ON bookings(girl_id, date)
    `);
    console.log('✅ Created index on girl_id and date');

    // Create index on status
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_bookings_status
      ON bookings(status)
    `);
    console.log('✅ Created index on status');

    // Create index on client_phone for lookup
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_bookings_client_phone
      ON bookings(client_phone)
    `);
    console.log('✅ Created index on client_phone');

    console.log('\n✅ Bookings table created successfully!');
    console.log('\nTable structure:');
    console.log('- id: Unique booking ID');
    console.log('- girl_id: Reference to girls table');
    console.log('- client_name: Client name');
    console.log('- client_email: Client email (optional)');
    console.log('- client_phone: Client phone number');
    console.log('- date: Booking date (YYYY-MM-DD)');
    console.log('- start_time: Start time (HH:MM)');
    console.log('- end_time: End time (HH:MM)');
    console.log('- duration: Duration in minutes');
    console.log('- service_type: Type of service (30min, 60min, 90min, etc.)');
    console.log('- total_price: Total price in CZK');
    console.log('- status: pending | confirmed | cancelled | completed');
    console.log('- payment_status: unpaid | paid | refunded');
    console.log('- notes: Client notes');
    console.log('- admin_notes: Internal admin notes');

  } catch (error) {
    console.error('❌ Error creating bookings table:', error);
    process.exit(1);
  }

  process.exit(0);
}

createBookingsTable();
