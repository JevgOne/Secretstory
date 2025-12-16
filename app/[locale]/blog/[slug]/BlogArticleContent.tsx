"use client";

import { useEffect } from "react";
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
  content: string;
  category: string;
  featured_image: string;
  author: string;
  read_time: number;
  views: number;
  is_featured: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  locale: string;
  og_image?: string;
  girl: {
    id: number;
    name: string;
    slug: string;
    bio: string;
    age: number;
    nationality: string;
  } | null;
};

type Props = {
  locale: string;
  post: BlogPost;
  relatedPosts: BlogPost[];
};

export default function BlogArticleContent({ locale, post, relatedPosts }: Props) {
  const t = useTranslations();
  const tNav = useTranslations('nav');
  const tBlog = useTranslations('blog');
  const tCommon = useTranslations('common');
  const tFooter = useTranslations('footer');
  const pathname = usePathname();

  // Increment view count on mount
  useEffect(() => {
    const incrementViews = async () => {
      try {
        await fetch(`/api/blog/${post.slug}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'increment_views' }),
        });
      } catch (error) {
        console.error('Error incrementing views:', error);
      }
    };

    incrementViews();
  }, [post.slug]);

  // Helper function to map category from DB to display category
  const getCategoryDisplay = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'erotic_story': `💋 ${tBlog('category_erotic_story')}`,
      'girl_spotlight': `⭐ ${tBlog('category_girl_spotlight')}`,
      'prague_tips': `🌃 ${tBlog('category_prague_tips')}`,
      'guide': `📖 ${tBlog('category_guide')}`,
      'etiquette': `🎩 ${tBlog('category_etiquette')}`
    };
    return categoryMap[category] || category;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Add JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'LovelyGirls Prague',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/logo.png`,
      },
    },
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    image: post.featured_image || post.og_image,
    articleBody: post.content,
    wordCount: post.content.split(/\s+/).length,
    timeRequired: `PT${post.read_time}M`,
  };

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
          <Link href={`/${locale}`}>{t('nav.home')}</Link>
          <Link href={`/${locale}/divky`}>{t('nav.girls')}</Link>
          <Link href={`/${locale}/cenik`}>{t('nav.pricing')}</Link>
          <Link href={`/${locale}/schedule`}>{t('nav.schedule')}</Link>
          <Link href={`/${locale}/discounts`}>{t('nav.discounts')}</Link>
          <Link href={`/${locale}/faq`}>{t('nav.faq')}</Link>
        </div>
        <div className="nav-contact">
          <LanguageSwitcher />
          <a href="https://t.me/+420734332131" className="btn">{t('nav.telegram')}</a>
          <a href="https://wa.me/420734332131" className="btn btn-fill">{t('nav.whatsapp')}</a>
        </div>
        <MobileMenu currentPath={pathname} />
      </nav>

      {/* Hero */}
      <header className="story-hero">
        <div className="hero-bg"></div>
        <div className="hero-bg-image"></div>
        <div className="hero-pattern"></div>

        <div className="hero-content">
          <nav className="hero-breadcrumb">
            <Link href={`/${locale}`}>{t('nav.home')}</Link>
            <span className="sep">›</span>
            <Link href={`/${locale}/blog`}>{t('footer.blog')}</Link>
            <span className="sep">›</span>
            <span>{tBlog('story')}</span>
          </nav>
          <span className="hero-category">{getCategoryDisplay(post.category)}</span>
          <h1 className="hero-title">{post.title}</h1>
          <p className="hero-excerpt">{post.excerpt}</p>
          <div className="hero-meta">
            <div className="hero-meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <time>{formatDate(post.published_at || post.created_at)}</time>
            </div>
            <div className="hero-meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>{tBlog('min_read', { minutes: post.read_time })}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Article */}
      <article className="article-container">
        <div className="article-content">

          {/* Girl Card Inline */}
          {post.girl && (
            <Link href={`/${locale}/profily/${post.girl.slug}`} className="girl-card-inline">
              <div className="girl-card-avatar">{tCommon('photo')}</div>
              <div className="girl-card-info">
                <div className="girl-card-label">{tBlog('story_features')}</div>
                <h3 className="girl-card-name">{post.girl.name}</h3>
                <p className="girl-card-desc">{post.girl.bio}</p>
              </div>
              <span className="girl-card-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                {tBlog('view_profile')}
              </span>
            </Link>
          )}

          {/* Render HTML content from database */}
          <div dangerouslySetInnerHTML={{ __html: post.content }} />

          <div className="story-ending">
            <div className="ending-emoji">💋</div>
            <p className="ending-text">— {tBlog('the_end')} —</p>
          </div>
        </div>
      </article>

      {/* Article Footer */}
      <div className="article-footer">
        <div className="share-cta">
          <span className="share-text">{tBlog('share_cta')}</span>
          <div className="share-buttons">
            <a href="#" className="share-btn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" className="share-btn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" className="share-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Meet Girl CTA */}
        {post.girl && (
          <div className="meet-cta">
            <div className="meet-avatar">{post.girl.name[0]}</div>
            <div className="meet-content">
              <div className="meet-label">{tBlog('featured_in_story')}</div>
              <h3 className="meet-name">{post.girl.name}</h3>
              <p className="meet-desc">{post.girl.bio}</p>
              <Link href={`/${locale}/profily/${post.girl.slug}`} className="meet-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                {tBlog('view_girl_profile')}
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* More Stories */}
      {relatedPosts.length > 0 && (
        <section className="more-stories">
          <div className="more-header">
            <h2 className="more-title">{tBlog('more_stories')}</h2>
            <Link href={`/${locale}/blog`} className="more-link">
              {tBlog('view_all')}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
          <div className="more-grid">
            {relatedPosts.map((relatedPost) => (
              <Link href={`/${locale}/blog/${relatedPost.slug}`} key={relatedPost.id} className="more-card">
                <div className="more-card-image">
                  {tBlog('story_image')}
                  <div className="more-card-overlay">
                    <h3 className="more-card-title">{relatedPost.title}</h3>
                    {relatedPost.girl && (
                      <span className="more-card-girl">{tBlog('with_girl')} {relatedPost.girl.name}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

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
              <p className="footer-desc">{t('footer.about_text')}</p>
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
                  <Link href={`/${locale}/blog`}>{t('footer.blog')}</Link>
                </nav>
              </div>

              {/* Contact */}
              <div className="footer-links-col">
                <h4 className="footer-links-title">{t('footer.contact')}</h4>
                <div className="footer-contact-info">
                  <div className="footer-contact-item">
                    <span className="label">{t('footer.hours')}</span>
                    <span className="value">{t('footer.hours_value')}</span>
                  </div>
                  <div className="footer-contact-item">
                    <span className="label">{t('footer.location')}</span>
                    <span className="value">{t('footer.location_value')}</span>
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
              <span>{t('footer.copyright')}</span>
              <span className="dot">•</span>
              <span>{tCommon('adults_only')}</span>
            </div>
            <div className="footer-bottom-right">
              <Link href={`/${locale}/podminky`}>{t('footer.terms')}</Link>
              <Link href={`/${locale}/soukromi`}>{t('footer.privacy')}</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
