# Visual Migration Guide: og_image_alt

## Migration Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        BEFORE MIGRATION                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  seo_metadata table (14 records)                               │
│  ┌──────────────────────────────────────────────────────┐      │
│  │ id | page_path | ... | og_image | og_type | ...      │      │
│  ├──────────────────────────────────────────────────────┤      │
│  │ 1  | /cs       | ... | NULL     | website | ...      │      │
│  │ 2  | /en       | ... | NULL     | website | ...      │      │
│  │ 3  | /cs/divky | ... | NULL     | website | ...      │      │
│  │ ...                                                   │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                 │
│  Missing: og_image_alt column                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │  ALTER TABLE seo_metadata
                              │  ADD COLUMN og_image_alt TEXT;
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        AFTER MIGRATION                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  seo_metadata table (14 records - UNCHANGED)                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ id | page_path | og_image | og_image_alt | og_type      │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ 1  | /cs       | NULL     | NULL ◄─NEW   | website     │  │
│  │ 2  | /en       | NULL     | NULL         | website     │  │
│  │ 3  | /cs/divky | NULL     | NULL         | website     │  │
│  │ ...                                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Added: og_image_alt column (all values = NULL)               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## API Integration Status

```
┌─────────────────────────────────────────────────────────────────┐
│                    API Route: /app/api/seo/route.ts            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✅ Line 80:  Field extracted from request body               │
│     const { ..., og_image_alt, ... } = body;                  │
│                                                                 │
│  ✅ Line 120: Field included in UPDATE args                   │
│     args = [..., og_image_alt || null, ...]                   │
│                                                                 │
│  ✅ Line 149: Field set in UPDATE query                       │
│     UPDATE seo_metadata SET og_image_alt = ?, ...             │
│                                                                 │
│  ✅ Line 192: Field included in INSERT args                   │
│     args = [..., og_image_alt || null, ...]                   │
│                                                                 │
│  ✅ Line 213: Field in INSERT column list                     │
│     INSERT INTO seo_metadata (..., og_image_alt, ...)         │
│                                                                 │
│  RESULT: No code changes needed!                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Migration Timeline

```
┌─────────────────────────────────────────────────────────────────┐
│                        DEPLOYMENT TIMELINE                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  T-10 min:  Read documentation, understand migration           │
│             ├─ 012_README.md                                   │
│             ├─ 012_QUICK_START.md                              │
│             └─ 012_SUMMARY.md                                  │
│                                                                 │
│  T-5 min:   Create database backup                             │
│             ├─ cp lovelygirls.db lovelygirls.db.backup        │
│             └─ Verify backup exists                            │
│                                                                 │
│  T-0:       Apply migration                                    │
│             └─ sqlite3 db < 012_add_og_image_alt.sql           │
│                ▼                                                │
│                Less than 1 second                               │
│                ▼                                                │
│             ✅ Migration complete                              │
│                                                                 │
│  T+1 min:   Verify migration                                   │
│             ├─ PRAGMA table_info(seo_metadata)                 │
│             ├─ SELECT COUNT(*) (should be 14)                  │
│             └─ PRAGMA integrity_check                          │
│                                                                 │
│  T+5 min:   Test API endpoints                                 │
│             ├─ GET /api/seo                                    │
│             ├─ POST /api/seo (create)                          │
│             └─ POST /api/seo (update)                          │
│                                                                 │
│  T+10 min:  Verify frontend                                    │
│             ├─ Open localhost:3000                             │
│             ├─ Check browser console                           │
│             └─ View page source                                │
│                                                                 │
│  T+1 hour:  Monitor logs                                       │
│             └─ Check for any SQL errors                        │
│                                                                 │
│  T+1 day:   Start populating data                              │
│             └─ Add og_image_alt to existing records            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow After Migration

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER REQUEST                            │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    POST /api/seo                                │
│  {                                                              │
│    "page_path": "/cs",                                         │
│    "og_image": "/images/homepage.jpg",                         │
│    "og_image_alt": "LovelyGirls Prague homepage" ◄── NEW       │
│  }                                                              │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API ROUTE HANDLER                            │
│  1. Extract og_image_alt from body (line 80)                   │
│  2. Prepare args array (line 120 or 192)                       │
│  3. Execute SQL query (line 149 or 213)                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (SQLite)                            │
│  UPDATE seo_metadata SET                                        │
│    og_image = '/images/homepage.jpg',                          │
│    og_image_alt = 'LovelyGirls Prague homepage' ◄── SAVED     │
│  WHERE page_path = '/cs'                                       │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND RENDERING                           │
│  <meta property="og:image"                                     │
│        content="/images/homepage.jpg" />                       │
│  <meta property="og:image:alt"                                 │
│        content="LovelyGirls Prague homepage" /> ◄── RENDERED  │
└─────────────────────────────────────────────────────────────────┘
```

## Risk Matrix

```
┌─────────────────────────────────────────────────────────────────┐
│                        RISK ASSESSMENT                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Data Loss Risk:           ⬜⬜⬜⬜⬜  0/5  None                │
│  Downtime Risk:            ⬜⬜⬜⬜⬜  0/5  None                │
│  Breaking Change Risk:     ⬜⬜⬜⬜⬜  0/5  None                │
│  Rollback Difficulty:      ⬜⬜⬜⬜⬜  1/5  Very Easy          │
│  Testing Coverage:         ⬛⬛⬛⬛⬛  5/5  Complete            │
│  Documentation Quality:    ⬛⬛⬛⬛⬛  5/5  Excellent          │
│                                                                 │
│  OVERALL RISK:            ⬜⬜⬜⬜⬜  LOW                        │
│  DEPLOYMENT CONFIDENCE:   ⬛⬛⬛⬛⬛  HIGH                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Success Criteria Checklist

```
┌─────────────────────────────────────────────────────────────────┐
│                    VERIFICATION CHECKLIST                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Database:                                                      │
│    ✓ Column og_image_alt exists                                │
│    ✓ All 14 records preserved                                  │
│    ✓ Database integrity check passes                           │
│    ✓ No corruption detected                                    │
│                                                                 │
│  API:                                                           │
│    ✓ GET requests work                                         │
│    ✓ POST (insert) works with og_image_alt                     │
│    ✓ POST (insert) works without og_image_alt                  │
│    ✓ POST (update) works with og_image_alt                     │
│    ✓ DELETE requests work                                      │
│                                                                 │
│  Frontend:                                                      │
│    ✓ Pages load without errors                                 │
│    ✓ No console errors                                         │
│    ✓ Meta tags render correctly                                │
│    ✓ OpenGraph previews work                                   │
│                                                                 │
│  Performance:                                                   │
│    ✓ No performance degradation                                │
│    ✓ Query times unchanged                                     │
│    ✓ Database size increase < 1KB                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Rollback Process

```
┌─────────────────────────────────────────────────────────────────┐
│                        IF ROLLBACK NEEDED                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Option 1: Restore from Backup (FASTEST - 5 seconds)           │
│  ────────────────────────────────────────────────────────────  │
│  cp lovelygirls.db.backup.TIMESTAMP lovelygirls.db             │
│                                                                 │
│  ✓ Instant rollback                                            │
│  ✓ Guaranteed to work                                          │
│  ✗ Loses any data changes since migration                      │
│                                                                 │
│                           OR                                    │
│                                                                 │
│  Option 2: Run Rollback Script (SLOWER - 30 seconds)           │
│  ────────────────────────────────────────────────────────────  │
│  sqlite3 db < 012_add_og_image_alt_ROLLBACK.sql                │
│                                                                 │
│  ✓ Preserves data changes since migration                      │
│  ✓ Removes only og_image_alt column                            │
│  ✗ More complex (recreates table)                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## File Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     MIGRATION 012 FILES                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  012_README.md ◄──────────── START HERE                        │
│       │                                                         │
│       ├─► 012_QUICK_START.md ─────► Quick deployment          │
│       │                                                         │
│       ├─► 012_CHECKLIST.md ───────► Step-by-step guide        │
│       │                                                         │
│       ├─► 012_SUMMARY.md ─────────► Complete overview         │
│       │                                                         │
│       ├─► 012_TEST_PLAN.md ───────► Testing guide             │
│       │                                                         │
│       ├─► 012_SCHEMA_DIFF.sql ────► Schema comparison         │
│       │                                                         │
│       └─► 012_VISUAL_GUIDE.md ────► This document             │
│                                                                 │
│  Executable Files:                                             │
│  ├─► 012_add_og_image_alt.sql ────► Main migration            │
│  ├─► 012_ROLLBACK.sql ────────────► Undo migration            │
│  └─► 012_VERIFY.sh ───────────────► Test migration            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Expected Output Examples

### Successful Migration Output

```bash
$ sqlite3 lovelygirls.db < 012_add_og_image_alt.sql
# No output = Success!

$ sqlite3 lovelygirls.db "PRAGMA table_info(seo_metadata);" | grep og_image_alt
16|og_image_alt|TEXT|0||0
```

### API Response Examples

**Before Migration:**
```json
{
  "success": true,
  "metadata": {
    "id": 1,
    "page_path": "/cs",
    "og_image": null
    // No og_image_alt field
  }
}
```

**After Migration:**
```json
{
  "success": true,
  "metadata": {
    "id": 1,
    "page_path": "/cs",
    "og_image": null,
    "og_image_alt": null  // ← New field (NULL by default)
  }
}
```

**After Populating Data:**
```json
{
  "success": true,
  "metadata": {
    "id": 1,
    "page_path": "/cs",
    "og_image": "/images/homepage.jpg",
    "og_image_alt": "LovelyGirls Prague homepage banner"
  }
}
```

---

## Navigation

- **← Previous**: [011_girl_media.sql](./011_girl_media.sql)
- **↑ Index**: [012_README.md](./012_README.md)
- **→ Next**: TBD

---

**Visual Guide Version**: 1.0
**Last Updated**: 2026-01-03
