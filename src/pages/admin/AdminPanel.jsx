import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, Settings, ArrowLeft, LogOut, Gem } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const MENU = [
  {
    label: 'Category Cards',
    description: 'Ana sayfa kategori kartlarını yönet',
    icon: LayoutGrid,
    path: '/lefevef/admin/categories',
  },
  {
    label: 'Ürün Yönetimi',
    description: 'Mermer ürünlerini ekle, düzenle ve sil',
    icon: Gem,
    path: '/lefevef/admin/products',
  },
  {
    label: 'Site Ayarları',
    description: 'Adres, telefon ve iletişim bilgileri',
    icon: Settings,
    path: '/lefevef/admin/settings',
  },
];

export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    if (user.role !== 'admin') {
      navigate('/lefevef/admin');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#080E14' }}>
      {/* Top bar */}
      <div
        className="px-6 lg:px-12 h-16 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(201,169,110,0.12)' }}
      >
        <div className="flex items-center gap-3">
          <Link to="/" className="text-white/30 hover:text-white/60 transition-colors mr-1">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span
            className="font-display text-lg font-bold tracking-widest uppercase"
            style={{ color: '#C9A96E' }}
          >
            Lithic
          </span>
          <span className="text-white/20 text-xs tracking-widest">/ Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-white/30 hidden sm:block">{user.email}</span>
          <button
            onClick={() => base44.auth.logout()}
            className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Çıkış
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[10px] tracking-[0.4em] uppercase mb-1" style={{ color: '#C9A96E' }}>
            Admin
          </p>
          <h1 className="font-display text-3xl text-white font-semibold mb-10">Panel</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MENU.map((item, i) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={item.path}
                  className="block rounded-2xl p-6 transition-all duration-200 hover:scale-[1.02] group"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(201,169,110,0.3)';
                    e.currentTarget.style.background = 'rgba(201,169,110,0.05)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.2)' }}
                  >
                    <item.icon className="w-5 h-5" style={{ color: '#C9A96E' }} />
                  </div>
                  <p className="font-display text-lg text-white mb-1">{item.label}</p>
                  <p className="text-xs text-white/35">{item.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}