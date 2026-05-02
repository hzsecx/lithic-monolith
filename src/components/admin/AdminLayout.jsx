import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, LogOut, LayoutGrid, Gem, Settings, ChevronRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

const NAV_ITEMS = [
  { label: 'Category Cards', path: '/lefevef/admin/categories', icon: LayoutGrid },
  { label: 'Ürün Yönetimi', path: '/lefevef/admin/products', icon: Gem },
  { label: 'Site Ayarları', path: '/lefevef/admin/settings', icon: Settings },
];

export default function AdminLayout({ children, title, subtitle }) {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#07090D' }}>
      {/* Sidebar */}
      <aside
        className="hidden lg:flex flex-col w-60 flex-shrink-0 sticky top-0 h-screen"
        style={{
          background: 'linear-gradient(180deg, #0C1018 0%, #080C12 100%)',
          borderRight: '1px solid rgba(201,169,110,0.1)',
        }}
      >
        {/* Logo */}
        <div className="px-6 py-7" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <Link to="/" className="block">
            <span className="font-display text-xl font-bold tracking-widest uppercase" style={{ color: '#C9A96E' }}>
              Lithic
            </span>
            <p className="text-[9px] tracking-[0.35em] uppercase mt-0.5" style={{ color: 'rgba(201,169,110,0.4)' }}>
              Admin Console
            </p>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p className="text-[9px] tracking-[0.3em] uppercase px-3 mb-3" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Yönetim
          </p>
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group"
                style={{
                  backgroundColor: active ? 'rgba(201,169,110,0.12)' : 'transparent',
                  color: active ? '#C9A96E' : 'rgba(255,255,255,0.45)',
                  border: active ? '1px solid rgba(201,169,110,0.2)' : '1px solid transparent',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium text-[13px]">{item.label}</span>
                {active && <ChevronRight className="w-3 h-3 ml-auto opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-3 pb-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-3 px-3 py-3 rounded-lg mt-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-black text-xs font-bold flex-shrink-0" style={{ backgroundColor: '#C9A96E' }}>
              {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/60 truncate">{user?.full_name || 'Admin'}</p>
              <p className="text-[10px] text-white/25 truncate">{user?.email}</p>
            </div>
            <button onClick={() => base44.auth.logout()} title="Çıkış" className="text-white/25 hover:text-white/60 transition-colors">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="flex items-center justify-between px-6 lg:px-8 h-14 flex-shrink-0 sticky top-0 z-30"
          style={{
            background: 'rgba(7,9,13,0.9)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="flex items-center gap-3">
            {/* Mobile back */}
            <Link to="/lefevef/admin/panel" className="lg:hidden text-white/30 hover:text-white/70 transition-colors mr-1">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              <Link to="/lefevef/admin/panel" className="hover:text-white/60 transition-colors hidden lg:block">Panel</Link>
              <span className="hidden lg:block">/</span>
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>{title}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-[11px] tracking-wider text-white/25 hover:text-white/50 transition-colors hidden sm:block">
              ← Siteye Dön
            </Link>
            <button onClick={() => base44.auth.logout()} className="lg:hidden text-white/30 hover:text-white/60 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {/* Page header */}
          <div
            className="px-6 lg:px-8 py-6"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
          >
            {subtitle && (
              <p className="text-[10px] tracking-[0.35em] uppercase mb-1" style={{ color: '#C9A96E' }}>
                {subtitle}
              </p>
            )}
            <h1 className="font-display text-2xl lg:text-3xl text-white font-semibold">{title}</h1>
          </div>
          <div className="px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}