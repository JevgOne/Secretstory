# Vercel Blob Setup - Instrukce

Upload fotek a videí teď používá **Vercel Blob** storage.

## 🚀 Pro LOKÁLNÍ development (nepovinné)

Lokálně to bude fungovat i bez tokenu - Vercel Blob automaticky použije demo storage pro development.

Pokud chceš plně funkční lokální upload:

1. Jdi na [Vercel Dashboard](https://vercel.com/dashboard)
2. Vyber projekt "lovelygirls-design"
3. Jdi na **Storage** → **Create Database** → **Blob**
4. Zkopíruj `BLOB_READ_WRITE_TOKEN`
5. Přidej do `.env.local`:
   ```
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
   ```

## 📦 Pro PRODUKCI (Vercel deploy)

Když dáš web na Vercel, storage se nastaví **AUTOMATICKY**:

1. V Vercel projektu jdi na **Storage** tab
2. Připoj Blob storage k projektu (klikni "Connect")
3. Vercel automaticky přidá `BLOB_READ_WRITE_TOKEN` do environment variables

**Hotovo!** Nemusíš nic víc dělat.

## 💰 Cena

- **Free tier:** 5 GB storage + 100 GB bandwidth/měsíc
- **Pro:** $0.15/GB storage + $0.15/GB bandwidth

## 📁 Kde se ukládají soubory

- **Produkce:** Vercel Blob Cloud (CDN po celém světě)
- **Lokálně:** Demo storage (stačí pro testování)

## 🔄 Migrace z lokálního úložiště

Pokud máš už nějaké fotky v `/public/uploads/`, můžeš je migrovat:
1. Nahrát je ručně přes admin (prostě je nahrát znovu)
2. Nebo napsat migrační script (řekni, když budeš chtít)

---

**Vše je hotové a připravené k použití!** ✅
