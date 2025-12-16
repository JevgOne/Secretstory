"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MobileMenu from '@/components/MobileMenu';

type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  featured_image: string;
  author: string;
  read_time: number;
  views: number;
  is_featured: boolean;
  published_at: string;
  created_at: string;
  locale: string;
  girl: {
    id: number;
    name: string;
    slug: string;
    bio: string;
  } | null;
};

type Props = {
  locale: string;
  initialStories: BlogPost[];
  initialGuides: BlogPost[];
  featuredPost: BlogPost | null;
};

export default function BlogContent({ locale, initialStories, initialGuides, featuredPost }: Props) {
  const tNav = useTranslations('nav');
  const tBlog = useTranslations('blog');
  const tCommon = useTranslations('common');
  const tFooter = useTranslations('footer');
  const pathname = usePathname();
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    { key: "all", label: tBlog('category_all') },
    { key: "erotic_stories", label: tBlog('category_erotic_stories') },
    { key: "girl_spotlights", label: tBlog('category_girl_spotlights') },
    { key: "prague_tips", label: tBlog('category_prague_tips') },
    { key: "guides", label: tBlog('category_guides') }
  ];

  const tags = [
    "Escort Prague", "GFE Experience", "Luxury Escort", "Prague Hotels",
    "First Time", "Erotic Stories", "Blonde Escorts", "Overnight Booking", "Dinner Date"
  ];

  // Helper function to map category from DB to display category
  const getCategoryDisplay = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'erotic_story': tBlog('category_erotic_story'),
      'girl_spotlight': tBlog('category_girl_spotlight'),
      'prague_tips': tBlog('category_prague_tips'),
      'guide': tBlog('category_guide'),
      'etiquette': tBlog('category_etiquette')
    };
    return categoryMap[category] || category;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Format views
  const formatViews = (views: number) => {
    return tBlog('views', { count: views });
  };

  return (
    <>
      {/* Mobile Menu - outside nav for proper z-index */}
      <MobileMenu currentPath={pathname} />

      {/* Navigation */}
      <nav className="main-nav">
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
          <a href="https://t.me/+420734332131" className="btn">{tNav('telegram')}</a>
          <a href="https://wa.me/420734332131" className="btn btn-fill">{tNav('whatsapp')}</a>
        </div>
      </nav>

      {/* Hero */}
      <header className="blog-hero">
        <div className="hero-pattern"></div>
        <div className="hero-content">
          <div className="hero-label">✨ {tBlog('hero_label')}</div>
          <h1 className="hero-title">{tBlog('hero_title').split('&')[0]} & <em>{tBlog('hero_title').split('&')[1]}</em></h1>
          <p className="hero-subtitle">{tBlog('hero_subtitle')}</p>
        </div>
      </header>

      {/* Categories */}
      <div className="categories-bar">
        {categories.map((cat) => (
          <button
            key={cat.key}
            className={`cat-btn ${activeCategory === (cat.key === "all" ? "All" : cat.label) ? "active" : ""}`}
            onClick={() => setActiveCategory(cat.key === "all" ? "All" : cat.label)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Featured Story */}
      {featuredPost && (
        <section className="featured-section">
          <div className="section-header">
            <h2 className="section-title"><span>🔥</span> {tBlog('latest_story')}</h2>
            <a href="#stories" className="view-all">
              {tBlog('view_all_stories')}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

          <Link href={`/${locale}/blog/${featuredPost.slug}`} className="featured-story">
            <div className="featured-image">
              <div className="featured-image-placeholder">{tBlog('featured_image')}</div>
              <span className="featured-badge">{tBlog('new_story')}</span>
            </div>
            <div className="featured-content">
              <div className="featured-meta">
                <span className="featured-category">{getCategoryDisplay(featuredPost.category)}</span>
                <span className="featured-date">{formatDate(featuredPost.published_at || featuredPost.created_at)}</span>
              </div>
              <h3 className="featured-title">{featuredPost.title}</h3>
              <p className="featured-excerpt">{featuredPost.excerpt}</p>
              {featuredPost.girl && (
                <div className="featured-girl">
                  <div className="girl-avatar">{featuredPost.girl.name[0]}</div>
                  <div className="girl-info">
                    <h4>{featuredPost.girl.name}</h4>
                    <p>{featuredPost.girl.bio}</p>
                  </div>
                </div>
              )}
            </div>
          </Link>
        </section>
      )}

      {/* Stories Grid */}
      {initialStories.length > 0 && (
        <section id="stories" className="stories-section">
          <div className="section-header">
            <h2 className="section-title"><span>💋</span> {tBlog('erotic_stories')}</h2>
            <a href="#" className="view-all">
              {tBlog('view_all')}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

          <div className="stories-grid">
            {initialStories.slice(0, 6).map((story) => (
              <article key={story.id} className="story-card">
                <Link href={`/${locale}/blog/${story.slug}`} className="story-image">
                  <div className="story-image-placeholder">{tBlog('story_image')}</div>
                  <span className="story-category-badge">{getCategoryDisplay(story.category)}</span>
                  <div className="story-overlay">
                    <h3 className="story-overlay-title">{story.title}</h3>
                    {story.girl && (
                      <div className="story-overlay-girl">
                        <div className="story-mini-avatar">{story.girl.name[0]}</div>
                        <span>{story.girl.name}</span>
                      </div>
                    )}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Guides Section */}
      {initialGuides.length > 0 && (
        <section id="guides" className="guides-section">
          <div className="section-header">
            <h2 className="section-title"><span>📖</span> {tBlog('guides_tips')}</h2>
            <a href="#" className="view-all">
              {tBlog('view_all_guides')}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

          <div className="guides-grid">
            {initialGuides.slice(0, 4).map((guide) => (
              <Link href={`/${locale}/blog/${guide.slug}`} key={guide.id} className="guide-card">
                <div className="guide-image">
                  <div className="guide-image-placeholder">{tBlog('guide')}</div>
                </div>
                <div className="guide-content">
                  <span className="guide-category">{getCategoryDisplay(guide.category)}</span>
                  <h3 className="guide-title">{guide.title}</h3>
                  <p className="guide-excerpt">{guide.excerpt}</p>
                  <div className="guide-meta">
                    <span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      {tBlog('min_read', { minutes: guide.read_time })}
                    </span>
                    <span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                      {formatViews(guide.views)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="newsletter-section">
        <div className="newsletter-box">
          <div className="newsletter-icon">💌</div>
          <h2 className="newsletter-title">{tBlog('newsletter_title')}</h2>
          <p className="newsletter-subtitle">{tBlog('newsletter_subtitle')}</p>
          <form className="newsletter-form">
            <input type="email" className="newsletter-input" placeholder={tBlog('newsletter_placeholder')} required />
            <button type="submit" className="newsletter-btn">{tBlog('newsletter_btn')}</button>
          </form>
        </div>
      </section>

      {/* Tags */}
      <section className="tags-section">
        <div className="tags-inner">
          <div className="tags-label">{tBlog('tags_label')}</div>
          <div className="tags-cloud">
            {tags.map((tag, i) => (
              <a href="#" key={i} className="tag">{tag}</a>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-container">
          <div className="footer-main">
            <div className="footer-brand-section">
              <Link href={`/${locale}`} className="footer-logo">
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
              <p className="footer-tagline">{tFooter('tagline')}</p>
              <p className="footer-desc">{tFooter('about_text')}</p>
            </div>

            <div className="footer-links-grid">
              {/* Services */}
              <div className="footer-links-col">
                <h4 className="footer-links-title">{tFooter('practices')}</h4>
                <nav className="footer-links">
                  <Link href={`/${locale}/divky`}>{tNav('girls')}</Link>
                  <Link href={`/${locale}/cenik`}>{tNav('pricing')}</Link>
                  <Link href={`/${locale}/schedule`}>{tNav('schedule')}</Link>
                  <Link href={`/${locale}/discounts`}>{tNav('discounts')}</Link>
                  <Link href={`/${locale}/faq`}>{tNav('faq')}</Link>
                  <Link href={`/${locale}/blog`}>{tFooter('blog')}</Link>
                </nav>
              </div>

              {/* Contact */}
              <div className="footer-links-col">
                <h4 className="footer-links-title">{tFooter('contact')}</h4>
                <div className="footer-contact-info">
                  <div className="footer-contact-item">
                    <span className="label">{tFooter('hours')}</span>
                    <span className="value">{tFooter('hours_value')}</span>
                  </div>
                  <div className="footer-contact-item">
                    <span className="label">{tFooter('location')}</span>
                    <span className="value">{tFooter('location_value')}</span>
                  </div>
                </div>
                <div className="footer-contact-actions">
                  <a href="tel:+420734332131" className="footer-contact-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    {tFooter('call')}
                  </a>
                  <a href="https://wa.me/420734332131?text=Ahoj%2C%20m%C3%A1te%20dneska%20voln%C3%BD%20term%C3%ADn%3F" className="footer-contact-btn whatsapp">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    {tFooter('whatsapp')}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-bottom-left">
              <span>{tFooter('copyright')}</span>
              <span className="dot">•</span>
              <span>{tCommon('adults_only')}</span>
            </div>
            <div className="footer-bottom-right">
              <Link href={`/${locale}/podminky`}>{tFooter('terms')}</Link>
              <Link href={`/${locale}/soukromi`}>{tFooter('privacy')}</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
