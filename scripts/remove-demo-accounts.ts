import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function removeDemoAccounts() {
  console.log('🔒 Removing demo accounts for security...\n');

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error('❌ Missing database credentials');
    process.exit(1);
  }

  const db = createClient({ url, authToken });

  try {
    // Demo email patterns
    const demoEmails = [
      'admin@lovelygirls.cz',
      'manager@lovelygirls.cz',
      'katy@demo.cz',
      'ema@demo.cz',
      'sofia@demo.cz'
    ];

    // Demo girl names (sample data)
    const demoGirlSlugs = ['katy', 'ema', 'sofia'];

    // 1. Remove demo user accounts
    console.log('👤 Removing demo user accounts...');
    for (const email of demoEmails) {
      const result = await db.execute({
        sql: 'DELETE FROM users WHERE email = ?',
        args: [email]
      });
      console.log(`   ✅ Removed: ${email}`);
    }

    // 2. Remove demo girls (if they exist)
    console.log('\n👩 Removing demo girl profiles...');
    for (const slug of demoGirlSlugs) {
      // Get girl ID first
      const girl = await db.execute({
        sql: 'SELECT id FROM girls WHERE slug = ?',
        args: [slug]
      });

      if (girl.rows.length > 0) {
        const girlId = girl.rows[0].id;

        // Delete related data first (foreign keys)
        await db.execute({
          sql: 'DELETE FROM girl_photos WHERE girl_id = ?',
          args: [girlId]
        });
        await db.execute({
          sql: 'DELETE FROM girl_videos WHERE girl_id = ?',
          args: [girlId]
        });
        await db.execute({
          sql: 'DELETE FROM availability WHERE girl_id = ?',
          args: [girlId]
        });
        await db.execute({
          sql: 'DELETE FROM bookings WHERE girl_id = ?',
          args: [girlId]
        });
        await db.execute({
          sql: 'DELETE FROM reviews WHERE girl_id = ?',
          args: [girlId]
        });

        // Finally delete the girl
        await db.execute({
          sql: 'DELETE FROM girls WHERE id = ?',
          args: [girlId]
        });

        console.log(`   ✅ Removed: ${slug} and all related data`);
      }
    }

    // 3. Remove sample bookings (with demo client names)
    console.log('\n📅 Removing demo bookings...');
    await db.execute({
      sql: `DELETE FROM bookings WHERE client_name IN (?, ?) OR client_phone LIKE ?`,
      args: ['Jan Novák', 'Petr Svoboda', '+420777%']
    });
    console.log('   ✅ Demo bookings removed');

    // 4. Verify cleanup
    console.log('\n📊 Verification:');
    const userCount = await db.execute('SELECT COUNT(*) as count FROM users');
    const girlCount = await db.execute('SELECT COUNT(*) as count FROM girls');
    const bookingCount = await db.execute('SELECT COUNT(*) as count FROM bookings');

    console.log(`   Users remaining: ${userCount.rows[0].count}`);
    console.log(`   Girls remaining: ${girlCount.rows[0].count}`);
    console.log(`   Bookings remaining: ${bookingCount.rows[0].count}`);

    console.log('\n✅ Demo accounts removed successfully!');
    console.log('\n⚠️  IMPORTANT: Create a new admin account:');
    console.log('   Run: npm run create-admin');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

removeDemoAccounts();
