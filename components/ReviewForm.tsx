"use client";

import { useState } from 'react';
import ReviewStars from './ReviewStars';

interface ReviewFormProps {
  girlId: number;
  girlName: string;
  onSuccess?: () => void;
  translations: {
    title: string;
    subtitle: string;
    your_name: string;
    your_name_placeholder: string;
    rating_label: string;
    vibe_label: string;
    review_title: string;
    review_title_placeholder: string;
    review_content: string;
    review_content_placeholder: string;
    submit: string;
    submitting: string;
    success_message: string;
    error_message: string;
    write_another: string;
  };
}

export default function ReviewForm({
  girlId,
  girlName,
  onSuccess,
  translations
}: ReviewFormProps) {
  const [formData, setFormData] = useState({
    author_name: '',
    rating: 0,
    title: '',
    content: '',
    vibe: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Vibe options with emojis
  const vibes = [
    { id: 'amazing', emoji: '🤩', label: 'Úžasné', color: '#10b981' },
    { id: 'great', emoji: '😊', label: 'Skvělé', color: '#3b82f6' },
    { id: 'good', emoji: '🙂', label: 'Dobré', color: '#8b5cf6' },
    { id: 'okay', emoji: '😐', label: 'Ujde', color: '#f59e0b' },
    { id: 'meh', emoji: '😕', label: 'Slabé', color: '#ef4444' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.author_name || !formData.rating || !formData.content) {
      setError(translations.error_message);
      return;
    }

    setLoading(true);
    setLoadingProgress(0);

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 200);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          girl_id: girlId,
          author_name: formData.author_name,
          rating: formData.rating,
          title: formData.title || `${formData.vibe ? vibes.find(v => v.id === formData.vibe)?.label + ' zážitek' : ''}`,
          content: formData.content
        })
      });

      setLoadingProgress(100);
      const data = await response.json();

      if (data.success) {
        setTimeout(() => {
          setSuccess(true);
          setFormData({
            author_name: '',
            rating: 0,
            title: '',
            content: '',
            vibe: ''
          });
          if (onSuccess) onSuccess();
        }, 300);
      } else {
        setError(data.error || translations.error_message);
      }
    } catch (err) {
      console.error('Review submission error:', err);
      setError(translations.error_message);
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setLoading(false);
        setLoadingProgress(0);
      }, 500);
    }
  };

  if (success) {
    return (
      <div className="review-form-success">
        <div className="success-icon">✓</div>
        <div className="success-title">{translations.success_message}</div>
        <p className="success-text">
          Vaše recenze čeká na schválení administrátorem. Děkujeme!
        </p>
        <button
          className="btn"
          onClick={() => setSuccess(false)}
        >
          {translations.write_another}
        </button>

        <style jsx>{`
          .review-form-success {
            text-align: center;
            padding: 3rem 1.5rem;
            background: rgba(34, 197, 94, 0.1);
            border: 1px solid rgba(34, 197, 94, 0.3);
            border-radius: 12px;
          }

          .success-icon {
            width: 60px;
            height: 60px;
            margin: 0 auto 1rem;
            background: rgba(34, 197, 94, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            color: var(--green);
          }

          .success-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--white);
            margin-bottom: 0.5rem;
          }

          .success-text {
            color: var(--gray);
            margin-bottom: 1.5rem;
          }

          .btn {
            background: rgba(255, 255, 255, 0.1);
            color: var(--white);
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
          }

          .btn:hover {
            background: rgba(255, 255, 255, 0.15);
          }
        `}</style>
      </div>
    );
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h3 className="form-title">{translations.title}</h3>
        <p className="form-subtitle">{translations.subtitle.replace('{name}', girlName)}</p>
      </div>

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="author_name">{translations.your_name} *</label>
        <input
          type="text"
          id="author_name"
          value={formData.author_name}
          onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
          placeholder={translations.your_name_placeholder}
          required
        />
      </div>

      {/* RATING & VIBE IN ONE ROW */}
      <div className="rating-vibe-section">
        <div className="rating-group">
          <label>{translations.rating_label} *</label>
          <ReviewStars
            rating={formData.rating}
            size="large"
            interactive
            onChange={(rating) => setFormData({ ...formData, rating })}
          />
        </div>

        <div className="vibe-group">
          <label>{translations.vibe_label} ✨</label>
          <div className="vibe-picker">
          {vibes.map((vibe) => (
            <button
              key={vibe.id}
              type="button"
              className={`vibe-option ${formData.vibe === vibe.id ? 'active' : ''}`}
              style={{
                borderColor: formData.vibe === vibe.id ? vibe.color : 'rgba(255, 255, 255, 0.1)',
                background: formData.vibe === vibe.id ? `${vibe.color}20` : 'rgba(255, 255, 255, 0.03)'
              }}
              onClick={() => setFormData({ ...formData, vibe: vibe.id })}
            >
              <span className="vibe-emoji">{vibe.emoji}</span>
              <span className="vibe-label" style={{ color: formData.vibe === vibe.id ? vibe.color : '#9ca3af' }}>
                {vibe.label}
              </span>
            </button>
          ))}
          </div>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="title">
          {translations.review_title}
          <span className="optional"> (nepovinné)</span>
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder={translations.review_title_placeholder}
        />
      </div>

      <div className="form-group">
        <label htmlFor="content">{translations.review_content} *</label>
        <textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder={translations.review_content_placeholder}
          rows={6}
          required
        />
      </div>

      <button
        type="submit"
        className="submit-btn"
        disabled={loading}
      >
        {loading ? (
          <>
            <span>{translations.submitting}</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${loadingProgress}%` }}></div>
            </div>
            <span className="progress-percent">{loadingProgress}%</span>
          </>
        ) : (
          translations.submit
        )}
      </button>

      <style jsx>{`
        .review-form {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 2rem;
        }

        .form-header {
          margin-bottom: 2rem;
        }

        .form-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--white);
          margin-bottom: 0.5rem;
        }

        .form-subtitle {
          color: var(--gray);
          font-size: 0.95rem;
        }

        .form-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }

        .rating-vibe-section {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 2rem;
          margin-bottom: 1.5rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
        }

        @media (max-width: 768px) {
          .rating-vibe-section {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }

        .rating-group,
        .vibe-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          font-size: 0.9rem;
          color: var(--gray);
          margin-bottom: 0.5rem;
        }

        .optional {
          color: #666;
          font-size: 0.85rem;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          color: var(--white);
          font-size: 0.95rem;
          transition: all 0.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--accent);
          background: rgba(255, 255, 255, 0.08);
        }

        .form-group textarea {
          resize: vertical;
          font-family: inherit;
          line-height: 1.6;
        }

        .submit-btn {
          width: 100%;
          background: var(--wine);
          color: white;
          border: none;
          padding: 1rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }

        .submit-btn:hover:not(:disabled) {
          background: #9a2942;
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .vibe-picker {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .vibe-picker {
            justify-content: space-between;
          }
        }

        .vibe-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.03);
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          flex: 1;
          min-width: fit-content;
        }

        @media (max-width: 768px) {
          .vibe-option {
            flex: 1 1 calc(50% - 0.25rem);
          }
        }

        .vibe-option:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .vibe-option.active {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25),
                      0 0 0 1px rgba(255, 255, 255, 0.1) inset;
        }

        .vibe-emoji {
          font-size: 1.5rem;
          line-height: 1;
        }

        .vibe-label {
          font-size: 0.9rem;
          font-weight: 600;
          transition: color 0.3s;
          white-space: nowrap;
        }

        .progress-bar {
          position: relative;
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          margin: 0.5rem 0;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--wine), #c41e3a);
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        .progress-percent {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
        }

        .submit-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }
      `}</style>
    </form>
  );
}
