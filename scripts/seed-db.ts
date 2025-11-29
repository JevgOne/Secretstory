import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as bcrypt from 'bcryptjs';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function seed() {
  console.log('🌱 Seeding database...\n');

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error('❌ Missing database credentials');
    process.exit(1);
  }

  const db = createClient({ url, authToken });

  try {
    // Hash passwords
    const adminHash = await bcrypt.hash('admin123', 10);
    const managerHash = await bcrypt.hash('manager123', 10);

    // Insert users
    console.log('👤 Creating users...');
    await db.execute({
      sql: 'INSERT OR IGNORE INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)',
      args: [1, 'admin@lovelygirls.cz', adminHash, 'admin']
    });
    await db.execute({
      sql: 'INSERT OR IGNORE INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)',
      args: [2, 'manager@lovelygirls.cz', managerHash, 'manager']
    });
    console.log('   ✅ Users created\n');

    // Insert sample girls
    console.log('👩 Creating sample girls...');
    const girls = [
      { name: 'Katy', color: 'pink', status: 'active', age: 24, nationality: 'Czech', services: JSON.stringify(['GFE', 'Massage']) },
      { name: 'Ema', color: 'blue', status: 'active', age: 26, nationality: 'Slovak', services: JSON.stringify(['PSE', 'Oral']) },
      { name: 'Sofia', color: 'purple', status: 'active', age: 23, nationality: 'Russian', services: JSON.stringify(['Classic', 'GFE']) }
    ];

    for (const girl of girls) {
      await db.execute({
        sql: `INSERT OR IGNORE INTO girls (name, slug, age, nationality, color, status, services, verified, online, rating, reviews_count, bookings_count)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          girl.name,
          girl.name.toLowerCase(),
          girl.age,
          girl.nationality,
          girl.color,
          girl.status,
          girl.services,
          1,
          1,
          4.8,
          12,
          45
        ]
      });
    }
    console.log('   ✅ Girls created\n');

    // Create girl user accounts
    console.log('🔑 Creating girl accounts...');
    const katyHash = await bcrypt.hash('katy123', 10);
    const emaHash = await bcrypt.hash('ema123', 10);
    const sofiaHash = await bcrypt.hash('sofia123', 10);

    await db.execute({
      sql: 'INSERT OR IGNORE INTO users (email, password_hash, role, girl_id) VALUES (?, ?, ?, ?)',
      args: ['katy@demo.cz', katyHash, 'girl', 1]
    });
    await db.execute({
      sql: 'INSERT OR IGNORE INTO users (email, password_hash, role, girl_id) VALUES (?, ?, ?, ?)',
      args: ['ema@demo.cz', emaHash, 'girl', 2]
    });
    await db.execute({
      sql: 'INSERT OR IGNORE INTO users (email, password_hash, role, girl_id) VALUES (?, ?, ?, ?)',
      args: ['sofia@demo.cz', sofiaHash, 'girl', 3]
    });
    console.log('   ✅ Girl accounts created\n');

    // Insert sample bookings
    console.log('📅 Creating sample bookings...');
    const today = new Date().toISOString().split('T')[0];
    await db.execute({
      sql: `INSERT OR IGNORE INTO bookings (girl_id, created_by, client_name, client_phone, date, start_time, end_time, duration, location, location_type, price, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [1, 2, 'Jan Novák', '+420777123456', today, '14:00', '16:00', 120, 'Praha 2 - Vinohrady', 'incall', 6500, 'confirmed']
    });
    await db.execute({
      sql: `INSERT OR IGNORE INTO bookings (girl_id, created_by, client_name, client_phone, date, start_time, end_time, duration, location, location_type, price, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [2, 2, 'Petr Svoboda', '+420777654321', today, '18:00', '19:00', 60, 'Hotel Marriott', 'outcall', 3500, 'pending']
    });
    console.log('   ✅ Bookings created\n');

    console.log('✅ Database seeded successfully!\n');

    // Show summary
    const userCount = await db.execute('SELECT COUNT(*) as count FROM users');
    const girlCount = await db.execute('SELECT COUNT(*) as count FROM girls');
    const bookingCount = await db.execute('SELECT COUNT(*) as count FROM bookings');

    console.log('📊 Summary:');
    console.log('   Users:', userCount.rows[0].count);
    console.log('   Girls:', girlCount.rows[0].count);
    console.log('   Bookings:', bookingCount.rows[0].count);

    console.log('\n🔑 Login credentials:');
    console.log('   Admin: admin@lovelygirls.cz / admin123');
    console.log('   Manager: manager@lovelygirls.cz / manager123');
    console.log('   Katy: katy@demo.cz / katy123');
    console.log('   Ema: ema@demo.cz / ema123');
    console.log('   Sofia: sofia@demo.cz / sofia123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
