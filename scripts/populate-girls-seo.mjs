import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN
});

console.log('🚀 Starting girl profiles SEO generation...\n');

// Get all active girls
const girlsResult = await db.execute({
  sql: "SELECT id, name, slug, age, nationality, services FROM girls WHERE status = 'active'"
});

const girls = girlsResult.rows;
console.log(`📋 Found ${girls.length} active girls\n`);

const locales = [
  { code: 'cs', lang: 'Czech' },
  { code: 'en', lang: 'English' },
  { code: 'de', lang: 'German' },
  { code: 'uk', lang: 'Ukrainian' }
];

let created = 0;
let updated = 0;
let errors = 0;

for (const girl of girls) {
  const name = girl.name;
  const slug = girl.slug;
  const age = girl.age;
  const nationality = girl.nationality || 'Czech';

  // Parse services if it's JSON
  let servicesText = 'Classic escort, GFE';
  try {
    if (girl.services && typeof girl.services === 'string') {
      const services = JSON.parse(girl.services);
      if (Array.isArray(services) && services.length > 0) {
        servicesText = services.slice(0, 3).join(', ');
      }
    }
  } catch (e) {
    // Keep default
  }

  for (const locale of locales) {
    const pagePath = `/${locale.code}/profily/${slug}`;

    // Generate locale-specific SEO
    let metaTitle, metaDescription, focusKeyword;

    if (locale.code === 'cs') {
      metaTitle = `${name} (${age}) - Escort Praha | Ověřený Profil | LovelyGirls`;
      metaDescription = `${name}, ${age} let, ${nationality}. Profesionální escort služby v Praze. ${servicesText}. Rezervace přes WhatsApp, 100% ověřený profil, diskrétní setkání.`;
      focusKeyword = `${name} escort praha`;
    } else if (locale.code === 'en') {
      metaTitle = `${name} (${age}) - Escort Prague | Verified Profile | LovelyGirls`;
      metaDescription = `${name}, ${age} years old, ${nationality}. Professional escort services in Prague. ${servicesText}. Book via WhatsApp, 100% verified profile, discreet meetings.`;
      focusKeyword = `${name} escort prague`;
    } else if (locale.code === 'de') {
      metaTitle = `${name} (${age}) - Escort Prag | Verifiziertes Profil | LovelyGirls`;
      metaDescription = `${name}, ${age} Jahre alt, ${nationality}. Professionelle Escort-Services in Prag. ${servicesText}. Buchen Sie über WhatsApp, 100% verifiziertes Profil.`;
      focusKeyword = `${name} escort prag`;
    } else { // uk
      metaTitle = `${name} (${age}) - Ескорт Прага | Перевірений Профіль | LovelyGirls`;
      metaDescription = `${name}, ${age} років, ${nationality}. Професійні ескорт послуги в Празі. ${servicesText}. Бронювання через WhatsApp, 100% перевірений профіль.`;
      focusKeyword = `${name} ескорт прага`;
    }

    try {
      // Check if exists
      const existing = await db.execute({
        sql: 'SELECT id FROM seo_metadata WHERE page_path = ?',
        args: [pagePath]
      });

      const seoData = {
        page_type: 'girl',
        locale: locale.code,
        meta_title: metaTitle,
        meta_description: metaDescription,
        meta_keywords: `${name} escort, ${name} praha, escort ${nationality}, ${age} let escort, ${servicesText}`,
        og_title: `${name} - ${age} years - Escort Prague`,
        og_description: metaDescription,
        og_image: `https://www.eroticreviews.uk/girls/${slug}/main.jpg`,
        og_type: 'profile',
        canonical_url: `https://www.eroticreviews.uk${pagePath}`,
        robots_index: 1,
        robots_follow: 1,
        focus_keyword: focusKeyword,
        seo_score: 88
      };

      if (existing.rows.length > 0) {
        // Update
        await db.execute({
          sql: `UPDATE seo_metadata SET
            page_type = ?,
            locale = ?,
            meta_title = ?,
            meta_description = ?,
            meta_keywords = ?,
            og_title = ?,
            og_description = ?,
            og_image = ?,
            og_type = ?,
            canonical_url = ?,
            robots_index = ?,
            robots_follow = ?,
            focus_keyword = ?,
            seo_score = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE page_path = ?`,
          args: [
            seoData.page_type,
            seoData.locale,
            seoData.meta_title,
            seoData.meta_description,
            seoData.meta_keywords,
            seoData.og_title,
            seoData.og_description,
            seoData.og_image,
            seoData.og_type,
            seoData.canonical_url,
            seoData.robots_index,
            seoData.robots_follow,
            seoData.focus_keyword,
            seoData.seo_score,
            pagePath
          ]
        });
        updated++;
      } else {
        // Insert
        await db.execute({
          sql: `INSERT INTO seo_metadata (
            page_path, page_type, locale,
            meta_title, meta_description, meta_keywords,
            og_title, og_description, og_image, og_type,
            twitter_card, twitter_title, twitter_description, twitter_image,
            canonical_url, robots_index, robots_follow, focus_keyword, seo_score
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            pagePath,
            seoData.page_type,
            seoData.locale,
            seoData.meta_title,
            seoData.meta_description,
            seoData.meta_keywords,
            seoData.og_title,
            seoData.og_description,
            seoData.og_image,
            seoData.og_type,
            'summary_large_image',
            seoData.og_title,
            seoData.og_description,
            seoData.og_image,
            seoData.canonical_url,
            seoData.robots_index,
            seoData.robots_follow,
            seoData.focus_keyword,
            seoData.seo_score
          ]
        });
        created++;
      }
      console.log(`✅ ${pagePath}`);
    } catch (error) {
      errors++;
      console.error(`❌ Error for ${pagePath}:`, error.message);
    }
  }
}

console.log('\n📊 Summary:');
console.log(`✨ Created: ${created}`);
console.log(`✅ Updated: ${updated}`);
console.log(`❌ Errors: ${errors}`);
console.log(`👧 Girls processed: ${girls.length}`);
console.log(`📄 Total SEO pages: ${girls.length * locales.length}`);
console.log('\n✅ Girl profiles SEO generation complete!');

process.exit(0);
