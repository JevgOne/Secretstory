# ✅ Finální kroky k dokončení migrace

## 📍 Aktuální stav:

✅ Nová Turso databáze vytvořena a připravena
✅ `.env.local` aktualizován s novými credentials
✅ Všechny změny commitnuté
✅ Git remote nastaven na nový GitHub repo
⏸️ **POTŘEBUJE AKCI:** Push do GitHub a Vercel setup

---

## 🚀 Co musíš teď udělat (3 kroky):

### Krok 1: Push kódu na GitHub (1 minuta)

```bash
# V terminálu, v této složce:
git push new-prod main
```

**Pokud máš chybu oprávnění:**
- Ujisti se, že jsi přihlášený na GitHub účet `lovelygirlsprivate-gif`
- Nebo přidej JevgOne jako collaboratora na https://github.com/lovelygirlsprivate-gif/LG/settings/access

---

### Krok 2: Vytvoř Vercel projekt (2 minuty)

1. Jdi na: **https://vercel.com/new**

2. Klikni na **"Import Git Repository"**

3. Vyber: **`lovelygirlsprivate-gif/LG`**

4. **DŮLEŽITÉ:** Před kliknutím na "Deploy", přidej Environment Variables:

   Klikni na **"Environment Variables"** a přidej tyto 5 proměnných:

   ```
   Name: TURSO_DATABASE_URL
   Value: libsql://lg2-lovelygirlsprivate-gif.aws-eu-west-1.turso.io
   ```

   ```
   Name: TURSO_AUTH_TOKEN
   Value: eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjY5NTgxNTEsImlkIjoiYjU1MGI2OGEtMDZkNC00N2EzLTkxZWYtYjc1YzU3NDlmNzJhIiwicmlkIjoiNGExMWU3Y2ItZGQyZS00NTcyLTg0N2UtNTQxZDUxMzNkNzA2In0.TYaIiZOdUBu9dNNOyeZ4A8r1ymo3qK92UUYcopof2jVlE-xJcbDpN3kZWF_PHE1cewiCmJweuMPmIaaRrNpCDw
   ```

   ```
   Name: BLOB_READ_WRITE_TOKEN
   Value: vercel_blob_rw_QKTYf1OZcVE7804I_1SlbZuyHn66yymHV9ulOY6T4ZDovEo
   ```

   ```
   Name: RESEND_API_KEY
   Value: re_eQsjjuQg_KvjhcnV1McxPCeJyfj7Pf6MR
   ```

   ```
   Name: NEXT_PUBLIC_APP_URL
   Value: https://lg-lovelygirlsprivate-gif.vercel.app
   ```

   **PRO TIP:** Všechny hodnoty jsou připravené v souboru `vercel-env-variables.txt` - můžeš je odtud zkopírovat!

5. Klikni na **"Deploy"**

6. Počkej 2-3 minuty na dokončení buildu

---

### Krok 3: Ověř že vše funguje (30 sekund)

Po dokončení deploye:

1. Otevři URL, kterou ti Vercel ukáže (pravděpodobně `https://lg-lovelygirlsprivate-gif.vercel.app`)

2. Zkontroluj tyto stránky:
   - `/cs/divky` - měly by se zobrazit všechny dívky
   - `/cs/cenik` - ceník
   - `/cs/schedule` - rozvrh

3. Pokud vše funguje → **🎉 HOTOVO!**

---

## 🆘 Pokud něco nefunguje:

### Build ve Vercel failuje
- Zkontroluj že jsi přidal **VŠECH 5** environment variables
- Podívej se do Build Logs ve Vercel dashboardu

### Stránky se načtou, ale nejsou data
- Ověř že `TURSO_DATABASE_URL` a `TURSO_AUTH_TOKEN` jsou správně
- Zkus Redeploy ve Vercel dashboardu

### 500 Internal Server Error
- Jdi do Vercel → tvůj projekt → Logs
- Najdi error message
- Obvykle chybí nějaká environment variable

---

## 📱 Po úspěšném nasazení:

Máš nový projekt! 🚀

- **GitHub:** https://github.com/lovelygirlsprivate-gif/LG
- **Vercel:** https://vercel.com/dashboard (tvůj nový projekt)
- **Live web:** https://lg-lovelygirlsprivate-gif.vercel.app
- **Turso DB:** libsql://lg2-lovelygirlsprivate-gif.aws-eu-west-1.turso.io

### Volitelné další kroky:

**Custom doména:**
1. Vercel Dashboard → tvůj projekt → Settings → Domains
2. Add Domain → zadej svou doménu
3. Nastav DNS podle instrukcí

**Aktualizuj URL:**
Až budeš mít custom doménu, aktualizuj:
- Vercel env variable: `NEXT_PUBLIC_APP_URL`
- `.env.local` v projektu

---

## 📦 Důležité soubory:

- `PUSH_INSTRUCTIONS.md` - Detailní push instrukce
- `vercel-env-variables.txt` - Ready-to-copy environment variables
- `.env.local` - Lokální konfigurace (již aktualizováno)
- `.env.local.backup-20251228` - Backup starých credentials

---

**Potřebuješ pomoc?** Napiš mi! 💬
