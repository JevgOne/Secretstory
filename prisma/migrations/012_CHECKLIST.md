# Migration 012 Deployment Checklist

## Pre-Deployment (CRITICAL - DO NOT SKIP)

### 1. Create Backup
- [ ] Create timestamped backup of database
  ```bash
  cp /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db \
     /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db.backup.$(date +%Y%m%d_%H%M%S)
  ```
- [ ] Verify backup file exists and has non-zero size
  ```bash
  ls -lh /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db.backup.*
  ```

### 2. Verify Current State
- [ ] Check current record count
  ```bash
  sqlite3 /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db "SELECT COUNT(*) FROM seo_metadata;"
  ```
  Expected: 14

- [ ] Confirm og_image_alt doesn't exist yet
  ```bash
  sqlite3 /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db "PRAGMA table_info(seo_metadata);" | grep og_image_alt
  ```
  Expected: No output

### 3. Review Migration Files
- [ ] Read migration SQL: `012_add_og_image_alt_to_seo_metadata.sql`
- [ ] Review test plan: `012_TEST_PLAN.md`
- [ ] Understand rollback: `012_add_og_image_alt_to_seo_metadata_ROLLBACK.sql`

---

## Deployment

### 4. Apply Migration
- [ ] Run migration script
  ```bash
  sqlite3 /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db < \
    /Users/zen/Secretstory/lovelygirls-design/prisma/migrations/012_add_og_image_alt_to_seo_metadata.sql
  ```
- [ ] Note time of migration: _______________

### 5. Immediate Verification
- [ ] Verify column exists
  ```bash
  sqlite3 /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db "PRAGMA table_info(seo_metadata);" | grep og_image_alt
  ```
  Expected: `16|og_image_alt|TEXT|0||0`

- [ ] Check record count unchanged
  ```bash
  sqlite3 /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db "SELECT COUNT(*) FROM seo_metadata;"
  ```
  Expected: 14

- [ ] Verify database integrity
  ```bash
  sqlite3 /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db "PRAGMA integrity_check;"
  ```
  Expected: `ok`

- [ ] Check all og_image_alt are NULL
  ```bash
  sqlite3 /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db \
    "SELECT COUNT(*) FROM seo_metadata WHERE og_image_alt IS NULL;"
  ```
  Expected: 14

---

## Post-Deployment Testing

### 6. API Testing - Read Operations
- [ ] Test GET all records
  ```bash
  curl -X GET "http://localhost:3000/api/seo?locale=cs"
  ```
  Expected: Success, returns records with `og_image_alt: null`

- [ ] Test GET specific record
  ```bash
  curl -X GET "http://localhost:3000/api/seo?page_path=/cs"
  ```
  Expected: Success, returns record with `og_image_alt: null`

### 7. API Testing - Write Operations
- [ ] Test INSERT with og_image_alt
  ```bash
  curl -X POST http://localhost:3000/api/seo \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -d '{
      "page_path": "/test-migration",
      "page_type": "static",
      "locale": "cs",
      "meta_title": "Test",
      "og_image": "/test.jpg",
      "og_image_alt": "Test alt text"
    }'
  ```
  Expected: Success (201)

- [ ] Verify INSERT worked
  ```bash
  sqlite3 /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db \
    "SELECT og_image_alt FROM seo_metadata WHERE page_path='/test-migration';"
  ```
  Expected: `Test alt text`

- [ ] Test UPDATE with og_image_alt
  ```bash
  curl -X POST http://localhost:3000/api/seo \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -d '{
      "page_path": "/cs",
      "page_type": "static",
      "locale": "cs",
      "meta_title": "LovelyGirls Prague - Premium Escort",
      "og_image_alt": "LovelyGirls Prague homepage"
    }'
  ```
  Expected: Success (200)

- [ ] Verify UPDATE worked
  ```bash
  sqlite3 /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db \
    "SELECT og_image_alt FROM seo_metadata WHERE page_path='/cs';"
  ```
  Expected: `LovelyGirls Prague homepage`

- [ ] Test INSERT without og_image_alt (backward compatibility)
  ```bash
  curl -X POST http://localhost:3000/api/seo \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -d '{
      "page_path": "/test-no-alt",
      "page_type": "static",
      "locale": "cs",
      "meta_title": "Test No Alt"
    }'
  ```
  Expected: Success (201), og_image_alt should be NULL

### 8. Frontend Testing
- [ ] Open homepage: `http://localhost:3000/cs`
- [ ] Verify page loads without errors
- [ ] Check browser console for errors
- [ ] View page source, look for meta tags
- [ ] Confirm OpenGraph meta tags render correctly

### 9. Clean Up Test Data
- [ ] Delete test records
  ```bash
  sqlite3 /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db \
    "DELETE FROM seo_metadata WHERE page_path LIKE '/test%';"
  ```

---

## Monitoring (First 24 Hours)

### 10. Application Health
- [ ] Check application logs for SQL errors
  - [ ] Hour 1: _______________
  - [ ] Hour 4: _______________
  - [ ] Hour 12: _______________
  - [ ] Hour 24: _______________

- [ ] Monitor error tracking (Sentry/etc) for new errors
  - [ ] Any og_image_alt related errors? _______________

- [ ] Check database size (should be minimal increase)
  ```bash
  ls -lh /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db
  ```

### 11. User Impact
- [ ] Any user complaints? _______________
- [ ] SEO metadata admin panel working? _______________
- [ ] Social media previews rendering? _______________

---

## Post-Migration Tasks (Week 1)

### 12. Data Population
- [ ] Add og_image_alt to homepage (/cs, /en)
- [ ] Add og_image_alt to main pages (/cs/divky, /en/divky, etc)
- [ ] Add og_image_alt to girl profiles
- [ ] Add og_image_alt to blog posts

### 13. Documentation
- [ ] Update SEO admin panel to show og_image_alt field
- [ ] Update internal documentation
- [ ] Train team on new field usage

### 14. SEO Validation
- [ ] Test OpenGraph rendering on Facebook
- [ ] Test OpenGraph rendering on Twitter/X
- [ ] Test OpenGraph rendering on LinkedIn
- [ ] Validate alt text with screen readers
- [ ] Check Google Search Console for improvements

---

## Rollback (Only If Needed)

### If Migration Fails
- [ ] Note what went wrong: _______________
- [ ] Restore from backup
  ```bash
  cp /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db.backup.TIMESTAMP \
     /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db
  ```
- [ ] Verify rollback worked
  ```bash
  sqlite3 /Users/zen/Secretstory/lovelygirls-design/lovelygirls.db "PRAGMA table_info(seo_metadata);" | grep og_image_alt
  ```
  Expected: No output
- [ ] Test application works
- [ ] Document issue for future reference

---

## Final Sign-Off

### Migration Complete
- [ ] All checks passed
- [ ] No errors in logs
- [ ] Frontend working correctly
- [ ] API endpoints tested
- [ ] Data integrity verified

**Deployed by**: _______________
**Date/Time**: _______________
**Status**: ⬜ Success  ⬜ Rolled Back
**Notes**: _______________

---

## Files Reference

- Migration SQL: `/Users/zen/Secretstory/lovelygirls-design/prisma/migrations/012_add_og_image_alt_to_seo_metadata.sql`
- Rollback SQL: `/Users/zen/Secretstory/lovelygirls-design/prisma/migrations/012_add_og_image_alt_to_seo_metadata_ROLLBACK.sql`
- Test Plan: `/Users/zen/Secretstory/lovelygirls-design/prisma/migrations/012_TEST_PLAN.md`
- Quick Start: `/Users/zen/Secretstory/lovelygirls-design/prisma/migrations/012_QUICK_START.md`
- Summary: `/Users/zen/Secretstory/lovelygirls-design/prisma/migrations/012_SUMMARY.md`
- This Checklist: `/Users/zen/Secretstory/lovelygirls-design/prisma/migrations/012_CHECKLIST.md`
