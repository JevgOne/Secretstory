-- SEO Metadata Table (like Yoast SEO for WordPress)
CREATE TABLE IF NOT EXISTS seo_metadata (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_path TEXT NOT NULL UNIQUE, -- e.g., '/cs/divky', '/en/blog', '/cs/profily/emma'
  page_type TEXT NOT NULL, -- 'static', 'dynamic', 'blog', 'girl_profile'
  locale TEXT DEFAULT 'cs', -- 'cs', 'en', 'de', 'uk'

  -- SEO Fields
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,

  -- Open Graph
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  og_type TEXT DEFAULT 'website', -- 'website', 'article', 'profile'

  -- Twitter Card
  twitter_card TEXT DEFAULT 'summary_large_image',
  twitter_title TEXT,
  twitter_description TEXT,
  twitter_image TEXT,

  -- Schema.org JSON-LD
  schema_type TEXT, -- 'Organization', 'Person', 'Service', 'Article', 'FAQPage'
  schema_data TEXT, -- JSON string with custom schema data

  -- Canonical & Robots
  canonical_url TEXT,
  robots_index INTEGER DEFAULT 1, -- 1 = index, 0 = noindex
  robots_follow INTEGER DEFAULT 1, -- 1 = follow, 0 = nofollow

  -- Focus Keyword (like Yoast)
  focus_keyword TEXT,
  seo_score INTEGER DEFAULT 0, -- 0-100 SEO score

  -- Timestamps
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_seo_page_path ON seo_metadata(page_path);
CREATE INDEX IF NOT EXISTS idx_seo_locale ON seo_metadata(locale);
CREATE INDEX IF NOT EXISTS idx_seo_page_type ON seo_metadata(page_type);

-- Insert default SEO metadata for main pages
INSERT OR IGNORE INTO seo_metadata (page_path, page_type, locale, meta_title, meta_description, meta_keywords, focus_keyword) VALUES
  -- Homepage
  ('/cs', 'static', 'cs', 'LovelyGirls Prague - Premium Escort & Erotické Masáže', 'Prémiové escort služby v Praze. Profesionální společnice, erotické masáže, VIP služby. Ověřené profily, diskrétní, k dispozici 24/7.', 'escort prague, erotické masáže praha, VIP escort, luxusní společnice', 'escort prague'),
  ('/en', 'static', 'en', 'LovelyGirls Prague - Premium Escort & Erotic Massage Services', 'Premium escort services in Prague. Professional companions, erotic massage, VIP services. Verified profiles, discreet, available 24/7.', 'escort prague, erotic massage prague, VIP escort czech, luxury companions', 'escort prague'),

  -- Girls page
  ('/cs/divky', 'static', 'cs', 'Naše Dívky - Premium Escort Praha | LovelyGirls', 'Prohlédněte si profily našich krásných společnic. Ověřené profily, reálné fotky, k dispozici dnes. Incall & outcall služby v Praze.', 'escort praha holky, společnice praha, erotické služby', 'escort praha'),
  ('/en/divky', 'static', 'en', 'Our Girls - Premium Escort Prague | LovelyGirls', 'Browse profiles of our beautiful companions. Verified profiles, real photos, available today. Incall & outcall services in Prague.', 'escort prague girls, companions prague, erotic services', 'escort prague girls'),

  -- Pricing page
  ('/cs/cenik', 'static', 'cs', 'Ceník Služeb - Escort & Masáže Praha | LovelyGirls', 'Transparentní ceník escort služeb a erotických masáží v Praze. Balíčky od 60 do 180 minut.Incall & outcall. Rezervace přes WhatsApp.', 'ceník escort praha, ceny masáží, escort tarify', 'ceník escort'),
  ('/en/cenik', 'static', 'en', 'Pricing - Escort & Massage Prague | LovelyGirls', 'Transparent pricing for escort services and erotic massage in Prague. Packages from 60 to 180 minutes. Incall & outcall. Book via WhatsApp.', 'escort prague prices, massage rates, pricing', 'escort prices'),

  -- Schedule page
  ('/cs/schedule', 'static', 'cs', 'Rozvrh Dostupnosti - Kdy Jsme K Dispozici | LovelyGirls', 'Aktuální rozvrh dostupnosti našich společnic. Zjistěte, kdo je k dispozici dnes, zítra nebo tento týden. Rezervujte si termín.', 'rozvrh escort, dostupnost, kalendář', 'rozvrh escort'),
  ('/en/schedule', 'static', 'en', 'Availability Schedule - When We Are Available | LovelyGirls', 'Current availability schedule of our companions. Find out who is available today, tomorrow or this week. Book your appointment.', 'escort schedule, availability, calendar', 'escort schedule'),

  -- Blog
  ('/cs/blog', 'static', 'cs', 'Blog - Erotické Příběhy & Průvodce | LovelyGirls Prague', 'Erotické příběhy, průvodce escort službami v Praze, tipy pro první návštěvu, recenze holek a mnoho dalšího.', 'erotické příběhy, escort blog, průvodce praha', 'escort blog'),
  ('/en/blog', 'static', 'en', 'Blog - Erotic Stories & Guides | LovelyGirls Prague', 'Erotic stories, escort service guides in Prague, first-time tips, girl spotlights and much more.', 'erotic stories, escort blog, prague guide', 'escort blog'),

  -- FAQ
  ('/cs/faq', 'static', 'cs', 'Časté Otázky (FAQ) - Escort Praha | LovelyGirls', 'Odpovědi na nejčastější otázky o našich službách, cenách, rezervacích a diskrétnosti. Vše co potřebujete vědět před první návštěvou.', 'faq escort, časté otázky, escort průvodce', 'faq escort'),
  ('/en/faq', 'static', 'en', 'Frequently Asked Questions (FAQ) - Escort Prague | LovelyGirls', 'Answers to the most common questions about our services, prices, bookings and discretion. Everything you need to know before your first visit.', 'faq escort, frequently asked questions, escort guide', 'faq escort'),

  -- Discounts
  ('/cs/discounts', 'static', 'cs', 'Akční Slevy & Nabídky - Ušetřete až 20% | LovelyGirls', 'Aktuální slevy a speciální nabídky na escort služby.Firsttimer sleva, víkendové pakety, overnight bonusy. Rezervujte teď!', 'slevy escort, akce, firsttimer sleva', 'slevy escort'),
  ('/en/discounts', 'static', 'en', 'Special Discounts & Offers - Save up to 20% | LovelyGirls', 'Current discounts and special offers on escort services. First-timer discount, weekend packages, overnight bonuses. Book now!', 'escort discounts, special offers, firsttimer discount', 'escort discounts');
