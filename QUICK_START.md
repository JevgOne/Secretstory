# ⚡ Rychlý start - Nový projekt v 5 minutách

## 🎯 Co potřebuješ

1. **Turso účet** - https://turso.tech
2. **GitHub účet** - https://github.com
3. **Vercel účet** - https://vercel.com
4. **Turso CLI** nainstalované

## 🚀 Rychlý postup

### 1️⃣ Přihlaš se do Turso CLI (30 sekund)

```bash
turso auth login
```

### 2️⃣ Vytvoř a naplň novou databázi (2 minuty)

```bash
# Export současných dat
turso db shell lg --location aws-ap-south-1 ".dump" > backup.sql

# Vytvoř novou databázi
turso db create lovelygirls-prod --location aws-ap-south-1

# Importuj data
turso db shell lovelygirls-prod < backup.sql

# Získej přihlašovací údaje
turso db show lovelygirls-prod
turso db tokens create lovelygirls-prod
```

**Ulož si:**
- Database URL: `libsql://lovelygirls-prod-xxx.aws-ap-south-1.turso.io`
- Auth Token: `eyJh...` (dlouhý string)

### 3️⃣ Vytvoř GitHub repozitář (1 minuta)

**Web způsob:**
1. Jdi na https://github.com/new
2. Název: `lovelygirls-prod`
3. Private: ✅
4. Klikni "Create repository"
5. V terminálu:

```bash
git remote add new-origin https://github.com/TVUJ-USERNAME/lovelygirls-prod.git
git push new-origin main
```

### 4️⃣ Nasaď na Vercel (2 minuty)

1. Jdi na https://vercel.com/new
2. Vyber svůj GitHub repozitář `lovelygirls-prod`
3. Klikni na "Environment Variables" a přidej:

```
TURSO_DATABASE_URL=libsql://lovelygirls-prod-xxx.aws-ap-south-1.turso.io
TURSO_AUTH_TOKEN=eyJh...tvůj-dlouhý-token...
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_QKTYf1OZcVE7804I_1SlbZuyHn66yymHV9ulOY6T4ZDovEo
RESEND_API_KEY=re_eQsjjuQg_KvjhcnV1McxPCeJyfj7Pf6MR
NEXT_PUBLIC_APP_URL=https://lovelygirls-prod.vercel.app
```

4. Klikni "Deploy"
5. Počkej 2-3 minuty na build

### 5️⃣ Ověř že vše funguje

Otevři: `https://lovelygirls-prod.vercel.app/cs/divky`

Měly by se zobrazit všechny dívky z databáze! 🎉

---

## 🔧 Pokud něco nefunguje

### Problém: Build ve Vercel failuje
**Řešení:** Zkontroluj, že jsi přidal VŠECHNY environment variables

### Problém: Stránka se načte, ale nejsou data
**Řešení:**
1. Zkontroluj TURSO_DATABASE_URL a TURSO_AUTH_TOKEN ve Vercel
2. Ověř že data jsou v databázi: `turso db shell lovelygirls-prod "SELECT COUNT(*) FROM girls;"`

### Problém: 500 Error
**Řešení:**
1. Jdi do Vercel Dashboard → tvůj projekt → Logs
2. Podívej se na error message
3. Obvykle chybí nějaká environment variable

---

## 📱 Po úspěšném nasazení

✅ Máš nový projekt na nové infrastruktuře
✅ Starý projekt je nedotčený (můžeš ho smazat později)
✅ Všechna data jsou migrovaná
✅ Web funguje na nové URL

### Volitelné další kroky:

1. **Custom doména:**
   - Vercel Dashboard → Settings → Domains
   - Přidej svou doménu (např. `lovelygirls.cz`)

2. **Analytics:**
   - Vercel Analytics se aktivuje automaticky

3. **Smaž starý projekt:**
   - Až budeš 100% spokojený, smaž starý Vercel deployment
   - Archivuj starý GitHub repo

---

**Celkový čas: ~5-10 minut** ⏱️

**Potřebuješ pomoc?** Podívej se do `MIGRATION_GUIDE.md` pro detailní instrukce.
