# AI Blog System - Kompletní dokumentace

Systém pro automatické generování a překlad blogových článků s copywriter workflow.

## 🎯 Přehled funkcí

### 1. **Scheduling** ⏰
- Plánování článků na konkrétní datum a čas
- Automatické publikování (pasivní + Vercel cron)
- 3 režimy: Draft / Publish Now / Scheduled
- Funguje ve všech 4 jazycích (CS, EN, DE, UK)

### 2. **AI Content Generator** 🤖
- Automatické generování 30 článků na měsíc
- GPT-4o powered content creation
- SEO-optimalizovaný obsah
- Pokrytí všech kategorií

### 3. **Auto-Translate** 🌍
- Automatický překlad do všech 4 jazyků
- Zachování HTML formátování
- Kontextový překlad (ne doslovný)
- Přiřazení copywriterům

### 4. **Copywriter Workflow** ✅
- Review status: draft → pending_review → approved → published
- Copywriter pro každý jazyk (CS, EN, DE, UK)
- Review notes a tracking

---

## 📋 Workflow

### A) Automatické generování článků (AI)

```
1. Admin → /admin/blog/generate
2. Vyber jazyk (cs/en/de/uk)
3. Nastav start date
4. Klikni "Vygenerovat 30 článků"
   ↓
5. AI generuje:
   - 30 unikátních článků
   - Každý 800-1200 slov
   - SEO metadata
   - Naplánováno na každý den v měsíci (10:00)
   ↓
6. Všechny články mají status "draft"
7. Admin zkontroluje a upraví
8. Admin odešle copywriterovi (změní na "pending_review")
```

### B) Auto-překlad článků

```
1. Admin otevře článek v editaci
2. Klikne "🌍 Auto-Translate"
   ↓
3. AI překládá:
   CS → EN + DE + UK (nebo jiná kombinace)
   ↓
4. Vytvoří 3 nové články (překlady)
5. Status: "pending_review"
6. Auto-assign copywriterovi podle jazyka:
   - CS → Copywriter CS (ID 1)
   - EN → Copywriter EN (ID 2)
   - DE → Copywriter DE (ID 3)
   - UK → Copywriter UK (ID 4)
```

### C) Copywriter review (připraveno pro budoucnost)

```
1. Copywriter dostane notifikaci (TODO)
2. Přejde na /admin/copywriter/dashboard (TODO)
3. Zobrazí články "pending_review"
4. Zkontroluje/upraví překlad
5. Schválí (approved) nebo Zamítne (rejected + notes)
   ↓
6. Pokud approved:
   - Admin může naplánovat/publikovat
7. Pokud rejected:
   - Vrátí se adminovi s poznámkami
```

---

## 🚀 Jak používat

### Generování měsíce článků

**URL:** `/admin/blog/generate`

**Kroky:**
1. Vyber jazyk (např. `cs`)
2. Nastav start date (např. `2026-02-01`)
3. Klikni "🤖 Vygenerovat 30 článků"
4. Počkej 5-10 minut
5. Výsledek: 30 článků naplánovaných na Feb 1-30

**Co se stane:**
- Článek 1 → scheduled_for: 2026-02-01 10:00
- Článek 2 → scheduled_for: 2026-02-02 10:00
- ...
- Článek 30 → scheduled_for: 2026-03-02 10:00

**Status:** Všechny jako `draft` → musíš je zkontrolovat!

### Automatický překlad

**Klikni v editaci článku:** `🌍 Auto-Translate`

**Co se stane:**
1. Vezme aktuální článek (např. CS)
2. Přeloží do EN, DE, UK
3. Vytvoří 3 nové články (každý s vlastním slug)
4. Status: `pending_review`
5. Assigned copywriter podle jazyka

**Výhody:**
- Konzistentní překlady
- Zachování HTML formátování
- SEO metadata automaticky
- Přiřazení copywriterům

### Naplánování publikace

**V editaci článku:**
1. Sekce "Nastavení publikace"
2. Vyber "Naplánovat publikaci"
3. Nastav datum + čas
4. Klikni "Naplánovat článek"

**Auto-publish:**
- Pasivní: Při každém GET /api/blog
- Aktivní: Vercel cron každých 10 min
- Publikuje když `scheduled_for <= NOW()`

---

## 📊 Databáze

### Nová pole v `blog_posts`:

```sql
-- Scheduling
scheduled_for DATETIME DEFAULT NULL

-- Review workflow
review_status TEXT DEFAULT 'draft'
assigned_copywriter_id INTEGER DEFAULT NULL
reviewed_at DATETIME DEFAULT NULL
reviewed_by INTEGER DEFAULT NULL
review_notes TEXT DEFAULT NULL
```

### Review status hodnoty:

- `draft` - Právě vytvořen, neodeslán k review
- `pending_review` - Odeslán copywriterovi
- `approved` - Copywriter schválil
- `rejected` - Copywriter zamítl (+ notes)
- `published` - Live na webu

### Tabulka `copywriters`:

```sql
CREATE TABLE copywriters (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  languages TEXT NOT NULL, -- 'cs,en,de,uk'
  is_active INTEGER DEFAULT 1,
  created_at DATETIME,
  updated_at DATETIME
);
```

**Předvyplněné copywritery:**
- ID 1: Copywriter CS (cs)
- ID 2: Copywriter EN (en)
- ID 3: Copywriter DE (de)
- ID 4: Copywriter UK (uk)

---

## 🔧 API Endpointy

### POST `/api/admin/blog/generate-month`

Generuje 30 článků na měsíc.

**Body:**
```json
{
  "locale": "cs",
  "startDate": "2026-02-01T00:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "created": 30,
  "errors": 0,
  "posts": [
    {
      "id": 123,
      "title": "Jak se stát escort dívkou",
      "slug": "jak-se-stat-escort-divkou",
      "scheduled_for": "2026-02-01T10:00:00.000Z",
      "category": "sex-prace"
    }
  ]
}
```

### POST `/api/admin/blog/translate`

Přeloží článek do všech jazyků.

**Body:**
```json
{
  "postId": 123,
  "mode": "all"
}
```

**Response:**
```json
{
  "success": true,
  "translated": 3,
  "posts": [
    {
      "id": 124,
      "locale": "en",
      "title": "How to Become an Escort Girl",
      "slug": "how-to-become-escort-girl"
    },
    {
      "id": 125,
      "locale": "de",
      "title": "Wie man ein Escort-Mädchen wird",
      "slug": "wie-man-ein-escort-madchen-wird"
    }
  ]
}
```

---

## 💰 Náklady (OpenAI API)

### AI Content Generator (30 článků):

**Model:** GPT-4o
**Usage:**
- 30 článků × ~3000 tokens output = ~90k tokens
- Input prompts: ~30k tokens
- **Total:** ~120k tokens

**Cena:**
- Input: $5 / 1M tokens
- Output: $15 / 1M tokens
- **Odhad:** ~$2-3 per run

### Auto-Translate (1 článek → 3 jazyky):

**Model:** GPT-4o
**Usage:**
- 3 překlady × ~2500 tokens = ~7.5k tokens output
- Input: ~3k tokens × 3 = ~9k tokens
- **Total:** ~16.5k tokens

**Cena:**
- **Odhad:** ~$0.30 per článek (3 překlady)

### Měsíční odhad:

Pokud generuješ 30 článků + překládáš všechny:
- 30 článků generování: ~$3
- 30 × auto-translate: ~$9
- **Total:** ~$12/měsíc

---

## ⚙️ Environment Variables

Potřebné v `.env.local`:

```bash
# OpenAI API
OPENAI_API_KEY=sk-xxx...

# Cron protection (volitelné)
CRON_SECRET=your-secret-token
```

---

## 📝 Soubory

| Soubor | Popis |
|--------|-------|
| `prisma/migrations/014_blog_scheduled_publishing.sql` | Scheduling migrace |
| `prisma/migrations/015_blog_review_workflow.sql` | Copywriter workflow migrace |
| `lib/blog-scheduler.ts` | Auto-publish helper |
| `lib/auto-translate.ts` | OpenAI translate helper |
| `lib/blog-content-generator.ts` | AI content generator |
| `app/api/cron/publish-scheduled/route.ts` | Vercel cron endpoint |
| `app/api/admin/blog/generate-month/route.ts` | Bulk generátor API |
| `app/api/admin/blog/translate/route.ts` | Auto-translate API |
| `app/(admin)/admin/blog/generate/page.tsx` | Generator UI |
| `app/(admin)/admin/blog/[id]/edit/page.tsx` | Edit + Auto-translate tlačítko |
| `vercel.json` | Vercel cron config |

---

## ✅ Checklist před použitím

- [ ] Nastavit `OPENAI_API_KEY` v env
- [ ] Deploy na Vercel (pro cron jobs)
- [ ] Zkontrolovat copywriters v DB (měli by být 4)
- [ ] Otestovat generování 1-2 článků nejdřív
- [ ] Připravit si checklist pro kontrolu AI obsahu

---

## 🎓 Best Practices

### Při generování obsahu:

1. **Vždy zkontroluj AI články před publikací!**
   - Faktická přesnost
   - Gramatika a styl
   - SEO optimalizace
   - Odkazy a odkazy na dívky

2. **Uprav podle potřeby:**
   - Přidej konkrétní odkazy
   - Doplň lokální informace o Praze
   - Přizpůsob tone of voice

3. **Testuj na malém vzorku:**
   - Nejdřív vygeneruj 5 článků
   - Zkontroluj kvalitu
   - Pak teprve generuj 30

### Při překládání:

1. **Copywriter review je NUTNÝ!**
   - AI občas udělá chyby
   - Kulturní nuance
   - Lokalizace (ne jen překlad)

2. **Kontroluj HTML formátování:**
   - Někdy AI změní strukturu
   - Zkontroluj odkazy

3. **SEO metadata:**
   - Přizpůsob klíčová slova pro daný jazyk
   - Meta description délka

---

## 🐛 Troubleshooting

**"Generování trvá moc dlouho"**
- Normální, 30 článků = 5-10 minut
- Nedávej větší timeout než 300s (5 min)

**"OpenAI API error"**
- Zkontroluj API key
- Zkontroluj rate limits
- Zkontroluj billing na OpenAI

**"Překlad selhal"**
- Možná rate limit
- Zkus po 1 minutě znovu
- Zkontroluj API quota

**"Články se nepublikují"**
- Zkontroluj scheduled_for datum
- Navštiv blog (spustí pasivní publishing)
- Zkontroluj Vercel cron logy

---

**Vytvořeno:** 2026-01-25
**Verze:** 1.0
**Author:** AI System + Admin
