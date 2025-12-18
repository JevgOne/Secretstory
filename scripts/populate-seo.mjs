import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN
});

// SEO data for all pages in all locales
const seoPages = [
  // CZECH (cs) - Main pages
  {
    page_path: '/cs',
    page_type: 'static',
    locale: 'cs',
    meta_title: 'Luxusní Escort Praha | Ověřené Dívky | LovelyGirls',
    meta_description: 'Prémiové escort služby v Praze. Ověřené profily, diskrétní setkání, rychlá rezervace přes WhatsApp. Elegantní společnice pro náročné gentlemany.',
    meta_keywords: 'escort praha, escort služby praha, luxusní escort, ověřené dívky, společnice praha, diskrétní escort, vip escort praha',
    focus_keyword: 'escort praha',
    og_title: 'LovelyGirls Prague - Luxusní Escort Služby',
    og_description: 'Nejlepší escort služby v Praze. Ověřené profily, 100% diskrétní, dostupné 24/7.',
    og_image: 'https://www.eroticreviews.uk/og-image.jpg',
    og_type: 'website',
    canonical_url: 'https://www.eroticreviews.uk/cs',
    robots_index: 1,
    robots_follow: 1,
    seo_score: 85
  },
  {
    page_path: '/cs/divky',
    page_type: 'static',
    locale: 'cs',
    meta_title: 'Naše Dívky - Escort Praha | LovelyGirls',
    meta_description: 'Prohlédněte si profily našich ověřených escort dívek v Praze. Profesionální společnice, modelky a VIP escort služby. Online dostupnost 24/7.',
    meta_keywords: 'escort dívky praha, escort modelky, vip dívky, společnice profily, escort galerie praha',
    focus_keyword: 'escort dívky praha',
    og_title: 'Escort Dívky Praha - Ověřené Profily',
    og_description: 'Největší výběr ověřených escort dívek v Praze. Prohlédněte si profily, fotky a online dostupnost.',
    canonical_url: 'https://www.eroticreviews.uk/cs/divky',
    robots_index: 1,
    robots_follow: 1,
    seo_score: 90
  },
  {
    page_path: '/cs/cenik',
    page_type: 'static',
    locale: 'cs',
    meta_title: 'Ceník Escort Služeb Praha | Transparentní Ceny | LovelyGirls',
    meta_description: 'Přehledný ceník escort služeb v Praze. Jasné ceny, žádné skryté poplatky. 1 hodina od 3000 Kč. VIP služby, erotická masáž, GFE experience.',
    meta_keywords: 'ceník escort praha, ceny escort služeb, kolik stojí escort, escort ceny praha, vip escort cena',
    focus_keyword: 'ceník escort praha',
    canonical_url: 'https://www.eroticreviews.uk/cs/cenik',
    robots_index: 1,
    robots_follow: 1,
    seo_score: 80
  },
  {
    page_path: '/cs/faq',
    page_type: 'static',
    locale: 'cs',
    meta_title: 'Časté Otázky (FAQ) - Escort Praha | LovelyGirls',
    meta_description: 'Odpovědi na nejčastější otázky o escort službách v Praze. Jak objednat, platba, diskrétnost, bezpečnost. Vše co potřebujete vědět.',
    meta_keywords: 'escort faq, otázky escort, jak objednat escort, bezpečnost escort, diskrétní escort',
    focus_keyword: 'escort faq praha',
    canonical_url: 'https://www.eroticreviews.uk/cs/faq',
    robots_index: 1,
    robots_follow: 1,
    seo_score: 75
  },
  {
    page_path: '/cs/schedule',
    page_type: 'static',
    locale: 'cs',
    meta_title: 'Rozpis Dostupnosti - Kdo Je Online Dnes | LovelyGirls Praha',
    meta_description: 'Aktuální rozpis dostupnosti escort dívek v Praze. Zjistěte kdo je online právě teď. Rezervujte si schůzku ještě dnes přes WhatsApp.',
    meta_keywords: 'escort dostupnost praha, kdo je online, escort rozpis, dostupné dívky praha, escort dnes',
    focus_keyword: 'escort dostupnost praha',
    canonical_url: 'https://www.eroticreviews.uk/cs/schedule',
    robots_index: 1,
    robots_follow: 1,
    seo_score: 85
  },
  {
    page_path: '/cs/sluzby',
    page_type: 'static',
    locale: 'cs',
    meta_title: 'Naše Služby - Escort, Masáž, VIP | LovelyGirls Praha',
    meta_description: 'Široká nabídka escort služeb v Praze: klasický escort, erotická masáž, GFE, PSE, duo, tantra masáž. Profesionální a diskrétní služby 24/7.',
    meta_keywords: 'escort služby praha, erotická masáž, gfe escort, vip escort, tantra masáž, duo escort',
    focus_keyword: 'escort služby praha',
    canonical_url: 'https://www.eroticreviews.uk/cs/sluzby',
    robots_index: 1,
    robots_follow: 1,
    seo_score: 82
  },
  {
    page_path: '/cs/blog',
    page_type: 'static',
    locale: 'cs',
    meta_title: 'Blog - Tipy a Články o Escort Službách | LovelyGirls',
    meta_description: 'Zajímavé články, tipy a novinky ze světa escort služeb. Rady pro klienty, průvodce Prahou, lifestyle články od našich dívek.',
    meta_keywords: 'escort blog, escort články, escort tipy, escort průvodce, novinky escort praha',
    focus_keyword: 'escort blog praha',
    canonical_url: 'https://www.eroticreviews.uk/cs/blog',
    robots_index: 1,
    robots_follow: 1,
    seo_score: 70
  },
  {
    page_path: '/cs/discounts',
    page_type: 'static',
    locale: 'cs',
    meta_title: 'Akce a Slevy - Escort Praha | LovelyGirls',
    meta_description: 'Aktuální akce a slevy na escort služby v Praze. Speciální nabídky, duo slevy, věrnostní program. Ušetřete až 30% na vybraných službách.',
    meta_keywords: 'escort slevy praha, akce escort, duo sleva, escort věrnostní program, levný escort praha',
    focus_keyword: 'escort slevy praha',
    canonical_url: 'https://www.eroticreviews.uk/cs/discounts',
    robots_index: 1,
    robots_follow: 1,
    seo_score: 75
  },
  {
    page_path: '/cs/podminky',
    page_type: 'static',
    locale: 'cs',
    meta_title: 'Podmínky Používání | LovelyGirls Praha',
    meta_description: 'Podmínky používání escort služeb LovelyGirls Praha. Pravidla rezervace, platby, storno podmínky a další důležité informace.',
    meta_keywords: 'podmínky escort, pravidla rezervace, storno podmínky escort',
    focus_keyword: 'podmínky escort praha',
    canonical_url: 'https://www.eroticreviews.uk/cs/podminky',
    robots_index: 1,
    robots_follow: 1,
    seo_score: 65
  },
  {
    page_path: '/cs/soukromi',
    page_type: 'static',
    locale: 'cs',
    meta_title: 'Ochrana Soukromí | LovelyGirls Praha',
    meta_description: 'Zásady ochrany osobních údajů LovelyGirls Praha. 100% diskrétnost, šifrovaná komunikace, žádné sdílení dat třetím stranám.',
    meta_keywords: 'ochrana soukromí escort, diskrétnost escort, gdpr escort, bezpečnost dat',
    focus_keyword: 'diskrétnost escort praha',
    canonical_url: 'https://www.eroticreviews.uk/cs/soukromi',
    robots_index: 1,
    robots_follow: 1,
    seo_score: 65
  },

  // ENGLISH (en) - Main pages
  {
    page_path: '/en',
    page_type: 'static',
    locale: 'en',
    meta_title: 'Luxury Escort Prague | Verified Girls | LovelyGirls',
    meta_description: 'Premium escort services in Prague. Verified profiles, discreet meetings, fast booking via WhatsApp. Elegant companions for discerning gentlemen.',
    meta_keywords: 'escort prague, escort services prague, luxury escort, verified girls, companions prague, discreet escort, vip escort prague',
    focus_keyword: 'escort prague',
    og_title: 'LovelyGirls Prague - Luxury Escort Services',
    og_description: 'Best escort services in Prague. Verified profiles, 100% discreet, available 24/7.',
    og_image: 'https://www.eroticreviews.uk/og-image.jpg',
    og_type: 'website',
    canonical_url: 'https://www.eroticreviews.uk/en',
    robots_index: 1,
    robots_follow: 1,
    seo_score: 85
  },
  {
    page_path: '/en/divky',
    page_type: 'static',
    locale: 'en',
    meta_title: 'Our Girls - Escort Prague | LovelyGirls',
    meta_description: 'Browse verified escort girl profiles in Prague. Professional companions, models and VIP escort services. Online availability 24/7.',
    meta_keywords: 'escort girls prague, escort models, vip girls, companion profiles, escort gallery prague',
    focus_keyword: 'escort girls prague',
    canonical_url: 'https://www.eroticreviews.uk/en/divky',
    robots_index: 1,
    robots_follow: 1,
    seo_score: 90
  },
  {
    page_path: '/en/cenik',
    page_type: 'static',
    locale: 'en',
    meta_title: 'Pricing - Escort Services Prague | Transparent Rates | LovelyGirls',
    meta_description: 'Clear pricing for escort services in Prague. Transparent rates, no hidden fees. 1 hour from 120 EUR. VIP services, erotic massage, GFE experience.',
    meta_keywords: 'escort pricing prague, escort rates, how much escort cost, escort prices prague, vip escort price',
    focus_keyword: 'escort pricing prague',
    canonical_url: 'https://www.eroticreviews.uk/en/cenik',
    robots_index: 1,
    robots_follow: 1,
    seo_score: 80
  },
  {
    page_path: '/en/faq',
    page_type: 'static',
    locale: 'en',
    meta_title: 'FAQ - Escort Prague | LovelyGirls',
    meta_description: 'Answers to frequently asked questions about escort services in Prague. How to book, payment, discretion, safety. Everything you need to know.',
    meta_keywords: 'escort faq, escort questions, how to book escort, escort safety, discreet escort',
    focus_keyword: 'escort faq prague',
    canonical_url: 'https://www.eroticreviews.uk/en/faq',
    robots_index: 1,
    robots_follow: 1,
    seo_score: 75
  },
  {
    page_path: '/en/schedule',
    page_type: 'static',
    locale: 'en',
    meta_title: 'Schedule - Who Is Online Today | LovelyGirls Prague',
    meta_description: 'Current availability schedule of escort girls in Prague. Find out who is online right now. Book your meeting today via WhatsApp.',
    meta_keywords: 'escort availability prague, who is online, escort schedule, available girls prague, escort today',
    focus_keyword: 'escort availability prague',
    canonical_url: 'https://www.eroticreviews.uk/en/schedule',
    robots_index: 1,
    robots_follow: 1,
    seo_score: 85
  },
  {
    page_path: '/en/sluzby',
    page_type: 'static',
    locale: 'en',
    meta_title: 'Our Services - Escort, Massage, VIP | LovelyGirls Prague',
    meta_description: 'Wide range of escort services in Prague: classic escort, erotic massage, GFE, PSE, duo, tantra massage. Professional and discreet services 24/7.',
    meta_keywords: 'escort services prague, erotic massage, gfe escort, vip escort, tantra massage, duo escort',
    focus_keyword: 'escort services prague',
    canonical_url: 'https://www.eroticreviews.uk/en/sluzby',
    robots_index: 1,
    robots_follow: 1,
    seo_score: 82
  },

  // GERMAN (de) - Main pages
  {
    page_path: '/de',
    page_type: 'static',
    locale: 'de',
    meta_title: 'Luxus-Escort Prag | Verifizierte Mädchen | LovelyGirls',
    meta_description: 'Premium-Escort-Services in Prag. Verifizierte Profile, diskrete Treffen, schnelle Buchung über WhatsApp. Elegante Begleiterinnen für anspruchsvolle Gentlemen.',
    meta_keywords: 'escort prag, escort-services prag, luxus-escort, verifizierte mädchen, begleiterinnen prag, diskreter escort, vip escort prag',
    focus_keyword: 'escort prag',
    og_title: 'LovelyGirls Prag - Luxus-Escort-Services',
    og_description: 'Beste Escort-Services in Prag. Verifizierte Profile, 100% diskret, verfügbar 24/7.',
    canonical_url: 'https://www.eroticreviews.uk/de',
    robots_index: 1,
    robots_follow: 1,
    seo_score: 85
  },
  {
    page_path: '/de/divky',
    page_type: 'static',
    locale: 'de',
    meta_title: 'Unsere Mädchen - Escort Prag | LovelyGirls',
    meta_description: 'Durchsuchen Sie verifizierte Escort-Mädchen-Profile in Prag. Professionelle Begleiterinnen, Models und VIP-Escort-Services. Online-Verfügbarkeit 24/7.',
    meta_keywords: 'escort mädchen prag, escort models, vip mädchen, begleiter profile, escort galerie prag',
    focus_keyword: 'escort mädchen prag',
    canonical_url: 'https://www.eroticreviews.uk/de/divky',
    robots_index: 1,
    robots_follow: 1,
    seo_score: 90
  },

  // UKRAINIAN (uk) - Main pages
  {
    page_path: '/uk',
    page_type: 'static',
    locale: 'uk',
    meta_title: 'Люксовий Ескорт Прага | Перевірені Дівчата | LovelyGirls',
    meta_description: 'Преміум ескорт послуги в Празі. Перевірені профілі, дискретні зустрічі, швидке бронювання через WhatsApp. Елегантні супутниці для вимогливих джентльменів.',
    meta_keywords: 'ескорт прага, ескорт послуги прага, люксовий ескорт, перевірені дівчата, супутниці прага, дискретний ескорт',
    focus_keyword: 'ескорт прага',
    canonical_url: 'https://www.eroticreviews.uk/uk',
    robots_index: 1,
    robots_follow: 1,
    seo_score: 85
  },
  {
    page_path: '/uk/divky',
    page_type: 'static',
    locale: 'uk',
    meta_title: 'Наші Дівчата - Ескорт Прага | LovelyGirls',
    meta_description: 'Перегляньте профілі перевірених ескорт дівчат у Празі. Професійні супутниці, моделі та VIP ескорт послуги. Онлайн доступність 24/7.',
    meta_keywords: 'ескорт дівчата прага, ескорт моделі, vip дівчата, профілі супутниць, галерея ескорт прага',
    focus_keyword: 'ескорт дівчата прага',
    canonical_url: 'https://www.eroticreviews.uk/uk/divky',
    robots_index: 1,
    robots_follow: 1,
    seo_score: 90
  }
];

console.log('🚀 Starting SEO data population...\n');

let created = 0;
let updated = 0;
let errors = 0;

for (const page of seoPages) {
  try {
    // Check if page already exists
    const existing = await db.execute({
      sql: 'SELECT id FROM seo_metadata WHERE page_path = ?',
      args: [page.page_path]
    });

    if (existing.rows.length > 0) {
      // Update existing
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
          twitter_card = ?,
          twitter_title = ?,
          twitter_description = ?,
          twitter_image = ?,
          canonical_url = ?,
          robots_index = ?,
          robots_follow = ?,
          focus_keyword = ?,
          seo_score = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE page_path = ?`,
        args: [
          page.page_type,
          page.locale,
          page.meta_title,
          page.meta_description,
          page.meta_keywords,
          page.og_title || page.meta_title,
          page.og_description || page.meta_description,
          page.og_image || 'https://www.eroticreviews.uk/og-image.jpg',
          page.og_type || 'website',
          'summary_large_image',
          page.og_title || page.meta_title,
          page.og_description || page.meta_description,
          page.og_image || 'https://www.eroticreviews.uk/og-image.jpg',
          page.canonical_url,
          page.robots_index,
          page.robots_follow,
          page.focus_keyword,
          page.seo_score,
          page.page_path
        ]
      });
      updated++;
      console.log(`✅ Updated: ${page.page_path}`);
    } else {
      // Insert new
      await db.execute({
        sql: `INSERT INTO seo_metadata (
          page_path, page_type, locale,
          meta_title, meta_description, meta_keywords,
          og_title, og_description, og_image, og_type,
          twitter_card, twitter_title, twitter_description, twitter_image,
          canonical_url, robots_index, robots_follow, focus_keyword, seo_score
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          page.page_path,
          page.page_type,
          page.locale,
          page.meta_title,
          page.meta_description,
          page.meta_keywords,
          page.og_title || page.meta_title,
          page.og_description || page.meta_description,
          page.og_image || 'https://www.eroticreviews.uk/og-image.jpg',
          page.og_type || 'website',
          'summary_large_image',
          page.og_title || page.meta_title,
          page.og_description || page.meta_description,
          page.og_image || 'https://www.eroticreviews.uk/og-image.jpg',
          page.canonical_url,
          page.robots_index,
          page.robots_follow,
          page.focus_keyword,
          page.seo_score
        ]
      });
      created++;
      console.log(`✨ Created: ${page.page_path}`);
    }
  } catch (error) {
    errors++;
    console.error(`❌ Error for ${page.page_path}:`, error.message);
  }
}

console.log('\n📊 Summary:');
console.log(`✨ Created: ${created}`);
console.log(`✅ Updated: ${updated}`);
console.log(`❌ Errors: ${errors}`);
console.log(`📄 Total pages: ${seoPages.length}`);
console.log('\n✅ SEO data population complete!');

process.exit(0);
