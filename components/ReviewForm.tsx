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
    your_email: string;
    your_email_placeholder: string;
    email_optional: string;
    rating_label: string;
    review_title: string;
    review_title_placeholder: string;
    review_content: string;
    review_content_placeholder: string;
    submit: string;
    submitting: string;
    success_message: string;
    error_message: string;
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
    author_email: '',
    rating: 0,
    title: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.author_name || !formData.rating || !formData.content) {
      setError(translations.error_message);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          girl_id: girlId,
          author_name: formData.author_name,
          author_email: formData.author_email || null,
          rating: formData.rating,
          title: formData.title || null,
          content: formData.content
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setFormData({
          author_name: '',
          author_email: '',
          rating: 0,
          title: '',
          content: ''
        });
        if (onSuccess) onSuccess();
      } else {
        setError(data.error || translations.error_message);
      }
    } catch (err) {
      console.error('Review submission error:', err);
      setError(translations.error_message);
    } finally {
      setLoading(false);
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
          Napsat další recenzi
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

      <div className="form-row">
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

        <div className="form-group">
          <label htmlFor="author_email">
            {translations.your_email}
            <span className="optional"> ({translations.email_optional})</span>
          </label>
          <input
            type="email"
            id="author_email"
            value={formData.author_email}
            onChange={(e) => setFormData({ ...formData, author_email: e.target.value })}
            placeholder={translations.your_email_placeholder}
          />
        </div>
      </div>

      <div className="form-group">
        <label>{translations.rating_label} *</label>
        <ReviewStars
          rating={formData.rating}
          size="large"
          interactive
          onChange={(rating) => setFormData({ ...formData, rating })}
        />
      </div>

      <div className="form-group">
        <label htmlFor="title">
          {translations.review_title}
          <span className="optional"> ({translations.email_optional})</span>
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
        {loading ? translations.submitting : translations.submit}
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

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
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
      `}</style>
    </form>
  );
}
