import { db } from '../lib/db';
import { generateBlogPostContent } from '../lib/blog-content-generator';
import { translateToAllLanguages } from '../lib/auto-translate';

// 10 článků: 2 z každé kategorie
const articleIdeas = [
  // Sex práce (2)
  {
    category: 'sex-prace' as const,
    title: 'Jak se stát escort dívkou v Praze: Kompletní průvodce',
    excerpt: 'Chcete začít pracovat jako escort v Praze? Přečtěte si kompletní průvodce pro začátečnice.',
    keywords: ['escort praha', 'sex práce', 'jak začít', 'průvodce']
  },
  {
    category: 'sex-prace' as const,
    title: 'Bezpečnost v escort práci: 10 pravidel, která musíte znát',
    excerpt: 'Bezpečnost je na prvním místě. Přinášíme vám 10 zlatých pravidel pro bezpečnou escort práci.',
    keywords: ['bezpečnost', 'escort pravidla', 'sex práce bezpečnost']
  },

  // Příběhy z bordelu (2)
  {
    category: 'pribehy-z-bordelu' as const,
    title: 'Můj první den v pražském bordelu: Upřímný příběh',
    excerpt: 'Nervozita, očekávání a překvapení. Jak probíhá první den v jednom z nejlepších bordelů v Praze.',
    keywords: ['příběh escort', 'bordel praha', 'zkušenosti']
  },
  {
    category: 'pribehy-z-bordelu' as const,
    title: 'Klient, který změnil můj pohled na escort práci',
    excerpt: 'Ne všichni klienti jsou stejní. Příběh o setkání, které mi ukázalo krásu této profese.',
    keywords: ['escort příběh', 'klient', 'zkušenost']
  },

  // Rady a tipy (2)
  {
    category: 'rady-a-tipy' as const,
    title: 'Etiketa pro klienty: Jak se chovat při návštěvě escort dívky',
    excerpt: 'Chcete, aby vaše návštěva byla příjemná pro obě strany? Dodržujte základní pravidla slušnosti.',
    keywords: ['etiketa klient', 'jak se chovat', 'escort návštěva']
  },
  {
    category: 'rady-a-tipy' as const,
    title: 'Nejlepší hotely v Praze pro escort schůzky',
    excerpt: 'Diskrétní, luxusní a escort-friendly hotely v centru Prahy, kde si užijete soukromí.',
    keywords: ['hotely praha', 'escort hotel', 'diskrétní ubytování']
  },

  // Novinky (2)
  {
    category: 'novinky' as const,
    title: 'Nové trendy v pražské escort scéně pro rok 2026',
    excerpt: 'Co přináší rok 2026? GFE zážitky, online booking a rostoucí profesionalita.',
    keywords: ['escort trendy', 'novinky 2026', 'escort praha']
  },
  {
    category: 'novinky' as const,
    title: 'LovelyGirls rozšiřuje tým: Nové dívky a služby',
    excerpt: 'Představujeme nové escort dívky a speciální služby, které jsme přidali do naší nabídky.',
    keywords: ['nové dívky', 'lovelygirls', 'escort služby']
  },

  // Ostatní (2)
  {
    category: 'ostatni' as const,
    title: 'Praha jako destinace pro escort tourism: Průvodce pro zahraniční návštěvníky',
    excerpt: 'Praha je jedním z nejlepších měst pro escort tourism v Evropě. Zjistěte proč.',
    keywords: ['praha escort', 'escort tourism', 'zahraniční klienti']
  },
  {
    category: 'ostatni' as const,
    title: 'Právní aspekty sex práce v České republice: Co je legální?',
    excerpt: 'Úplný přehled právní situace escort a sex práce v ČR. Co je dovoleno a co ne.',
    keywords: ['právo sex práce', 'legislativa escort', 'legální escort']
  }
];

async function seedBlogArticles() {
  console.log('🚀 Starting blog articles seeding...');
  console.log(`📝 Will create ${articleIdeas.length} articles × 4 languages = ${articleIdeas.length * 4} total articles`);
  console.log(`📋 All articles will be DRAFT - you will set publication dates manually\n`);

  let articleIndex = 0;

  for (const idea of articleIdeas) {
    articleIndex++;
    console.log(`\n[${ articleIndex}/${articleIdeas.length}] Processing: ${idea.title}`);
    console.log(`   Category: ${idea.category}`);

    try {
      // 1. Generate full content in Czech
      console.log('   🤖 Generating Czech content...');
      const content = await generateBlogPostContent(idea);

      // Generate slug
      const slug = content.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // 2. Insert Czech article (as DRAFT - no scheduling)
      console.log('   💾 Saving Czech article...');
      const csResult = await db.execute({
        sql: `
          INSERT INTO blog_posts (
            slug, title, excerpt, content, category,
            author, read_time, is_featured, is_published,
            locale,
            meta_title, meta_description, meta_keywords,
            review_status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          slug,
          content.title,
          content.excerpt,
          content.content,
          idea.category,
          'AI Generator',
          content.read_time,
          0,
          0,
          'cs',
          content.meta_title,
          content.meta_description,
          content.meta_keywords,
          'draft'
        ]
      });

      const csPostId = Number(csResult.lastInsertRowid);
      console.log(`   ✓ Czech article created (ID: ${csPostId})`);

      // 3. Translate to all other languages
      console.log('   🌍 Translating to EN, DE, UK...');
      const translations = await translateToAllLanguages(
        {
          title: content.title,
          excerpt: content.excerpt,
          content: content.content,
          meta_description: content.meta_description
        },
        'cs'
      );

      // 4. Create translated articles
      const languages = [
        { code: 'en', name: 'English', copywriter: 2 },
        { code: 'de', name: 'Deutsch', copywriter: 3 },
        { code: 'uk', name: 'Українська', copywriter: 4 }
      ];

      for (const lang of languages) {
        const translated = translations[lang.code];
        if (!translated) {
          console.log(`   ⚠️  Translation to ${lang.name} failed, skipping...`);
          continue;
        }

        const translatedSlug = translated.title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');

        const langResult = await db.execute({
          sql: `
            INSERT INTO blog_posts (
              slug, title, excerpt, content, category,
              author, read_time, is_featured, is_published,
              locale,
              meta_title, meta_description, meta_keywords,
              review_status, assigned_copywriter_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          args: [
            translatedSlug,
            translated.title,
            translated.excerpt,
            translated.content,
            idea.category,
            'Auto-Translate',
            content.read_time,
            0,
            0,
            lang.code,
            translated.title,
            translated.meta_description,
            content.meta_keywords,
            'pending_review',
            lang.copywriter
          ]
        });

        console.log(`   ✓ ${lang.name} translation created (ID: ${Number(langResult.lastInsertRowid)}) - Assigned to Copywriter ${lang.copywriter}`);
      }

      console.log(`   🎉 Article complete! Status: DRAFT (ready for manual scheduling)`);

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.error(`   ❌ Error processing article:`, error);
      console.error(`   Continuing with next article...\n`);
    }
  }

  console.log('\n✅ Seeding complete!');
  console.log(`📊 Total articles created: ${articleIdeas.length} × 4 languages = ${articleIdeas.length * 4} articles`);
  console.log(`\n📝 All articles are in DRAFT status`);
  console.log(`🔍 Review at: /admin/blog`);
  console.log(`\n📅 Next steps:`);
  console.log(`   1. Open each article in /admin/blog`);
  console.log(`   2. Review and edit content`);
  console.log(`   3. Set publication date/time`);
  console.log(`   4. Click "Naplánovat článek" or "Publikovat okamžitě"`);
  console.log(`\n🌍 Translations are assigned to copywriters:`);
  console.log(`   🇨🇿 Czech: No copywriter (you review)`);
  console.log(`   🇬🇧 English: Copywriter #2`);
  console.log(`   🇩🇪 Deutsch: Copywriter #3`);
  console.log(`   🇺🇦 Українська: Copywriter #4`);
}

// Run if called directly
if (require.main === module) {
  seedBlogArticles()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { seedBlogArticles };
