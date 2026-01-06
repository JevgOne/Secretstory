# Migration Test Plan: Add og_image_alt to seo_metadata

## Migration Details
- **Migration File**: `012_add_og_image_alt_to_seo_metadata.sql`
- **Date**: 2026-01-03
- **Type**: Schema Change (Add Column)
- **Risk Level**: LOW (backward-compatible, nullable column)

---

## Pre-Migration Checklist

### 1. Backup Database
```bash
# Create a full backup before migration
cp /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db \
   /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db.backup.$(date +%Y%m%d_%H%M%S)
```

### 2. Verify Current State
```bash
# Check current schema
sqlite3 /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db ".schema seo_metadata"

# Count existing records
sqlite3 /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db "SELECT COUNT(*) FROM seo_metadata;"

# Verify og_image_alt doesn't exist yet
sqlite3 /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db "PRAGMA table_info(seo_metadata);" | grep og_image_alt
# Expected: No output (column doesn't exist)
```

### 3. Record Baseline Metrics
```bash
# Save current data sample for comparison
sqlite3 /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db \
  "SELECT id, page_path, og_image, created_at FROM seo_metadata LIMIT 5;" > pre_migration_sample.txt
```

---

## Migration Execution

### Step 1: Apply Migration
```bash
sqlite3 /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db < \
  /Users/zen/Secretstory/lovelygirls-design/prisma/migrations/012_add_og_image_alt_to_seo_metadata.sql
```

### Step 2: Verify Migration Success
```bash
# Check new schema includes og_image_alt
sqlite3 /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db "PRAGMA table_info(seo_metadata);" | grep og_image_alt
# Expected: Output showing og_image_alt column

# Verify full schema
sqlite3 /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db ".schema seo_metadata"
# Expected: Schema includes "og_image_alt TEXT" after og_image
```

### Step 3: Data Integrity Checks
```bash
# Verify record count unchanged
sqlite3 /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db "SELECT COUNT(*) FROM seo_metadata;"
# Expected: Same count as before (14 records)

# Verify existing data intact
sqlite3 /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db \
  "SELECT id, page_path, og_image, og_image_alt FROM seo_metadata LIMIT 5;"
# Expected: All existing data present, og_image_alt is NULL for all records

# Verify no corruption
sqlite3 /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db "PRAGMA integrity_check;"
# Expected: ok
```

---

## Post-Migration Testing

### Test 1: API Read Operations (GET)
```bash
# Test existing records can be read
curl -X GET "http://localhost:3000/api/seo?page_path=/cs"
# Expected: Success, returns metadata with og_image_alt: null

# Test filtering still works
curl -X GET "http://localhost:3000/api/seo?locale=cs"
# Expected: Success, returns all Czech locale records
```

### Test 2: API Create Operations (POST - new record)
```bash
# Test inserting new record with og_image_alt
curl -X POST http://localhost:3000/api/seo \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "page_path": "/cs/test-migration",
    "page_type": "static",
    "locale": "cs",
    "meta_title": "Test Migration",
    "og_image": "/images/test.jpg",
    "og_image_alt": "Test image description"
  }'
# Expected: Success, record created with og_image_alt

# Verify the data was saved
sqlite3 /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db \
  "SELECT page_path, og_image, og_image_alt FROM seo_metadata WHERE page_path='/cs/test-migration';"
# Expected: Shows og_image_alt = "Test image description"
```

### Test 3: API Update Operations (POST - existing record)
```bash
# Test updating existing record with og_image_alt
curl -X POST http://localhost:3000/api/seo \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "page_path": "/cs",
    "page_type": "static",
    "locale": "cs",
    "meta_title": "LovelyGirls Prague - Premium Escort",
    "og_image": "/images/og-homepage.jpg",
    "og_image_alt": "LovelyGirls Prague homepage banner"
  }'
# Expected: Success, record updated

# Verify update
sqlite3 /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db \
  "SELECT page_path, og_image_alt FROM seo_metadata WHERE page_path='/cs';"
# Expected: Shows new og_image_alt value
```

### Test 4: API Operations WITHOUT og_image_alt
```bash
# Test that omitting og_image_alt still works (backward compatibility)
curl -X POST http://localhost:3000/api/seo \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "page_path": "/cs/test-no-alt",
    "page_type": "static",
    "locale": "cs",
    "meta_title": "Test Without Alt",
    "og_image": "/images/test2.jpg"
  }'
# Expected: Success, og_image_alt should be NULL
```

### Test 5: Frontend Rendering
```bash
# Check that pages render correctly with new field
# Open browser to: http://localhost:3000/cs
# View page source, check <meta> tags
# Expected: No errors, og_image_alt in meta tags if set
```

---

## Rollback Procedure (If Needed)

### When to Rollback
- Data corruption detected
- Application errors occur
- Unexpected behavior in production

### Rollback Steps
```bash
# Option 1: Restore from backup (FASTEST)
cp /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db.backup.TIMESTAMP \
   /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db

# Option 2: Run rollback script (if you need to preserve some data)
sqlite3 /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db < \
  /Users/zen/Secretstory/lovelygirls-design/prisma/migrations/012_add_og_image_alt_to_seo_metadata_ROLLBACK.sql

# Verify rollback
sqlite3 /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db "PRAGMA table_info(seo_metadata);" | grep og_image_alt
# Expected: No output (column removed)
```

### Post-Rollback Verification
```bash
# Check data integrity
sqlite3 /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db "PRAGMA integrity_check;"

# Verify record count
sqlite3 /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db "SELECT COUNT(*) FROM seo_metadata;"

# Test API still works
curl -X GET "http://localhost:3000/api/seo?page_path=/cs"
```

---

## Success Criteria

✅ Migration is successful if:
1. Column `og_image_alt` exists in schema
2. All existing records preserved (count = 14)
3. New records can be created with og_image_alt
4. Existing records can be updated with og_image_alt
5. Records without og_image_alt still work (NULL values)
6. API GET/POST/DELETE operations work correctly
7. No database integrity errors
8. Frontend renders without errors

---

## API Code Verification

The API route `/app/api/seo/route.ts` already handles `og_image_alt`:

### Line 80: Field is extracted from request body
```typescript
og_image_alt,
```

### Line 120: Field is included in UPDATE args
```typescript
og_image_alt || null,
```

### Line 149: Field is set in UPDATE query
```typescript
og_image_alt = ?,
```

### Line 192: Field is included in INSERT args
```typescript
og_image_alt || null,
```

### Line 213: Field is in INSERT column list
```typescript
og_image, og_image_alt, og_type,
```

**Conclusion**: No code changes needed. The API is already prepared for this field.

---

## Cleanup After Successful Migration

```bash
# Remove test records
sqlite3 /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db \
  "DELETE FROM seo_metadata WHERE page_path LIKE '/cs/test-%';"

# Keep backup for 7 days, then remove
# rm /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db.backup.TIMESTAMP
```

---

## Monitoring Post-Migration

### Days 1-3: Watch for issues
- Monitor application logs for SQL errors
- Check Sentry/error tracking for new errors
- Verify SEO metadata appears correctly in production

### Week 1: Populate data
- Add og_image_alt to existing records
- Test screen readers with new alt text
- Validate OpenGraph rendering on social media

---

## Notes

- **Risk Level**: LOW - This is a simple column addition
- **Downtime**: NONE - SQLite ALTER TABLE is instant
- **Backward Compatible**: YES - Nullable column, API handles it
- **Data Loss Risk**: NONE - Only adding, not modifying/deleting
- **Reversible**: YES - Rollback script provided
