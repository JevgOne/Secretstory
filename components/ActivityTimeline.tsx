"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

interface Activity {
  id: number;
  girl_id: number;
  girl_name: string;
  girl_slug: string;
  activity_type: 'photo_added' | 'video_added' | 'story_added' | 'service_changed';
  title: string;
  description: string;
  media_url?: string;
  created_at: string;
}

const activityIcons = {
  photo_added: '📷',
  video_added: '🎥',
  story_added: '✨',
  service_changed: '🔄'
};

const activityColors = {
  photo_added: '#d4af37',
  video_added: '#c41e3a',
  story_added: '#f4d03f',
  service_changed: '#10b981'
};

export default function ActivityTimeline() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();

  useEffect(() => {
    async function fetchActivities() {
      try {
        const response = await fetch('/api/activity-log?limit=8');
        const data = await response.json();
        if (data.success) {
          setActivities(data.activities);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchActivities();
  }, []);

  if (loading) {
    return (
      <section style={{ padding: '4rem 0' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', color: '#9ca3af' }}>Načítání...</div>
        </div>
      </section>
    );
  }

  if (activities.length === 0) {
    return null;
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `před ${diffDays} ${diffDays === 1 ? 'dnem' : 'dny'}`;
    if (diffHours > 0) return `před ${diffHours} ${diffHours === 1 ? 'hodinou' : 'hodinami'}`;
    if (diffMins > 0) return `před ${diffMins} ${diffMins === 1 ? 'minutou' : 'minutami'}`;
    return 'právě teď';
  };

  return (
    <section style={{ padding: '4rem 0', background: 'rgba(139, 41, 66, 0.03)' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="section-title">Nejnovější aktivity</h2>
          <p className="section-subtitle">Co se děje u našich modelek</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {activities.map((activity) => (
            <Link
              key={activity.id}
              href={`/${locale}/profily/${activity.girl_slug}`}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                height: '100%'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.borderColor = activityColors[activity.activity_type];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: `${activityColors[activity.activity_type]}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    flexShrink: 0
                  }}>
                    {activityIcons[activity.activity_type]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      color: '#fff',
                      fontWeight: '600',
                      fontSize: '15px',
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {activity.girl_name}
                    </div>
                    <div style={{
                      color: '#9ca3af',
                      fontSize: '14px',
                      marginBottom: '8px',
                      lineHeight: '1.4'
                    }}>
                      {activity.description}
                    </div>
                    <div style={{
                      color: activityColors[activity.activity_type],
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {getTimeAgo(activity.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          section {
            padding: 2rem 0 !important;
          }
        }
      `}</style>
    </section>
  );
}
