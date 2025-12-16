-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL, -- 'erotic_story', 'girl_spotlight', 'prague_tips', 'guide', 'etiquette'
  featured_image TEXT,
  girl_id INTEGER, -- Optional: link to girls table
  author TEXT DEFAULT 'LovelyGirls Team',
  read_time INTEGER DEFAULT 5, -- minutes
  views INTEGER DEFAULT 0,
  is_featured INTEGER DEFAULT 0,
  is_published INTEGER DEFAULT 1,
  published_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  og_image TEXT,

  -- Multilingual
  locale TEXT DEFAULT 'cs', -- 'cs', 'en', 'de', 'uk'

  FOREIGN KEY (girl_id) REFERENCES girls(id) ON DELETE SET NULL
);

-- Blog Tags Table
CREATE TABLE IF NOT EXISTS blog_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Blog Post Tags Junction Table
CREATE TABLE IF NOT EXISTS blog_post_tags (
  post_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES blog_tags(id) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_locale ON blog_posts(locale);
CREATE INDEX IF NOT EXISTS idx_blog_posts_girl_id ON blog_posts(girl_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);

-- Sample data for testing
INSERT OR IGNORE INTO blog_tags (name, slug) VALUES
  ('Escort Prague', 'escort-prague'),
  ('GFE Experience', 'gfe-experience'),
  ('Luxury Escort', 'luxury-escort'),
  ('Prague Hotels', 'prague-hotels'),
  ('First Time', 'first-time'),
  ('Erotic Stories', 'erotic-stories'),
  ('Blonde Escorts', 'blonde-escorts'),
  ('Overnight Booking', 'overnight-booking'),
  ('Dinner Date', 'dinner-date');

-- Sample blog post
INSERT OR IGNORE INTO blog_posts (
  slug,
  title,
  excerpt,
  content,
  category,
  featured_image,
  girl_id,
  read_time,
  is_featured,
  is_published,
  published_at,
  meta_title,
  meta_description,
  meta_keywords,
  locale
) VALUES (
  'extra-hour-old-town-square',
  'The Extra Hour by Old Town Square',
  'A slow lift, warm light and a yes that takes its time. What started as a simple booking became an evening neither of us wanted to end.',
  '<p>The elevator doors opened slowly, like they knew we had time. Katy stepped in first, her heels clicking against the marble floor. The penthouse button glowed under her fingertip, and suddenly we were rising—above the cobblestones, above the tourists, above everything ordinary about this city.</p>

<p>I had booked her for dinner. Just dinner, I told myself. A companion for an evening in Prague, someone who could hold a conversation about wine and architecture and maybe—<em>maybe</em>—something more. What I didn''t expect was the way she looked at me when I mentioned the astronomical clock.</p>

<p><strong>"You''ve never seen it at night?"</strong> she asked, genuine surprise in her voice. <strong>"From above?"</strong></p>

<p>That''s how we ended up here. Not at the restaurant where I had a reservation, but at a rooftop suite with floor-to-ceiling windows and a view that made the whole city look like a Christmas card come to life.</p>

<hr class="scene-break" />

<p>She kicked off her heels by the door. A small gesture, but it changed everything—suddenly this wasn''t a booking anymore. It was an evening. She walked to the window, champagne in hand, and I watched the city lights play across her shoulders.</p>

<p><em>"You know what I love about this job?"</em> she said, not turning around. <em>"The men who actually want to talk first."</em></p>

<p>We talked about her hometown in Moravia. About the time she almost became a dancer. About why Prague pulls people in and doesn''t let them go. The champagne disappeared. Another bottle appeared. The clock struck midnight somewhere below us, and neither of us moved.</p>

<hr class="scene-break" />

<p>When she finally turned around, the question in her eyes matched the one I''d been afraid to ask.</p>

<p><strong>"The booking was for three hours,"</strong> I said, glancing at my watch. <strong>"It''s been four."</strong></p>

<p>She smiled—not her professional smile, but something softer. <strong>"Then let''s make it five."</strong></p>

<hr class="scene-break" />

<p>What happened next isn''t something I''ll describe in detail. Some moments are meant to be lived, not narrated. But I''ll say this: there''s a difference between a service and a connection. Between going through motions and being genuinely present.</p>

<p>Katy was present. Every touch, every whisper, every pause—it all meant something. When the sun started to paint the spires gold, she was still there, her head on my chest, tracing lazy patterns on my skin.</p>

<blockquote class="story-quote">
  <p>Some nights in Prague are about the sights. Others are about what you find when you stop looking.</p>
</blockquote>

<p>I extended the booking twice more. She laughed each time, but she never reached for her phone. When I finally walked her to a taxi, the Old Town Square was waking up—street sweepers, early tourists, the smell of fresh bread from somewhere.</p>

<p><strong>"Same time next month?"</strong> she asked through the window.</p>

<p>I nodded. She smiled. The taxi pulled away, and I stood there longer than I should have, watching the morning light do impossible things to this impossible city.</p>

<p>Some bookings end when the time runs out. Others, the good ones, end when you both decide they should. That night with Katy—it was definitely one of the good ones.</p>',
  'erotic_story',
  '/blog/old-town-square-night.jpg',
  NULL,
  5,
  1,
  1,
  DATETIME('now'),
  'The Extra Hour by Old Town Square | LovelyGirls Blog',
  'A story about an unforgettable evening with an escort in Prague. What started as dinner booking became a night neither wanted to end.',
  'escort prague story, gfe experience prague, overnight escort, prague escort blog',
  'en'
);
