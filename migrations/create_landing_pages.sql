-- Landing Pages Table
CREATE TABLE IF NOT EXISTS landing_pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    is_published INTEGER DEFAULT 0,
    display_order INTEGER DEFAULT 0,

    -- SEO Meta
    meta_title_cs TEXT,
    meta_title_en TEXT,
    meta_title_de TEXT,
    meta_title_uk TEXT,

    meta_description_cs TEXT,
    meta_description_en TEXT,
    meta_description_de TEXT,
    meta_description_uk TEXT,

    -- Content
    title_cs TEXT,
    title_en TEXT,
    title_de TEXT,
    title_uk TEXT,

    subtitle_cs TEXT,
    subtitle_en TEXT,
    subtitle_de TEXT,
    subtitle_uk TEXT,

    content_cs TEXT, -- Rich HTML content
    content_en TEXT,
    content_de TEXT,
    content_uk TEXT,

    -- CTA
    cta_text_cs TEXT,
    cta_text_en TEXT,
    cta_text_de TEXT,
    cta_text_uk TEXT,

    cta_url TEXT,

    -- Featured image
    featured_image_url TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for slug lookups
CREATE INDEX IF NOT EXISTS idx_landing_pages_slug ON landing_pages(slug);
CREATE INDEX IF NOT EXISTS idx_landing_pages_published ON landing_pages(is_published);

-- Example landing page
INSERT INTO landing_pages (
    slug,
    is_published,
    display_order,
    meta_title_cs, meta_title_en, meta_title_de, meta_title_uk,
    meta_description_cs, meta_description_en, meta_description_de, meta_description_uk,
    title_cs, title_en, title_de, title_uk,
    subtitle_cs, subtitle_en, subtitle_de, subtitle_uk,
    content_cs, content_en, content_de, content_uk,
    cta_text_cs, cta_text_en, cta_text_de, cta_text_uk,
    cta_url
) VALUES (
    'welcome',
    1,
    1,
    'Vítejte | LovelyGirls Prague', 'Welcome | LovelyGirls Prague', 'Willkommen | LovelyGirls Prague', 'Ласкаво просимо | LovelyGirls Prague',
    'Objevte luxusní erotické masáže v Praze', 'Discover luxury erotic massage in Prague', 'Entdecken Sie Luxus-Erotik-Massage in Prag', 'Відкрийте для себе розкішний еротичний масаж у Празі',
    'Vítejte v LovelyGirls Prague', 'Welcome to LovelyGirls Prague', 'Willkommen bei LovelyGirls Prague', 'Ласкаво просимо до LovelyGirls Prague',
    'Luxusní erotické masáže v srdci Prahy', 'Luxury erotic massages in the heart of Prague', 'Luxuriöse erotische Massagen im Herzen von Prag', 'Розкішні еротичні масажі в серці Праги',
    '<p>Nabízíme prémiové erotické masáže s krásnými a profesionálními dívkami.</p><ul><li>Diskrétní prostředí</li><li>Vyškolené masérky</li><li>Bezpečné platby</li></ul>',
    '<p>We offer premium erotic massages with beautiful and professional girls.</p><ul><li>Discreet environment</li><li>Trained masseuses</li><li>Secure payments</li></ul>',
    '<p>Wir bieten Premium-Erotik-Massagen mit schönen und professionellen Mädchen.</p><ul><li>Diskrete Umgebung</li><li>Ausgebildete Masseurinnen</li><li>Sichere Zahlungen</li></ul>',
    '<p>Ми пропонуємо преміум еротичні масажі з красивими та професійними дівчатами.</p><ul><li>Дискретне середовище</li><li>Навчені масажистки</li><li>Безпечні платежі</li></ul>',
    'Rezervovat nyní', 'Book now', 'Jetzt buchen', 'Забронювати зараз',
    'https://wa.me/420734332131'
);
