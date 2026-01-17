"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

interface Story {
  id: number;
  media_url: string;
  media_type: 'image' | 'video';
  thumbnail_url?: string;
  duration: number;
  views_count: number;
  created_at: string;
}

interface GirlStories {
  girl_id: number;
  girl_name: string;
  girl_slug: string;
  girl_photo?: string;
  stories: Story[];
}

interface StoriesProps {
  initialStories?: GirlStories[];
}

export default function Stories({ initialStories = [] }: StoriesProps) {
  const [storiesData, setStoriesData] = useState<GirlStories[]>(initialStories);
  const locale = useLocale();
  const t = useTranslations('home');

  useEffect(() => {
    // Only fetch if no initial data provided
    if (initialStories.length === 0) {
      async function fetchStories() {
        try {
          const response = await fetch('/api/stories');
          const data = await response.json();
          if (data.success) {
            setStoriesData(data.stories);
          }
        } catch (error) {
          console.error('Error fetching stories:', error);
        }
      }
      fetchStories();
    }

    // Auto-refresh every 10 minutes
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/stories');
        const data = await response.json();
        if (data.success) {
          setStoriesData(data.stories);
        }
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [initialStories.length]);

  if (storiesData.length === 0) {
    return null;
  }

  return (
    <section style={{
      padding: '1.5rem 0 2.5rem',
      background: 'rgba(0, 0, 0, 0.2)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle ambient effect */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        height: '400px',
        background: 'radial-gradient(ellipse, rgba(139, 41, 66, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
        filter: 'blur(80px)'
      }} />

      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: '600',
            color: '#fff',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em'
          }}>
            {t('stories_title')}
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>{t('stories_subtitle')}</p>
        </div>

        <div style={{
          display: 'flex',
          gap: '20px',
          overflowX: 'auto',
          padding: '16px 8px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
        className="stories-container">
          {storiesData.map((girlStories, index) => (
            <Link
              key={girlStories.girl_id}
              href={`/${locale}/profily/${girlStories.girl_slug}#stories`}
              style={{ textDecoration: 'none' }}
            >
              <div
                className="story-item"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '100px',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease',
                  animation: `fadeInUp 0.5s ease ${index * 0.1}s both`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Story Ring with Animation */}
                <div style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  padding: '3px',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(139, 41, 66, 0.4) 50%, rgba(255, 255, 255, 0.3) 100%)',
                  backgroundSize: '200% 200%',
                  position: 'relative',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                  animation: 'gradientShift 3s ease infinite'
                }}>
                  {/* Inner circle */}
                  <div className="story-circle">
                    <video
                      className="story-video"
                      autoPlay
                      loop
                      muted
                      playsInline
                      src={girlStories.stories[0]?.media_url}
                    />
                  </div>

                  {/* Story count badge */}
                  {girlStories.stories.length > 1 && (
                    <div style={{
                      position: 'absolute',
                      bottom: '-2px',
                      right: '-2px',
                      background: 'rgba(139, 41, 66, 0.95)',
                      color: '#fff',
                      borderRadius: '50%',
                      width: '26px',
                      height: '26px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: '600',
                      border: '2px solid #1f1f23',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                    }}>
                      {girlStories.stories.length}
                    </div>
                  )}
                </div>

                {/* Name with glow effect */}
                <div style={{
                  marginTop: '12px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  textAlign: 'center',
                  maxWidth: '100px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
                }}>
                  {girlStories.girl_name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .stories-container::-webkit-scrollbar {
          display: none;
        }

        .story-circle {
          width: 84px;
          height: 84px;
          background: #1a1a1a;
          border-radius: 50%;
        }

        .story-video {
          width: 84px;
          height: 84px;
          object-fit: cover;
          clip-path: circle(50%);
          -webkit-clip-path: circle(50%);
        }

        @media (max-width: 768px) {
          section {
            padding: 2rem 0 !important;
          }
        }
      `}</style>
    </section>
  );
}
