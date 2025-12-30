-- PRICING PLANS TABLE
CREATE TABLE IF NOT EXISTS pricing_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    duration INTEGER NOT NULL,           -- Duration in minutes (30, 60, 90)
    price INTEGER NOT NULL,              -- Price in CZK
    is_popular INTEGER DEFAULT 0,        -- 0 = false, 1 = true
    display_order INTEGER DEFAULT 0,     -- Order in which to display
    is_active INTEGER DEFAULT 1,         -- 0 = inactive, 1 = active

    -- Multi-language fields
    title_cs TEXT NOT NULL,
    title_en TEXT NOT NULL,
    title_de TEXT NOT NULL,
    title_uk TEXT NOT NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- PRICING PLAN FEATURES TABLE
CREATE TABLE IF NOT EXISTS pricing_plan_features (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plan_id INTEGER NOT NULL,
    display_order INTEGER DEFAULT 0,

    -- Multi-language fields
    feature_cs TEXT NOT NULL,
    feature_en TEXT NOT NULL,
    feature_de TEXT NOT NULL,
    feature_uk TEXT NOT NULL,

    FOREIGN KEY (plan_id) REFERENCES pricing_plans(id) ON DELETE CASCADE
);

-- PRICING EXTRAS TABLE
CREATE TABLE IF NOT EXISTS pricing_extras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    price INTEGER NOT NULL,              -- Price in CZK
    display_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,

    -- Multi-language fields
    name_cs TEXT NOT NULL,
    name_en TEXT NOT NULL,
    name_de TEXT NOT NULL,
    name_uk TEXT NOT NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- DISCOUNTS TABLE
CREATE TABLE IF NOT EXISTS discounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    icon TEXT DEFAULT '🎁',              -- Emoji icon
    discount_type TEXT NOT NULL,         -- 'percentage' or 'fixed' or 'special'
    discount_value INTEGER,              -- Percentage (15) or fixed amount (500) in CZK
    display_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    is_featured INTEGER DEFAULT 0,       -- Featured discount at top

    -- Multi-language fields
    name_cs TEXT NOT NULL,
    name_en TEXT NOT NULL,
    name_de TEXT NOT NULL,
    name_uk TEXT NOT NULL,

    description_cs TEXT NOT NULL,
    description_en TEXT NOT NULL,
    description_de TEXT NOT NULL,
    description_uk TEXT NOT NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- LOYALTY TIERS TABLE
CREATE TABLE IF NOT EXISTS loyalty_tiers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visits_required INTEGER NOT NULL,    -- Number of visits needed
    discount_percentage INTEGER NOT NULL, -- Discount percentage
    tier_level INTEGER NOT NULL,         -- 1=Bronze, 2=Silver, 3=Gold, 4=VIP
    display_order INTEGER DEFAULT 0,

    -- Multi-language fields
    title_cs TEXT NOT NULL,
    title_en TEXT NOT NULL,
    title_de TEXT NOT NULL,
    title_uk TEXT NOT NULL,

    description_cs TEXT NOT NULL,
    description_en TEXT NOT NULL,
    description_de TEXT NOT NULL,
    description_uk TEXT NOT NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default pricing plans
INSERT INTO pricing_plans (duration, price, is_popular, display_order, title_cs, title_en, title_de, title_uk) VALUES
(30, 1500, 0, 1, 'Quick Relax', 'Quick Relax', 'Schnelle Entspannung', 'Швидкий релакс'),
(60, 2500, 1, 2, 'Classic Experience', 'Classic Experience', 'Klassisches Erlebnis', 'Класичний досвід'),
(90, 3500, 0, 3, 'Premium Pleasure', 'Premium Pleasure', 'Premium Vergnügen', 'Преміум насолода');

-- Insert default features for Quick Relax (30 min)
INSERT INTO pricing_plan_features (plan_id, display_order, feature_cs, feature_en, feature_de, feature_uk) VALUES
(1, 1, 'Erotická masáž', 'Erotic massage', 'Erotische Massage', 'Еротичний масаж'),
(1, 2, 'Společná sprcha', 'Shared shower', 'Gemeinsame Dusche', 'Спільний душ'),
(1, 3, 'Uvolnění na závěr', 'Relaxing finish', 'Entspannender Abschluss', 'Розслаблюючий фініш');

-- Insert default features for Classic Experience (60 min)
INSERT INTO pricing_plan_features (plan_id, display_order, feature_cs, feature_en, feature_de, feature_uk) VALUES
(2, 1, 'Klasická + erotická masáž', 'Classic + erotic massage', 'Klassische + erotische Massage', 'Класичний + еротичний масаж'),
(2, 2, 'Body to body masáž', 'Body to body massage', 'Körper-zu-Körper-Massage', 'Масаж тіло до тіла'),
(2, 3, 'Společná sprcha', 'Shared shower', 'Gemeinsame Dusche', 'Спільний душ'),
(2, 4, 'Líbání s jazykem', 'French kissing', 'Französisches Küssen', 'Французький поцілунок'),
(2, 5, 'Ideální pro začátečníky', 'Ideal for beginners', 'Ideal für Anfänger', 'Ідеально для початківців');

-- Insert default features for Premium Pleasure (90 min)
INSERT INTO pricing_plan_features (plan_id, display_order, feature_cs, feature_en, feature_de, feature_uk) VALUES
(3, 1, 'Vše z Classic Experience', 'Everything from Classic', 'Alles aus Classic', 'Все з Classic'),
(3, 2, 'Tantra elementy', 'Tantra elements', 'Tantra-Elemente', 'Тантра елементи'),
(3, 3, 'Delší relaxace', 'Extended relaxation', 'Längere Entspannung', 'Подовжена релаксація'),
(3, 4, 'Sklenka sektu', 'Glass of champagne', 'Glas Sekt', 'Келих шампанського'),
(3, 5, 'VIP atmosféra', 'VIP atmosphere', 'VIP-Atmosphäre', 'VIP атмосфера');

-- Insert default extras
INSERT INTO pricing_extras (price, display_order, name_cs, name_en, name_de, name_uk) VALUES
(800, 1, 'Nuru masáž', 'Nuru massage', 'Nuru-Massage', 'Nuru масаж'),
(800, 2, 'Tantra masáž', 'Tantra massage', 'Tantra-Massage', 'Тантра масаж'),
(1500, 3, 'Duo masáž (2 dívky)', 'Duo massage (2 girls)', 'Duo-Massage (2 Mädchen)', 'Дуо масаж (2 дівчини)'),
(800, 4, 'Prodloužení +30 min', 'Extension +30 min', 'Verlängerung +30 Min', 'Подовження +30 хв'),
(500, 5, 'Masáž prostaty', 'Prostate massage', 'Prostatamassage', 'Масаж простати'),
(500, 6, 'Roleplay', 'Roleplay', 'Rollenspiel', 'Рольова гра'),
(700, 7, 'Lehká dominance', 'Light domination', 'Leichte Dominanz', 'Легка домінація'),
(300, 8, 'Foot fetish', 'Foot fetish', 'Fußfetisch', 'Фут фетиш');

-- Insert default discounts
INSERT INTO discounts (icon, discount_type, discount_value, display_order, is_featured, name_cs, name_en, name_de, name_uk, description_cs, description_en, description_de, description_uk) VALUES
('🌟', 'percentage', 15, 1, 0, 'První návštěva', 'First Visit', 'Erster Besuch', 'Перший візит', 'Sleva 15% na první návštěvu našeho salonu', '15% off on your first visit to our salon', '15% Rabatt bei Ihrem ersten Besuch', 'Знижка 15% на перший візит'),
('👯', 'special', 0, 2, 0, 'Duo sleva', 'Duo Discount', 'Duo-Rabatt', 'Дуо знижка', 'Speciální cena při návštěvě dvou masáží najednou', 'Special price when booking two massages at once', 'Sonderpreis bei Buchung von zwei Massagen', 'Спеціальна ціна при замовленні двох масажів'),
('💝', 'special', 0, 3, 0, 'Narozeninová sleva', 'Birthday Discount', 'Geburtstagsrabatt', 'Знижка на день народження', 'Oslavte s námi! Speciální bonus v den Vašich narozenin', 'Celebrate with us! Special bonus on your birthday', 'Feiern Sie mit uns! Besonderer Bonus an Ihrem Geburtstag', 'Святкуйте з нами! Спеціальний бонус у день народження'),
('🔄', 'percentage', 10, 4, 0, 'Zpět k nám', 'Come Back', 'Komm zurück', 'Повернення', 'Vrátíte-li se do 14 dnů, získáte slevu 10%', 'Return within 14 days and get 10% off', 'Kehren Sie innerhalb von 14 Tagen zurück und erhalten Sie 10% Rabatt', 'Поверніться протягом 14 днів і отримайте 10% знижки'),
('☀️', 'percentage', 20, 5, 0, 'Ranní ptáče', 'Early Bird', 'Frühaufsteher', 'Рання пташка', 'Sleva 20% na návštěvy před 14:00', '20% off for visits before 2 PM', '20% Rabatt für Besuche vor 14 Uhr', '20% знижки на візити до 14:00'),
('📅', 'percentage', 10, 6, 0, 'Uprostřed týdne', 'Midweek Special', 'Wochenmitte-Special', 'Середина тижня', 'Sleva 10% v úterý, středu a čtvrtek', '10% off on Tuesday, Wednesday, and Thursday', '10% Rabatt am Dienstag, Mittwoch und Donnerstag', '10% знижки у вівторок, середу та четвер');

-- Insert default loyalty tiers
INSERT INTO loyalty_tiers (visits_required, discount_percentage, tier_level, display_order, title_cs, title_en, title_de, title_uk, description_cs, description_en, description_de, description_uk) VALUES
(3, 5, 1, 1, 'Bronze', 'Bronze', 'Bronze', 'Бронза', '5% sleva po 3 návštěvách', '5% discount after 3 visits', '5% Rabatt nach 3 Besuchen', '5% знижки після 3 візитів'),
(5, 10, 2, 2, 'Silver', 'Silver', 'Silber', 'Срібло', '10% sleva po 5 návštěvách', '10% discount after 5 visits', '10% Rabatt nach 5 Besuchen', '10% знижки після 5 візитів'),
(10, 15, 3, 3, 'Gold', 'Gold', 'Gold', 'Золото', '15% sleva po 10 návštěvách', '15% discount after 10 visits', '15% Rabatt nach 10 Besuchen', '15% знижки після 10 візитів'),
(20, 20, 4, 4, 'VIP', 'VIP', 'VIP', 'VIP', '20% sleva + prioritní rezervace', '20% discount + priority booking', '20% Rabatt + vorrangige Buchung', '20% знижки + пріоритетне бронювання');
