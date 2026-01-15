"use client";

import { useState } from 'react';
import ReviewStars from './ReviewStars';
import { VIBE_OPTIONS, TAG_OPTIONS, type VibeId, type TagId } from '@/lib/review-constants';

interface ReviewFormProps {
  girlId: number;
  girlName: string;
  onSuccess?: () => void;
  locale?: 'cs' | 'en' | 'de' | 'uk';
  translations: {
    title: string;
    subtitle: string;
    your_name: string;
    your_name_placeholder: string;
    rating_label: string;
    vibe_label: string;
    tags_label?: string;
    tags_max_info?: string;
    review_title: string;
    review_title_placeholder: string;
    review_content: string;
    review_content_placeholder: string;
    submit: string;
    submitting: string;
    success_message: string;
    approval_pending: string;
    optional: string;
    error_message: string;
    write_another: string;
  };
}

export default function ReviewForm({
  girlId,
  girlName,
  onSuccess,
  locale = 'cs',
  translations
}: ReviewFormProps) {
  const [formData, setFormData] = useState({
    author_name: '',
    rating: 0,
    title: '',
    content: '',
    vibe: '' as VibeId | '',
    tags: [] as TagId[]
  });
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Helper to toggle tag selection (max 4)
  const toggleTag = (tagId: TagId) => {
    setFormData(prev => {
      const currentTags = prev.tags;
      if (currentTags.includes(tagId)) {
        return { ...prev, tags: currentTags.filter(t => t !== tagId) };
      } else if (currentTags.length < 4) {
        return { ...prev, tags: [...currentTags, tagId] };
      }
      return prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Prevent duplicate submissions
    if (loading) return;

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
          rating: formData.rating || 5, // Default to 5 if not provided
          title: formData.title,
          content: formData.content,
          vibe: formData.vibe || null,
          tags: formData.tags
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
            vibe: '' as VibeId | '',
            tags: []
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
        {/* Confetti Animation */}
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${50 + (Math.random() - 0.5) * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                background: ['#ff6b6b', '#ffd93d', '#6bcf7f', '#4d96ff', '#b185db', '#ff85a1'][Math.floor(Math.random() * 6)]
              }}
            />
          ))}
        </div>

        <div className="success-animation">
          <svg viewBox="0 0 52 52" className="checkmark">
            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
            <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>
        <h3 className="success-title">{translations.success_message}</h3>
        <p className="success-text">{translations.approval_pending}</p>
        <button
          className="btn-secondary"
          onClick={() => setSuccess(false)}
        >
          {translations.write_another}
        </button>

        <style jsx>{`
          .review-form-success {
            text-align: center;
            padding: 4rem 2rem;
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 100%);
            border: 1px solid rgba(34, 197, 94, 0.3);
            border-radius: 24px;
            backdrop-filter: blur(12px);
          }

          .success-animation {
            margin: 0 auto 2rem;
          }

          .checkmark {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: block;
            stroke-width: 3;
            stroke: #22c55e;
            stroke-miterlimit: 10;
            margin: 0 auto;
            animation: fill 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both;
          }

          .checkmark-circle {
            stroke-dasharray: 166;
            stroke-dashoffset: 166;
            stroke-width: 3;
            stroke-miterlimit: 10;
            stroke: #22c55e;
            fill: rgba(34, 197, 94, 0.1);
            animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
          }

          .checkmark-check {
            transform-origin: 50% 50%;
            stroke-dasharray: 48;
            stroke-dashoffset: 48;
            animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
          }

          @keyframes stroke {
            100% {
              stroke-dashoffset: 0;
            }
          }

          @keyframes scale {
            0%, 100% {
              transform: none;
            }
            50% {
              transform: scale3d(1.1, 1.1, 1);
            }
          }

          @keyframes fill {
            100% {
              box-shadow: inset 0px 0px 0px 30px rgba(34, 197, 94, 0.2);
            }
          }

          .success-title {
            font-size: 1.75rem;
            font-weight: 700;
            color: var(--white);
            margin-bottom: 0.75rem;
            letter-spacing: -0.02em;
          }

          .success-text {
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 2rem;
            font-size: 1rem;
            line-height: 1.6;
          }

          .btn-secondary {
            background: rgba(255, 255, 255, 0.08);
            color: var(--white);
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 0.875rem 2rem;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s;
            font-weight: 600;
            font-size: 0.95rem;
          }

          .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.12);
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          }
        `}</style>
      </div>
    );
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      {/* Header */}
      <div className="form-header">
        <div className="header-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </div>
        <h3 className="form-title">{translations.title}</h3>
        <p className="form-subtitle">{translations.subtitle.replace('{name}', girlName)}</p>
      </div>

      {error && (
        <div className="form-error">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Name Input */}
      <div className="form-group">
        <label htmlFor="author_name">
          {translations.your_name}
          <span className="required">*</span>
        </label>
        <input
          type="text"
          id="author_name"
          value={formData.author_name}
          onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
          placeholder={translations.your_name_placeholder}
          required
          className="form-input"
        />
      </div>

      {/* Rating & Vibe Section */}
      <div className="rating-vibe-section">
        <div className="rating-group">
          <label>
            {translations.rating_label}
            <span className="required">*</span>
          </label>
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
          {Object.entries(VIBE_OPTIONS).map(([key, vibe]) => {
            const vibeId = key as VibeId;
            const label = vibe[`label_${locale}`] || vibe.label_cs;
            const isSelected = formData.vibe === vibeId;

            return (
              <button
                key={vibeId}
                type="button"
                className={`vibe-option ${isSelected ? 'active' : ''}`}
                style={{
                  borderColor: isSelected ? vibe.color : 'rgba(255, 255, 255, 0.12)',
                  background: isSelected
                    ? `linear-gradient(135deg, ${vibe.color}20, ${vibe.color}08)`
                    : 'rgba(255, 255, 255, 0.04)'
                }}
                onClick={() => setFormData({ ...formData, vibe: vibeId })}
              >
                <span className="vibe-emoji">{vibe.emoji}</span>
                <span className="vibe-label" style={{ color: isSelected ? vibe.color : 'rgba(255, 255, 255, 0.6)' }}>
                  {label}
                </span>
              </button>
            );
          })}
          </div>
        </div>
      </div>

      {/* Tag Selector */}
      <div className="form-group">
        <label>
          {translations.tags_label || 'Tagy'}
          <span className="tag-count">({formData.tags.length}/4)</span>
        </label>
        <div className="tag-picker">
          {Object.entries(TAG_OPTIONS).map(([key, tag]) => {
            const tagId = key as TagId;
            const label = tag[`label_${locale}`] || tag.label_cs;
            const isSelected = formData.tags.includes(tagId);
            const isDisabled = !isSelected && formData.tags.length >= 4;

            return (
              <button
                key={tagId}
                type="button"
                className={`tag-option ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                onClick={() => !isDisabled && toggleTag(tagId)}
                disabled={isDisabled}
              >
                <span className="tag-emoji">{tag.emoji}</span>
                <span className="tag-label">{label}</span>
                {isSelected && (
                  <svg className="tag-check" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                )}
              </button>
            );
          })}
        </div>
        {translations.tags_max_info && (
          <p className="helper-text">{translations.tags_max_info}</p>
        )}
      </div>

      {/* Title Input (Optional) */}
      <div className="form-group">
        <label htmlFor="title">
          {translations.review_title}
          <span className="optional">({translations.optional})</span>
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder={translations.review_title_placeholder}
          className="form-input"
        />
      </div>

      {/* Content Textarea */}
      <div className="form-group">
        <label htmlFor="content">
          {translations.review_content}
          <span className="required">*</span>
        </label>
        <textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder={translations.review_content_placeholder}
          rows={6}
          required
          className="form-textarea"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="submit-btn"
        disabled={loading}
      >
        {loading ? (
          <div className="loading-content">
            <div className="spinner"></div>
            <span>{translations.submitting}</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${loadingProgress}%` }}></div>
            </div>
          </div>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <path d="M22 2L11 13"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z"/>
            </svg>
            <span>{translations.submit}</span>
          </>
        )}
      </button>

      <style jsx>{`
        .review-form {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 2.5rem;
          backdrop-filter: blur(12px);
        }

        .form-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .header-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 1.25rem;
          background: linear-gradient(135deg, rgba(139, 41, 66, 0.2), rgba(92, 28, 46, 0.1));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-icon svg {
          width: 28px;
          height: 28px;
          color: var(--wine);
        }

        .form-title {
          font-size: 1.875rem;
          font-weight: 700;
          color: var(--white);
          margin-bottom: 0.75rem;
          letter-spacing: -0.02em;
        }

        .form-subtitle {
          color: rgba(255, 255, 255, 0.6);
          font-size: 1rem;
          line-height: 1.6;
        }

        .form-error {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ff6b6b;
          padding: 1rem 1.25rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }

        .rating-vibe-section {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
        }

        .rating-group,
        .vibe-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-group {
          margin-bottom: 1.75rem;
        }

        .form-group label {
          display: block;
          font-size: 0.95rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 0.75rem;
        }

        .required {
          color: #ff6b6b;
          margin-left: 0.25rem;
        }

        .optional {
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.875rem;
          font-weight: 400;
          margin-left: 0.5rem;
        }

        .tag-count {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.875rem;
          font-weight: 500;
          margin-left: 0.5rem;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          padding: 0.875rem 1.125rem;
          color: var(--white);
          font-size: 0.95rem;
          transition: all 0.3s;
          font-family: inherit;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: var(--wine);
          background: rgba(255, 255, 255, 0.09);
          box-shadow: 0 0 0 4px rgba(139, 41, 66, 0.1);
        }

        .form-textarea {
          resize: vertical;
          line-height: 1.7;
          min-height: 140px;
        }

        .helper-text {
          margin-top: 0.625rem;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .vibe-picker {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 0.75rem;
        }

        .vibe-option {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.625rem;
          padding: 1rem;
          border: 2px solid;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .vibe-option:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        .vibe-option.active {
          transform: scale(1.05);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .vibe-emoji {
          font-size: 1.5rem;
          line-height: 1;
        }

        .vibe-label {
          font-size: 0.9rem;
          font-weight: 700;
          transition: color 0.3s;
        }

        .tag-picker {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 0.75rem;
        }

        .tag-option {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.875rem 1rem;
          border: 2px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.04);
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
        }

        .tag-option:hover:not(.disabled) {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.07);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .tag-option.selected {
          background: rgba(139, 41, 66, 0.2);
          border-color: var(--wine);
          box-shadow: 0 4px 16px rgba(139, 41, 66, 0.2);
        }

        .tag-option.disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .tag-emoji {
          font-size: 1.25rem;
          line-height: 1;
        }

        .tag-label {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--white);
          flex: 1;
        }

        .tag-check {
          color: var(--wine);
        }

        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, var(--wine) 0%, #9a2942 100%);
          color: white;
          border: none;
          padding: 1.125rem 1.5rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          box-shadow: 0 4px 16px rgba(139, 41, 66, 0.3);
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(139, 41, 66, 0.5);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .loading-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
        }

        .spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .progress-bar {
          position: relative;
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 100px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, white, rgba(255, 255, 255, 0.8));
          border-radius: 100px;
          transition: width 0.3s ease;
        }

        @media (max-width: 768px) {
          .review-form {
            padding: 2rem;
            border-radius: 20px;
          }

          .form-header {
            margin-bottom: 2rem;
          }

          .form-title {
            font-size: 1.5rem;
          }

          .rating-vibe-section {
            padding: 1.5rem;
            gap: 1.5rem;
          }

          .vibe-picker {
            grid-template-columns: repeat(2, 1fr);
          }

          .tag-picker {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .review-form {
            padding: 1.5rem;
          }

          .header-icon {
            width: 56px;
            height: 56px;
          }

          .vibe-picker {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </form>
  );
}
