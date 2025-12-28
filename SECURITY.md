# 🔒 Bezpečnostní instrukce

## ⚠️  DŮLEŽITÉ: Odstranění demo účtů

Demo účty jsou **BEZPEČNOSTNÍ RIZIKO** a musí být odstraněny před nasazením do produkce!

### Krok 1: Odstraň demo účty z databáze

```bash
npm run remove-demo
```

Tento script odstraní:
- ✅ Demo admin účty (`admin@lovelygirls.cz`, `manager@lovelygirls.cz`)
- ✅ Demo girl účty (`katy@demo.cz`, `ema@demo.cz`, `sofia@demo.cz`)
- ✅ Ukázková data (Katy, Ema, Sofia)
- ✅ Demo rezervace

### Krok 2: Vytvoř bezpečný admin účet

```bash
npm run create-admin
```

Script se tě zeptá na:
- Email (použij skutečný email)
- Heslo (min. 8 znaků, použij silné heslo!)
- Potvrzení hesla

**Doporučení pro heslo:**
- Minimálně 12 znaků
- Kombinace velkých a malých písmen
- Čísla a speciální znaky
- Příklad: `MySecure#Pass2024!`

### Krok 3: Ověř že demo účty byly odstraněny

```bash
# Přihlaš se do admin panelu
# URL: /admin/login
#
# Pokus se přihlásit s demo účtem:
# Email: admin@lovelygirls.cz
# Password: admin123
#
# Mělo by selhat!
```

---

## 🔐 Ochrana citlivých dat

### Environment variables

**NIKDY necommituj tyto soubory:**
- ❌ `.env.local`
- ❌ `.env.production`
- ❌ `.env*.local`
- ❌ Jakékoliv soubory s hesly nebo API klíči

**.gitignore je již nastaven** na ignorování těchto souborů.

### Ověř že .env.local není v Gitu:

```bash
git status
# .env.local by NEMĚL být zobrazen!

git ls-files | grep env
# .env.local by NEMĚL být v seznamu!
```

### Pokud jsi omylem commitnul .env.local:

```bash
# Odstraň ze staging
git rm --cached .env.local

# Commit
git commit -m "Remove .env.local from git"

# Push
git push
```

**⚠️  DŮLEŽITÉ:** Pokud byl .env.local s credentials v Gitu, **ROTUJ VŠECHNY KLÍČE!**

---

## 🔑 Rotace API klíčů (pokud byly kompromitovány)

### 1. Turso Database Token

```bash
# Vygeneruj nový token
turso db tokens create [database-name]

# Aktualizuj .env.local
TURSO_AUTH_TOKEN=nový-token
```

### 2. Vercel Blob Token

1. Jdi na: https://vercel.com/dashboard/stores
2. Vyber svůj Blob store
3. Klikni na "Rotate Token"
4. Zkopíruj nový token do `.env.local`

### 3. Resend API Key

1. Jdi na: https://resend.com/api-keys
2. Vytvoř nový API klíč
3. Smaž starý klíč
4. Aktualizuj `.env.local`

### 4. Aktualizuj Vercel Environment Variables

Po rotaci klíčů:

1. Jdi na: https://vercel.com/dashboard
2. Vyber projekt
3. Settings → Environment Variables
4. Aktualizuj všechny rotované klíče
5. Redeploy: Deployments → ... → Redeploy

---

## 🛡️ Bezpečnostní checklist

### Před nasazením do produkce:

- [ ] Demo účty odstraněny (`npm run remove-demo`)
- [ ] Nový admin účet vytvořen (`npm run create-admin`)
- [ ] `.env.local` není v Git repozitáři
- [ ] Všechny API klíče jsou v Vercel Environment Variables
- [ ] Silná hesla pro admin účty (12+ znaků)
- [ ] HTTPS je povoleno (Vercel automaticky)
- [ ] CSP (Content Security Policy) nakonfigurováno

### Pravidelná údržba:

- [ ] Měsíčně: Kontrola admin přístupů
- [ ] Kvartálně: Rotace API klíčů
- [ ] Ročně: Audit bezpečnosti

---

## 🚨 Co dělat při bezpečnostním incidentu

1. **Okamžitě rotuj všechny API klíče**
2. **Změň všechna admin hesla**
3. **Zkontroluj logy v Vercel**
4. **Ověř integritu databáze**
5. **Informuj uživatele (pokud byla kompromitována osobní data)**

---

## 📞 Kontakt pro bezpečnostní hlášení

Pokud objevíš bezpečnostní chybu:
- Email: [tvůj-email]
- Discord: [tvůj-discord]

**Prosím NEVEŘEJŇUJ bezpečnostní chyby veřejně!**

---

## 📚 Další doporučení

### HTTPS

- ✅ Vercel automaticky používá HTTPS
- ✅ Force HTTPS redirect je aktivní

### Rate Limiting

Zvažte přidání rate limitingu pro:
- Login endpointy
- API endpointy
- Registration formy

### Monitoring

Doporučené nástroje:
- Vercel Analytics (automaticky aktivní)
- Sentry (error tracking)
- LogSnag (notifications)

---

**Poslední aktualizace:** 2025-12-28
**Verze:** 1.0
