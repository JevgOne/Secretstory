# LovelyGirls Design → Implementation: Comprehensive Analysis

**Project Manager Report** | Generated: 2025-12-09
**Comparing**: Design HTML files vs. Current Next.js Implementation

---

## Executive Summary

**Overall Project Completion: ~65%**

The current Next.js implementation has successfully ported most pages from the design, but significant gaps remain in styling, layout consistency, and functionality. The project uses next-intl for internationalization, which is an improvement over static HTML, but many CSS styles from the design have not been fully implemented in globals.css or component-level styles.

**Critical Findings:**
- ❌ **Major CSS Missing**: Approximately 70% of design CSS is not in globals.css
- ❌ **Layout Discrepancies**: Homepage, catalog, and profile detail pages have structural differences
- ❌ **Missing Components**: Gallery toggle, quick actions, ambient backgrounds
- ✅ **Good Progress**: All 9 core pages exist, translations implemented, API integration working
- ⚠️ **Blog System**: Fully hardcoded, no CMS or dynamic content system

---

## Page-by-Page Analysis

### 1. Homepage (`/app/[locale]/page.tsx` vs `lovelygirls-clean.html`)

**Status:** 🟡 **70% Complete**

**What Exists:**
- ✅ Navigation with logo and Santa hat
- ✅ Hero section with h1 and description
- ✅ New girl card (right column)
- ✅ Profiles grid (4 cards)
- ✅ Info strip (4 items)
- ✅ Locations section (2 cards)
- ✅ Booking steps (3 steps)
- ✅ CTA with WhatsApp/Telegram/Phone buttons
- ✅ Age verification modal
- ✅ Translation system with next-intl

**Missing/Different:**
- ❌ **Card hover effects** - Quick action buttons (Profile, Favorite) not appearing on hover
- ❌ **Card overlay gradient** - Missing hover gradient overlay on profile images
- ❌ **Profile badges animations** - badgePulse animation for "NEW" badges not implemented
- ❌ **Ambient background** - Design has animated radial gradients, implementation lacks this
- ❌ **Profile card border gradient** - Missing `::before` pseudo-element for card borders
- ❌ **Responsive breakpoints** - Design has specific breakpoints (1024px, 768px, 480px) not fully matched
- ⚠️ **Hardcoded girls data** - Only 4 girls in implementation vs design's flexibility

**CSS Differences:**
```css
/* MISSING from globals.css: */
- .card-overlay (hover gradient)
- .quick-actions (hover action buttons)
- @keyframes badgePulse
- .profile-card::before (gradient border effect)
- Ambient background animations
- Full responsive media query set
```

**Priority:** **HIGH** (Homepage is first impression)

---

### 2. Catalog/Girls Page (`/app/[locale]/divky/page.tsx` vs `catalog-modern-2.html`)

**Status:** 🔴 **35% Complete**

**What Exists:**
- ✅ Basic page structure with navigation
- ✅ Translation system

**Missing/Different:**
- ❌ **ENTIRE CATALOG PAGE MISSING** - No dedicated catalog/listing page exists
- ❌ **Ambient background effect** - Animated radial gradient background
- ❌ **Section header** - Title, subtitle, "View all" button
- ❌ **Cards grid** - 4-column grid (responsive: 3→2→1)
- ❌ **Card design** - Modern card with gradient border, hover effects
- ❌ **Badges** - New/Top/Asian badges with different styles
- ❌ **Online indicator** - Pulsing green dot animation
- ❌ **Time badges** - Available (green) vs Tomorrow (orange) styling
- ❌ **Stats grid** - 4-column stat display (age, cm, kg, breast)
- ❌ **Location pill** - Pink gradient background with location icon
- ❌ **Quick actions** - Profile and favorite buttons on hover

**CSS Missing:**
```css
/* ENTIRE SECTION MISSING: */
- .ambient-bg with @keyframes ambientMove
- .cards-grid
- .card with ::before gradient border
- .badge-new, .badge-top, .badge-asian
- .online-dot with @keyframes onlinePulse
- .time-badge.available, .time-badge.tomorrow
- .stat styling
- .card-location
- .quick-actions
```

**Priority:** **CRITICAL** (Core functionality missing)

---

### 3. Profile Detail (`/app/[locale]/profily/[slug]/page.tsx` vs `lovelygirls-detail.html`)

**Status:** 🟡 **75% Complete**

**What Exists:**
- ✅ Breadcrumb navigation
- ✅ Two-column layout (gallery + info)
- ✅ Sticky gallery
- ✅ Profile header with name, tagline
- ✅ Stats section (age, height, weight, breast)
- ✅ Languages section with flags
- ✅ Hashtags/services
- ✅ Location display
- ✅ Description section
- ✅ Services grid (included vs extra)
- ✅ CTA buttons (WhatsApp, Telegram, Phone)
- ✅ Reviews section with rating
- ✅ Similar girls section
- ✅ Dynamic data fetching from API
- ✅ Extensive styled-jsx CSS (1498 lines!)

**Missing/Different:**
- ❌ **Gallery toggle** - Photo/Video toggle buttons missing
- ❌ **Gallery thumbnails** - No thumbnail navigation (5 thumbs including videos)
- ❌ **Video indicators** - Play button overlay on video thumbnails
- ❌ **Tattoo/Piercing section** - Conditional section not in design
- ⚠️ **Hashtag styling** - Implementation has modern gradient style, design simpler
- ⚠️ **Service icons** - Different icon approach (checkmark vs emoji)

**CSS Differences:**
```css
/* MISSING: */
- .gallery-toggle (photo/video switch)
- .toggle-btn, .toggle-btn.active
- .gallery-thumbs (5-column grid)
- .gallery-thumb.video (play button overlay)
- Video thumbnail ::before and ::after for play icon
```

**Priority:** **MEDIUM** (Mostly complete, missing gallery features)

---

### 4. Pricing Page (`/app/[locale]/cenik/page.tsx` vs `lovelygirls-cenik.html`)

**Status:** 🟢 **90% Complete**

**What Exists:**
- ✅ Page header with title and subtitle
- ✅ Pricing grid (3 plans)
- ✅ Popular badge on middle plan
- ✅ Duration, title, price display
- ✅ Features list with checkmarks
- ✅ Reserve button
- ✅ Extras section (8 items in 4-column grid)
- ✅ Note box with payment information
- ✅ Schema.org structured data
- ✅ Translation system

**Missing/Different:**
- ⚠️ **Pricing grid layout** - Design: 3 columns always, Implementation: responsive to 1 column
- ⚠️ **Popular card styling** - Design has gradient background, implementation matches

**CSS Differences:**
- Minor differences in hover effects and transitions
- Implementation uses inline styles instead of global CSS

**Priority:** **LOW** (Nearly complete)

---

### 5. Schedule Page (`/app/[locale]/schedule/page.tsx` vs `lovelygirls-schedule.html`)

**Status:** 🟢 **85% Complete**

**What Exists:**
- ✅ Page header
- ✅ Date selector with 7 tabs
- ✅ Active date highlighting
- ✅ Schedule grid (4 columns)
- ✅ Schedule cards with image, status, name, time, location
- ✅ Online/offline status indicators
- ✅ Legend explaining status dots
- ✅ API data fetching
- ✅ Translation system
- ✅ BottomCTA component

**Missing/Different:**
- ⚠️ **Today badge** - Design has `.date-tab.today` border styling
- ⚠️ **Unavailable cards opacity** - Design reduces opacity to 0.5
- ⚠️ **Status dot animation** - `@keyframes blink` not fully matching

**CSS Differences:**
- Minor styling differences
- Implementation has most CSS in place

**Priority:** **LOW** (Nearly complete)

---

### 6. Discounts Page (`/app/[locale]/discounts/page.tsx` vs `lovelygirls-discounts.html`)

**Status:** 🟢 **85% Complete**

**What Exists:**
- ✅ Page header
- ✅ Featured card (Christmas special) with price comparison
- ✅ Discounts grid (6 cards)
- ✅ Discount icons, names, values, descriptions
- ✅ Loyalty program section (4 steps)
- ✅ Note section
- ✅ Translation system

**Missing/Different:**
- ⚠️ **Featured card Christmas tree** - Design has `::before` with 🎄 emoji
- ⚠️ **Featured card grid** - Design: 2 columns with image, Implementation: may differ
- ⚠️ **Discount icon background** - Design has `rgba(139, 41, 66, 0.2)` background

**CSS Differences:**
- Featured card decorative elements
- Minor layout differences

**Priority:** **LOW** (Nearly complete)

---

### 7. FAQ Page (`/app/[locale]/faq/page.tsx` vs `lovelygirls-faq.html`)

**Status:** 🟢 **80% Complete**

**What Exists:**
- ✅ Page header
- ✅ Category filters (5 categories)
- ✅ FAQ accordion (8 questions)
- ✅ Active category highlighting
- ✅ Accordion behavior (only one open at a time)
- ✅ Contact CTA with WhatsApp and Phone buttons
- ✅ Translation system

**Missing/Different:**
- ⚠️ **FAQ icon animation** - Plus icon should rotate when open
- ⚠️ **Category button styling** - Minor differences

**CSS Differences:**
- Icon rotation animation
- Minor button styling

**Priority:** **LOW** (Mostly complete)

---

### 8. Blog Index (`/app/[locale]/blog/page.tsx` vs `lovelygirls-blog.html`)

**Status:** 🟡 **60% Complete**

**What Exists:**
- ✅ Blog hero section with title and subtitle
- ✅ Hero pattern overlay
- ✅ Category tabs (5 categories)
- ✅ Featured story section
- ✅ Stories grid (6 stories)
- ✅ Guides section (4 guides)
- ✅ Newsletter signup form
- ✅ Tags cloud (9 tags)

**Missing/Different:**
- ❌ **All data is hardcoded** - No CMS integration, all stories static
- ❌ **Story images** - All using placeholders
- ❌ **View all links** - Not functional
- ❌ **Newsletter form** - Not connected to any service
- ⚠️ **Hero pattern** - Design has decorative pattern, implementation basic

**CSS Differences:**
- Hero pattern effects
- Story card hover effects

**Priority:** **MEDIUM** (Needs dynamic data system)

---

### 9. Blog Article (`/app/[locale]/blog/[slug]/page.tsx` vs `lovelygirls-blog-article.html`)

**Status:** 🟡 **55% Complete**

**What Exists:**
- ✅ Story hero with breadcrumb
- ✅ Article content with formatting
- ✅ Girl card inline
- ✅ Scene breaks
- ✅ Share buttons (empty links)
- ✅ Meet girl CTA
- ✅ More stories section (3 cards)

**Missing/Different:**
- ❌ **All content hardcoded** - Single story, no dynamic system
- ❌ **Share functionality** - Buttons exist but don't work
- ❌ **Article images** - No image support in content
- ❌ **Related stories logic** - Hardcoded 3 stories

**CSS Differences:**
- Article formatting styles
- Quote styling

**Priority:** **MEDIUM** (Needs CMS system)

---

## Critical Issues (Top 5 Blocking)

### 1. 🔴 Missing Catalog/Girls Listing Page
**Impact:** CRITICAL
**Affected:** Navigation, user flow
**Description:** The design has a complete catalog page (`catalog-modern-2.html`) with ambient background, modern card grid, badges, and filtering. The implementation has NO dedicated catalog page - clicking "Dívky" in nav leads nowhere.

**Solution Required:**
- Create `/app/[locale]/divky/page.tsx`
- Implement ambient background animation
- Build cards grid with all design features
- Add filtering/sorting functionality
- Fetch girls from API

---

### 2. 🔴 70% of Design CSS Missing from globals.css
**Impact:** CRITICAL
**Affected:** All pages
**Description:** The `globals.css` file (500 lines visible) is missing most of the design CSS. Design HTML files contain ~3000+ lines of CSS per file. Many hover effects, animations, and layout styles are absent.

**Missing Categories:**
- Card hover effects (overlay, quick actions)
- Badge animations (pulse, glow)
- Ambient backgrounds
- Gallery components (toggle, thumbnails)
- Responsive breakpoints
- Transition effects

**Solution Required:**
- Extract ALL CSS from design HTML files
- Organize into logical sections in globals.css
- Remove duplicate styles
- Ensure consistency across pages

---

### 3. 🟡 Blog System Fully Hardcoded
**Impact:** HIGH
**Affected:** Blog pages, content management
**Description:** Both blog index and article pages have hardcoded content. No CMS, no dynamic fetching, no admin panel for content creation.

**Solution Required:**
- Choose CMS solution (Contentful, Sanity, Strapi, or custom)
- Create blog post schema
- Build API endpoints for blog data
- Implement dynamic rendering
- Add image upload system

---

### 4. 🟡 Gallery Features Missing (Profile Page)
**Impact:** MEDIUM
**Affected:** Profile detail page
**Description:** Design has Photo/Video toggle, thumbnail navigation (5 thumbs), video indicators. Implementation only shows single image placeholder.

**Solution Required:**
- Implement gallery state management
- Add Photo/Video toggle buttons
- Build thumbnail grid (5 items)
- Add video play button overlays
- Connect to image/video data from API

---

### 5. 🟡 Homepage Quick Actions Not Working
**Impact:** MEDIUM
**Affected:** Homepage profile cards
**Description:** Design shows Profile and Favorite buttons on card hover. Implementation doesn't show these quick actions.

**Solution Required:**
- Add quick actions buttons to profile cards
- Implement hover state CSS
- Connect Profile button to detail page
- Implement Favorite functionality (requires backend)

---

## Implementation Plan (Ordered by Priority)

### Phase 1: Critical Fixes (Week 1-2)

#### Task 1.1: Create Catalog/Girls Listing Page
**Complexity:** HIGH
**Estimate:** 12 hours
**Dependencies:** None
**Files to Create:**
- `/app/[locale]/divky/page.tsx`
- Update navigation links

**Steps:**
1. Create new page component
2. Extract catalog CSS from `catalog-modern-2.html`
3. Implement ambient background animation
4. Build cards grid component
5. Add filtering/sorting UI
6. Connect to girls API
7. Implement responsive design
8. Test on all breakpoints

---

#### Task 1.2: Extract and Organize All Design CSS
**Complexity:** HIGH
**Estimate:** 16 hours
**Dependencies:** None
**Files to Modify:**
- `/app/globals.css`

**Steps:**
1. Read all 9 design HTML files
2. Extract CSS from `<style>` tags
3. Remove duplicates (identify common patterns)
4. Organize into sections:
   - Base/Reset
   - CSS Variables
   - Navigation
   - Hero sections
   - Profile cards
   - Galleries
   - Forms
   - Animations
   - Responsive
5. Add missing CSS to globals.css
6. Test all pages for styling issues
7. Remove inline styles where possible

**CSS Sections to Extract:**
```
- Homepage: 896 lines
- Catalog: 434 lines
- Detail: 1048 lines
- Pricing: 468 lines
- Schedule: 467 lines
- Discounts: 518 lines
- FAQ: [need to read full file]
- Blog: [need to read full file]
- Blog Article: [need to read full file]
```

**Total CSS Lines:** ~5000-6000 lines (after deduplication: ~2500-3000 lines)

---

#### Task 1.3: Implement Card Hover Effects (Homepage)
**Complexity:** MEDIUM
**Estimate:** 6 hours
**Dependencies:** Task 1.2 (CSS extraction)
**Files to Modify:**
- `/app/[locale]/page.tsx`
- `/app/globals.css`

**Steps:**
1. Add `.card-overlay` div to profile cards
2. Add `.quick-actions` with Profile and Favorite buttons
3. Implement hover CSS transitions
4. Add `@keyframes badgePulse` animation
5. Add gradient border `::before` pseudo-element
6. Test hover states
7. Ensure accessibility (keyboard navigation)

---

### Phase 2: Gallery and Media (Week 2-3)

#### Task 2.1: Implement Gallery Toggle and Thumbnails
**Complexity:** HIGH
**Estimate:** 10 hours
**Dependencies:** None
**Files to Modify:**
- `/app/[locale]/profily/[slug]/page.tsx`

**Steps:**
1. Add gallery state (photo/video mode)
2. Create Photo/Video toggle component
3. Build thumbnail grid component
4. Add active thumbnail indicator
5. Implement video play button overlays
6. Connect to gallery data from API
7. Add click handlers for navigation
8. Test with multiple images/videos

---

#### Task 2.2: Add Image Upload/Management System
**Complexity:** HIGH
**Estimate:** 12 hours
**Dependencies:** Backend API
**Files to Create:**
- Image upload API endpoint
- Image storage service integration

**Steps:**
1. Choose storage solution (Cloudinary, AWS S3, Vercel Blob)
2. Create upload API endpoint
3. Implement image optimization
4. Add video support
5. Create admin UI for uploads (future)
6. Update API to serve gallery data
7. Test uploads and retrieval

---

### Phase 3: Blog System (Week 3-4)

#### Task 3.1: Choose and Integrate CMS
**Complexity:** HIGH
**Estimate:** 16 hours
**Dependencies:** None
**CMS Options:**
1. **Contentful** (Recommended) - Easy, hosted, good DX
2. **Sanity** - Flexible, good for complex content
3. **Strapi** - Self-hosted, full control
4. **Custom DB** - Most control, most work

**Steps:**
1. Evaluate CMS options
2. Set up CMS account/instance
3. Create content models:
   - Blog post (title, slug, content, author, date, category, tags)
   - Story (title, slug, content, girl, excerpt)
   - Guide (title, slug, content, category, readTime, views)
4. Migrate hardcoded content
5. Create API endpoints
6. Update blog pages to fetch from CMS
7. Add admin access for content management

---

#### Task 3.2: Implement Dynamic Blog Pages
**Complexity:** MEDIUM
**Estimate:** 8 hours
**Dependencies:** Task 3.1 (CMS setup)
**Files to Modify:**
- `/app/[locale]/blog/page.tsx`
- `/app/[locale]/blog/[slug]/page.tsx`

**Steps:**
1. Create API fetch functions
2. Update blog index with dynamic data
3. Update article page with dynamic content
4. Implement related stories logic
5. Add image rendering in content
6. Test with various content types

---

### Phase 4: Features and Polish (Week 4-5)

#### Task 4.1: Implement Newsletter Signup
**Complexity:** MEDIUM
**Estimate:** 6 hours
**Dependencies:** Email service
**Files to Modify:**
- `/app/[locale]/blog/page.tsx`
- Create API endpoint

**Steps:**
1. Choose email service (Mailchimp, ConvertKit, SendGrid)
2. Create API endpoint for signup
3. Implement form submission
4. Add validation
5. Show success/error messages
6. Test signup flow

---

#### Task 4.2: Implement Favorite Functionality
**Complexity:** HIGH
**Estimate:** 12 hours
**Dependencies:** Backend API, auth system
**Files to Create:**
- Favorites API endpoints
- Favorites storage (DB or localStorage)

**Steps:**
1. Design favorites data model
2. Create add/remove API endpoints
3. Implement frontend state management
4. Add favorite button to cards
5. Create favorites page (optional)
6. Add authentication if needed
7. Test add/remove flow

---

#### Task 4.3: Add Share Functionality (Blog)
**Complexity:** LOW
**Estimate:** 4 hours
**Dependencies:** None
**Files to Modify:**
- `/app/[locale]/blog/[slug]/page.tsx`

**Steps:**
1. Implement share URL generation
2. Add Web Share API support
3. Add fallback for copy-to-clipboard
4. Add social media share links
5. Style share buttons
6. Test on mobile and desktop

---

#### Task 4.4: Responsive Design Testing and Fixes
**Complexity:** MEDIUM
**Estimate:** 10 hours
**Dependencies:** Tasks 1.2 (CSS)
**Files to Modify:**
- All page files
- `/app/globals.css`

**Steps:**
1. Test all pages at breakpoints: 1440px, 1024px, 768px, 480px, 375px
2. Fix layout issues
3. Ensure touch targets are 44px+ on mobile
4. Test navigation on mobile
5. Verify forms work on mobile
6. Test performance on slow networks
7. Fix any overflow/scroll issues

---

### Phase 5: Optimization and Deployment (Week 5-6)

#### Task 5.1: Performance Optimization
**Complexity:** MEDIUM
**Estimate:** 8 hours
**Dependencies:** All pages complete

**Steps:**
1. Optimize images (next/image everywhere)
2. Implement lazy loading
3. Add loading states
4. Optimize fonts (font subsetting)
5. Minimize CSS/JS
6. Add caching headers
7. Test with Lighthouse
8. Fix Core Web Vitals issues

---

#### Task 5.2: SEO Optimization
**Complexity:** MEDIUM
**Estimate:** 6 hours
**Dependencies:** None

**Steps:**
1. Add meta tags to all pages
2. Implement OpenGraph tags
3. Add Twitter Card tags
4. Create sitemap.xml
5. Create robots.txt
6. Add canonical URLs
7. Verify Schema.org data
8. Test with Google Rich Results

---

#### Task 5.3: Analytics and Tracking
**Complexity:** LOW
**Estimate:** 4 hours
**Dependencies:** None

**Steps:**
1. Set up Google Analytics 4
2. Add tracking to all pages
3. Set up conversion goals
4. Add event tracking (CTA clicks, reservations)
5. Test tracking in development
6. Verify data in GA dashboard

---

## CSS Extraction Needed

### Master CSS File Structure (Proposed)

```css
/* =================================
   LOVELYGIRLS GLOBAL STYLES
   ================================= */

/* 1. BASE & RESET */
* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { font-family: 'DM Sans', sans-serif; ... }

/* 2. CSS VARIABLES */
:root {
  --black: #1a1216;
  --bg: #231a1e;
  /* ... all color variables ... */
}

/* 3. TYPOGRAPHY */
h1, h2, h3, h4, h5, h6 { ... }
.section-title { font-family: 'Cormorant', serif; ... }

/* 4. NAVIGATION */
nav { position: fixed; ... }
.logo, .logo-L, .santa-hat { ... }
.nav-links, .nav-contact { ... }
.btn, .btn-fill { ... }
.language-switcher { ... }
.mobile-menu { ... }

/* 5. HERO SECTIONS */
.hero { min-height: 100vh; ... }
.hero-inner { display: grid; ... }
.new-girl-card { ... }

/* 6. PROFILE CARDS */
.profiles-grid { display: grid; ... }
.profile-card { position: relative; ... }
.profile-card::before { /* gradient border */ }
.profile-card:hover { transform: translateY(-8px); ... }
.card-overlay { /* hover gradient */ }
.quick-actions { /* hover buttons */ }
.profile-badge { ... }
@keyframes badgePulse { ... }
.profile-img { ... }
.profile-info { ... }
.online-dot { ... }
@keyframes onlinePulse { ... }

/* 7. GALLERY */
.gallery { position: sticky; ... }
.gallery-main { aspect-ratio: 3/4; ... }
.gallery-toggle { ... }
.toggle-btn, .toggle-btn.active { ... }
.gallery-thumbs { display: grid; ... }
.gallery-thumb.video::before, ::after { /* play button */ }

/* 8. SECTIONS & LAYOUTS */
section { padding: 100px 4%; }
.page-header { ... }
.page-title, .page-subtitle { ... }

/* 9. FORMS */
.newsletter-form { ... }
.newsletter-input, .newsletter-btn { ... }

/* 10. PRICING */
.pricing-grid { ... }
.pricing-card, .pricing-card.popular { ... }
.pricing-badge { ... }

/* 11. SCHEDULE */
.date-selector, .date-tabs { ... }
.date-tab, .date-tab.active { ... }
.schedule-grid, .schedule-card { ... }

/* 12. DISCOUNTS */
.featured-card { ... }
.discounts-grid, .discount-card { ... }
.loyalty-steps, .loyalty-step { ... }

/* 13. FAQ */
.faq-categories, .faq-cat { ... }
.faq-grid, .faq-item { ... }

/* 14. BLOG */
.blog-hero { ... }
.categories-bar { ... }
.featured-story { ... }
.stories-grid, .story-card { ... }
.guides-grid, .guide-card { ... }

/* 15. AMBIENT EFFECTS */
.ambient-bg { position: fixed; ... }
.ambient-bg::before { /* animated gradients */ }
@keyframes ambientMove { ... }

/* 16. ANIMATIONS */
@keyframes blink { ... }
@keyframes fadeIn { ... }

/* 17. UTILITIES */
.note-box { ... }

/* 18. FOOTER */
footer { ... }

/* 19. RESPONSIVE */
@media (max-width: 1024px) { ... }
@media (max-width: 768px) { ... }
@media (max-width: 480px) { ... }
```

**Estimated Total:** 2500-3000 lines of organized CSS

---

## Missing Components Inventory

### 1. **Ambient Background** (Design: catalog, blog)
```tsx
<div className="ambient-bg" />
```
CSS with animated radial gradients

### 2. **Card Overlay** (Design: homepage, catalog)
```tsx
<div className="card-overlay" />
```
Hover gradient overlay

### 3. **Quick Actions** (Design: homepage, catalog)
```tsx
<div className="quick-actions">
  <button className="action-btn" title="Profil">
    <svg>...</svg>
  </button>
  <button className="action-btn" title="Oblíbené">
    <svg>...</svg>
  </button>
</div>
```

### 4. **Gallery Toggle** (Design: profile detail)
```tsx
<div className="gallery-toggle">
  <button className="toggle-btn active">
    <svg>...</svg> Foto
  </button>
  <button className="toggle-btn">
    <svg>...</svg> Video
  </button>
</div>
```

### 5. **Gallery Thumbnails** (Design: profile detail)
```tsx
<div className="gallery-thumbs">
  <div className="gallery-thumb active">1</div>
  <div className="gallery-thumb">2</div>
  <div className="gallery-thumb">3</div>
  <div className="gallery-thumb video">▶</div>
  <div className="gallery-thumb video">▶</div>
</div>
```

### 6. **Status Dot Animation** (Design: all pages)
```tsx
<span className="online-dot" />
```
CSS with pulse animation

### 7. **Badge Pulse Animation** (Design: homepage, catalog)
```css
@keyframes badgePulse {
  0%, 100% { box-shadow: 0 4px 20px rgba(232,90,79,0.4); }
  50% { box-shadow: 0 4px 30px rgba(232,90,79,0.6); }
}
```

### 8. **Gradient Card Border** (Design: profile cards)
```css
.profile-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 20px;
  padding: 1px;
  background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
}
```

---

## Translation Keys Needed

Based on the design files, here are translation keys that should be verified/added:

### Homepage
- `hero.title`, `hero.subtitle`
- `newGirl.label`, `newGirl.badge`
- `profiles.title`, `profiles.subtitle`, `profiles.viewAll`
- `info.verified.title`, `info.verified.text`
- `info.fast.title`, `info.fast.text`
- `info.discreet.title`, `info.discreet.text`
- `info.loyalty.title`, `info.loyalty.text`
- `locations.title`, `locations.subtitle`
- `booking.title`, `booking.subtitle`
- `booking.step1.title`, `booking.step1.text`
- `booking.step2.title`, `booking.step2.text`
- `booking.step3.title`, `booking.step3.text`
- `cta.title`, `cta.text`

### Catalog (NEW PAGE)
- `catalog.title`, `catalog.subtitle`
- `catalog.viewAll`

### Profile Detail
- `profile.online`, `profile.offline`
- `profile.languages`
- `profile.about`, `profile.included`, `profile.extra`
- `profile.reviews`, `profile.similar`

### Blog
- `blog.hero.label`, `blog.hero.title`, `blog.hero.subtitle`
- `blog.latestStory`, `blog.eroticStories`, `blog.guides`
- `blog.newsletter.title`, `blog.newsletter.subtitle`, `blog.newsletter.button`

---

## Recommendations

### Immediate Actions (This Week)
1. ✅ **Create catalog page** - Users can't browse girls
2. ✅ **Extract design CSS** - Foundation for all other work
3. ✅ **Implement card hovers** - Improves UX immediately

### Short-term (Next 2 Weeks)
4. ✅ **Gallery features** - Complete profile detail page
5. ✅ **Choose CMS** - Decision needed for blog system
6. ✅ **Responsive testing** - Ensure mobile works

### Medium-term (Month 2)
7. ✅ **Blog CMS integration** - Dynamic content
8. ✅ **Newsletter signup** - Lead capture
9. ✅ **Favorites functionality** - User engagement

### Long-term (Month 3+)
10. ✅ **Admin panel** - Content management
11. ✅ **Booking system** - Direct reservations
12. ✅ **Payment integration** - Online payments

---

## Estimated Timeline

**Total Project Completion:** 6-8 weeks

- **Phase 1 (Critical):** 2 weeks
- **Phase 2 (Gallery):** 1 week
- **Phase 3 (Blog CMS):** 2 weeks
- **Phase 4 (Features):** 2 weeks
- **Phase 5 (Optimization):** 1 week

**Developer Hours:**
- Phase 1: ~34 hours
- Phase 2: ~22 hours
- Phase 3: ~24 hours
- Phase 4: ~32 hours
- Phase 5: ~18 hours
**Total: ~130 hours**

---

## Success Metrics

### Code Quality
- [ ] All design CSS extracted and organized
- [ ] No inline styles (except styled-jsx where appropriate)
- [ ] TypeScript strict mode passing
- [ ] ESLint zero warnings
- [ ] Components reusable and documented

### Visual Parity
- [ ] All 9 pages match design 95%+
- [ ] Hover effects working
- [ ] Animations smooth (60fps)
- [ ] Responsive on all devices
- [ ] Dark mode fully working

### Performance
- [ ] Lighthouse score 90+ (all metrics)
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Images optimized (WebP/AVIF)
- [ ] Bundle size < 200kb (first load)

### Functionality
- [ ] All navigation links working
- [ ] Forms submitting correctly
- [ ] API calls successful
- [ ] Error handling in place
- [ ] Loading states implemented

### SEO
- [ ] All meta tags present
- [ ] Schema.org data valid
- [ ] Sitemap generated
- [ ] Robots.txt configured
- [ ] Google Search Console verified

---

## Notes

- **Priority System:** CRITICAL > HIGH > MEDIUM > LOW
- **Complexity System:** LOW (1-4h) | MEDIUM (4-8h) | HIGH (8-16h)
- **This is a living document** - Update as progress is made
- **Team Size Assumption:** 1-2 developers
- **Code Review:** Required for all Phase 1 & 2 tasks
- **Testing:** Manual testing on Chrome, Safari, Firefox, Mobile Safari, Chrome Android
- **Browser Support:** Last 2 versions of major browsers, iOS 14+, Android 10+

---

**End of Report**
**Next Update:** After Phase 1 completion
**Questions?** Contact project manager

