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
                  {/* Inner circle with glassmorphism */}
                  <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: 'rgba(31, 31, 35, 0.9)',
                    backdropFilter: 'blur(10px)',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid rgba(0, 0, 0, 0.5)',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    {/* Background: girl photo as fallback */}
                    {girlStories.girl_photo && (
                      <img
                        src={girlStories.girl_photo}
                        alt=""
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          zIndex: 1
                        }}
                      />
                    )}
                    {/* Video on top if available */}
                    {girlStories.stories[0]?.media_type === 'video' && girlStories.stories[0]?.media_url && (
                      <video
                        src={girlStories.stories[0].media_url}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        onLoadedData={(e) => {
                          const video = e.target as HTMLVideoElement;
                          video.play().catch(() => {});
                        }}
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          zIndex: 2
                        }}
                      />
                    )}
                    {/* Image on top if it's an image story */}
                    {girlStories.stories[0]?.media_type === 'image' && girlStories.stories[0]?.media_url && (
                      <img
                        src={girlStories.stories[0].media_url}
                        alt={girlStories.girl_name}
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          zIndex: 2
                        }}
                      />
                    )}
                    {/* Fallback if no photo */}
                    {!girlStories.girl_photo && !girlStories.stories[0]?.media_url && (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #8b2942 0%, #4a1525 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '24px',
                        fontWeight: '600'
                      }}>
                        {girlStories.girl_name.charAt(0)}
                      </div>
                    )}
                    {/* Play icon for videos */}
                    {girlStories.stories[0]?.media_type === 'video' && (
                      <div style={{
                        position: 'absolute',
                        zIndex: 3,
                        background: 'rgba(0,0,0,0.4)',
                        borderRadius: '50%',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    )}
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

        @media (max-width: 768px) {
          section {
            padding: 2rem 0 !important;
          }
        }
      `}</style>
    </section>
  );
}
