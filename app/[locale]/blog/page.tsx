"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MobileMenu from '@/components/MobileMenu';

export default function BlogPage() {
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Erotic Stories", "Girl Spotlights", "Prague Tips", "Guides"];

  const stories = [
    {
      title: "Cool elegance that loves a firm lead ❄️",
      girl: "Ema",
      category: "Erotic Story",
      slug: "cool-elegance-firm-lead"
    },
    {
      title: "Gentle blonde with reviews that speak for themselves 💋",
      girl: "Daniela",
      category: "Erotic Story",
      slug: "gentle-blonde-reviews"
    },
    {
      title: "A night at the Four Seasons with Victoria",
      girl: "Victoria",
      category: "Girl Spotlight",
      slug: "night-four-seasons-victoria"
    },
    {
      title: "Young brunette with an open mind 💋",
      girl: "Natalie",
      category: "Erotic Story",
      slug: "young-brunette-open-mind"
    },
    {
      title: "Midnight walk across Charles Bridge ✨",
      girl: "Sofia",
      category: "Prague Nights",
      slug: "midnight-walk-charles-bridge"
    },
    {
      title: "The businessman who wanted more than dinner",
      girl: "Anna",
      category: "Erotic Story",
      slug: "businessman-more-than-dinner"
    }
  ];

  const guides = [
    {
      title: "First time booking an escort in Prague?",
      category: "Beginner's Guide",
      excerpt: "Everything you need to know before your first experience. From choosing the right girl to etiquette tips.",
      readTime: "8 min read",
      views: "2.4k views"
    },
    {
      title: "Best hotels for a discreet encounter",
      category: "Prague Tips",
      excerpt: "Our curated list of Prague's most private and escort-friendly hotels.",
      readTime: "6 min read",
      views: "1.8k views"
    },
    {
      title: "GFE vs. PSE: Understanding escort experiences",
      category: "Experience",
      excerpt: "What do these terms actually mean? A straightforward explanation.",
      readTime: "5 min read",
      views: "3.1k views"
    },
    {
      title: "The gentleman's guide to escort etiquette",
      category: "Etiquette",
      excerpt: "How to make a great impression and ensure an unforgettable time.",
      readTime: "7 min read",
      views: "2.9k views"
    }
  ];

  const tags = [
    "Escort Prague", "GFE Experience", "Luxury Escort", "Prague Hotels",
    "First Time", "Erotic Stories", "Blonde Escorts", "Overnight Booking", "Dinner Date"
  ];

  return (
    <>
      {/* Navigation */}
      <nav>
        <Link href={`/${locale}`} className="logo">
          <span className="logo-L">
            <svg className="santa-hat" viewBox="0 0 16 14" fill="none">
              <path d="M2 12C4 11 6 7 9 5C8 3 9 1.5 10 1" stroke="#c41e3a" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="10" cy="1.5" r="1.5" fill="#fff"/>
              <path d="M1 12C3 11.5 6 11 9 11" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            L
          </span>
          ovely Girls
        </Link>
        <div className="nav-links">
          <Link href={`/${locale}`}>{tNav('home')}</Link>
          <Link href={`/${locale}/divky`}>{tNav('girls')}</Link>
          <Link href={`/${locale}/cenik`}>{tNav('pricing')}</Link>
          <Link href={`/${locale}/schedule`}>{tNav('schedule')}</Link>
          <Link href={`/${locale}/discounts`}>{tNav('discounts')}</Link>
          <Link href={`/${locale}/faq`}>{tNav('faq')}</Link>
        </div>
        <div className="nav-contact">
          <LanguageSwitcher />
          <a href="tel:+420734332131" className="btn">{tNav('phone')}</a>
          <a href="https://wa.me/420734332131" className="btn btn-fill">{tNav('whatsapp')}</a>
        </div>
        <MobileMenu currentPath={pathname} />
      </nav>

      {/* Hero */}
      <header className="blog-hero">
        <div className="hero-pattern"></div>
        <div className="hero-content">
          <div className="hero-label">✨ Stories & Tips from Prague</div>
          <h1 className="hero-title">Seductive Stories & <em>Insider Secrets</em></h1>
          <p className="hero-subtitle">Intimate encounters, behind-the-scenes moments, and everything you need to know about luxury escort experiences in Prague.</p>
        </div>
      </header>

      {/* Categories */}
      <div className="categories-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`cat-btn ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Story */}
      <section className="featured-section">
        <div className="section-header">
          <h2 className="section-title"><span>🔥</span> Latest Story</h2>
          <a href="#stories" className="view-all">
            View all stories
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>

        <Link href="/blog/extra-hour-old-town-square" className="featured-story">
          <div className="featured-image">
            <div className="featured-image-placeholder">FEATURED IMAGE</div>
            <span className="featured-badge">New Story</span>
          </div>
          <div className="featured-content">
            <div className="featured-meta">
              <span className="featured-category">Erotic Story</span>
              <span className="featured-date">November 28, 2025</span>
            </div>
            <h3 className="featured-title">The Extra Hour by Old Town Square</h3>
            <p className="featured-excerpt">
              A slow lift, warm light and a yes that takes its time. What started as a simple booking became an evening neither of us wanted to end. The view from the penthouse, the champagne, and the way she looked at me when...
            </p>
            <div className="featured-girl">
              <div className="girl-avatar">K</div>
              <div className="girl-info">
                <h4>Katy</h4>
                <p>Sexy brunette with babygirl vibe & GFE</p>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* Stories Grid */}
      <section id="stories" className="stories-section">
        <div className="section-header">
          <h2 className="section-title"><span>💋</span> Erotic Stories</h2>
          <a href="#" className="view-all">
            View all
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>

        <div className="stories-grid">
          {stories.map((story, i) => (
            <article key={i} className="story-card">
              <Link href={`/blog/${story.slug}`} className="story-image">
                <div className="story-image-placeholder">STORY IMAGE</div>
                <span className="story-category-badge">{story.category}</span>
                <div className="story-overlay">
                  <h3 className="story-overlay-title">{story.title}</h3>
                  <div className="story-overlay-girl">
                    <div className="story-mini-avatar">{story.girl[0]}</div>
                    <span>{story.girl}</span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Guides Section */}
      <section id="guides" className="guides-section">
        <div className="section-header">
          <h2 className="section-title"><span>📖</span> Guides & Tips</h2>
          <a href="#" className="view-all">
            View all guides
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>

        <div className="guides-grid">
          {guides.map((guide, i) => (
            <Link href="/blog/first-time-guide" key={i} className="guide-card">
              <div className="guide-image">
                <div className="guide-image-placeholder">GUIDE</div>
              </div>
              <div className="guide-content">
                <span className="guide-category">{guide.category}</span>
                <h3 className="guide-title">{guide.title}</h3>
                <p className="guide-excerpt">{guide.excerpt}</p>
                <div className="guide-meta">
                  <span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {guide.readTime}
                  </span>
                  <span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    {guide.views}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section">
        <div className="newsletter-box">
          <div className="newsletter-icon">💌</div>
          <h2 className="newsletter-title">Get Exclusive Updates</h2>
          <p className="newsletter-subtitle">New girls, special offers, and stories. No spam, just pleasure.</p>
          <form className="newsletter-form">
            <input type="email" className="newsletter-input" placeholder="Your email" required />
            <button type="submit" className="newsletter-btn">Subscribe</button>
          </form>
        </div>
      </section>

      {/* Tags */}
      <section className="tags-section">
        <div className="tags-inner">
          <div className="tags-label">Popular Topics</div>
          <div className="tags-cloud">
            {tags.map((tag, i) => (
              <a href="#" key={i} className="tag">{tag}</a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div>LovelyGirls Prague © 2025 — Pouze 18+</div>
        <div className="footer-links">
          <Link href={`/${locale}/podminky`}>Podmínky</Link>
          <Link href={`/${locale}/soukromi`}>Soukromí</Link>
        </div>
      </footer>
    </>
  );
}
