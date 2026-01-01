import { createClient } from '@libsql/client';
import { config } from 'dotenv';
config({ path: '.env.local' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

try {
  console.log('Creating girl_applications table...');

  await client.execute(`
    CREATE TABLE IF NOT EXISTS girl_applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      -- Personal Info
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      height INTEGER,
      weight INTEGER,
      bust INTEGER,
      waist INTEGER,
      hips INTEGER,

      -- Contact
      email TEXT,
      phone TEXT NOT NULL,
      telegram TEXT,

      -- Professional Info
      experience TEXT,
      languages TEXT,
      availability TEXT,

      -- Bio
      bio_cs TEXT,
      bio_en TEXT,

      -- Photos
      photo_main TEXT,
      photo_gallery TEXT,

      -- Services
      services TEXT,

      -- Status
      status TEXT DEFAULT 'pending',
      reviewed_by INTEGER,
      reviewed_at TEXT,
      rejection_reason TEXT,

      -- Metadata
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      notes TEXT,

      FOREIGN KEY (reviewed_by) REFERENCES users(id)
    )
  `);

  console.log('✓ Table created successfully');

  // Create indexes
  await client.execute('CREATE INDEX IF NOT EXISTS idx_applications_status ON girl_applications(status)');
  await client.execute('CREATE INDEX IF NOT EXISTS idx_applications_created ON girl_applications(created_at)');

  console.log('✓ Indexes created successfully');

  // Verify
  const result = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='girl_applications'");
  console.log('\n=== VERIFICATION ===');
  console.log('Table exists:', result.rows.length > 0);

} catch (error) {
  console.error('Error:', error);
}
