import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'libsql://lg-jevgone.aws-ap-south-1.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function checkTable() {
  console.log('🔍 Kontroluji tabulku girl_photos...\n');

  try {
    // Check if table exists
    const tableCheck = await db.execute(`
      SELECT name FROM sqlite_master
      WHERE type='table' AND name='girl_photos'
    `);

    if (tableCheck.rows.length === 0) {
      console.log('❌ Tabulka girl_photos NEEXISTUJE!');
      console.log('\n📝 Vytvoř ji pomocí:');
      console.log(`
CREATE TABLE girl_photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  girl_id INTEGER NOT NULL,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_primary INTEGER DEFAULT 0,
  alt_text TEXT,
  file_size INTEGER,
  mime_type TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_girl_photos_girl_id ON girl_photos(girl_id);
CREATE INDEX idx_girl_photos_display_order ON girl_photos(girl_id, display_order);
      `);
      return;
    }

    console.log('✅ Tabulka girl_photos existuje\n');

    // Get table structure
    const structure = await db.execute(`PRAGMA table_info(girl_photos)`);

    console.log('📊 Struktura tabulky:');
    console.log('─'.repeat(80));
    structure.rows.forEach(col => {
      console.log(`${col.name.padEnd(20)} ${col.type.padEnd(15)} ${col.notnull ? 'NOT NULL' : 'NULL'}`);
    });
    console.log('─'.repeat(80));

    // Count photos
    const count = await db.execute('SELECT COUNT(*) as count FROM girl_photos');
    console.log(`\n📸 Celkem fotek: ${count.rows[0].count}`);

    // Sample photos
    const samples = await db.execute('SELECT * FROM girl_photos LIMIT 3');
    if (samples.rows.length > 0) {
      console.log('\n📷 Ukázkové fotky:');
      samples.rows.forEach(photo => {
        console.log(`  - ID ${photo.id}, Girl ${photo.girl_id}, ${photo.filename}`);
      });
    }

  } catch (error) {
    console.error('❌ Chyba:', error.message);
  }
}

checkTable();
