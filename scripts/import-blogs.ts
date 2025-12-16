import dotenv from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@libsql/client';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

// Create DB client
if (!process.env.TURSO_DATABASE_URL) {
  throw new Error('TURSO_DATABASE_URL is not defined');
}

if (!process.env.TURSO_AUTH_TOKEN) {
  throw new Error('TURSO_AUTH_TOKEN is not defined');
}

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Blog articles data from lovelygirls.cz/blog
const blogArticles = [
  // Tips & Advice Articles
  {
    title: 'Escort Outcall Prague: a calm hotel guide',
    slug: 'escort-outcall-prague-a-calm-hotel-guide',
    content: `# Escort Outcall Prague: a calm hotel guide

Outcall means the companion arrives to your hotel or address in Prague. It's ideal when you're already settled.

## Initial Contact

Include three details in your first message:
- **Location** - Your hotel or address
- **Timing** - Preferred date and time
- **Duration** - Session length (60, 90, or 120 minutes)

## Logistics

Most hotels are straightforward. You'll receive brief arrival tips following confirmation.

## Duration Options

Three package lengths are available:
- **60 minutes** - Quick, focused session
- **90 minutes** - The usual sweet spot without clock-watching
- **120 minutes** - Extended, unhurried experience

The 90-minute option is recommended for first-time bookings.

## Timing Tips

Evening hours between 7–10 pm are popular. If you're arriving from dinner, add a +15/20-minute buffer for logistics.

## Etiquette

Brief protocol suggestions:
- Maintain silent phone mode during the session
- Send notification upon arrival at the hotel lobby
- Have the room prepared and ready

## Ready to Book?

Check our [pricing page](/cs/cenik) for rates and our [schedule](/cs/schedule) for availability.`,
    excerpt: 'Complete guide to hotel outcall services in Prague. Learn about booking process, timing, duration options, and etiquette.',
    category: 'rady-a-tipy',
    featured_image: 'https://cdn.prod.website-files.com/6824b3a1d28e4d0b4a07cae5/68e8abe2dca955e02408cfd8_EscortOutcallHOTEL.webp',
    locale: 'en',
    is_published: 1,
    is_featured: 0
  },
  {
    title: 'BDSM Prague: Beginner Submissive Etiquette',
    slug: 'bdsm-prague-beginner-submissive-etiquette',
    content: `# BDSM Prague: Beginner Submissive Etiquette

For those new to BDSM in Prague, understanding basic etiquette makes the experience safer and more enjoyable.

## Before the Session

**Communication is Key**
- Clearly state your limits and boundaries
- Discuss what you want to explore
- Ask questions if anything is unclear
- Set a safe word

**Physical Preparation**
- Arrive clean and well-groomed
- Avoid alcohol or drugs
- Get enough rest beforehand

## During the Session

**Trust and Respect**
- Follow instructions from your Domme
- Use your safe word if needed - never hesitate
- Communicate throughout the session
- Respect boundaries and limits

**Safe Words**
The most common system uses traffic light colors:
- **Green** - Everything is good, continue
- **Yellow** - Slow down, approaching a limit
- **Red** - Stop immediately

## After the Session

**Aftercare**
Aftercare is essential for emotional and physical well-being:
- Take time to decompress
- Stay hydrated
- Communicate how you're feeling
- Rest if needed

## Finding the Right Domme

Look for experienced practitioners who:
- Prioritize safety and consent
- Communicate clearly about boundaries
- Provide proper aftercare
- Have good reviews

## Ready to Explore?

Browse our [profiles](/cs/divky) to find Prague companions experienced in BDSM and dominance.`,
    excerpt: 'Essential etiquette guide for BDSM beginners in Prague. Learn about communication, safe words, preparation, and aftercare.',
    category: 'rady-a-tipy',
    locale: 'en',
    is_published: 1,
    is_featured: 0
  },
  {
    title: 'Girlfriend Experience (GFE) in Prague Explained',
    slug: 'girlfriend-experience-gfe-prague-explained',
    content: `# Girlfriend Experience (GFE) in Prague Explained

GFE stands for "Girlfriend Experience" - a more intimate, emotionally connected encounter that goes beyond physical intimacy.

## What is GFE?

The Girlfriend Experience mimics a romantic relationship dynamic:
- Natural conversation and connection
- Affection and intimacy
- Shared activities (dinner, drinks, exploring the city)
- Emotional engagement
- Unhurried, relaxed atmosphere

## What to Expect

**Emotional Connection**
- Genuine conversation and interest
- Eye contact and affection
- Kissing and cuddling
- Feeling like you're with a real girlfriend

**Activities**
GFE sessions often include:
- Dinner dates at Prague restaurants
- Drinks at bars or your hotel
- Sightseeing and walking tours
- Cultural activities
- Overnight stays

**Duration**
GFE bookings typically last longer than standard sessions:
- Minimum 2-3 hours recommended
- Dinner dates: 3-4 hours
- Overnight: 10-12 hours

## GFE vs Standard Sessions

| Aspect | GFE | Standard |
|--------|-----|----------|
| Duration | Longer (3+ hours) | Shorter (1-2 hours) |
| Intimacy | High emotional connection | Physical focus |
| Activities | Varied (dinner, dates) | Session-focused |
| Pace | Relaxed, natural | More structured |
| Kissing | Deep, passionate | Optional/brief |

## Tips for First-Time GFE

1. **Book longer sessions** - GFE needs time to develop naturally
2. **Choose activities you enjoy** - Shared interests build connection
3. **Be yourself** - Authenticity creates better chemistry
4. **Communicate openly** - Share what you're looking for
5. **Relax** - Let the experience unfold naturally

## Finding GFE Providers

Look for companions who:
- Explicitly offer GFE in their services
- Have warm, engaging personalities
- Receive reviews mentioning connection and chemistry
- Prefer longer bookings

## Ready for GFE?

Browse our [Prague companions](/cs/divky) who specialize in the Girlfriend Experience.`,
    excerpt: 'Comprehensive guide to Girlfriend Experience (GFE) in Prague. Understand what GFE means, what to expect, and how to book.',
    category: 'rady-a-tipy',
    locale: 'en',
    is_published: 1,
    is_featured: 0
  },
  {
    title: 'First-Time Escort Booking in Prague: Complete Guide',
    slug: 'first-time-escort-booking-prague-guide',
    content: `# First-Time Escort Booking in Prague: Complete Guide

Booking an escort for the first time can feel overwhelming. This guide covers everything you need to know for a smooth experience in Prague.

## Step 1: Browse Profiles

Take time to browse companion profiles:
- Read descriptions carefully
- Check available services
- Review photos
- Read reviews if available
- Check rates and booking requirements

## Step 2: Initial Contact

When reaching out, include:
- **Your name** (can use a pseudonym)
- **Date and time** desired
- **Duration** of booking
- **Location** (hotel name or area)
- **Special requests** if any

**Example Message:**
"Hi, I'm Mike visiting Prague. I'd like to book a 90-minute session tomorrow (March 15th) around 8 PM at the Hilton Old Town. Looking for GFE experience. Is this available?"

## Step 3: Confirmation

Once confirmed, you'll receive:
- Final price confirmation
- Arrival time
- Any special instructions
- Contact number for the day

## Step 4: Preparation

**Before the Session:**
- Shower and groom well
- Prepare the donation in an envelope
- Tidy your room
- Have drinks/water available
- Silence your phone

**Payment:**
- Cash is standard in Prague (CZK or EUR usually accepted)
- Place payment in a visible location (not handed directly)
- Never negotiate rates during the session

## Step 5: During the Session

**Etiquette:**
- Greet warmly and offer a drink
- Respect boundaries
- Communicate what you enjoy
- Be present and engaged
- Watch the time yourself

**Hygiene:**
- Offer to shower before if you haven't recently
- Fresh breath is essential
- Clean fingernails

## Step 6: After the Session

- Don't rush the goodbye
- Leave a review if the experience was positive
- Rebook directly if you had a great time

## Common Concerns

**Is it legal in Prague?**
Yes, sex work is legal in the Czech Republic for adults.

**What if I'm nervous?**
Totally normal! Companions are professionals who deal with first-timers regularly. Just communicate openly.

**How much should I tip?**
Tipping isn't expected but is appreciated for exceptional service (10-20% is generous).

**What if we don't click?**
Chemistry varies. If you've followed etiquette and paid, you've done your part. Try someone else next time.

## Red Flags to Avoid

- Providers asking for deposits (rare in Prague)
- Suspiciously low rates
- Pushy or aggressive communication
- No verification photos
- Meeting in unsafe locations

## Ready to Book?

Browse our verified [Prague companions](/cs/divky) and start your experience with confidence.`,
    excerpt: 'Complete first-timer guide to booking escorts in Prague. Step-by-step instructions, etiquette, preparation, and common questions answered.',
    category: 'rady-a-tipy',
    locale: 'en',
    is_published: 1,
    is_featured: 1
  }
];

async function generateSlug(title: string): Promise<string> {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function importBlogs() {
  console.log('Starting blog import...\n');

  let imported = 0;
  let skipped = 0;

  for (const article of blogArticles) {
    try {
      // Check if article already exists
      const existing = await db.execute({
        sql: 'SELECT id FROM blog_posts WHERE slug = ?',
        args: [article.slug]
      });

      if (existing.rows.length > 0) {
        console.log(`⏭️  Skipping "${article.title}" - already exists`);
        skipped++;
        continue;
      }

      // Insert blog post
      const result = await db.execute({
        sql: `
          INSERT INTO blog_posts (
            slug, title, excerpt, content, category, featured_image,
            author, read_time, is_featured, is_published, published_at,
            meta_title, meta_description, locale, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          article.slug,
          article.title,
          article.excerpt,
          article.content,
          article.category,
          article.featured_image || null,
          'LovelyGirls Team',
          5, // Default read time
          article.is_featured,
          article.is_published,
          article.is_published ? new Date().toISOString() : null,
          article.title,
          article.excerpt,
          article.locale,
          new Date().toISOString(),
          new Date().toISOString()
        ]
      });

      console.log(`✅ Imported: "${article.title}" (ID: ${result.lastInsertRowid})`);
      imported++;

    } catch (error) {
      console.error(`❌ Failed to import "${article.title}":`, error);
    }
  }

  console.log(`\n📊 Import Summary:`);
  console.log(`   ✅ Imported: ${imported}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   📝 Total: ${blogArticles.length}`);
}

importBlogs()
  .then(() => {
    console.log('\n✨ Blog import completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  });
