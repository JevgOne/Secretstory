import dotenv from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

// Create DB client
if (!process.env.TURSO_DATABASE_URL) {
  throw new Error('TURSO_DATABASE_URL is not defined');
}

if (!process.env.TURSO_AUTH_TOKEN) {
  throw new Error('TURSO_AUTH_TOKEN is not defined');
}

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function importScrapedBlogs() {
  console.log('Starting blog import from scraped_blog_articles.json...\n');

  // Load scraped articles
  const jsonPath = resolve(__dirname, '../scraped_blog_articles.json');
  const articlesJson = readFileSync(jsonPath, 'utf-8');
  const articles = JSON.parse(articlesJson);

  console.log(`Found ${articles.length} articles to import\n`);

  let imported = 0;
  let skipped = 0;

  for (const article of articles) {
    try {
      // Check if article already exists
      const existing = await db.execute({
        sql: 'SELECT id FROM blog_posts WHERE slug = ?',
        args: [article.slug]
      });

      if (existing.rows.length > 0) {
        console.log(`⏭️  Skipping "${article.title}" - already exists`);
        skipped++;
        continue;
      }

      // Insert blog post
      const result = await db.execute({
        sql: `
          INSERT INTO blog_posts (
            slug, title, excerpt, content, category, featured_image,
            author, read_time, is_featured, is_published, published_at,
            meta_title, meta_description, locale, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          article.slug,
          article.title,
          article.excerpt,
          article.content,
          article.category,
          article.featured_image || null,
          'LovelyGirls Team',
          5, // Default read time
          article.is_featured || 0,
          article.is_published || 1,
          article.is_published ? new Date().toISOString() : null,
          article.title,
          article.excerpt,
          article.locale || 'en',
          new Date().toISOString(),
          new Date().toISOString()
        ]
      });

      console.log(`✅ Imported: "${article.title}" (ID: ${result.lastInsertRowid})`);
      imported++;

    } catch (error) {
      console.error(`❌ Failed to import "${article.title}":`, error);
    }
  }

  console.log(`\n📊 Import Summary:`);
  console.log(`   ✅ Imported: ${imported}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   📝 Total: ${articles.length}`);
}

importScrapedBlogs()
  .then(() => {
    console.log('\n✨ Blog import completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  });
