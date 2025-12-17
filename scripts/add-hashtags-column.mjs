import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN
});

// Add hashtags column to girls table
try {
  await db.execute('ALTER TABLE girls ADD COLUMN hashtags TEXT');
  console.log('Successfully added hashtags column');
} catch (error) {
  if (error.message && error.message.includes('duplicate column')) {
    console.log('Column hashtags already exists');
  } else {
    console.error('Error adding column:', error);
  }
}

process.exit(0);
