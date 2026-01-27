# Blog Scheduler - Návod k použití

Systém plánování blogových příspěvků umožňuje naplánovat zveřejnění článků na konkrétní datum a čas, stejně jako Facebook a další sociální sítě.

## 📋 Jak to funguje

### 3 režimy publikace:

1. **Uložit jako koncept** (Draft)
   - Článek není viditelný na webu
   - Můžete ho dále upravovat
   - Zobrazí se v admin seznamu se šedým badgem "Koncept"

2. **Publikovat okamžitě** (Publish Now)
   - Článek bude ihned viditelný na webu
   - Nastaví se `published_at` na aktuální čas
   - Zobrazí se se zeleným badgem "Publikováno"

3. **Naplánovat publikaci** (Schedule)
   - Vyberte datum a čas budoucího zveřejnění
   - Článek zůstane skrytý do naplánovaného času
   - Automaticky se zveřejní v určený čas
   - Zobrazí se se žlutým badgem "Naplánováno" + datum/čas

## 🎯 Jak naplánovat článek

### Při vytváření nového článku:

1. Vyplňte všechny informace o článku
2. V sekci "Nastavení publikace" vyberte **"Naplánovat publikaci"**
3. Vyberte datum a čas publikace v datetime pickeru
4. Klikněte na **"Naplánovat článek"**

### Při úpravě existujícího článku:

1. Otevřete článek k úpravě
2. Změňte režim publikace na **"Naplánovat publikaci"**
3. Nastavte nový čas (nebo upravte stávající)
4. Uložte změny

## 🤖 Automatické publikování

Systém má **2 mechanismy** pro automatické zveřejňování:

### 1. Pasivní scheduling (vždy aktivní)
- Při každém načtení `/api/blog` (veřejné API)
- Automaticky zkontroluje a publikuje články, kterým vypršel čas
- Funguje na **jakémkoliv hostingu**
- ✅ Nevyžaduje žádnou konfiguraci

### 2. Aktivní scheduling (Vercel Cron)
- Dedikovaný cron job běží **každých 10 minut**
- Endpoint: `/api/cron/publish-scheduled`
- Publikuje články i když nikdo blog nenavštíví
- ⚙️ Vyžaduje nasazení na Vercel

### Vercel Cron konfigurace

V projektu je připraven `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/publish-scheduled",
      "schedule": "*/10 * * * *"
    }
  ]
}
```

**Bezpečnost:** Pro zabezpečení cron endpointu můžete nastavit env proměnnou:
```
CRON_SECRET=your-secret-token
```

## 📊 Admin rozhraní

### Seznam článků

V admin seznamu (`/admin/blog`) uvidíte:

- **Koncept** - šedý badge
- **Publikováno** - zelený badge
- **Naplánováno** - žlutý badge + datum/čas publikace

### Filtrování

Můžete filtrovat podle:
- ✅ Všechny
- ✅ Publikované
- ✅ Koncepty
- ✅ **Naplánované** (nový filtr)

## 🔧 Technické detaily

### Databázová struktura

Přidané pole v tabulce `blog_posts`:
```sql
scheduled_for DATETIME DEFAULT NULL
```

### Logika publikace

```
IF scheduled_for IS NOT NULL AND scheduled_for <= NOW():
  → SET is_published = 1
  → SET published_at = scheduled_for
  → SET scheduled_for = NULL
```

### Soubory

| Soubor | Popis |
|--------|-------|
| `prisma/migrations/014_blog_scheduled_publishing.sql` | Database migration |
| `lib/blog-scheduler.ts` | Hlavní logika auto-publishing |
| `app/api/cron/publish-scheduled/route.ts` | Cron endpoint |
| `app/api/blog/route.ts` | Public API s pasivním schedulingem |
| `app/(admin)/admin/blog/new/page.tsx` | Formulář pro nový článek |
| `app/(admin)/admin/blog/[id]/edit/page.tsx` | Formulář pro úpravu |
| `app/(admin)/admin/blog/page.tsx` | Admin seznam článků |
| `vercel.json` | Vercel Cron konfigurace |

## 🎉 Příklady použití

### Naplánovat článek na zítra v 10:00

1. Vytvořte nový článek
2. Vyberte "Naplánovat publikaci"
3. Nastavte: `zítřejší datum 10:00`
4. Klikněte "Naplánovat článek"

### Změnit naplánovaný čas

1. Otevřete článek k úpravě
2. Režim je automaticky nastavený na "Naplánováno"
3. Upravte datum/čas
4. Uložte změny

### Publikovat naplánovaný článek okamžitě

1. Otevřete článek k úpravě
2. Změňte režim na "Publikovat okamžitě"
3. Uložte změny

### Zrušit naplánovanou publikaci

1. Otevřete článek k úpravě
2. Změňte režim na "Uložit jako koncept"
3. Uložte změny

## ✅ Výhody

- 📅 Plánujte obsah dopředu
- 🤖 Automatické publikování bez manuálního zásahu
- 🔄 Flexibilní - můžete kdykoli změnit čas nebo zrušit
- 🌍 Funguje na jakémkoliv hostingu (pasivní scheduling)
- ⚡ Extra rychlé na Vercelu (aktivní cron)
- 🎯 Přehledné barevné označení ve admin rozhraní

## 🐛 Troubleshooting

**Článek se nepublikuje automaticky:**
1. Zkontrolujte, že `scheduled_for` je v minulosti
2. Navštivte blog stránku (spustí pasivní scheduling)
3. Zkontrolujte Vercel cron logy (pokud používáte Vercel)

**Naplánovaný čas se nezobrazuje správně:**
- DateTime picker používá **místní časovou zónu** prohlížeče
- Datum se ukládá jako ISO string (UTC)
- Zobrazuje se v české lokalizaci

---

**Vytvořeno:** 2026-01-25
**Verze:** 1.0
