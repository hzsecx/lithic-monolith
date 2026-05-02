import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, Settings, Gem, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminLayout from '@/components/admin/AdminLayout';

const MENU = [
  {
    label: 'Category Cards',
    description: 'Ana sayfa kategori kartlarını ekle, düzenle, sırala',
    icon: LayoutGrid,
    path: '/lefevef/admin/categories',
    color: '#6C8EF5',
    bg: 'rgba(108,142,245,0.08)',
    border: 'rgba(108,142,245,0.2)',
  },
  {
    label: 'Ürün Yönetimi',
    description: 'Mermer ürünlerini ekle, düzenle, fiyatlandır',
    icon: Gem,
    path: '/lefevef/admin/products',
    color: '#C9A96E',
    bg: 'rgba(201,169,110,0.08)',
    border: 'rgba(201,169,110,0.2)',
  },
  {
    label: 'Site Ayarları',
    description: 'Adres, telefon ve iletişim bilgileri',
    icon: Settings,
    path: '/lefevef/admin/settings',
    color: '#5EC4A1',
    bg: 'rgba(94,196,161,0.08)',
    border: 'rgba(94,196,161,0.2)',
  },
];

export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: products = [] } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: () => base44.entities.MarbleProduct.list('-created_date', 200),
  });
  const { data: cards = [] } = useQuery({
    queryKey: ['categoryCards'],
    queryFn: () => base44.entities.CategoryCard.list('sort_order', 100),
  });

  useEffect(() => {
    if (!user) return;
    if (user.role !== 'admin') navigate('/lefevef/admin');
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  const stats = [
    { label: 'Toplam Ürün', value: products.length },
    { label: 'Stokta', value: products.filter(p => p.stock_status === 'in_stock').length },
    { label: 'Az Stok', value: products.filter(p => p.stock_status === 'low_stock').length },
    { label: 'Aktif Kart', value: cards.filter(c => c.is_active).length },
  ];

  return (
    <AdminLayout title="Genel Bakış" subtitle="Admin">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-xl p-4"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <p className="font-display text-3xl text-white font-bold">{s.value}</p>
            <p className="text-[11px] text-white/35 mt-1 tracking-wider">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Menu Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MENU.map((item, i) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08 }}
          >
            <Link
              to={item.path}
              className="block rounded-2xl p-6 transition-all duration-200 hover:scale-[1.02] group"
              style={{ background: item.bg, border: `1px solid ${item.border}` }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.3)`}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: item.bg, border: `1px solid ${item.border}` }}
                >
                  <item.icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <ArrowRight className="w-4 h-4 opacity-30 group-hover:opacity-70 transition-opacity" style={{ color: item.color }} />
              </div>
              <p className="font-display text-lg text-white font-semibold mb-1">{item.label}</p>
              <p className="text-xs text-white/35 leading-relaxed">{item.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </AdminLayout>
  );
}