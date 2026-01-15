# 🚀 SEO Action Plan - LovelyGirls.cz

## ✅ Co už máte (VYNIKAJÍCÍ základ!):
- ✅ Sitemap.xml s 500+ URLs (dynamicky generovaná z DB)
- ✅ Robots.txt správně nakonfigurovaný
- ✅ Google Analytics (G-W4W24CVL1L)
- ✅ 12 různých strukturovaných dat typů (Schema.org)
- ✅ ISR (Incremental Static Regeneration) na hlavních stránkách
- ✅ Hreflang tags pro 4 jazyky (cs, en, de, uk)
- ✅ Canonical URLs
- ✅ Open Graph + Twitter Cards metadata
- ✅ Smart metadata fallbacks (PRÁVĚ PŘIDÁNO)

---

## 🔴 KRITICKÉ - Udělat IHNED (tým 1-2 hodiny):

### 1. Google Search Console Setup
**DŮLEŽITOST: 🔥🔥🔥 MAXIMÁLNÍ**

```bash
# Kroky:
1. Jdi na: https://search.google.com/search-console
2. Přidej property: www.lovelygirls.cz
3. Verifikuj vlastnictví:
   - HTML tag method: <meta name="google-site-verification" content="TVŮj-KÓD" />
   - Nebo DNS TXT record
4. Submit sitemap: https://www.lovelygirls.cz/sitemap.xml
5. Request indexing pro top 10 URLs (/cs, /en, /cs/divky, /cs/profily/nika, atd.)
```

**Přidej do .env.local:**
```
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION="tvůj-verification-kód"
```

---

### 2. Vytvořit og-image.jpg
**DŮLEŽITOST: 🔥🔥🔥 VYSOKÁ**

**Specifikace:**
- Rozměr: **1200x630px**
- Format: JPEG nebo PNG
- Velikost: < 1MB
- Design: Logo + text "Luxury Escort Prague | Verified Companions"
- Barvy: Použijte wine/burgundy color scheme (#8b2942)

**Kam nahrát:**
```
/public/og-image.jpg
```

**Online nástroje pro vytvoření:**
- https://www.canva.com/create/og-images/
- https://og-playground.vercel.app/

---

### 3. Naplnit SEO metadata do databáze
**DŮLEŽITOST: 🔥🔥 VYSOKÁ**

**SQL queries** (spusť v databázi):

```sql
-- Homepage (Czech)
INSERT INTO seo_metadata (page_path, meta_title, meta_description, meta_keywords, robots_index, robots_follow, og_title, og_description, og_image, canonical_url)
VALUES
('/cs',
 'Luxusní Escort Praha | Ověřené Dívky | LovelyGirls',
 'Prémiové escort služby v Praze. Ověřené profily, diskrétní setkání, rychlá rezervace přes WhatsApp. Elegantní společnice pro náročné gentlemany. ⭐ +420 734 332 131',
 'escort praha, escort služby praha, luxusní escort, ověřené dívky, společnice praha, diskrétní escort, erotická masáž praha, vip holky praha',
 1, 1,
 'Luxusní Escort Praha - Ověřené Společnice | LovelyGirls',
 'Prémiové escort služby v Praze. Ověřené profily, diskrétní setkání, online rezervace. Elegantní společnice pro náročné gentlemany.',
 'https://www.lovelygirls.cz/og-image.jpg',
 'https://www.lovelygirls.cz/cs');

-- Homepage (English)
INSERT INTO seo_metadata (page_path, meta_title, meta_description, meta_keywords, robots_index, robots_follow, og_title, og_description, og_image, canonical_url)
VALUES
('/en',
 'Luxury Escort Prague | Verified Girls | LovelyGirls',
 'Premium escort services in Prague. Verified profiles, discreet meetings, fast booking via WhatsApp. Elegant companions for discerning gentlemen. ⭐ +420 734 332 131',
 'escort prague, escort services prague, luxury escort, verified girls, companions prague, erotic massage prague, vip girls prague',
 1, 1,
 'Luxury Escort Prague - Verified Companions | LovelyGirls',
 'Premium escort services in Prague. Verified profiles, discreet meetings, online booking. Elegant companions for discerning gentlemen.',
 'https://www.lovelygirls.cz/og-image.jpg',
 'https://www.lovelygirls.cz/en');

-- Girls listing page
INSERT INTO seo_metadata (page_path, meta_title, meta_description, meta_keywords, robots_index, robots_follow, canonical_url)
VALUES
('/cs/divky',
 'Dívky Praha - Ověřené Profily | LovelyGirls',
 'Prohlédněte si ověřené profily našich elegantních společnic v Praze. Fotografie, video, recenze, online dostupnost, rychlá rezervace přes WhatsApp. +420 734 332 131',
 'escort holky praha, dívky praha, společnice praha, erotická masáž, vip escort, ověřené profily',
 1, 1,
 'https://www.lovelygirls.cz/cs/divky');

-- Schedule page
INSERT INTO seo_metadata (page_path, meta_title, meta_description, meta_keywords, robots_index, robots_follow, canonical_url)
VALUES
('/cs/schedule',
 'Program - Kdo je Online Dnes | LovelyGirls Praha',
 'Aktuální program našich dívek v Praze. Zjistěte kdo je online dnes a zarezervujte si setkání. Real-time dostupnost, rychlá rezervace přes WhatsApp.',
 'escort program praha, kdo je online dnes, dostupnost escort, aktuální program, rezervace escort praha',
 1, 1,
 'https://www.lovelygirls.cz/cs/schedule');
```

**Pro top 15 profilů dívek:**
```sql
-- Pro každou top dívku (např. Nika, Luna, Bella, atd.):
INSERT INTO seo_metadata (page_path, meta_title, meta_description, meta_keywords, robots_index, robots_follow, canonical_url)
VALUES
('/cs/profily/nika',
 'Nika (28 let) - Elegantní Escort Praha | LovelyGirls',
 'Nika - 28 let, 162 cm, elegantní společnice v Praze. Verified profil, recenze (4.8⭐), fotografie, video. GFE, erotická masáž. Rezervace: +420 734 332 131',
 'nika escort praha, nika společnice, escort nika, gfe praha, erotická masáž nika',
 1, 1,
 'https://www.lovelygirls.cz/cs/profily/nika');
```

---

## 🟡 DŮLEŽITÉ - Udělat do 1 týdne:

### 4. Internal Linking Strategy
**DŮLEŽITOST: 🔥🔥 STŘEDNÍ-VYSOKÁ**

**Co přidat:**
- [ ] Na každém profilu dívky: "Podobné dívky" sekce (3-4 dívky se stejnými tags)
- [ ] Na homepage: Breadcrumbs navigation
- [ ] V blog postech: Odkazy na relevantní profily
- [ ] Vytvoř "Doporučené profily" widget v sidebaru

**Implementace:**
```tsx
// V profilu dívky přidej:
<section className="similar-girls">
  <h3>Podobné dívky</h3>
  {similarGirls.map(girl => (
    <Link href={`/${locale}/profily/${girl.slug}`}>
      <GirlCard girl={girl} />
    </Link>
  ))}
</section>
```

---

### 5. Obrázky Optimalizace
**DŮLEŽITOST: 🔥🔥 STŘEDNÍ**

**Kroky:**
- [ ] Konvertuj všechny obrázky do WebP formatu
- [ ] Přidej alt tags na všechny obrázky (popisné!)
- [ ] Implementuj lazy loading (už máte Next.js Image)
- [ ] Optimalizuj velikost obrázků (max 150KB per image)

**Next.js Image Component už používáte - DOBŘE! ✅**

---

### 6. Speed Optimalizace
**DŮLEŽITOST: 🔥🔥 STŘEDNÍ**

**Zkontroluj:**
- [ ] PageSpeed Insights: https://pagespeed.web.dev/?url=https://www.lovelygirls.cz
- [ ] GTmetrix: https://gtmetrix.com/
- [ ] WebPageTest: https://www.webpagetest.org/

**Cíl:**
- Mobile score: > 90
- Desktop score: > 95
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

---

## 🟢 NICE-TO-HAVE - Udělat do 1 měsíce:

### 7. Blog Content Strategy
**DŮLEŽITOST: 🔥 NÍZKÁ-STŘEDNÍ**

**Témata pro SEO články** (300-500 slov každý):
- [ ] "Jak si vybrat správnou společnici v Praze"
- [ ] "Top 10 tipy pro první setkání s escort"
- [ ] "Rozdíl mezi GFE a klasickou escort službou"
- [ ] "Etiketa při setkání s VIP společnicí"
- [ ] "Nejlepší čtvrtě v Praze pro diskrétní setkání"

**Frekvence:**
- 2-3 články měsíčně
- Použijte klíčová slova z keyword research
- Internal linking na profily dívek

---

### 8. Backlinks Strategy
**DŮLEŽITOST: 🔥 NÍZKÁ-STŘEDNÍ**

**Strategie:**
- [ ] Vyměna odkazů s relevantními escort directories
- [ ] Guest posting na adult lifestyle blogs
- [ ] Vytvoření profilu na relevantních review sites
- [ ] Social media presence (Instagram, Twitter/X)

**POZOR:** Kvalita > kvantita!

---

### 9. Local SEO
**DŮLEŽITOST: 🔥 STŘEDNÍ**

- [ ] Vytvoř Google Business Profile (pokud je to možné pro váš typ businessu)
- [ ] Přidej LocalBusiness schema na homepage (JIŽ MÁTE ✅)
- [ ] Optimalizuj pro "escort praha" + lokální keywords
- [ ] Vytvoř landing pages pro různé čtvrtě Prahy (Praha 1, Praha 2, atd.)

---

## 📊 Tracking & Monitoring:

### Co sledovat každý týden:
1. **Google Search Console:**
   - Impressions (zobrazení v Google)
   - Clicks (kliknutí z Google)
   - Average position (průměrná pozice)
   - Coverage errors (chyby indexace)

2. **Google Analytics:**
   - Organic search traffic
   - Bounce rate
   - Conversion rate (kontaktování přes WhatsApp/telefon)
   - Top landing pages

3. **Rankings:**
   - "escort praha" → cíl: Top 3
   - "escort služby praha" → cíl: Top 5
   - "společnice praha" → cíl: Top 3
   - "luxusní escort praha" → cíl: Top 3

---

## 🎯 Keyword Target List (Priority):

### High Volume Keywords (Czech):
1. **escort praha** - 2,900 searches/month
2. **escort** - 18,100 searches/month (competitive!)
3. **společnice praha** - 720 searches/month
4. **erotická masáž praha** - 1,600 searches/month
5. **escort služby** - 590 searches/month

### Long-tail Keywords (Easy to rank):
1. **ověřené escort praha** - 50 searches/month
2. **luxusní společnice praha** - 30 searches/month
3. **vip escort praha 2** - 20 searches/month
4. **gfe escort praha** - 40 searches/month
5. **diskrétní escort praha** - 60 searches/month

---

## 🔧 Technical SEO Checklist:

### Already Done ✅:
- [x] Sitemap.xml
- [x] Robots.txt
- [x] Structured data (12 types!)
- [x] Hreflang tags
- [x] Canonical URLs
- [x] Mobile-responsive design
- [x] HTTPS enabled
- [x] Fast loading (Next.js optimizations)

### TODO:
- [ ] Google Search Console verification
- [ ] Submit sitemap to Google
- [ ] OG image creation
- [ ] Fill SEO metadata in database
- [ ] Internal linking strategy
- [ ] Image alt tags audit
- [ ] Create XML image sitemap
- [ ] Add FAQ schema to FAQ page
- [ ] Create breadcrumbs on all pages

---

## 📈 Expected Results Timeline:

**Week 1-2:**
- Google začne crawlovat stránky
- Indexace 50-100 stránek

**Week 3-4:**
- Indexace 300+ stránek
- První zobrazení v Google (impressions)

**Month 2:**
- Top 10 pro long-tail keywords
- Top 30 pro main keywords

**Month 3-6:**
- Top 5 pro long-tail keywords
- Top 10 pro main keywords ("escort praha")
- 500+ organic visits/měsíc

**Month 6+:**
- Top 3 pro multiple keywords
- 1000+ organic visits/měsíc
- Dominance v Praze escort search results

---

## ✅ QUICK WIN CHECKLIST (udělat DNES):

1. [ ] Google Search Console - verify ownership
2. [ ] Submit sitemap
3. [ ] Create og-image.jpg
4. [ ] Fill SEO metadata for top 5 pages
5. [ ] Request indexing for homepage

**Časová náročnost: 1-2 hodiny**
**Impact: 🚀 VYSOKÝ**

---

## 📞 Support:

Pokud máte otázky:
- Google Search Console: https://support.google.com/webmasters
- Schema.org documentation: https://schema.org/docs/documents.html
- Next.js SEO: https://nextjs.org/learn/seo/introduction-to-seo

---

**Last Updated:** 2026-01-15
**Version:** 1.0
**Owner:** LovelyGirls Technical Team
