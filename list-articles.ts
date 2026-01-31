import {db} from './lib/db.js';

(async () => {
  const result = await db.execute(`
    SELECT id, title, category, locale, LENGTH(content) as content_length
    FROM blog_posts
    ORDER BY id
  `);

  console.log('\n📚 Vygenerované články:\n');

  const byTitle: Record<string, any[]> = {};

  result.rows.forEach((row: any) => {
    const baseTitle = row.title.split(' - ')[0]; // Get title without language suffix
    if (!byTitle[baseTitle]) {
      byTitle[baseTitle] = [];
    }
    byTitle[baseTitle].push(row);
  });

  Object.entries(byTitle).forEach(([title, articles]) => {
    const languages = articles.map(a => a.locale).join(', ');
    const category = articles[0].category;
    const contentLength = Math.round(articles[0].content_length / 1000);
    console.log(`✅ ${title}`);
    console.log(`   Kategorie: ${category}`);
    console.log(`   Jazyky: ${languages} (${articles.length}/4)`);
    console.log(`   Délka: ~${contentLength}k znaků`);
    console.log('');
  });

  console.log(`\n📊 Celkem: ${result.rows.length} článků v ${Object.keys(byTitle).length} tématech\n`);
})();
