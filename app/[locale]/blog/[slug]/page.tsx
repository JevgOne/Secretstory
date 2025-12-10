"use client";

import Link from "next/link";

export default function BlogArticlePage() {
  return (
    <>
      {/* Navigation */}
      <nav>
        <Link href="/" className="logo">
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
          <Link href="/">Home</Link>
          <Link href="/divky">Dívky</Link>
          <Link href="/cenik">Ceník</Link>
          <Link href="/blog" className="active">Blog</Link>
          <Link href="/faq">FAQ</Link>
        </div>
        <div className="nav-contact">
          <a href="tel:+420734332131" className="btn">+420 734 332 131</a>
          <a href="https://wa.me/420734332131" className="btn btn-fill">WhatsApp</a>
        </div>
        <button className="mobile-menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Hero */}
      <header className="story-hero">
        <div className="hero-bg"></div>
        <div className="hero-bg-image"></div>
        <div className="hero-pattern"></div>

        <div className="hero-content">
          <nav className="hero-breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">›</span>
            <Link href="/blog">Blog</Link>
            <span className="sep">›</span>
            <span>Story</span>
          </nav>
          <span className="hero-category">💋 Erotic Story</span>
          <h1 className="hero-title">The Extra Hour by Old Town Square</h1>
          <p className="hero-excerpt">A slow lift, warm light and a yes that takes its time.</p>
          <div className="hero-meta">
            <div className="hero-meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <time>November 28, 2025</time>
            </div>
            <div className="hero-meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>5 min read</span>
            </div>
          </div>
        </div>
      </header>

      {/* Article */}
      <article className="article-container">
        <div className="article-content">

          {/* Girl Card Inline */}
          <Link href="/profily/katy" className="girl-card-inline">
            <div className="girl-card-avatar">PHOTO</div>
            <div className="girl-card-info">
              <div className="girl-card-label">This story features</div>
              <h3 className="girl-card-name">Katy</h3>
              <p className="girl-card-desc">Sexy brunette with babygirl vibe & GFE</p>
            </div>
            <span className="girl-card-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              View Profile
            </span>
          </Link>

          <p>The elevator doors opened slowly, like they knew we had time. Katy stepped in first, her heels clicking against the marble floor. The penthouse button glowed under her fingertip, and suddenly we were rising—above the cobblestones, above the tourists, above everything ordinary about this city.</p>

          <p>I had booked her for dinner. Just dinner, I told myself. A companion for an evening in Prague, someone who could hold a conversation about wine and architecture and maybe—<em>maybe</em>—something more. What I didn't expect was the way she looked at me when I mentioned the astronomical clock.</p>

          <p><strong>"You've never seen it at night?"</strong> she asked, genuine surprise in her voice. <strong>"From above?"</strong></p>

          <p>That's how we ended up here. Not at the restaurant where I had a reservation, but at a rooftop suite with floor-to-ceiling windows and a view that made the whole city look like a Christmas card come to life.</p>

          <div className="scene-break">
            <span>✦</span>
          </div>

          <p>She kicked off her heels by the door. A small gesture, but it changed everything—suddenly this wasn't a booking anymore. It was an evening. She walked to the window, champagne in hand, and I watched the city lights play across her shoulders.</p>

          <p><em>"You know what I love about this job?"</em> she said, not turning around. <em>"The men who actually want to talk first."</em></p>

          <p>We talked about her hometown in Moravia. About the time she almost became a dancer. About why Prague pulls people in and doesn't let them go. The champagne disappeared. Another bottle appeared. The clock struck midnight somewhere below us, and neither of us moved.</p>

          <div className="article-image">
            <div className="article-image-placeholder">ATMOSPHERIC PRAGUE NIGHT VIEW</div>
            <p className="article-image-caption">The view from above Old Town Square</p>
          </div>

          <p>When she finally turned around, the question in her eyes matched the one I'd been afraid to ask.</p>

          <p><strong>"The booking was for three hours,"</strong> I said, glancing at my watch. <strong>"It's been four."</strong></p>

          <p>She smiled—not her professional smile, but something softer. <strong>"Then let's make it five."</strong></p>

          <div className="scene-break">
            <span>✦</span>
          </div>

          <p>What happened next isn't something I'll describe in detail. Some moments are meant to be lived, not narrated. But I'll say this: there's a difference between a service and a connection. Between going through motions and being genuinely present.</p>

          <p>Katy was present. Every touch, every whisper, every pause—it all meant something. When the sun started to paint the spires gold, she was still there, her head on my chest, tracing lazy patterns on my skin.</p>

          <div className="story-quote">
            <p>Some nights in Prague are about the sights. Others are about what you find when you stop looking.</p>
          </div>

          <p>I extended the booking twice more. She laughed each time, but she never reached for her phone. When I finally walked her to a taxi, the Old Town Square was waking up—street sweepers, early tourists, the smell of fresh bread from somewhere.</p>

          <p><strong>"Same time next month?"</strong> she asked through the window.</p>

          <p>I nodded. She smiled. The taxi pulled away, and I stood there longer than I should have, watching the morning light do impossible things to this impossible city.</p>

          <p>Some bookings end when the time runs out. Others, the good ones, end when you both decide they should. That night with Katy—it was definitely one of the good ones.</p>

          <div className="story-ending">
            <div className="ending-emoji">💋</div>
            <p className="ending-text">— The End —</p>
          </div>
        </div>
      </article>

      {/* Article Footer */}
      <div className="article-footer">
        <div className="share-cta">
          <span className="share-text">Enjoyed this story? Share it:</span>
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
        <div className="meet-cta">
          <div className="meet-avatar">K</div>
          <div className="meet-content">
            <div className="meet-label">Featured in this story</div>
            <h3 className="meet-name">Meet Katy</h3>
            <p className="meet-desc">Sexy brunette escort Prague with babygirl vibe & GFE Prague. Available for dinner dates, overnight bookings, and unforgettable evenings.</p>
            <Link href="/profily/katy" className="meet-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              View Katy's Profile
            </Link>
          </div>
        </div>
      </div>

      {/* More Stories */}
      <section className="more-stories">
        <div className="more-header">
          <h2 className="more-title">More Stories</h2>
          <Link href="/blog" className="more-link">
            View all
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
        <div className="more-grid">
          <Link href="/blog/cool-elegance" className="more-card">
            <div className="more-card-image">
              STORY IMAGE
              <div className="more-card-overlay">
                <h3 className="more-card-title">Cool elegance that loves a firm lead ❄️</h3>
                <span className="more-card-girl">with Ema</span>
              </div>
            </div>
          </Link>
          <Link href="/blog/four-seasons" className="more-card">
            <div className="more-card-image">
              STORY IMAGE
              <div className="more-card-overlay">
                <h3 className="more-card-title">A night at the Four Seasons</h3>
                <span className="more-card-girl">with Victoria</span>
              </div>
            </div>
          </Link>
          <Link href="/blog/charles-bridge" className="more-card">
            <div className="more-card-image">
              STORY IMAGE
              <div className="more-card-overlay">
                <h3 className="more-card-title">Midnight walk across Charles Bridge ✨</h3>
                <span className="more-card-girl">with Sofia</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-container">
          <div className="footer-grid">
            {/* About Column */}
            <div className="footer-col">
              <h4 className="footer-heading">O nás</h4>
              <p className="footer-text">Luxusní eskortní služby v Praze. Diskrétní, profesionální a nezapomenutelné zážitky.</p>
            </div>

            {/* Quick Links Column */}
            <div className="footer-col">
              <h4 className="footer-heading">Rychlé odkazy</h4>
              <nav className="footer-nav">
                <Link href="/divky">Dívky</Link>
                <Link href="/cenik">Ceník</Link>
                <Link href="/schedule">Rozvrh</Link>
                <Link href="/discounts">Slevy</Link>
                <Link href="/faq">FAQ</Link>
              </nav>
            </div>

            {/* Contact Column */}
            <div className="footer-col">
              <h4 className="footer-heading">Kontakt</h4>
              <div className="footer-contact">
                <a href="tel:+420734332131" className="footer-btn footer-btn-primary">
                  Zavolat
                </a>
                <a href="https://wa.me/420734332131" className="footer-btn footer-btn-secondary">
                  WhatsApp
                </a>
                <div className="footer-info">
                  <div className="footer-info-item">
                    <span className="footer-info-label">Otevírací doba</span>
                    <span className="footer-info-value">10:00 - 04:00</span>
                  </div>
                  <div className="footer-info-item">
                    <span className="footer-info-label">Lokace</span>
                    <span className="footer-info-value">Praha 2</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Legal Column */}
            <div className="footer-col">
              <h4 className="footer-heading">Právní informace</h4>
              <nav className="footer-nav">
                <Link href="/blog">Blog</Link>
                <Link href="/podminky">Podmínky</Link>
                <Link href="/soukromi">Soukromí</Link>
              </nav>
              <div className="footer-copyright">
                LovelyGirls Prague © 2025 — Pouze 18+
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="footer-disclaimer">
            Všechny modely jsou plnoleté. Pouze pro osoby 18+.
          </div>
        </div>
      </footer>
    </>
  );
}
