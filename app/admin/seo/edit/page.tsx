"use client";

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AdminHeader from '@/components/AdminHeader';
import { calculateSEOScore, SEOMetadata } from '@/lib/seo';

function EditSEOForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pagePath = searchParams.get('path') || '';

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState<Partial<SEOMetadata>>({
    page_path: pagePath,
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    focus_keyword: '',
    og_title: '',
    og_description: '',
    og_image: '',
    og_type: 'website',
    twitter_card: 'summary_large_image',
    twitter_title: '',
    twitter_description: '',
    twitter_image: '',
    canonical_url: '',
    robots_index: 1,
    robots_follow: 1,
  });

  // Load existing SEO data
  useEffect(() => {
    async function loadSEOData() {
      if (!pagePath) {
        setLoadingData(false);
        return;
      }

      try {
        const response = await fetch(`/api/seo?page_path=${encodeURIComponent(pagePath)}`);
        const data = await response.json();

        if (data.success && data.metadata) {
          setFormData({
            ...data.metadata,
            robots_index: data.metadata.robots_index ?? 1,
            robots_follow: data.metadata.robots_follow ?? 1,
          });
        }
      } catch (err) {
        console.error('Error loading SEO data:', err);
        setError('Chyba při načítání SEO dat');
      } finally {
        setLoadingData(false);
      }
    }

    loadSEOData();
  }, [pagePath]);

  // Calculate SEO score in real-time
  const seoScore = useMemo(() => calculateSEOScore(formData), [formData]);

  // Character count helpers
  const metaTitleLength = formData.meta_title?.length || 0;
  const metaDescLength = formData.meta_description?.length || 0;

  // SEO checks
  const seoChecks = useMemo(() => {
    const checks = [
      {
        label: 'Meta title present (50-60 chars optimal)',
        passed: metaTitleLength >= 30 && metaTitleLength <= 70,
        optimal: metaTitleLength >= 50 && metaTitleLength <= 60,
      },
      {
        label: 'Meta description present (150-160 chars optimal)',
        passed: metaDescLength >= 100 && metaDescLength <= 180,
        optimal: metaDescLength >= 150 && metaDescLength <= 160,
      },
      {
        label: 'Focus keyword in title',
        passed: !!(
          formData.focus_keyword &&
          formData.meta_title &&
          formData.meta_title.toLowerCase().includes(formData.focus_keyword.toLowerCase())
        ),
      },
      {
        label: 'Focus keyword in description',
        passed: !!(
          formData.focus_keyword &&
          formData.meta_description &&
          formData.meta_description.toLowerCase().includes(formData.focus_keyword.toLowerCase())
        ),
      },
      {
        label: 'OG image set',
        passed: !!formData.og_image,
      },
      {
        label: 'Meta keywords set',
        passed: !!formData.meta_keywords,
      },
    ];

    return checks;
  }, [formData, metaTitleLength, metaDescLength]);

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // green
    if (score >= 50) return '#f59e0b'; // orange
    return '#ef4444'; // red
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!pagePath) {
      setError('Page path is required');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          page_path: pagePath,
          seo_score: seoScore,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('SEO metadata saved successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Error saving SEO metadata');
      }
    } catch (err) {
      console.error('Error saving SEO data:', err);
      setError('Error saving SEO metadata');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <>
        <AdminHeader title="Edit SEO" showBack={false} />
        <div className="admin-container">
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gray)' }}>
            Loading...
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Edit SEO" showBack={false} />
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">SEO Editor</h1>
            <p className="admin-subtitle">Edit SEO metadata for: <strong>{pagePath}</strong></p>
          </div>
          <Link href="/admin/seo" className="btn btn-secondary">
            ← Back to SEO Manager
          </Link>
        </div>

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        {success && (
          <div className="success-banner">
            {success}
          </div>
        )}

        <div className="editor-layout">
          {/* Left Column - Form */}
          <form onSubmit={handleSubmit} className="seo-form">
            {/* General SEO */}
            <div className="form-section">
              <h2 className="section-title">General SEO</h2>

              <div className="form-group">
                <label>Meta Title *</label>
                <input
                  type="text"
                  value={formData.meta_title || ''}
                  onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                  placeholder="e.g., Premium Escort Services in Prague | LovelyGirls"
                />
                <div className="char-count" style={{
                  color: metaTitleLength > 60 || metaTitleLength < 30 && metaTitleLength > 0 ? '#f59e0b' : '#10b981'
                }}>
                  {metaTitleLength}/60 characters
                  {metaTitleLength > 60 && ' (too long)'}
                  {metaTitleLength < 30 && metaTitleLength > 0 && ' (too short)'}
                </div>
              </div>

              <div className="form-group">
                <label>Meta Description *</label>
                <textarea
                  value={formData.meta_description || ''}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  rows={4}
                  placeholder="e.g., Discover premium escort services in Prague with verified profiles, competitive rates, and discreet booking."
                />
                <div className="char-count" style={{
                  color: metaDescLength > 160 || metaDescLength < 100 && metaDescLength > 0 ? '#f59e0b' : '#10b981'
                }}>
                  {metaDescLength}/160 characters
                  {metaDescLength > 160 && ' (too long)'}
                  {metaDescLength < 100 && metaDescLength > 0 && ' (too short)'}
                </div>
              </div>

              <div className="form-group">
                <label>Meta Keywords</label>
                <input
                  type="text"
                  value={formData.meta_keywords || ''}
                  onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                  placeholder="escort prague, premium escorts, vip girls"
                />
                <small>Comma-separated keywords</small>
              </div>

              <div className="form-group">
                <label>Focus Keyword</label>
                <input
                  type="text"
                  value={formData.focus_keyword || ''}
                  onChange={(e) => setFormData({ ...formData, focus_keyword: e.target.value })}
                  placeholder="e.g., escort prague"
                />
                <small>Main keyword to optimize for</small>
              </div>
            </div>

            {/* Open Graph */}
            <div className="form-section">
              <h2 className="section-title">Open Graph (Social Media)</h2>

              <div className="form-group">
                <label>OG Title</label>
                <input
                  type="text"
                  value={formData.og_title || ''}
                  onChange={(e) => setFormData({ ...formData, og_title: e.target.value })}
                  placeholder="Fallback to Meta Title if empty"
                />
                <small>Title for social media shares</small>
              </div>

              <div className="form-group">
                <label>OG Description</label>
                <textarea
                  value={formData.og_description || ''}
                  onChange={(e) => setFormData({ ...formData, og_description: e.target.value })}
                  rows={3}
                  placeholder="Fallback to Meta Description if empty"
                />
                <small>Description for social media shares</small>
              </div>

              <div className="form-group">
                <label>OG Image URL</label>
                <input
                  type="url"
                  value={formData.og_image || ''}
                  onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
                  placeholder="https://lovelygirls.cz/og-image.jpg"
                />
                <small>Recommended: 1200x630px</small>
              </div>

              <div className="form-group">
                <label>OG Type</label>
                <select
                  value={formData.og_type || 'website'}
                  onChange={(e) => setFormData({ ...formData, og_type: e.target.value })}
                >
                  <option value="website">Website</option>
                  <option value="article">Article</option>
                  <option value="profile">Profile</option>
                </select>
              </div>
            </div>

            {/* Twitter Card */}
            <div className="form-section">
              <h2 className="section-title">Twitter Card</h2>

              <div className="form-group">
                <label>Twitter Card Type</label>
                <select
                  value={formData.twitter_card || 'summary_large_image'}
                  onChange={(e) => setFormData({ ...formData, twitter_card: e.target.value })}
                >
                  <option value="summary_large_image">Summary Large Image</option>
                  <option value="summary">Summary</option>
                </select>
              </div>

              <div className="form-group">
                <label>Twitter Title</label>
                <input
                  type="text"
                  value={formData.twitter_title || ''}
                  onChange={(e) => setFormData({ ...formData, twitter_title: e.target.value })}
                  placeholder="Fallback to OG Title if empty"
                />
                <small>Title for Twitter shares</small>
              </div>

              <div className="form-group">
                <label>Twitter Description</label>
                <textarea
                  value={formData.twitter_description || ''}
                  onChange={(e) => setFormData({ ...formData, twitter_description: e.target.value })}
                  rows={3}
                  placeholder="Fallback to OG Description if empty"
                />
                <small>Description for Twitter shares</small>
              </div>

              <div className="form-group">
                <label>Twitter Image URL</label>
                <input
                  type="url"
                  value={formData.twitter_image || ''}
                  onChange={(e) => setFormData({ ...formData, twitter_image: e.target.value })}
                  placeholder="Fallback to OG Image if empty"
                />
                <small>Image for Twitter shares</small>
              </div>
            </div>

            {/* Advanced */}
            <div className="form-section">
              <h2 className="section-title">Advanced</h2>

              <div className="form-group">
                <label>Canonical URL</label>
                <input
                  type="url"
                  value={formData.canonical_url || ''}
                  onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
                  placeholder="https://lovelygirls.cz/cs/divky"
                />
                <small>Preferred URL for this page</small>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.robots_index === 1}
                    onChange={(e) => setFormData({ ...formData, robots_index: e.target.checked ? 1 : 0 })}
                  />
                  <span>Robots Index</span>
                </label>
                <small>Allow search engines to index this page</small>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.robots_follow === 1}
                    onChange={(e) => setFormData({ ...formData, robots_follow: e.target.checked ? 1 : 0 })}
                  />
                  <span>Robots Follow</span>
                </label>
                <small>Allow search engines to follow links on this page</small>
              </div>
            </div>

            <div className="form-actions">
              <Link href="/admin/seo" className="btn btn-secondary">
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save SEO Metadata'}
              </button>
            </div>
          </form>

          {/* Right Column - Preview & Score */}
          <div className="sidebar">
            {/* SEO Score */}
            <div className="score-panel">
              <h3>SEO Score</h3>
              <div className="score-circle" style={{ borderColor: getScoreColor(seoScore) }}>
                <span className="score-value" style={{ color: getScoreColor(seoScore) }}>
                  {seoScore}
                </span>
                <span className="score-max">/100</span>
              </div>

              <div className="score-checks">
                {seoChecks.map((check, idx) => (
                  <div key={idx} className="check-item">
                    <span className={`check-icon ${check.passed ? 'passed' : 'failed'}`}>
                      {check.passed ? '✓' : '✗'}
                    </span>
                    <span className="check-label">
                      {check.label}
                      {'optimal' in check && check.optimal && (
                        <span className="optimal-badge">Optimal!</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Google Preview */}
            <div className="preview-panel">
              <h3>Google Search Preview</h3>
              <div className="google-preview">
                <div className="preview-url">
                  lovelygirls.cz › {pagePath.replace(/^\//, '').replace(/\//g, ' › ')}
                </div>
                <div className="preview-title">
                  {formData.meta_title || 'Your Meta Title Here'}
                </div>
                <div className="preview-description">
                  {formData.meta_description || 'Your meta description will appear here. It should be compelling and between 150-160 characters for optimal display.'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .admin-container {
            padding: 2rem;
            max-width: 1400px;
            margin: 0 auto;
          }

          .admin-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 2rem;
          }

          .admin-title {
            font-size: 2rem;
            font-weight: 700;
            color: var(--white);
            margin-bottom: 0.5rem;
          }

          .admin-subtitle {
            color: var(--gray);
          }

          .admin-subtitle strong {
            color: #d4af37;
          }

          .btn {
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 500;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.3s;
            border: none;
            display: inline-block;
          }

          .btn-primary {
            background: var(--wine);
            color: white;
          }

          .btn-primary:hover:not(:disabled) {
            background: #9a2942;
          }

          .btn-primary:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            color: var(--white);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }

          .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.15);
          }

          .error-banner {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #ef4444;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 2rem;
          }

          .success-banner {
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.3);
            color: #10b981;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 2rem;
          }

          .editor-layout {
            display: grid;
            grid-template-columns: 1fr 380px;
            gap: 2rem;
          }

          .seo-form {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 2rem;
          }

          .form-section {
            margin-bottom: 2rem;
            padding-bottom: 2rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .form-section:last-of-type {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
          }

          .section-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--white);
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .section-title::before {
            content: '';
            width: 4px;
            height: 24px;
            background: #d4af37;
            border-radius: 2px;
          }

          .form-group {
            margin-bottom: 1.5rem;
          }

          .form-group label {
            font-size: 0.9rem;
            color: var(--gray);
            margin-bottom: 0.5rem;
            display: block;
          }

          .form-group input,
          .form-group select,
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
          .form-group select:focus,
          .form-group textarea:focus {
            outline: none;
            border-color: #d4af37;
            background: rgba(255, 255, 255, 0.08);
          }

          .form-group textarea {
            resize: vertical;
            font-family: inherit;
            line-height: 1.6;
          }

          .form-group small {
            font-size: 0.85rem;
            color: var(--gray);
            margin-top: 0.5rem;
            display: block;
          }

          .char-count {
            font-size: 0.85rem;
            margin-top: 0.5rem;
            font-weight: 500;
          }

          .checkbox-label {
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--white);
            cursor: pointer;
          }

          .checkbox-label input[type="checkbox"] {
            width: auto;
            cursor: pointer;
          }

          .form-actions {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }

          .sidebar {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .score-panel,
          .preview-panel {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 1.5rem;
          }

          .score-panel h3,
          .preview-panel h3 {
            font-size: 1rem;
            font-weight: 600;
            color: var(--white);
            margin-bottom: 1rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .score-circle {
            width: 120px;
            height: 120px;
            border: 6px solid;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin: 1.5rem auto;
            transition: border-color 0.3s;
          }

          .score-value {
            font-size: 2.5rem;
            font-weight: 700;
            line-height: 1;
          }

          .score-max {
            font-size: 0.9rem;
            color: var(--gray);
          }

          .score-checks {
            margin-top: 1.5rem;
          }

          .check-item {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
            margin-bottom: 0.75rem;
            font-size: 0.85rem;
          }

          .check-icon {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
            font-weight: 700;
            flex-shrink: 0;
          }

          .check-icon.passed {
            background: rgba(16, 185, 129, 0.2);
            color: #10b981;
          }

          .check-icon.failed {
            background: rgba(239, 68, 68, 0.2);
            color: #ef4444;
          }

          .check-label {
            color: var(--gray);
            line-height: 1.4;
          }

          .optimal-badge {
            display: inline-block;
            background: rgba(16, 185, 129, 0.2);
            color: #10b981;
            font-size: 0.7rem;
            padding: 2px 6px;
            border-radius: 4px;
            margin-left: 0.5rem;
            font-weight: 600;
          }

          .google-preview {
            background: #fff;
            padding: 1rem;
            border-radius: 8px;
            font-family: arial, sans-serif;
          }

          .preview-url {
            font-size: 0.75rem;
            color: #5f6368;
            margin-bottom: 0.25rem;
            line-height: 1.3;
          }

          .preview-title {
            font-size: 1.25rem;
            color: #1a0dab;
            margin-bottom: 0.25rem;
            line-height: 1.3;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
          }

          .preview-description {
            font-size: 0.875rem;
            color: #4d5156;
            line-height: 1.6;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }

          @media (max-width: 1200px) {
            .editor-layout {
              grid-template-columns: 1fr;
            }

            .sidebar {
              order: -1;
            }
          }

          @media (max-width: 768px) {
            .admin-header {
              flex-direction: column;
              gap: 1rem;
            }

            .form-actions {
              flex-direction: column;
            }

            .btn {
              width: 100%;
              text-align: center;
            }
          }
        `}</style>
      </div>
    </>
  );
}

export default function EditSEOPage() {
  return (
    <Suspense fallback={<div style={{padding: '2rem'}}>Loading...</div>}>
      <EditSEOForm />
    </Suspense>
  );
}
