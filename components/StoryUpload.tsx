"use client";

import { useState, useEffect } from 'react';

export default function StoryUpload() {
  const [stories, setStories] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load stories
  const loadStories = async () => {
    try {
      const response = await fetch('/api/girl/stories');
      const data = await response.json();
      if (data.success) {
        setStories(data.stories);
      }
    } catch (error) {
      console.error('Error loading stories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStories();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const duration = (document.getElementById('story-duration-girl') as HTMLInputElement)?.value || '5';
    const expiresIn = (document.getElementById('story-expires-girl') as HTMLInputElement)?.value || '24';

    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('duration', duration);
      formData.append('expiresIn', expiresIn);

      try {
        const response = await fetch('/api/girl/stories', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          await loadStories();
        } else {
          const data = await response.json();
          alert(`Chyba při nahrávání ${file.name}: ${data.error || 'Neznámá chyba'}`);
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert(`Chyba při nahrávání ${file.name}`);
      }
    }
    setUploading(false);
    e.target.value = '';
  };

  const handleDelete = async (storyId: number) => {
    if (!confirm('Smazat tuto story?')) return;

    try {
      const response = await fetch(`/api/girl/stories?storyId=${storyId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadStories();
      } else {
        alert('Chyba při mazání story');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Chyba při mazání story');
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Načítání...</div>;
  }

  return (
    <div style={{
      background: 'var(--dark-bg)',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '2rem'
    }}>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '600',
        marginBottom: '1.5rem',
        color: 'var(--white)'
      }}>
        Moje Stories
      </h2>

      {/* Upload Section */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          marginBottom: '1rem',
          flexWrap: 'wrap'
        }}>
          <label style={{ color: 'var(--white)', fontSize: '0.875rem' }}>
            Doba zobrazení (sekundy):
            <input
              type="number"
              id="story-duration-girl"
              defaultValue="5"
              min="3"
              max="15"
              style={{
                marginLeft: '0.5rem',
                padding: '0.5rem',
                borderRadius: '8px',
                border: '1px solid var(--gray)',
                background: 'var(--card-bg)',
                color: 'var(--white)',
                width: '80px'
              }}
            />
          </label>
          <label style={{ color: 'var(--white)', fontSize: '0.875rem' }}>
            Vyprší za (hodin):
            <input
              type="number"
              id="story-expires-girl"
              defaultValue="24"
              min="1"
              max="168"
              style={{
                marginLeft: '0.5rem',
                padding: '0.5rem',
                borderRadius: '8px',
                border: '1px solid var(--gray)',
                background: 'var(--card-bg)',
                color: 'var(--white)',
                width: '80px'
              }}
            />
          </label>
        </div>

        <label style={{
          display: 'inline-block',
          padding: '0.75rem 1.5rem',
          background: 'var(--wine)',
          color: 'white',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '500',
          transition: 'all 0.2s'
        }}>
          📸 Nahrát Story
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleUpload}
            style={{ display: 'none' }}
          />
        </label>

        {uploading && (
          <p style={{ color: 'var(--gray)', marginTop: '1rem' }}>
            Nahrávání...
          </p>
        )}
      </div>

      {/* Stories Grid */}
      {stories.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '1rem'
        }}>
          {stories.map((story) => (
            <div key={story.id} style={{ position: 'relative' }}>
              {story.media_type === 'image' ? (
                <img
                  src={story.media_url}
                  alt=""
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    border: '2px solid var(--wine)'
                  }}
                />
              ) : (
                <video
                  src={story.media_url}
                  controls
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    background: '#000',
                    border: '2px solid var(--wine)'
                  }}
                />
              )}
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                background: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '6px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>
                {story.duration}s
              </div>
              {story.expires_at && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'rgba(234, 179, 8, 0.95)',
                  color: 'white',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  ⏱ {new Date(story.expires_at).toLocaleString('cs-CZ', {
                    day: 'numeric',
                    month: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              )}
              <button
                onClick={() => handleDelete(story.id)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(239, 68, 68, 0.95)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p style={{
          color: 'var(--gray)',
          textAlign: 'center',
          padding: '3rem',
          fontSize: '1rem'
        }}>
          Zatím žádné stories. Nahraj svoji první story! 📸
        </p>
      )}
    </div>
  );
}
