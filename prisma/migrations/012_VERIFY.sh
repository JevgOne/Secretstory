#!/bin/bash

# Migration Verification Script
# Purpose: Safely test the og_image_alt migration before applying to production
# Usage: ./012_VERIFY.sh

set -e  # Exit on any error

DB_PATH="/Users/zen/Secretstory/lovelygirls-design/lovelygirls.db"
MIGRATION_FILE="/Users/zen/Secretstory/lovelygirls-design/prisma/migrations/012_add_og_image_alt_to_seo_metadata.sql"
TEST_DB="/tmp/seo_migration_test.db"

echo "=========================================="
echo "Migration Verification: og_image_alt"
echo "=========================================="
echo ""

# Step 1: Create test database copy
echo "[1/6] Creating test database copy..."
cp "$DB_PATH" "$TEST_DB"
echo "✓ Test database created at: $TEST_DB"
echo ""

# Step 2: Verify original schema
echo "[2/6] Checking current schema..."
BEFORE_SCHEMA=$(sqlite3 "$TEST_DB" "PRAGMA table_info(seo_metadata);" | grep og_image_alt || true)
if [ -z "$BEFORE_SCHEMA" ]; then
    echo "✓ Confirmed: og_image_alt does NOT exist yet (expected)"
else
    echo "✗ ERROR: og_image_alt already exists!"
    exit 1
fi
echo ""

# Step 3: Count records before migration
echo "[3/6] Counting records before migration..."
BEFORE_COUNT=$(sqlite3 "$TEST_DB" "SELECT COUNT(*) FROM seo_metadata;")
echo "✓ Current record count: $BEFORE_COUNT"
echo ""

# Step 4: Apply migration to test database
echo "[4/6] Applying migration to test database..."
sqlite3 "$TEST_DB" < "$MIGRATION_FILE"
echo "✓ Migration applied successfully"
echo ""

# Step 5: Verify new schema
echo "[5/6] Verifying new schema..."
AFTER_SCHEMA=$(sqlite3 "$TEST_DB" "PRAGMA table_info(seo_metadata);" | grep og_image_alt)
if [ -n "$AFTER_SCHEMA" ]; then
    echo "✓ Confirmed: og_image_alt column exists"
    echo "  Column info: $AFTER_SCHEMA"
else
    echo "✗ ERROR: og_image_alt column was not created!"
    exit 1
fi
echo ""

# Step 6: Verify data integrity
echo "[6/6] Verifying data integrity..."

AFTER_COUNT=$(sqlite3 "$TEST_DB" "SELECT COUNT(*) FROM seo_metadata;")
if [ "$BEFORE_COUNT" -eq "$AFTER_COUNT" ]; then
    echo "✓ Record count matches: $AFTER_COUNT"
else
    echo "✗ ERROR: Record count changed! Before: $BEFORE_COUNT, After: $AFTER_COUNT"
    exit 1
fi

INTEGRITY=$(sqlite3 "$TEST_DB" "PRAGMA integrity_check;")
if [ "$INTEGRITY" = "ok" ]; then
    echo "✓ Database integrity check: PASSED"
else
    echo "✗ ERROR: Database integrity check FAILED: $INTEGRITY"
    exit 1
fi

# Check that og_image_alt is NULL for all existing records
NULL_COUNT=$(sqlite3 "$TEST_DB" "SELECT COUNT(*) FROM seo_metadata WHERE og_image_alt IS NULL;")
if [ "$NULL_COUNT" -eq "$AFTER_COUNT" ]; then
    echo "✓ All existing records have og_image_alt = NULL (expected)"
else
    echo "⚠ WARNING: Some records have non-NULL og_image_alt values"
fi

# Test inserting a record with og_image_alt
sqlite3 "$TEST_DB" "INSERT INTO seo_metadata (page_path, page_type, locale, og_image, og_image_alt) VALUES ('/test', 'static', 'cs', '/test.jpg', 'Test alt text');"
TEST_ALT=$(sqlite3 "$TEST_DB" "SELECT og_image_alt FROM seo_metadata WHERE page_path='/test';")
if [ "$TEST_ALT" = "Test alt text" ]; then
    echo "✓ Test insert with og_image_alt: SUCCESS"
    sqlite3 "$TEST_DB" "DELETE FROM seo_metadata WHERE page_path='/test';"
else
    echo "✗ ERROR: Test insert failed"
    exit 1
fi

echo ""
echo "=========================================="
echo "✓ VERIFICATION COMPLETE - ALL CHECKS PASSED"
echo "=========================================="
echo ""
echo "The migration is SAFE to apply to production."
echo ""
echo "To apply to production database:"
echo "  sqlite3 $DB_PATH < $MIGRATION_FILE"
echo ""
echo "Test database location (for inspection):"
echo "  $TEST_DB"
echo ""
echo "To clean up test database:"
echo "  rm $TEST_DB"
echo ""
