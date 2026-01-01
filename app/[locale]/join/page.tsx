"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function JoinPage() {
  const locale = useLocale();
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    // Personal
    name: '',
    age: '',
    height: '',
    weight: '',
    bust: '',
    waist: '',
    hips: '',

    // Contact
    email: '',
    phone: '',
    telegram: '',

    // Professional
    experience: 'beginner',
    languages: [] as string[],
    availability: [] as string[],

    // Bio
    bio_cs: '',
    bio_en: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age),
          height: formData.height ? parseInt(formData.height) : null,
          weight: formData.weight ? parseInt(formData.weight) : null,
          bust: formData.bust ? parseInt(formData.bust) : null,
          waist: formData.waist ? parseInt(formData.waist) : null,
          hips: formData.hips ? parseInt(formData.hips) : null
        })
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Chyba při odesílání žádosti');
      }
    } catch (err) {
      console.error('Error submitting application:', err);
      setError('Chyba při odesílání žádosti');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLanguageToggle = (lang: string) => {
    if (formData.languages.includes(lang)) {
      setFormData({
        ...formData,
        languages: formData.languages.filter(l => l !== lang)
      });
    } else {
      setFormData({
        ...formData,
        languages: [...formData.languages, lang]
      });
    }
  };

  const handleAvailabilityToggle = (day: string) => {
    if (formData.availability.includes(day)) {
      setFormData({
        ...formData,
        availability: formData.availability.filter(d => d !== day)
      });
    } else {
      setFormData({
        ...formData,
        availability: [...formData.availability, day]
      });
    }
  };

  if (submitted) {
    return (
      <>
        <nav className="main-nav">
          <Link href={`/${locale}`} className="logo">
            <span className="logo-L">L</span>
            {tCommon('brand_suffix')}
          </Link>
          <div className="nav-contact">
            <LanguageSwitcher />
          </div>
        </nav>

        <div className="success-container">
          <div className="success-card">
            <div className="success-icon">✅</div>
            <h1>Děkujeme za váš zájem!</h1>
            <p>Vaše žádost byla úspěšně odeslána. Brzy se vám ozveme na uvedený telefon nebo email.</p>
            <Link href={`/${locale}`} className="btn-back">
              Zpět na hlavní stránku
            </Link>
          </div>
        </div>

        <style jsx>{`
          .success-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            background: linear-gradient(135deg, #1f1f23 0%, #2d2d31 100%);
          }

          .success-card {
            background: #2d2d31;
            border: 1px solid #3d3d41;
            border-radius: 16px;
            padding: 3rem;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          }

          .success-icon {
            font-size: 4rem;
            margin-bottom: 1.5rem;
          }

          h1 {
            color: #fff;
            font-size: 1.8rem;
            margin-bottom: 1rem;
          }

          p {
            color: #9ca3af;
            line-height: 1.6;
            margin-bottom: 2rem;
          }

          .btn-back {
            display: inline-block;
            padding: 12px 24px;
            background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
            color: #1f1f23;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.3s ease;
          }

          .btn-back:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(212, 175, 55, 0.4);
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <nav className="main-nav">
        <Link href={`/${locale}`} className="logo">
          <span className="logo-L">L</span>
          {tCommon('brand_suffix')}
        </Link>
        <div className="nav-contact">
          <LanguageSwitcher />
        </div>
      </nav>

      <div className="form-container">
        <div className="form-card">
          <h1>Staň se součástí LovelyGirls! 💖</h1>
          <p className="subtitle">Vyplň formulář níže a my se ti brzy ozveme</p>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Personal Info */}
            <section>
              <h2>👤 Základní údaje</h2>

              <div className="form-group">
                <label>Jméno / Přezdívka *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Jak ti máme říkat?"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Věk *</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    required
                    min="18"
                    max="99"
                  />
                </div>

                <div className="form-group">
                  <label>Výška (cm)</label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    placeholder="např. 165"
                  />
                </div>

                <div className="form-group">
                  <label>Váha (kg)</label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="např. 55"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Poprsí (cm)</label>
                  <input
                    type="number"
                    value={formData.bust}
                    onChange={(e) => setFormData({ ...formData, bust: e.target.value })}
                    placeholder="např. 90"
                  />
                </div>

                <div className="form-group">
                  <label>Pas (cm)</label>
                  <input
                    type="number"
                    value={formData.waist}
                    onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                    placeholder="např. 60"
                  />
                </div>

                <div className="form-group">
                  <label>Boky (cm)</label>
                  <input
                    type="number"
                    value={formData.hips}
                    onChange={(e) => setFormData({ ...formData, hips: e.target.value })}
                    placeholder="např. 90"
                  />
                </div>
              </div>
            </section>

            {/* Contact Info */}
            <section>
              <h2>📞 Kontaktní údaje</h2>

              <div className="form-group">
                <label>Telefon *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  placeholder="+420 123 456 789"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tvuj@email.cz"
                />
              </div>

              <div className="form-group">
                <label>Telegram</label>
                <input
                  type="text"
                  value={formData.telegram}
                  onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                  placeholder="@username"
                />
              </div>
            </section>

            {/* Professional Info */}
            <section>
              <h2>💼 Profesní info</h2>

              <div className="form-group">
                <label>Zkušenosti</label>
                <select
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                >
                  <option value="beginner">Začátečnice - nemám zkušenosti</option>
                  <option value="intermediate">Mírně pokročilá - pár měsíců zkušeností</option>
                  <option value="experienced">Zkušená - více než rok</option>
                </select>
              </div>

              <div className="form-group">
                <label>Jazyky (vyber všechny, které ovládáš)</label>
                <div className="checkbox-grid">
                  {['Čeština', 'English', 'Deutsch', 'Українська', 'Русский', 'Slovenčina'].map(lang => (
                    <label key={lang} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.languages.includes(lang)}
                        onChange={() => handleLanguageToggle(lang)}
                      />
                      <span>{lang}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Dostupnost (kdy můžeš pracovat?)</label>
                <div className="checkbox-grid">
                  {['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle'].map(day => (
                    <label key={day} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.availability.includes(day)}
                        onChange={() => handleAvailabilityToggle(day)}
                      />
                      <span>{day}</span>
                    </label>
                  ))}
                </div>
              </div>
            </section>

            {/* Bio */}
            <section>
              <h2>✨ O tobě</h2>

              <div className="form-group">
                <label>Popis (česky)</label>
                <textarea
                  value={formData.bio_cs}
                  onChange={(e) => setFormData({ ...formData, bio_cs: e.target.value })}
                  rows={4}
                  placeholder="Napiš něco o sobě, co by měli klienti vědět..."
                />
              </div>

              <div className="form-group">
                <label>Popis (anglicky) - nepovinné</label>
                <textarea
                  value={formData.bio_en}
                  onChange={(e) => setFormData({ ...formData, bio_en: e.target.value })}
                  rows={4}
                  placeholder="Write something about yourself for English-speaking clients..."
                />
              </div>
            </section>

            <button
              type="submit"
              disabled={submitting}
              className="submit-btn"
            >
              {submitting ? '⏳ Odesílám...' : '✨ Odeslat žádost'}
            </button>

            <p className="note">
              * Povinná pole. Fotky nahraješ později po schválení žádosti.
            </p>
          </form>
        </div>
      </div>

      <style jsx>{`
        .form-container {
          min-height: 100vh;
          padding: 2rem;
          background: linear-gradient(135deg, #1f1f23 0%, #2d2d31 100%);
        }

        .form-card {
          max-width: 800px;
          margin: 2rem auto;
          background: #2d2d31;
          border: 1px solid #3d3d41;
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        h1 {
          color: #fff;
          font-size: 2rem;
          margin-bottom: 0.5rem;
          text-align: center;
        }

        .subtitle {
          color: #9ca3af;
          text-align: center;
          margin-bottom: 2rem;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid #ef4444;
          color: #ef4444;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        section {
          margin-bottom: 2.5rem;
        }

        h2 {
          color: #d4af37;
          font-size: 1.3rem;
          margin-bottom: 1.5rem;
          font-weight: 600;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        label {
          display: block;
          color: #9ca3af;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        input, select, textarea {
          width: 100%;
          padding: 12px;
          background: #1f1f23;
          border: 1px solid #3d3d41;
          border-radius: 8px;
          color: #fff;
          font-size: 1rem;
          transition: all 0.2s ease;
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #d4af37;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15);
        }

        .checkbox-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 0.75rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 6px;
          transition: background 0.2s ease;
        }

        .checkbox-label:hover {
          background: rgba(212, 175, 55, 0.1);
        }

        .checkbox-label input[type="checkbox"] {
          width: auto;
          cursor: pointer;
        }

        .checkbox-label span {
          color: #fff;
          font-size: 0.9rem;
        }

        .submit-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
          color: #1f1f23;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 16px rgba(212, 175, 55, 0.3);
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(212, 175, 55, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .note {
          margin-top: 1rem;
          color: #6b7280;
          font-size: 0.85rem;
          text-align: center;
        }

        @media (max-width: 768px) {
          .form-card {
            padding: 1.5rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .checkbox-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </>
  );
}
