# 🚀 Kompletní migrace na nový projekt

Tento návod tě provede vytvořením úplně nového projektu s novým GitHub repozitářem, Turso databází a Vercel nasazením.

## 📋 Prerekvizity

Ujisti se, že máš nainstalováno:
- Git
- Node.js & npm
- Turso CLI (`curl -sSfL https://get.tur.so/install.sh | bash`)
- GitHub CLI (volitelné): `brew install gh` nebo stáhni z https://cli.github.com/

## 🗂️ Krok 1: Export dat z Turso databáze

```bash
# Přihlaš se do Turso
turso auth login

# Exportuj současnou databázi
turso db shell lg --location aws-ap-south-1 ".dump" > turso-backup.sql

# Nebo použij tento příkaz pro export všech dat
turso db shell lg --location aws-ap-south-1 << 'EOF' > turso-backup.sql
.mode insert
SELECT * FROM girls;
SELECT * FROM girl_photos;
SELECT * FROM girl_videos;
SELECT * FROM availability;
EOF
```

## 🆕 Krok 2: Vytvoř novou Turso databázi

```bash
# Vytvoř novou databázi (zvol jiné jméno)
turso db create lovelygirls-prod --location aws-ap-south-1

# Získej databázové přihlašovací údaje
turso db show lovelygirls-prod

# Vytvoř auth token
turso db tokens create lovelygirls-prod

# Uložit si:
# - DATABASE_URL: libsql://lovelygirls-prod-[username].aws-ap-south-1.turso.io
# - AUTH_TOKEN: (token z předchozího příkazu)
```

## 📊 Krok 3: Importuj data do nové databáze

```bash
# Načti schéma a data do nové databáze
turso db shell lovelygirls-prod < turso-backup.sql

# Ověř, že data byla importována
turso db shell lovelygirls-prod "SELECT COUNT(*) FROM girls;"
```

## 🐙 Krok 4: Vytvoř nový GitHub repozitář

### Možnost A: Pomocí GitHub CLI (doporučeno)

```bash
# Přihlaš se do GitHub
gh auth login

# Vytvoř nový repozitář
gh repo create lovelygirls-prod --private --source=. --remote=new-origin

# Push kódu
git push new-origin main
```

### Možnost B: Manuálně přes web

1. Jdi na https://github.com/new
2. Vytvoř nový repozitář s názvem `lovelygirls-prod`
3. Nastav jako Private
4. **NETVOŘEJ** README, .gitignore ani LICENSE

```bash
# Přidej nový remote
git remote add new-origin https://github.com/[tvuj-username]/lovelygirls-prod.git

# Push kódu
git push new-origin main
```

## 🔐 Krok 5: Aktualizuj .env.local

Vytvoř nový `.env.local` soubor s novými credentials:

```bash
# Přejmenuj starý soubor
mv .env.local .env.local.backup

# Vytvoř nový .env.local
cat > .env.local << 'EOF'
# Nová Turso databáze
TURSO_DATABASE_URL=libsql://lovelygirls-prod-[username].aws-ap-south-1.turso.io
TURSO_AUTH_TOKEN=[nový-auth-token]

# Vercel Blob (zatím ponech stejný nebo vytvoř nový)
BLOB_READ_WRITE_TOKEN=[tvůj-blob-token]

# Resend API (ponech stejný)
RESEND_API_KEY=re_eQsjjuQg_KvjhcnV1McxPCeJyfj7Pf6MR

# App URL (aktualizuj po Vercel deployi)
NEXT_PUBLIC_APP_URL=https://lovelygirls-prod.vercel.app
EOF
```

## ☁️ Krok 6: Nasaď na Vercel

### Možnost A: Pomocí Vercel CLI

```bash
# Nainstaluj Vercel CLI (pokud nemáš)
npm install -g vercel

# Přihlaš se
vercel login

# Nasaď projekt
vercel --prod

# Během nasazení:
# - Project name: lovelygirls-prod
# - Framework: Next.js
# - Build command: (ponech výchozí)
# - Output directory: (ponech výchozí)
```

### Možnost B: Pomocí Vercel webového rozhraní (doporučeno)

1. Jdi na https://vercel.com/new
2. Klikni na "Import Git Repository"
3. Vyber nový GitHub repozitář `lovelygirls-prod`
4. **DŮLEŽITÉ**: Nastav Environment Variables:

```
TURSO_DATABASE_URL=libsql://lovelygirls-prod-[username].aws-ap-south-1.turso.io
TURSO_AUTH_TOKEN=[nový-auth-token]
BLOB_READ_WRITE_TOKEN=[tvůj-blob-token]
RESEND_API_KEY=re_eQsjjuQg_KvjhcnV1McxPCeJyfj7Pf6MR
NEXT_PUBLIC_APP_URL=https://lovelygirls-prod.vercel.app
```

5. Klikni na "Deploy"

## 🎯 Krok 7: Ověř nasazení

```bash
# Testuj nový web
curl -I https://lovelygirls-prod.vercel.app

# Zkontroluj, že se načítají data z nové databáze
# Otevři v prohlížeči: https://lovelygirls-prod.vercel.app/cs/divky
```

## 🔄 Krok 8: Nastav custom doménu (volitelné)

V Vercel dashboardu:
1. Jdi do Settings → Domains
2. Přidej svou doménu (např. `lovelygirls.cz`)
3. Nastav DNS záznamy podle instrukcí Vercel
4. Aktualizuj `NEXT_PUBLIC_APP_URL` v Vercel environment variables

## 📝 Checklist

- [ ] Export dat z Turso
- [ ] Vytvoření nové Turso databáze
- [ ] Import dat do nové databáze
- [ ] Vytvoření nového GitHub repozitáře
- [ ] Push kódu do nového repozitáře
- [ ] Aktualizace .env.local
- [ ] Nasazení na Vercel
- [ ] Konfigurace environment variables ve Vercel
- [ ] Ověření funkčnosti webu
- [ ] (Volitelné) Nastavení custom domény

## 🆘 Troubleshooting

### Turso databáze se nepřipojuje
```bash
turso db shell lovelygirls-prod "SELECT 1;"
```

### Vercel build failuje
- Zkontroluj, že všechny environment variables jsou nastavené
- Podívej se do build logů na Vercel dashboard

### Data se nenačítají
- Ověř, že TURSO_DATABASE_URL a TURSO_AUTH_TOKEN jsou správně nastavené ve Vercel
- Zkontroluj, že data byla správně importována pomocí Turso CLI

## 🎉 Po úspěšné migraci

Starý projekt můžeš:
- Archivovat na GitHub
- Smazat Vercel deployment
- Ponechat Turso databázi jako backup (nebo smazat po pár týdnech)

---

**Poznámka**: Tento proces vytvoří úplně nový projekt, který je nezávislý na starém. Starý projekt zůstane nedotčený.
