"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminHeader from '@/components/AdminHeader';

interface PageProps {
  params: Promise<{ id: string }>;
}

interface Girl {
  id: number;
  name: string;
}

export default function EditBlogPostPage({ params }: PageProps) {
  const router = useRouter();
  const [postId, setPostId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [girls, setGirls] = useState<Girl[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'rady-a-tipy',
    excerpt: '',
    content: '',
    featured_image: '',
    girl_id: '',
    tags: '',
    locale: 'cs',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    og_title: '',
    og_description: '',
    og_image: '',
    publishMode: 'draft', // 'draft', 'now', 'scheduled'
    scheduledFor: '',
    featured: false
  });

  // Load post data
  useEffect(() => {
    async function loadPost() {
      const resolvedParams = await params;
      setPostId(resolvedParams.id);

      try {
        // Load post data
        const postResponse = await fetch(`/api/admin/blog/${resolvedParams.id}`);
        const postData = await postResponse.json();

        if (postData.success && postData.post) {
          const post = postData.post;

          // Determine publish mode from existing data
          let publishMode = 'draft';
          let scheduledFor = '';

          if (post.scheduled_for) {
            publishMode = 'scheduled';
            // Convert ISO datetime to datetime-local format
            scheduledFor = new Date(post.scheduled_for).toISOString().slice(0, 16);
          } else if (post.is_published) {
            publishMode = 'now';
          }

          setFormData({
            title: post.title || '',
            slug: post.slug || '',
            category: post.category || 'sex-prace',
            excerpt: post.excerpt || '',
            content: post.content || '',
            featured_image: post.featured_image || '',
            girl_id: post.girl_id?.toString() || '',
            tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
            locale: post.locale || 'cs',
            meta_title: post.meta_title || '',
            meta_description: post.meta_description || '',
            meta_keywords: post.meta_keywords || '',
            og_title: post.og_title || '',
            og_description: post.og_description || '',
            og_image: post.og_image || '',
            publishMode,
            scheduledFor,
            featured: post.is_featured || false
          });
        } else {
          setError('Článek nenalezen');
        }

        // Load girls for dropdown
        const girlsResponse = await fetch('/api/admin/girls');
        const girlsData = await girlsResponse.json();
        if (girlsData.success) {
          setGirls(girlsData.girls);
        }
      } catch (err) {
        console.error('Error loading post:', err);
        setError('Chyba při načítání článku');
      } finally {
        setLoadingData(false);
      }
    }

    loadPost();
  }, [params]);

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title)
    });
  };

  const handleAutoTranslate = async () => {
    if (!confirm('Opravdu chcete automaticky přeložit tento článek do všech 4 jazyků? Tato akce může trvat 1-2 minuty.')) {
      return;
    }

    setTranslating(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/blog/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: parseInt(postId) })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`✓ Úspěšně přeloženo do ${data.translated} jazyků! Překlady jsou přiřazené copywriterům ke kontrole.`);
      } else {
        setError(data.error || 'Chyba při překladu');
      }
    } catch (err) {
      console.error('Translation error:', err);
      setError('Chyba při překladu článku');
    } finally {
      setTranslating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.title.trim()) {
      setError('Název článku je povinný');
      return;
    }

    if (!formData.slug.trim()) {
      setError('Slug je povinný');
      return;
    }

    if (!formData.excerpt.trim()) {
      setError('Perex je povinný');
      return;
    }

    if (!formData.content.trim()) {
      setError('Obsah článku je povinný');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          girl_id: formData.girl_id ? parseInt(formData.girl_id) : null,
          tags: formData.tags.split(',').map(t => t.trim()).filter(t => t.length > 0),
          published: formData.publishMode === 'now',
          scheduled_for: formData.publishMode === 'scheduled' ? formData.scheduledFor : null
        })
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/blog');
      } else {
        setError(data.error + (data.details ? `: ${data.details}` : '') || 'Chyba při aktualizaci článku');
      }
    } catch (err) {
      console.error('Error updating post:', err);
      setError('Chyba při aktualizaci článku');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <>
        <AdminHeader title="Upravit článek" showBack={false} />
        <div className="admin-container">
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gray)' }}>
            Načítání...
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Upravit článek" showBack={false} />
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Upravit článek</h1>
            <p className="admin-subtitle">Upravte existující blogový příspěvek</p>
          </div>
          <Link href="/admin/blog" className="btn btn-secondary">
            ← Zpět na seznam
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

        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-section">
            <h2 className="section-title">Základní informace</h2>

            <div className="form-grid">
              <div className="form-group full-width">
                <label>Název článku *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                  placeholder="např. Jak se stát escort dívkou"
                />
              </div>

              <div className="form-group full-width">
                <label>Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  placeholder="jak-se-stat-escort-divkou"
                />
                <small>URL adresa článku (automaticky generována z názvu, lze upravit)</small>
              </div>

              <div className="form-group">
                <label>Kategorie *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="pribehy-spolecnic">Příběhy společnic</option>
                  <option value="rady-a-tipy">Rady a tipy</option>
                  <option value="novinky">Novinky</option>
                  <option value="ostatni">Ostatní</option>
                </select>
              </div>

              <div className="form-group">
                <label>Jazyk *</label>
                <select
                  value={formData.locale}
                  onChange={(e) => setFormData({ ...formData, locale: e.target.value })}
                  required
                >
                  <option value="cs">Čeština</option>
                  <option value="en">English</option>
                  <option value="de">Deutsch</option>
                  <option value="uk">Українська</option>
                </select>
              </div>

              <div className="form-group">
                <label>Dívka (volitelné)</label>
                <select
                  value={formData.girl_id}
                  onChange={(e) => setFormData({ ...formData, girl_id: e.target.value })}
                >
                  <option value="">-- Bez přiřazení --</option>
                  {girls.map(girl => (
                    <option key={girl.id} value={girl.id}>
                      {girl.name}
                    </option>
                  ))}
                </select>
                <small>Přiřaďte článek ke konkrétní dívce</small>
              </div>

              <div className="form-group">
                <label>Tagy (oddělené čárkami)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="escort, praha, sex práce"
                />
                <small>Oddělte jednotlivé tagy čárkami</small>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Obsah</h2>

            <div className="form-group">
              <label>Perex / Úryvek *</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
                required
                placeholder="Krátký popis článku, který se zobrazí v náhledech..."
              />
              <small>Krátký úryvek, který se zobrazí v seznamu článků a v meta popisku</small>
            </div>

            <div className="form-group">
              <label>Obsah článku *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={20}
                required
                placeholder="Zde napište celý obsah článku..."
              />
              <small>Zatím prostý text, rich text editor může být přidán později</small>
            </div>

            <div className="form-group">
              <label>URL obrázku</label>
              <input
                type="url"
                value={formData.featured_image}
                onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
              <small>URL adresa hlavního obrázku článku</small>
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">SEO Metadata</h2>

            <div className="form-group">
              <label>Meta Title</label>
              <input
                type="text"
                value={formData.meta_title}
                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                placeholder="Název pro vyhledávače (automaticky z názvu článku)"
                maxLength={60}
              />
              <small>Doporučeno 50-60 znaků. Ponechte prázdné pro použití názvu článku.</small>
            </div>

            <div className="form-group">
              <label>Meta Description</label>
              <textarea
                value={formData.meta_description}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                rows={3}
                placeholder="Popis pro vyhledávače..."
                maxLength={160}
              />
              <small>Doporučeno 120-160 znaků. Ponechte prázdné pro použití perexu.</small>
            </div>

            <div className="form-group">
              <label>Meta Keywords</label>
              <input
                type="text"
                value={formData.meta_keywords}
                onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                placeholder="klíčové, slovo, další"
              />
              <small>Klíčová slova oddělená čárkami</small>
            </div>

            <div className="form-group">
              <label>OG Title (Open Graph)</label>
              <input
                type="text"
                value={formData.og_title}
                onChange={(e) => setFormData({ ...formData, og_title: e.target.value })}
                placeholder="Název pro sdílení na sociálních sítích"
                maxLength={60}
              />
              <small>Název při sdílení na Facebooku, Twitteru atd. Ponechte prázdné pro použití Meta Title.</small>
            </div>

            <div className="form-group">
              <label>OG Description (Open Graph)</label>
              <textarea
                value={formData.og_description}
                onChange={(e) => setFormData({ ...formData, og_description: e.target.value })}
                rows={2}
                placeholder="Popis pro sociální sítě..."
                maxLength={160}
              />
              <small>Popis při sdílení. Ponechte prázdné pro použití Meta Description.</small>
            </div>

            <div className="form-group">
              <label>OG Image (Open Graph)</label>
              <input
                type="url"
                value={formData.og_image}
                onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
                placeholder="https://example.com/og-image.jpg"
              />
              <small>URL obrázku pro sdílení na sociálních sítích (1200x630px doporučeno). Ponechte prázdné pro použití hlavního obrázku.</small>
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Nastavení publikace</h2>

            <div className="form-group">
              <label>Režim publikace</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="publishMode"
                    value="draft"
                    checked={formData.publishMode === 'draft'}
                    onChange={(e) => setFormData({ ...formData, publishMode: e.target.value })}
                  />
                  <div>
                    <strong>Uložit jako koncept</strong>
                    <small>Článek nebude viditelný na webu</small>
                  </div>
                </label>

                <label className="radio-label">
                  <input
                    type="radio"
                    name="publishMode"
                    value="now"
                    checked={formData.publishMode === 'now'}
                    onChange={(e) => setFormData({ ...formData, publishMode: e.target.value })}
                  />
                  <div>
                    <strong>Publikovat okamžitě</strong>
                    <small>Článek bude hned viditelný</small>
                  </div>
                </label>

                <label className="radio-label">
                  <input
                    type="radio"
                    name="publishMode"
                    value="scheduled"
                    checked={formData.publishMode === 'scheduled'}
                    onChange={(e) => setFormData({ ...formData, publishMode: e.target.value })}
                  />
                  <div>
                    <strong>Naplánovat publikaci</strong>
                    <small>Článek bude automaticky publikován v nastavený čas</small>
                  </div>
                </label>
              </div>

              {formData.publishMode === 'scheduled' && (
                <div className="scheduled-datetime-picker">
                  <label>Datum a čas publikace *</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledFor}
                    onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                    required={formData.publishMode === 'scheduled'}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                  <small>Článek bude automaticky publikován v tento čas (časová zóna: místní)</small>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
                <span>Zvýraznit článek</span>
              </label>
              <small>Zvýrazněné články se zobrazí na hlavní stránce blogu</small>
            </div>
          </div>

          <div className="form-actions">
            <Link href="/admin/blog" className="btn btn-secondary">
              Zrušit
            </Link>
            <button
              type="button"
              className="btn btn-translate"
              onClick={handleAutoTranslate}
              disabled={loading || translating}
            >
              {translating ? '🔄 Překládám...' : '🌍 Auto-Translate (CS→EN→DE→UK)'}
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading || translating}>
              {loading ? 'Ukládání...' : 'Uložit změny'}
            </button>
          </div>
        </form>

        <style jsx>{`
          .admin-container {
            padding: 2rem;
            max-width: 1200px;
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

          .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.15);
          }

          .btn-translate {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }

          .btn-translate:hover:not(:disabled) {
            opacity: 0.9;
            transform: translateY(-2px);
          }

          .btn-translate:disabled {
            opacity: 0.6;
            cursor: not-allowed;
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
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 2rem;
          }

          .post-form {
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
          }

          .section-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--white);
            margin-bottom: 1.5rem;
          }

          .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
          }

          .form-group {
            display: flex;
            flex-direction: column;
          }

          .form-group.full-width {
            grid-column: 1 / -1;
          }

          .form-group label {
            font-size: 0.9rem;
            color: var(--gray);
            margin-bottom: 0.5rem;
          }

          .form-group input,
          .form-group select,
          .form-group textarea {
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
            border-color: var(--accent);
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

          .radio-group {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-top: 0.5rem;
          }

          .radio-label {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.03);
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
          }

          .radio-label:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.2);
          }

          .radio-label input[type="radio"] {
            margin-top: 0.25rem;
            cursor: pointer;
            width: auto;
          }

          .radio-label input[type="radio"]:checked + div {
            color: var(--accent);
          }

          .radio-label strong {
            display: block;
            color: var(--white);
            margin-bottom: 0.25rem;
          }

          .radio-label small {
            display: block;
            color: var(--gray);
            font-size: 0.85rem;
          }

          .scheduled-datetime-picker {
            margin-top: 1rem;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
          }

          .scheduled-datetime-picker label {
            display: block;
            font-size: 0.9rem;
            color: var(--gray);
            margin-bottom: 0.5rem;
          }

          .scheduled-datetime-picker input {
            width: 100%;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 0.75rem 1rem;
            color: var(--white);
            font-size: 0.95rem;
          }

          .scheduled-datetime-picker input:focus {
            outline: none;
            border-color: var(--accent);
            background: rgba(255, 255, 255, 0.08);
          }

          .scheduled-datetime-picker small {
            display: block;
            font-size: 0.85rem;
            color: var(--gray);
            margin-top: 0.5rem;
          }

          .form-actions {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }

          @media (max-width: 768px) {
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
