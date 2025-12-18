import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN
});

console.log('📊 SEO Status Report\n');
console.log('='.repeat(60));

// Count by page type
const typeStats = await db.execute({
  sql: `SELECT page_type, COUNT(*) as count, AVG(seo_score) as avg_score
        FROM seo_metadata
        GROUP BY page_type
        ORDER BY count DESC`
});

console.log('\n📄 Pages by Type:');
typeStats.rows.forEach(row => {
  console.log(`  ${row.page_type.padEnd(15)} ${String(row.count).padStart(3)} pages  (Avg score: ${Math.round(row.avg_score)})`);
});

// Count by locale
const localeStats = await db.execute({
  sql: `SELECT locale, COUNT(*) as count
        FROM seo_metadata
        GROUP BY locale
        ORDER BY count DESC`
});

console.log('\n🌍 Pages by Locale:');
localeStats.rows.forEach(row => {
  console.log(`  ${row.locale}  ${String(row.count).padStart(3)} pages`);
});

// SEO Score distribution
const scoreStats = await db.execute({
  sql: `SELECT
          SUM(CASE WHEN seo_score >= 80 THEN 1 ELSE 0 END) as excellent,
          SUM(CASE WHEN seo_score >= 50 AND seo_score < 80 THEN 1 ELSE 0 END) as good,
          SUM(CASE WHEN seo_score < 50 THEN 1 ELSE 0 END) as poor,
          AVG(seo_score) as avg_score
        FROM seo_metadata`
});

const scores = scoreStats.rows[0];
console.log('\n⭐ SEO Score Distribution:');
console.log(`  Excellent (≥80): ${scores.excellent} pages`);
console.log(`  Good (50-79):    ${scores.good} pages`);
console.log(`  Poor (<50):      ${scores.poor} pages`);
console.log(`  Average Score:   ${Math.round(scores.avg_score)}/100`);

// Total count
const total = await db.execute({
  sql: 'SELECT COUNT(*) as total FROM seo_metadata'
});

console.log('\n' + '='.repeat(60));
console.log(`✅ Total SEO pages: ${total.rows[0].total}`);
console.log('='.repeat(60));

// Show some example pages
console.log('\n📋 Sample SEO Pages:');
const samples = await db.execute({
  sql: 'SELECT page_path, meta_title, seo_score FROM seo_metadata ORDER BY seo_score DESC LIMIT 5'
});

samples.rows.forEach((row, i) => {
  console.log(`\n${i + 1}. ${row.page_path}`);
  console.log(`   Title: ${row.meta_title}`);
  console.log(`   Score: ${row.seo_score}/100`);
});

console.log('\n✅ SEO Status Check Complete!\n');

process.exit(0);
