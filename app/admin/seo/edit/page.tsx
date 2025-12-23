"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AdminHeader from '@/components/AdminHeader';

function EditSEOForm() {
  const searchParams = useSearchParams();
  const pagePath = searchParams?.get('path') || '';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    focus_keyword: '',
    og_title: '',
    og_description: '',
    og_image: '',
    canonical_url: '',
  });

  useEffect(() => {
    if (!pagePath) {
      setError('Chybí parametr path v URL');
      setLoading(false);
      return;
    }

    async function loadData() {
      try {
        const res = await fetch(`/api/seo?page_path=${encodeURIComponent(pagePath)}`);
        const data = await res.json();

        if (data.success && data.metadata) {
          // Auto-fix Vercel Blob URLs without file extension
          let ogImage = data.metadata.og_image || '';
          if (ogImage && ogImage.includes('blob.vercel-storage.com') && !ogImage.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i)) {
            ogImage = ogImage + '.png';
          }

          setFormData({
            meta_title: data.metadata.meta_title || '',
            meta_description: data.metadata.meta_description || '',
            meta_keywords: data.metadata.meta_keywords || '',
            focus_keyword: data.metadata.focus_keyword || '',
            og_title: data.metadata.og_title || '',
            og_description: data.metadata.og_description || '',
            og_image: ogImage,
            canonical_url: data.metadata.canonical_url || '',
          });
        }
      } catch (err: any) {
        console.error(err);
        setError('Chyba při načítání: ' + err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [pagePath]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Soubor musí být obrázek');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Velikost souboru nesmí přesáhnout 5MB');
      return;
    }

    setUploadingImage(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/seo/upload-image', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setFormData(prev => ({ ...prev, og_image: data.url }));
        setSuccess('✅ Obrázek nahrán!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Chyba při nahrávání');
      }
    } catch (err: any) {
      setError('Chyba: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    // Extract locale and page_type from path
    const localeMatch = pagePath.match(/^\/(cs|en|de|uk)/);
    const locale = localeMatch ? localeMatch[1] : 'cs';

    let pageType = 'static';
    if (pagePath.includes('/profily/')) pageType = 'girl';
    else if (pagePath.includes('/blog/')) pageType = 'blog';
    else if (pagePath.includes('/sluzby/')) pageType = 'dynamic';

    try {
      const res = await fetch('/api/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_path: pagePath,
          page_type: pageType,
          locale: locale,
          ...formData,
          robots_index: 1,
          robots_follow: 1,
          seo_score: 75
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess('✅ SEO metadata uložena!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Chyba při ukládání');
      }
    } catch (err: any) {
      setError('Chyba: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!pagePath) {
    return (
      <>
        <AdminHeader title="Edit SEO" showBack={false} />
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
            Chyba: Chybí parametr 'path' v URL
          </div>
          <Link href="/admin/seo" style={{ color: '#d4af37', textDecoration: 'none' }}>
            ← Zpět na SEO Manager
          </Link>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <AdminHeader title="Edit SEO" showBack={false} />
        <div style={{ padding: '4rem', textAlign: 'center', color: '#9ca3af' }}>
          Načítání...
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Edit SEO" showBack={false} />
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', color: '#fff' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>SEO Editor</h1>
        <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>
          Stránka: <strong style={{ color: '#d4af37' }}>{pagePath}</strong>
        </p>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '2rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#9ca3af' }}>
              Meta Title *
            </label>
            <input
              type="text"
              value={formData.meta_title}
              onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
              style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }}
              placeholder="e.g., Escort Praha | LovelyGirls"
            />
            <small style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
              {formData.meta_title.length}/60 znaků
            </small>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#9ca3af' }}>
              Meta Description *
            </label>
            <textarea
              value={formData.meta_description}
              onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
              rows={4}
              style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', fontFamily: 'inherit', resize: 'vertical' }}
              placeholder="e.g., Prémiové escort služby v Praze..."
            />
            <small style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
              {formData.meta_description.length}/160 znaků
            </small>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#9ca3af' }}>
              Meta Keywords
            </label>
            <input
              type="text"
              value={formData.meta_keywords}
              onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
              style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }}
              placeholder="escort praha, escort služby, vip escort"
            />
            <small style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
              Oddělené čárkou
            </small>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#9ca3af' }}>
              Focus Keyword
            </label>
            <input
              type="text"
              value={formData.focus_keyword}
              onChange={(e) => setFormData({ ...formData, focus_keyword: e.target.value })}
              style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }}
              placeholder="e.g., escort praha"
            />
            <small style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
              Hlavní klíčové slovo
            </small>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#fff', marginBottom: '1.5rem', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            Open Graph (Social Media)
          </h3>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#9ca3af' }}>
              OG Title
            </label>
            <input
              type="text"
              value={formData.og_title}
              onChange={(e) => setFormData({ ...formData, og_title: e.target.value })}
              style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }}
              placeholder="Fallback to Meta Title if empty"
            />
            <small style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
              Titulek pro Facebook/LinkedIn sdílení
            </small>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#9ca3af' }}>
              OG Description
            </label>
            <textarea
              value={formData.og_description}
              onChange={(e) => setFormData({ ...formData, og_description: e.target.value })}
              rows={3}
              style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', fontFamily: 'inherit', resize: 'vertical' }}
              placeholder="Fallback to Meta Description if empty"
            />
            <small style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
              Popis pro sociální sítě
            </small>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#9ca3af' }}>
              OG Image
            </label>
            <small style={{ color: '#9ca3af', fontSize: '0.85rem', display: 'block', marginBottom: '0.75rem' }}>
              Doporučená velikost: 1200x630px pro optimální sdílení na sociálních sítích
            </small>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  style={{ display: 'none' }}
                  id="og-image-upload"
                />
                <label
                  htmlFor="og-image-upload"
                  style={{
                    display: 'inline-block',
                    padding: '10px 20px',
                    background: uploadingImage ? '#6b7280' : 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: '#fff',
                    cursor: uploadingImage ? 'not-allowed' : 'pointer',
                    fontWeight: '500',
                    fontSize: '14px'
                  }}
                >
                  {uploadingImage ? 'Nahrávám...' : '📁 Nahrát obrázek'}
                </label>
              </div>

              {formData.og_image && (
                <input
                  type="url"
                  value={formData.og_image}
                  onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
                  style={{
                    flex: 1,
                    padding: '0.5rem 0.75rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#9ca3af',
                    fontSize: '13px'
                  }}
                  placeholder="URL obrázku"
                />
              )}
            </div>

            {formData.og_image && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.75rem', fontWeight: '600' }}>Preview:</div>
                <div style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  padding: '1rem',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '200px'
                }}>
                  <img
                    src={formData.og_image}
                    alt="OG Image Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '400px',
                      height: 'auto',
                      borderRadius: '8px',
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                    }}
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.style.display = 'none';
                      const parent = img.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div style="color: #ef4444; text-align: center; padding: 2rem;">❌ Nepodařilo se načíst obrázek</div>';
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#9ca3af' }}>
              Canonical URL
            </label>
            <input
              type="url"
              value={formData.canonical_url}
              onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
              style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }}
              placeholder="https://www.eroticreviews.uk/cs"
            />
            <small style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
              Preferovaná URL stránky
            </small>
          </div>

          <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Link
              href="/admin/seo"
              style={{ padding: '10px 20px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.1)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.2)', textDecoration: 'none', fontWeight: '500' }}
            >
              Zrušit
            </Link>
            <button
              type="submit"
              disabled={saving}
              style={{ padding: '10px 20px', borderRadius: '8px', background: saving ? '#6b7280' : '#d4af37', color: '#1f1f23', border: 'none', fontWeight: '500', cursor: saving ? 'not-allowed' : 'pointer' }}
            >
              {saving ? 'Ukládám...' : 'Uložit SEO'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default function EditSEOPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: '4rem', textAlign: 'center', color: '#9ca3af' }}>
        Načítání...
      </div>
    }>
      <EditSEOForm />
    </Suspense>
  );
}
