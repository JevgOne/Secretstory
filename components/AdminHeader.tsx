"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

interface AdminHeaderProps {
  title: string;
  showBack?: boolean;
}

export default function AdminHeader({ title, showBack = false }: AdminHeaderProps) {
  return (
    <header className="app-header admin">
      <div className="app-header-left">
        {showBack && (
          <Link
            href="/admin/dashboard"
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
        <span className="app-admin-badge">Admin</span>
        <div className="app-header-title">{title}</div>
      </div>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Link
          href="/cs"
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
          className="app-header-btn"
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </header>
  );
}
