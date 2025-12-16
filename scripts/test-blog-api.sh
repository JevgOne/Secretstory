#!/bin/bash

# Blog API Testing Script
# This script tests all blog CMS endpoints

BASE_URL="http://localhost:3000"
echo "Testing Blog CMS API Endpoints..."
echo "================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

test_endpoint() {
  local name=$1
  local method=$2
  local url=$3
  local data=$4
  local expected_status=${5:-200}

  echo -e "${BLUE}Testing: $name${NC}"
  echo "  Method: $method"
  echo "  URL: $url"

  if [ -z "$data" ]; then
    response=$(curl -s -w "\n%{http_code}" -X $method "$url")
  else
    response=$(curl -s -w "\n%{http_code}" -X $method "$url" \
      -H "Content-Type: application/json" \
      -d "$data")
  fi

  status_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')

  if [ "$status_code" -eq "$expected_status" ]; then
    echo -e "  ${GREEN}✓ Status: $status_code${NC}"
    echo "  Response: $(echo $body | jq -c '.')"
    ((TESTS_PASSED++))
  else
    echo -e "  ${RED}✗ Status: $status_code (expected $expected_status)${NC}"
    echo "  Response: $body"
    ((TESTS_FAILED++))
  fi
  echo ""
}

# ===========================
# PUBLIC ENDPOINTS (No Auth)
# ===========================

echo "PUBLIC ENDPOINTS"
echo "================"
echo ""

# 1. Get all published posts
test_endpoint \
  "GET /api/blog - List all published posts" \
  "GET" \
  "${BASE_URL}/api/blog?locale=en&limit=10"

# 2. Get all posts with category filter
test_endpoint \
  "GET /api/blog - Filter by category" \
  "GET" \
  "${BASE_URL}/api/blog?category=erotic_story&locale=en"

# 3. Get featured posts
test_endpoint \
  "GET /api/blog - Get featured posts only" \
  "GET" \
  "${BASE_URL}/api/blog?featured=true&locale=en"

# 4. Get single post by slug
test_endpoint \
  "GET /api/blog/:slug - Get post by slug" \
  "GET" \
  "${BASE_URL}/api/blog/extra-hour-old-town-square?locale=en"

# 5. Increment view count
test_endpoint \
  "POST /api/blog/:slug/view - Increment views" \
  "POST" \
  "${BASE_URL}/api/blog/extra-hour-old-town-square/view"

# 6. Get post again to verify view count increased
echo -e "${BLUE}Verifying view count increased${NC}"
views=$(curl -s "${BASE_URL}/api/blog/extra-hour-old-town-square?locale=en" | jq -r '.post.views')
if [ "$views" -gt 0 ]; then
  echo -e "  ${GREEN}✓ View count: $views${NC}"
  ((TESTS_PASSED++))
else
  echo -e "  ${RED}✗ View count didn't increase${NC}"
  ((TESTS_FAILED++))
fi
echo ""

# 7. Test 404 for non-existent post
test_endpoint \
  "GET /api/blog/:slug - Non-existent post returns 404" \
  "GET" \
  "${BASE_URL}/api/blog/non-existent-post?locale=en" \
  "" \
  404

# ===========================
# ADMIN ENDPOINTS (Auth Required)
# ===========================

echo "ADMIN ENDPOINTS (require authentication)"
echo "========================================="
echo ""

echo -e "${BLUE}NOTE: Admin endpoints require authentication.${NC}"
echo "These tests will return 401 Unauthorized without a valid session."
echo ""

# 8. Get all posts (admin)
test_endpoint \
  "GET /api/admin/blog - List all posts (requires auth)" \
  "GET" \
  "${BASE_URL}/api/admin/blog" \
  "" \
  401

# 9. Create new post (admin)
test_endpoint \
  "POST /api/admin/blog - Create post (requires auth)" \
  "POST" \
  "${BASE_URL}/api/admin/blog" \
  '{
    "title": "Test Post",
    "content": "Test content",
    "category": "guide",
    "locale": "en"
  }' \
  401

# 10. Update post (admin)
test_endpoint \
  "PATCH /api/admin/blog/:id - Update post (requires auth)" \
  "PATCH" \
  "${BASE_URL}/api/admin/blog/1" \
  '{
    "title": "Updated Title"
  }' \
  401

# 11. Delete post (admin)
test_endpoint \
  "DELETE /api/admin/blog/:id - Delete post (requires auth)" \
  "DELETE" \
  "${BASE_URL}/api/admin/blog/999" \
  "" \
  401

# ===========================
# SUMMARY
# ===========================

echo "================================="
echo "TEST SUMMARY"
echo "================================="
echo -e "Passed: ${GREEN}${TESTS_PASSED}${NC}"
echo -e "Failed: ${RED}${TESTS_FAILED}${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}All tests passed! ✓${NC}"
  exit 0
else
  echo -e "${RED}Some tests failed ✗${NC}"
  exit 1
fi
