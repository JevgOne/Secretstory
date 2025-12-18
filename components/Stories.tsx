"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

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
  stories: Story[];
}

export default function Stories() {
  const [storiesData, setStoriesData] = useState<GirlStories[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();

  useEffect(() => {
    async function fetchStories() {
      try {
        const response = await fetch('/api/stories');
        const data = await response.json();
        if (data.success) {
          setStoriesData(data.stories);
        }
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStories();

    // Auto-refresh every 10 minutes
    const interval = setInterval(fetchStories, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <section style={{ padding: '4rem 0', background: 'rgba(0, 0, 0, 0.2)' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', color: '#9ca3af' }}>Načítání stories...</div>
        </div>
      </section>
    );
  }

  if (storiesData.length === 0) {
    return null;
  }

  return (
    <section style={{
      padding: '3rem 0',
      background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(139, 41, 66, 0.05) 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Ambient glow effect */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
        filter: 'blur(60px)'
      }} />

      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '600',
            color: '#fff',
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #fff 0%, #d4af37 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            ✨ Stories
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem' }}>Nové momenty našich modelek</p>
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
                  background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%)',
                  backgroundSize: '200% 200%',
                  position: 'relative',
                  boxShadow: '0 8px 32px rgba(212, 175, 55, 0.3)',
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
                    border: '2px solid rgba(0, 0, 0, 0.5)'
                  }}>
                    <img
                      src={girlStories.stories[0]?.thumbnail_url || girlStories.stories[0]?.media_url}
                      alt={girlStories.girl_name}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>

                  {/* Story count badge */}
                  {girlStories.stories.length > 1 && (
                    <div style={{
                      position: 'absolute',
                      bottom: '-2px',
                      right: '-2px',
                      background: 'linear-gradient(135deg, #d4af37, #f4d03f)',
                      color: '#1f1f23',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '700',
                      border: '3px solid #1f1f23',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                    }}>
                      {girlStories.stories.length}
                    </div>
                  )}

                  {/* New indicator */}
                  <div style={{
                    position: 'absolute',
                    top: '-8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #f4d03f, #d4af37)',
                    color: '#1f1f23',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    boxShadow: '0 2px 8px rgba(212, 175, 55, 0.4)'
                  }}>
                    NEW
                  </div>
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
