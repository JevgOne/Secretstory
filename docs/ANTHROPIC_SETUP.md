# Anthropic Claude API Setup

Systém teď používá **Claude 3.5 Sonnet** místo OpenAI pro generování a překlady.

## 🔑 Získání API klíče

### 1. Registrace na Anthropic

**URL:** https://console.anthropic.com/

**Kroky:**
1. Jdi na https://console.anthropic.com/
2. Klikni **"Sign In"** nebo **"Get Started"**
3. Zaregistruj se (email + heslo)
4. Ověř email

### 2. Vytvoření API klíče

Po přihlášení:
1. Jdi na **"API Keys"** v menu
2. Klikni **"Create Key"**
3. Pojmenuj klíč (např. "LovelyGirls Blog")
4. **Zkopíruj klíč** (začíná `sk-ant-...`)
5. ⚠️ **DŮLEŽITÉ:** Ulož klíč bezpečně - už ho neuvidíš!

### 3. Nastavení v projektu

**Přidej do `.env.local`:**

```bash
# Anthropic Claude API
ANTHROPIC_API_KEY=sk-ant-api03-xxx...
```

**Zkontroluj že máš:**
```bash
# V terminálu:
grep ANTHROPIC .env.local
```

**Mělo by vrátit:**
```
ANTHROPIC_API_KEY=sk-ant-api03-xxx...
```

---

## 💰 Ceny

Claude 3.5 Sonnet je **levnější** než GPT-4:

| Operace | Claude 3.5 Sonnet | GPT-4o | Úspora |
|---------|-------------------|--------|--------|
| Input (1M tokens) | $3 | $5 | 40% |
| Output (1M tokens) | $15 | $15 | 0% |

### Odhad nákladů pro blog:

**10 článků + překlady:**
- Generování 10 článků: ~$1.50
- 30 překladů (3 jazyky × 10): ~$3
- **Celkem: ~$4.50**

**30 článků + překlady:**
- Generování 30 článků: ~$4.50
- 90 překladů: ~$9
- **Celkem: ~$13.50**

---

## 🎯 Model

Používáme: **`claude-3-5-sonnet-20241022`**

**Výhody:**
- ✅ Lepší čeština než GPT-4
- ✅ Delší context window (200k tokens)
- ✅ Rychlejší odpovědi
- ✅ Levnější input
- ✅ Lepší pochopení kontextu

---

## 🚀 Jak použít

### Generování článků:

```bash
# S Anthropic API key v .env.local:
TURSO_DATABASE_URL="..." \
TURSO_AUTH_TOKEN="..." \
npx tsx scripts/seed-blog-articles.ts
```

### Nebo přes UI:

```
/admin/blog/generate
```

---

## 🔧 Testování

**Rychlý test:**

```bash
# Vytvoř testovací soubor:
cat > test-claude.mjs << 'EOF'
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const message = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 100,
  messages: [
    { role: 'user', content: 'Řekni "Funguje!" v češtině' }
  ]
});

console.log(message.content[0].text);
EOF

# Spusť test:
node test-claude.mjs
```

**Očekávaný výsledek:**
```
Funguje!
```

---

## ❌ Troubleshooting

### "Authentication error"
- Zkontroluj že máš správný klíč v `.env.local`
- Klíč musí začínat `sk-ant-`
- Restartuj dev server: `npm run dev`

### "Insufficient credits"
- Jdi na https://console.anthropic.com/settings/billing
- Přidej platební metodu
- Kup kredity ($5 minimum)

### "Rate limit exceeded"
- Počkej 1 minutu
- Nebo přidej delay mezi requesty (už je ve skriptu)

---

## 📊 Dashboard

**Sleduj usage:**
https://console.anthropic.com/settings/usage

---

**Vytvořeno:** 2026-01-26
**Model:** Claude 3.5 Sonnet (20241022)
