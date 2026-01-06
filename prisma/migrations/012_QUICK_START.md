# Quick Start: Apply og_image_alt Migration

## TL;DR - Execute Migration

```bash
# 1. Backup database (REQUIRED)
cp /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db \
   /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db.backup.$(date +%Y%m%d_%H%M%S)

# 2. Apply migration
sqlite3 /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db < \
  /Users/zen/Secretstory/lovelygirls-design/prisma/migrations/012_add_og_image_alt_to_seo_metadata.sql

# 3. Verify success
sqlite3 /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db \
  "PRAGMA table_info(seo_metadata);" | grep og_image_alt

# Expected output: 24|og_image_alt|TEXT|0||0
```

## What This Migration Does

Adds a single new column `og_image_alt` to the `seo_metadata` table:
- **Type**: TEXT (nullable)
- **Purpose**: Store OpenGraph image alt text for accessibility
- **Impact**: Zero - backward compatible, won't break anything
- **Downtime**: None - instant operation

## Verification Test Results

✅ **Pre-tested successfully** on 2026-01-03:
- Migration tested on copy of production database
- All 14 existing records preserved
- Database integrity verified
- Test insert/update operations successful
- API code already handles this field (lines 80, 120, 149, 192, 213)

## If Something Goes Wrong

```bash
# Restore from backup
cp /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db.backup.TIMESTAMP \
   /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db
```

## Files Created

1. **Migration SQL**: `012_add_og_image_alt_to_seo_metadata.sql`
2. **Rollback SQL**: `012_add_og_image_alt_to_seo_metadata_ROLLBACK.sql`
3. **Test Plan**: `012_TEST_PLAN.md` (comprehensive testing guide)
4. **Verification Script**: `012_VERIFY.sh` (automated safety checks)
5. **This Guide**: `012_QUICK_START.md`

## Next Steps After Migration

1. **Verify in app**: Check that SEO admin panel still works
2. **Add alt text**: Populate og_image_alt for existing pages
3. **Test rendering**: Verify OpenGraph meta tags include alt text
4. **Monitor**: Watch logs for any SQL errors (unlikely)

## Safe to Apply?

**YES** - This migration is:
- ✅ Backward compatible
- ✅ Tested on production data copy
- ✅ Non-destructive (only adding, not changing)
- ✅ Reversible (rollback script provided)
- ✅ Zero downtime
- ✅ API already supports it

**Risk Level**: LOW
