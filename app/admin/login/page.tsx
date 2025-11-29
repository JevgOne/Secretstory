"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDemoClick = (role: string) => {
    if (role === 'girl') {
      setEmail('katy@demo.cz');
      setPassword('katy123');
    } else if (role === 'manager') {
      setEmail('manager@lovelygirls.cz');
      setPassword('manager123');
    } else if (role === 'admin') {
      setEmail('admin@lovelygirls.cz');
      setPassword('admin123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Chyba při přihlašování');
        setLoading(false);
        return;
      }

      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect based on role
      if (data.user.role === 'girl') {
        router.push('/girl/dashboard');
      } else if (data.user.role === 'manager') {
        router.push('/manager/dashboard');
      } else if (data.user.role === 'admin') {
        router.push('/admin/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Chyba při přihlašování');
      setLoading(false);
    }
  };

  return (
    <div className="app-login-screen">
      <div className="app-login-bg"></div>
      <div className="app-login-pattern"></div>

      <div className="app-login-content">
        {/* LOGO */}
        <div className="app-login-logo">
          <div className="app-logo-icon">💋</div>
          <div className="app-logo-text">LovelyGirls</div>
          <div className="app-logo-subtext">Staff Portal</div>
        </div>

          {/* FORM */}
          <form className="app-login-form" onSubmit={handleSubmit}>
            <div className="app-form-group">
              <label className="app-form-label">Email</label>
              <input
                type="email"
                className="app-form-input"
                placeholder="vas@email.cz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="app-form-group">
              <label className="app-form-label">Heslo</label>
              <div className="app-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  className="app-form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <span className="app-input-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </span>
              </div>
            </div>

            <a href="#" className="app-forgot-link">Zapomenuté heslo?</a>

            <button type="submit" className={`app-btn-login ${loading ? "loading" : ""}`} disabled={loading}>
              <span className="app-btn-text">Přihlásit se</span>
              <div className="app-spinner"></div>
            </button>

            {/* DEMO USERS */}
            <div className="app-demo-section">
              <div className="app-demo-label">Demo přístupy</div>
              <div className="app-demo-buttons">
                <button type="button" className="app-demo-btn" onClick={() => handleDemoClick("girl")}>
                  👩 Dívka
                  <span>katy@demo.cz</span>
                </button>
                <button type="button" className="app-demo-btn" onClick={() => handleDemoClick("manager")}>
                  👔 Manažer
                  <span>manager@lovelygirls.cz</span>
                </button>
                <button type="button" className="app-demo-btn" onClick={() => handleDemoClick("admin")}>
                  ⚙️ Admin
                  <span>admin@lovelygirls.cz</span>
                </button>
              </div>
            </div>
          </form>

        {/* FOOTER */}
        <div className="app-login-footer">
          <p>© 2025 LovelyGirls Prague</p>
        </div>
      </div>
    </div>
  );
}
