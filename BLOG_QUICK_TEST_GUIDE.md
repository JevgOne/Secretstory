# Blog CMS Quick Test Guide

Quick reference for testing all blog endpoints.

## Prerequisites

1. Make sure dev server is running: `npm run dev`
2. Database migration completed: `npx tsx scripts/migrate-blog.ts`

---

## Public Endpoints (Copy & Paste)

### 1. List all published posts
```bash
curl -s "http://localhost:3000/api/blog?locale=en&limit=10" | jq '.'
```

### 2. Filter by category
```bash
curl -s "http://localhost:3000/api/blog?category=erotic_story&locale=en" | jq '.'
```

### 3. Get featured posts only
```bash
curl -s "http://localhost:3000/api/blog?featured=true" | jq '.'
```

### 4. Get single post by slug
```bash
curl -s "http://localhost:3000/api/blog/extra-hour-old-town-square?locale=en" | jq '.'
```

### 5. Increment view count
```bash
curl -s -X POST "http://localhost:3000/api/blog/extra-hour-old-town-square/view" | jq '.'
```

### 6. Verify views increased
```bash
curl -s "http://localhost:3000/api/blog/extra-hour-old-town-square?locale=en" | jq '.post.views'
```

---

## Admin Endpoints (Require Auth)

### 7. List all posts (admin)
```bash
curl -s "http://localhost:3000/api/admin/blog" | jq '.'
# Expected: 401 Unauthorized (unless logged in)
```

### 8. Create new post
```bash
curl -s -X POST "http://localhost:3000/api/admin/blog" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Post",
    "content": "<p>Test content</p>",
    "category": "guide",
    "locale": "en",
    "is_published": true,
    "tags": ["Test Tag"]
  }' | jq '.'
# Expected: 401 Unauthorized (unless logged in)
```

### 9. Update post
```bash
curl -s -X PATCH "http://localhost:3000/api/admin/blog/1" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title"
  }' | jq '.'
# Expected: 401 Unauthorized (unless logged in)
```

### 10. Delete post
```bash
curl -s -X DELETE "http://localhost:3000/api/admin/blog/999" | jq '.'
# Expected: 401 Unauthorized (unless logged in)
```

---

## Expected Results

### ✅ Public endpoints should work
- Return status 200
- Return JSON with success: true
- Public endpoints accessible without auth

### ✅ Admin endpoints should require auth
- Return status 401
- Return error: "Unauthorized - Please login"
- This is correct behavior

### ✅ View tracking should work
- First call to GET /blog/slug shows views: 0
- POST /blog/slug/view returns success
- Second call to GET /blog/slug shows views: 1

---

## Quick Verification Script

Run all tests at once:

```bash
chmod +x scripts/test-blog-api.sh
./scripts/test-blog-api.sh
```

---

## Database Verification

### Check tables exist
```bash
npx tsx scripts/verify-blog-tables.ts
```

Expected output:
```
Blog tables: [
  { name: 'blog_post_tags' },
  { name: 'blog_posts' },
  { name: 'blog_tags' }
]
```

---

## Sample POST Request Body

```json
{
  "title": "Prague Nightlife Guide",
  "excerpt": "Discover the best clubs and bars in Prague",
  "content": "<p>Prague offers amazing nightlife...</p>",
  "category": "prague_tips",
  "featured_image": "/blog/prague-night.jpg",
  "author": "LovelyGirls Team",
  "read_time": 8,
  "is_featured": true,
  "is_published": true,
  "meta_title": "Prague Nightlife Guide | LovelyGirls",
  "meta_description": "Complete guide to Prague nightlife",
  "meta_keywords": "prague nightlife, clubs prague, bars prague",
  "locale": "en",
  "tags": ["Prague Nightlife", "Travel Guide", "Nightclubs"]
}
```

---

## Troubleshooting

### Server not responding
```bash
# Check if server is running
lsof -i :3000

# Restart server if needed
npm run dev
```

### Migration failed
```bash
# Re-run migration
npx tsx scripts/migrate-blog.ts

# Verify tables
npx tsx scripts/verify-blog-tables.ts
```

### Sample post not found
```bash
# Check database
npx tsx -e "
import { db } from './lib/db.js';
const result = await db.execute('SELECT * FROM blog_posts');
console.log(result.rows);
"
```

---

## Common Response Formats

### Success Response
```json
{
  "success": true,
  "posts": [...]
}
```

### Error Response
```json
{
  "error": "Error message here"
}
```

### 401 Unauthorized (Expected for Admin)
```json
{
  "error": "Unauthorized - Please login"
}
```

---

## API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/blog` | None | List published posts |
| GET | `/api/blog/:slug` | None | Get single post |
| POST | `/api/blog/:slug/view` | None | Increment views |
| GET | `/api/admin/blog` | Admin | List all posts |
| GET | `/api/admin/blog/:id` | Admin | Get single post |
| POST | `/api/admin/blog` | Admin | Create post |
| PATCH | `/api/admin/blog/:id` | Admin | Update post |
| DELETE | `/api/admin/blog/:id` | Admin | Delete post |

---

## Categories

- `erotic_story`
- `girl_spotlight`
- `prague_tips`
- `guide`
- `etiquette`

## Locales

- `cs` (Czech)
- `en` (English)
- `de` (German)
- `uk` (Ukrainian)
