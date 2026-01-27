"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminHeader from '@/components/AdminHeader';

export default function GenerateBlogPostsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    locale: 'cs',
    startDate: new Date().toISOString().slice(0, 10)
  });

  const handleGenerate = async () => {
    if (!confirm('Opravdu chcete vygenerovat 30 článků? Tento proces může trvat 5-10 minut.')) {
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/admin/blog/generate-month', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale: formData.locale,
          startDate: new Date(formData.startDate).toISOString()
        })
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Chyba při generování článků');
      }
    } catch (err) {
      console.error('Error generating posts:', err);
      setError('Chyba při generování článků');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminHeader title="AI Generátor článků" showBack={false} />
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Vygenerovat články na měsíc</h1>
            <p className="admin-subtitle">AI automaticky vytvoří 30 článků s naplánovaným zveřejněním</p>
          </div>
          <Link href="/admin/blog" className="btn btn-secondary">
            ← Zpět na blog
          </Link>
        </div>

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        {result && (
          <div className="success-banner">
            <h3>✓ Generování dokončeno!</h3>
            <p>Vytvořeno: <strong>{result.created}</strong> článků</p>
            {result.errors > 0 && <p>Chyby: <strong>{result.errors}</strong></p>}
            <Link href="/admin/blog" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Zobrazit články
            </Link>
          </div>
        )}

        {result && result.posts && result.posts.length > 0 && (
          <div className="posts-preview">
            <h3>Vygenerované články:</h3>
            <div className="posts-list">
              {result.posts.map((post: any, i: number) => (
                <div key={i} className="post-item">
                  <strong>{post.title}</strong>
                  <div className="post-meta">
                    <span className="category-badge">{post.category}</span>
                    <span className="schedule-date">
                      Naplánováno: {new Date(post.scheduled_for).toLocaleDateString('cs-CZ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!result && (
          <div className="generator-form">
            <div className="form-section">
              <h2 className="section-title">Nastavení generování</h2>

              <div className="form-group">
                <label>Jazyk článků</label>
                <select
                  value={formData.locale}
                  onChange={(e) => setFormData({ ...formData, locale: e.target.value })}
                  disabled={loading}
                >
                  <option value="cs">🇨🇿 Čeština</option>
                  <option value="en">🇬🇧 English</option>
                  <option value="de">🇩🇪 Deutsch</option>
                  <option value="uk">🇺🇦 Українська</option>
                </select>
                <small>Články budou vygenerovány v tomto jazyce</small>
              </div>

              <div className="form-group">
                <label>Začátek publikace</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  min={new Date().toISOString().slice(0, 10)}
                  disabled={loading}
                />
                <small>První článek bude naplánován na toto datum, další dny postupně</small>
              </div>

              <div className="info-box">
                <h4>ℹ️ Jak to funguje:</h4>
                <ul>
                  <li>✓ AI vygeneruje 30 unikátních článků (1 na den)</li>
                  <li>✓ Pokrývá všechny kategorie (sex práce, příběhy, rady, novinky)</li>
                  <li>✓ Každý článek má 800-1200 slov</li>
                  <li>✓ SEO-optimalizovaný obsah s meta daty</li>
                  <li>✓ Články jsou naplánované na každý den v měsíci (10:00)</li>
                  <li>⚠️ Všechny články budou ve statusu "DRAFT" - před publikací je musíš zkontrolovat!</li>
                </ul>
              </div>

              <div className="warning-box">
                <h4>⚠️ Upozornění:</h4>
                <ul>
                  <li>Generování trvá 5-10 minut</li>
                  <li>Využívá OpenAI API (může vzniknout náklad ~$5-10)</li>
                  <li>Po vygenerování MUSÍŠ články zkontrolovat a upravit před publikací</li>
                  <li>Články jsou automaticky přiřazeny copywriterům pro review</li>
                </ul>
              </div>

              <button
                onClick={handleGenerate}
                className="btn btn-primary btn-large"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Generuji články... ({result?.created || 0}/30)
                  </>
                ) : (
                  '🤖 Vygenerovat 30 článků'
                )}
              </button>
            </div>
          </div>
        )}

        <style jsx>{`
          .admin-container {
            padding: 2rem;
            max-width: 1000px;
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

          .btn-large {
            padding: 1rem 2rem;
            font-size: 1.1rem;
            width: 100%;
            margin-top: 2rem;
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
            background: rgba(34, 197, 94, 0.1);
            border: 1px solid rgba(34, 197, 94, 0.3);
            color: #22c55e;
            padding: 2rem;
            border-radius: 12px;
            margin-bottom: 2rem;
            text-align: center;
          }

          .success-banner h3 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
          }

          .generator-form {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 2rem;
          }

          .form-section {
            margin-bottom: 2rem;
          }

          .section-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--white);
            margin-bottom: 1.5rem;
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

          .form-group input,
          .form-group select {
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
          .form-group select:focus {
            outline: none;
            border-color: var(--accent);
            background: rgba(255, 255, 255, 0.08);
          }

          .form-group small {
            display: block;
            font-size: 0.85rem;
            color: var(--gray);
            margin-top: 0.5rem;
          }

          .info-box,
          .warning-box {
            padding: 1.5rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
          }

          .info-box {
            background: rgba(59, 130, 246, 0.1);
            border: 1px solid rgba(59, 130, 246, 0.3);
          }

          .warning-box {
            background: rgba(251, 191, 36, 0.1);
            border: 1px solid rgba(251, 191, 36, 0.3);
          }

          .info-box h4,
          .warning-box h4 {
            color: var(--white);
            margin-bottom: 0.75rem;
          }

          .info-box ul,
          .warning-box ul {
            margin: 0;
            padding-left: 1.5rem;
          }

          .info-box li,
          .warning-box li {
            color: var(--gray);
            margin-bottom: 0.5rem;
          }

          .spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin-right: 0.5rem;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          .posts-preview {
            margin-top: 2rem;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 2rem;
          }

          .posts-preview h3 {
            color: var(--white);
            margin-bottom: 1rem;
          }

          .posts-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            max-height: 400px;
            overflow-y: auto;
          }

          .post-item {
            padding: 1rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }

          .post-item strong {
            color: var(--white);
            display: block;
            margin-bottom: 0.5rem;
          }

          .post-meta {
            display: flex;
            gap: 1rem;
            font-size: 0.85rem;
            color: var(--gray);
          }

          .category-badge {
            padding: 2px 8px;
            background: rgba(163, 51, 82, 0.2);
            color: #a33352;
            border-radius: 4px;
          }
        `}</style>
      </div>
    </>
  );
}
