# Blog CMS API Documentation

Complete REST API documentation for the blog system.

## Public Endpoints (No Authentication Required)

### 1. List Published Blog Posts

**GET** `/api/blog`

Get all published blog posts with optional filters.

**Query Parameters:**
- `locale` - Filter by locale (cs, en, de, uk)
- `category` - Filter by category (erotic_story, girl_spotlight, prague_tips, guide, etiquette)
- `featured` - Filter featured posts only (true/false)
- `girl_id` - Filter posts by specific girl
- `limit` - Maximum number of posts to return

**Example Request:**
```bash
curl "http://localhost:3000/api/blog?locale=en&limit=10"
curl "http://localhost:3000/api/blog?category=erotic_story&locale=en"
curl "http://localhost:3000/api/blog?featured=true"
```

**Example Response:**
```json
{
  "success": true,
  "posts": [
    {
      "id": 1,
      "slug": "extra-hour-old-town-square",
      "title": "The Extra Hour by Old Town Square",
      "excerpt": "A slow lift, warm light...",
      "category": "erotic_story",
      "featured_image": "/blog/old-town-square-night.jpg",
      "girl_id": null,
      "girl_name": null,
      "girl_slug": null,
      "author": "LovelyGirls Team",
      "read_time": 5,
      "views": 0,
      "is_featured": true,
      "published_at": "2025-12-14 09:52:40",
      "locale": "en",
      "meta_title": "The Extra Hour...",
      "meta_description": "A story about...",
      "og_image": null,
      "tags": ["Escort Prague", "GFE Experience"]
    }
  ]
}
```

---

### 2. Get Single Blog Post by Slug

**GET** `/api/blog/:slug`

Get a single published blog post by its slug.

**Query Parameters:**
- `locale` - Post locale (default: cs)

**Example Request:**
```bash
curl "http://localhost:3000/api/blog/extra-hour-old-town-square?locale=en"
```

**Example Response:**
```json
{
  "success": true,
  "post": {
    "id": 1,
    "slug": "extra-hour-old-town-square",
    "title": "The Extra Hour by Old Town Square",
    "excerpt": "A slow lift...",
    "content": "<p>Full HTML content...</p>",
    "category": "erotic_story",
    "featured_image": "/blog/old-town-square-night.jpg",
    "author": "LovelyGirls Team",
    "read_time": 5,
    "views": 3,
    "is_featured": true,
    "published_at": "2025-12-14 09:52:40",
    "created_at": "2025-12-14 09:52:40",
    "updated_at": "2025-12-14 10:15:23",
    "meta_title": "The Extra Hour...",
    "meta_description": "A story about...",
    "meta_keywords": "escort prague story...",
    "og_image": null,
    "locale": "en",
    "girl": null,
    "tags": [
      {
        "id": 1,
        "name": "Escort Prague",
        "slug": "escort-prague"
      }
    ],
    "related_posts": [
      {
        "id": 2,
        "slug": "another-story",
        "title": "Another Story",
        "excerpt": "...",
        "featured_image": "...",
        "read_time": 4,
        "published_at": "2025-12-13 15:30:00"
      }
    ]
  }
}
```

---

### 3. Increment View Count

**POST** `/api/blog/:slug/view`

Increment the view count for a blog post. No request body needed.

**Example Request:**
```bash
curl -X POST "http://localhost:3000/api/blog/extra-hour-old-town-square/view"
```

**Example Response:**
```json
{
  "success": true,
  "message": "View count incremented"
}
```

---

## Admin Endpoints (Authentication Required)

All admin endpoints require authentication with `admin` role.

### 4. List All Blog Posts (Admin)

**GET** `/api/admin/blog`

Get all blog posts (including unpublished).

**Query Parameters:**
- `category` - Filter by category
- `locale` - Filter by locale
- `is_published` - Filter by publish status (true/false)

**Example Request:**
```bash
curl "http://localhost:3000/api/admin/blog" \
  -H "Cookie: session=..."
```

**Example Response:**
```json
{
  "success": true,
  "posts": [
    {
      "id": 1,
      "slug": "extra-hour-old-town-square",
      "title": "The Extra Hour by Old Town Square",
      "excerpt": "...",
      "content": "...",
      "category": "erotic_story",
      "featured_image": "/blog/old-town-square-night.jpg",
      "girl_id": null,
      "girl_name": null,
      "author": "LovelyGirls Team",
      "read_time": 5,
      "views": 3,
      "is_featured": true,
      "is_published": true,
      "published_at": "2025-12-14 09:52:40",
      "created_at": "2025-12-14 09:52:40",
      "updated_at": "2025-12-14 10:15:23",
      "meta_title": "...",
      "meta_description": "...",
      "meta_keywords": "...",
      "og_image": null,
      "locale": "en",
      "tags": ["Escort Prague", "GFE Experience"]
    }
  ]
}
```

---

### 5. Get Single Blog Post (Admin)

**GET** `/api/admin/blog/:id`

Get a single blog post by ID (including unpublished).

**Example Request:**
```bash
curl "http://localhost:3000/api/admin/blog/1" \
  -H "Cookie: session=..."
```

**Example Response:**
```json
{
  "success": true,
  "post": {
    "id": 1,
    "slug": "extra-hour-old-town-square",
    "title": "The Extra Hour by Old Town Square",
    "excerpt": "...",
    "content": "...",
    "category": "erotic_story",
    "featured_image": "/blog/old-town-square-night.jpg",
    "girl_id": null,
    "girl_name": null,
    "girl_slug": null,
    "author": "LovelyGirls Team",
    "read_time": 5,
    "views": 3,
    "is_featured": true,
    "is_published": true,
    "published_at": "2025-12-14 09:52:40",
    "created_at": "2025-12-14 09:52:40",
    "updated_at": "2025-12-14 10:15:23",
    "meta_title": "...",
    "meta_description": "...",
    "meta_keywords": "...",
    "og_image": null,
    "locale": "en",
    "tags": [
      {
        "id": 1,
        "name": "Escort Prague",
        "slug": "escort-prague"
      }
    ]
  }
}
```

---

### 6. Create Blog Post (Admin)

**POST** `/api/admin/blog`

Create a new blog post.

**Request Body:**
```json
{
  "title": "My Blog Post Title",
  "excerpt": "A short excerpt",
  "content": "<p>Full HTML content here</p>",
  "category": "guide",
  "featured_image": "/blog/image.jpg",
  "girl_id": 5,
  "author": "LovelyGirls Team",
  "read_time": 7,
  "is_featured": true,
  "is_published": true,
  "published_at": "2025-12-14T12:00:00Z",
  "meta_title": "SEO Title",
  "meta_description": "SEO Description",
  "meta_keywords": "keyword1, keyword2",
  "og_image": "/blog/og-image.jpg",
  "locale": "en",
  "tags": ["Tag 1", "Tag 2"]
}
```

**Required Fields:**
- `title`
- `content`
- `category`

**Optional Fields:**
- `excerpt`
- `featured_image`
- `girl_id` (links to girls table)
- `author` (default: "LovelyGirls Team")
- `read_time` (default: 5)
- `is_featured` (default: false)
- `is_published` (default: false)
- `published_at` (auto-set if is_published=true)
- `meta_title` (default: title)
- `meta_description` (default: excerpt)
- `meta_keywords`
- `og_image` (default: featured_image)
- `locale` (default: "cs")
- `tags` (array of tag names)

**Example Request:**
```bash
curl -X POST "http://localhost:3000/api/admin/blog" \
  -H "Content-Type: application/json" \
  -H "Cookie: session=..." \
  -d '{
    "title": "Best Hotels in Prague",
    "content": "<p>Here are the best hotels...</p>",
    "category": "prague_tips",
    "locale": "en",
    "is_published": true,
    "tags": ["Prague Hotels", "Luxury"]
  }'
```

**Example Response:**
```json
{
  "success": true,
  "post_id": 2,
  "slug": "best-hotels-in-prague",
  "message": "Blog post created successfully"
}
```

---

### 7. Update Blog Post (Admin)

**PATCH** `/api/admin/blog/:id`

Update an existing blog post.

**Request Body:**
All fields from create are optional. Only send fields you want to update.

**Example Request:**
```bash
curl -X PATCH "http://localhost:3000/api/admin/blog/2" \
  -H "Content-Type: application/json" \
  -H "Cookie: session=..." \
  -d '{
    "title": "Updated Title",
    "is_published": true,
    "tags": ["New Tag 1", "New Tag 2"]
  }'
```

**Example Response:**
```json
{
  "success": true,
  "message": "Blog post updated successfully"
}
```

**Notes:**
- Slug is auto-updated if title changes
- published_at is auto-set when is_published changes from false to true
- Tags are replaced (not merged) when updated
- updated_at is automatically set to current timestamp

---

### 8. Delete Blog Post (Admin)

**DELETE** `/api/admin/blog/:id`

Delete a blog post. This will cascade delete all related tags.

**Example Request:**
```bash
curl -X DELETE "http://localhost:3000/api/admin/blog/2" \
  -H "Cookie: session=..."
```

**Example Response:**
```json
{
  "success": true,
  "message": "Blog post deleted successfully"
}
```

---

## Database Schema

### blog_posts Table
```sql
CREATE TABLE blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  featured_image TEXT,
  girl_id INTEGER,
  author TEXT DEFAULT 'LovelyGirls Team',
  read_time INTEGER DEFAULT 5,
  views INTEGER DEFAULT 0,
  is_featured INTEGER DEFAULT 0,
  is_published INTEGER DEFAULT 1,
  published_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  og_image TEXT,
  locale TEXT DEFAULT 'cs',
  FOREIGN KEY (girl_id) REFERENCES girls(id) ON DELETE SET NULL
);
```

### blog_tags Table
```sql
CREATE TABLE blog_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### blog_post_tags Table (Junction)
```sql
CREATE TABLE blog_post_tags (
  post_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES blog_tags(id) ON DELETE CASCADE
);
```

---

## Categories

Valid category values:
- `erotic_story` - Erotic/romantic stories
- `girl_spotlight` - Girl profile features
- `prague_tips` - Prague travel tips
- `guide` - How-to guides
- `etiquette` - Escort etiquette guides

---

## Locales

Supported locales:
- `cs` - Czech
- `en` - English
- `de` - German
- `uk` - Ukrainian

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message here"
}
```

**Common Status Codes:**
- `200` - Success
- `400` - Bad Request (missing required fields, validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error
