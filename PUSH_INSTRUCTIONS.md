# 📤 Instrukce pro push do nového GitHub repozitáře

## ✅ Připraveno:

- ✅ `.env.local` aktualizován s novými Turso credentials
- ✅ Všechny změny jsou commitnuté
- ✅ Remote `new-prod` je nastaven na: `git@github.com:lovelygirlsprivate-gif/LG.git`

## 🚀 Jak pushnut kód:

### Možnost 1: Přidej mě jako collaboratora (doporučeno)

1. Jdi na: https://github.com/lovelygirlsprivate-gif/LG/settings/access
2. Klikni na "Add people"
3. Přidej uživatele: `JevgOne`
4. Zvol role: "Write" nebo "Admin"

Pak já můžu spustit:
```bash
git push new-prod main
```

### Možnost 2: Push pomocí svého účtu

```bash
# Ujisti se, že jsi přihlášený na správný GitHub účet
git config user.name
git config user.email

# Push kódu
git push new-prod main
```

### Možnost 3: Použij GitHub Personal Access Token

1. Vytvoř token na: https://github.com/settings/tokens/new
2. Scope: `repo` (všechno)
3. Zkopíruj token

```bash
# Odstraň současný remote
git remote remove new-prod

# Přidej s tokenem (nahraď YOUR_TOKEN)
git remote add new-prod https://YOUR_TOKEN@github.com/lovelygirlsprivate-gif/LG.git

# Push
git push new-prod main
```

## 🎯 Po úspěšném push:

Vercel automaticky detekuje nový GitHub repozitář. Budeš muset:

1. Jít na https://vercel.com/new
2. Import repozitář: `lovelygirlsprivate-gif/LG`
3. Nastavit Environment Variables (viz níže)
4. Deploy

## 🔐 Environment Variables pro Vercel:

```
TURSO_DATABASE_URL=libsql://lg2-lovelygirlsprivate-gif.aws-eu-west-1.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjY5NTgxNTEsImlkIjoiYjU1MGI2OGEtMDZkNC00N2EzLTkxZWYtYjc1YzU3NDlmNzJhIiwicmlkIjoiNGExMWU3Y2ItZGQyZS00NTcyLTg0N2UtNTQxZDUxMzNkNzA2In0.TYaIiZOdUBu9dNNOyeZ4A8r1ymo3qK92UUYcopof2jVlE-xJcbDpN3kZWF_PHE1cewiCmJweuMPmIaaRrNpCDw
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_QKTYf1OZcVE7804I_1SlbZuyHn66yymHV9ulOY6T4ZDovEo
RESEND_API_KEY=re_eQsjjuQg_KvjhcnV1McxPCeJyfj7Pf6MR
NEXT_PUBLIC_APP_URL=https://lg-lovelygirlsprivate-gif.vercel.app
```

**DŮLEŽITÉ:** Zkopíruj všechny tyto proměnné přesně jak jsou!

## 📝 Checklist:

- [ ] Push kódu do GitHub úspěšný
- [ ] Vercel projekt vytvořen a napojen na GitHub
- [ ] Environment variables nastaveny ve Vercel
- [ ] První deployment dokončen
- [ ] Web funguje na nové URL
- [ ] Data se načítají z nové Turso databáze

---

**Status:** ⏸️ Čekám na GitHub push přístup
