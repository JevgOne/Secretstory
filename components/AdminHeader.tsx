"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";

interface AdminHeaderProps {
  title: string;
  showBack?: boolean;
  backUrl?: string;
}

export default function AdminHeader({ title, showBack = false, backUrl = "/admin/dashboard" }: AdminHeaderProps) {
  const [notifications, setNotifications] = useState({ applications: 0, reviews: 0 });
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    fetchNotifications();
    // Refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    if (!showNotifications && !showMobileMenu) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (showNotifications && !target.closest('.notifications-container')) {
        setShowNotifications(false);
      }
      if (showMobileMenu && !target.closest('.admin-mobile-menu-container')) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showNotifications, showMobileMenu]);

  const fetchNotifications = async () => {
    try {
      const [appsRes, reviewsRes] = await Promise.all([
        fetch('/api/applications?status=pending'),
        fetch('/api/reviews?status=pending')
      ]);

      const appsData = await appsRes.json();
      const reviewsData = await reviewsRes.json();

      setNotifications({
        applications: appsData.applications?.length || 0,
        reviews: reviewsData.reviews?.length || 0
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const totalNotifications = notifications.applications + notifications.reviews;

  return (
    <header className="app-header admin">
      <div className="app-header-left">
        {showBack && (
          <Link
            href={backUrl}
            className="admin-back-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: '500',
              textDecoration: 'none',
              marginRight: '16px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          >
            ← Zpět
          </Link>
        )}
        <span className="app-admin-badge admin-hide-mobile">Admin</span>
        <div className="app-header-title">{title}</div>
      </div>
      <div className="admin-header-actions">
        {/* Notifications Bell */}
        <div className="notifications-container" style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="admin-notif-btn"
            style={{
              padding: '8px 16px',
              background: totalNotifications > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${totalNotifications > 0 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
              borderRadius: '8px',
              color: totalNotifications > 0 ? '#ef4444' : 'white',
              fontSize: '0.85rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {totalNotifications > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#ef4444',
                color: 'white',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.625rem',
                fontWeight: '700',
                border: '2px solid #1f1f23'
              }}>
                {totalNotifications > 9 ? '9+' : totalNotifications}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="admin-notif-dropdown" style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              background: '#2d2d31',
              border: '1px solid #3d3d41',
              borderRadius: '12px',
              padding: '16px',
              minWidth: '280px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
              zIndex: 1000
            }}>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '12px'
              }}>
                Notifikace
              </div>

              {totalNotifications === 0 ? (
                <div style={{
                  padding: '20px',
                  textAlign: 'center',
                  color: '#6b7280',
                  fontSize: '0.875rem'
                }}>
                  Žádné nové notifikace
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {notifications.applications > 0 && (
                    <Link
                      href="/admin/applications"
                      onClick={() => setShowNotifications(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        color: 'white',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: '#ef4444',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.875rem'
                        }}>
                          📝
                        </div>
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                            Nové žádosti
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                            {notifications.applications} čekající
                          </div>
                        </div>
                      </div>
                      <div style={{
                        background: '#ef4444',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '700'
                      }}>
                        {notifications.applications}
                      </div>
                    </Link>
                  )}

                  {notifications.reviews > 0 && (
                    <Link
                      href="/admin/reviews"
                      onClick={() => setShowNotifications(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        color: 'white',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: '#f59e0b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.875rem'
                        }}>
                          ⭐
                        </div>
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                            Nové recenze
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                            {notifications.reviews} ke schválení
                          </div>
                        </div>
                      </div>
                      <div style={{
                        background: '#f59e0b',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '700'
                      }}>
                        {notifications.reviews}
                      </div>
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop-only links */}
        <Link
          href="/admin/settings"
          className="admin-hide-mobile"
          style={{
            padding: '8px 16px',
            background: 'rgba(139, 92, 246, 0.15)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '8px',
            color: '#a78bfa',
            fontSize: '0.85rem',
            fontWeight: '500',
            textDecoration: 'none',
            transition: 'all 0.2s'
          }}
        >
          ⚙️ Nastavení
        </Link>
        <Link
          href="/cs"
          className="admin-hide-mobile"
          style={{
            padding: '8px 16px',
            background: 'rgba(163, 51, 82, 0.15)',
            border: '1px solid rgba(163, 51, 82, 0.3)',
            borderRadius: '8px',
            color: '#a33352',
            fontSize: '0.85rem',
            fontWeight: '500',
            textDecoration: 'none',
            transition: 'all 0.2s'
          }}
        >
          🌐 Web
        </Link>
        <button
          className="app-header-btn admin-hide-mobile"
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>

        {/* Mobile hamburger menu */}
        <div className="admin-mobile-menu-container admin-show-mobile" style={{ position: 'relative' }}>
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="app-header-btn"
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {showMobileMenu ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>

          {showMobileMenu && (
            <div className="admin-mobile-dropdown">
              <Link
                href="/admin/settings"
                onClick={() => setShowMobileMenu(false)}
                className="admin-mobile-dropdown-item"
              >
                <span>⚙️</span>
                <span>Nastavení</span>
              </Link>
              <Link
                href="/cs"
                onClick={() => setShowMobileMenu(false)}
                className="admin-mobile-dropdown-item"
              >
                <span>🌐</span>
                <span>Web</span>
              </Link>
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  signOut({ callbackUrl: '/admin/login' });
                }}
                className="admin-mobile-dropdown-item"
                style={{ width: '100%', textAlign: 'left' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Odhlásit se</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
