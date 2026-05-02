import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Save, X, ImageIcon, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';

const CATEGORIES = ['slab', 'tile', 'block', 'mosaic', 'countertop'];
const STOCK_STATUSES = ['in_stock', 'low_stock', 'out_of_stock', 'made_to_order'];
const STOCK_COLORS = {
  in_stock: { bg: 'rgba(94,196,161,0.12)', text: '#5EC4A1', border: 'rgba(94,196,161,0.25)' },
  low_stock: { bg: 'rgba(251,191,36,0.12)', text: '#FBBf24', border: 'rgba(251,191,36,0.25)' },
  out_of_stock: { bg: 'rgba(239,68,68,0.12)', text: '#EF4444', border: 'rgba(239,68,68,0.25)' },
  made_to_order: { bg: 'rgba(108,142,245,0.12)', text: '#6C8EF5', border: 'rgba(108,142,245,0.25)' },
};
const STOCK_LABELS = { in_stock: 'Stokta', low_stock: 'Az Stok', out_of_stock: 'Stok Yok', made_to_order: 'Sipariş' };

const EMPTY_FORM = {
  name: '', category: 'slab', price_per_sqm: '', stock_status: 'in_stock',
  origin: '', image_url: '', description: '', slabs_remaining: '', featured: false,
};

const inputStyle = {
  backgroundColor: 'rgba(255,255,255,0.05)',
  borderColor: 'rgba(255,255,255,0.1)',
  color: 'white',
};

function FormField({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] tracking-[0.2em] uppercase font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</label>
      {children}
    </div>
  );
}

export default function AdminProducts() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState('');

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: () => base44.entities.MarbleProduct.list('-created_date', 200),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.MarbleProduct.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['adminProducts'] }); toast({ title: 'Ürün oluşturuldu' }); closeForm(); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.MarbleProduct.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['adminProducts'] }); toast({ title: 'Ürün güncellendi' }); closeForm(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.MarbleProduct.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['adminProducts'] }); toast({ title: 'Ürün silindi' }); },
  });

  const openNew = () => { setForm(EMPTY_FORM); setEditingProduct('new'); };
  const openEdit = (p) => {
    setForm({ name: p.name || '', category: p.category || 'slab', price_per_sqm: p.price_per_sqm ?? '', stock_status: p.stock_status || 'in_stock', origin: p.origin || '', image_url: p.image_url || '', description: p.description || '', slabs_remaining: p.slabs_remaining ?? '', featured: p.featured ?? false });
    setEditingProduct(p);
  };
  const closeForm = () => { setEditingProduct(null); setForm(EMPTY_FORM); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form, price_per_sqm: Number(form.price_per_sqm), slabs_remaining: form.slabs_remaining !== '' ? Number(form.slabs_remaining) : undefined };
    if (editingProduct === 'new') createMutation.mutate(data);
    else updateMutation.mutate({ id: editingProduct.id, data });
  };

  const filtered = products.filter(p =>
    !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.origin?.toLowerCase().includes(search.toLowerCase())
  );

  if (user?.role !== 'admin') return null;

  const stats = [
    { label: 'Toplam', value: products.length },
    { label: 'Stokta', value: products.filter(p => p.stock_status === 'in_stock').length },
    { label: 'Az Stok', value: products.filter(p => p.stock_status === 'low_stock').length },
    { label: 'Stok Yok', value: products.filter(p => p.stock_status === 'out_of_stock').length },
  ];

  return (
    <AdminLayout title="Ürün Yönetimi" subtitle="Katalog">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="font-display text-2xl text-white font-bold">{s.value}</p>
            <p className="text-[11px] text-white/35 mt-1 tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
          <Input
            placeholder="Ürün adı veya köken ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 text-white placeholder:text-white/25"
            style={inputStyle}
          />
        </div>
        <Button onClick={openNew} className="gap-2 text-black font-semibold flex-shrink-0" style={{ backgroundColor: '#C9A96E' }}>
          <Plus className="w-4 h-4" />
          Yeni Ürün
        </Button>
      </div>

      {/* Table-style list */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
        {/* Header row */}
        <div
          className="hidden sm:grid grid-cols-[56px_1fr_100px_90px_100px_80px] gap-4 px-4 py-3 text-[10px] tracking-[0.2em] uppercase font-medium"
          style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.3)' }}
        >
          <span></span>
          <span>Ürün</span>
          <span>Kategori</span>
          <span>Fiyat</span>
          <span>Durum</span>
          <span className="text-right">İşlem</span>
        </div>

        {isLoading ? (
          <div className="divide-y divide-white/5">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-16 animate-pulse" style={{ background: 'rgba(255,255,255,0.02)' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-white/25 text-sm">Ürün bulunamadı</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            {filtered.map((product, idx) => {
              const sc = STOCK_COLORS[product.stock_status] || STOCK_COLORS.in_stock;
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  className="grid sm:grid-cols-[56px_1fr_100px_90px_100px_80px] grid-cols-[56px_1fr_auto] items-center gap-4 px-4 py-3 transition-colors"
                  style={{ background: 'transparent' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Thumb */}
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 text-white/20" />
                      </div>
                    )}
                  </div>

                  {/* Name + origin */}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{product.name}</p>
                    {product.origin && <p className="text-xs text-white/30 mt-0.5">{product.origin}</p>}
                  </div>

                  {/* Category */}
                  <span className="hidden sm:block text-xs text-white/40 capitalize">{product.category}</span>

                  {/* Price */}
                  <span className="hidden sm:block text-sm font-semibold" style={{ color: '#C9A96E' }}>
                    ${product.price_per_sqm}
                  </span>

                  {/* Status badge */}
                  <span
                    className="hidden sm:inline-flex items-center text-[10px] font-medium px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}
                  >
                    {STOCK_LABELS[product.stock_status]}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-1 justify-end">
                    <button
                      onClick={() => openEdit(product)}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: 'rgba(255,255,255,0.3)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'white'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(product.id)}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: 'rgba(255,255,255,0.3)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#EF4444'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {editingProduct !== null && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
              onClick={closeForm}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md overflow-y-auto flex flex-col"
              style={{ background: '#0C1018', borderLeft: '1px solid rgba(201,169,110,0.15)' }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <div>
                  <p className="text-[9px] tracking-[0.35em] uppercase mb-0.5" style={{ color: '#C9A96E' }}>
                    {editingProduct === 'new' ? 'Yeni Ürün' : 'Düzenle'}
                  </p>
                  <h2 className="font-display text-lg text-white">{editingProduct === 'new' ? 'Ürün Ekle' : form.name || 'Ürün'}</h2>
                </div>
                <button onClick={closeForm} className="p-2 rounded-lg transition-colors" style={{ color: 'rgba(255,255,255,0.3)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-5">
                {/* Image preview */}
                <div className="w-full h-40 rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {form.image_url ? (
                    <img src={form.image_url} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                      <ImageIcon className="w-7 h-7 text-white/15" />
                      <p className="text-xs text-white/25">Görsel URL girin</p>
                    </div>
                  )}
                </div>

                <FormField label="Ürün Adı">
                  <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Calacatta Gold" required style={inputStyle} />
                </FormField>

                <FormField label="Görsel URL">
                  <Input value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} placeholder="https://..." style={inputStyle} />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Fiyat ($/m²)">
                    <Input type="number" value={form.price_per_sqm} onChange={e => setForm(p => ({ ...p, price_per_sqm: e.target.value }))} placeholder="150" required min={0} style={inputStyle} />
                  </FormField>
                  <FormField label="Köken">
                    <Input value={form.origin} onChange={e => setForm(p => ({ ...p, origin: e.target.value }))} placeholder="Italy" style={inputStyle} />
                  </FormField>
                </div>

                <FormField label="Açıklama">
                  <Textarea
                    value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Ürün hakkında detaylı açıklama..."
                    rows={3}
                    style={{ ...inputStyle, resize: 'none' }}
                  />
                </FormField>

                <FormField label="Kategori">
                  <div className="grid grid-cols-3 gap-1.5">
                    {CATEGORIES.map(cat => (
                      <button key={cat} type="button" onClick={() => setForm(p => ({ ...p, category: cat }))}
                        className="py-2 rounded-lg text-xs font-medium border transition-all capitalize"
                        style={form.category === cat
                          ? { backgroundColor: '#C9A96E', color: '#000', borderColor: 'transparent' }
                          : { backgroundColor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', borderColor: 'rgba(255,255,255,0.08)' }
                        }
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Stok Adedi (adet)">
                    <Input type="number" value={form.slabs_remaining} onChange={e => setForm(p => ({ ...p, slabs_remaining: e.target.value }))} placeholder="0" min={0} style={inputStyle} />
                  </FormField>
                  <FormField label="Öne Çıkan">
                    <div className="flex gap-2 h-9">
                      {[{ val: true, lbl: 'Evet' }, { val: false, lbl: 'Hayır' }].map(({ val, lbl }) => (
                        <button key={String(val)} type="button" onClick={() => setForm(p => ({ ...p, featured: val }))}
                          className="flex-1 rounded-lg text-xs font-medium border transition-all"
                          style={form.featured === val
                            ? { backgroundColor: '#C9A96E', color: '#000', borderColor: 'transparent' }
                            : { backgroundColor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', borderColor: 'rgba(255,255,255,0.08)' }
                          }
                        >{lbl}</button>
                      ))}
                    </div>
                  </FormField>
                </div>

                <FormField label="Stok Durumu">
                  <div className="grid grid-cols-2 gap-1.5">
                    {STOCK_STATUSES.map(s => (
                      <button key={s} type="button" onClick={() => setForm(p => ({ ...p, stock_status: s }))}
                        className="py-2 rounded-lg text-xs font-medium border transition-all"
                        style={form.stock_status === s
                          ? { backgroundColor: '#C9A96E', color: '#000', borderColor: 'transparent' }
                          : { backgroundColor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', borderColor: 'rgba(255,255,255,0.08)' }
                        }
                      >
                        {STOCK_LABELS[s]}
                      </button>
                    ))}
                  </div>
                </FormField>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="ghost" onClick={closeForm}
                    className="flex-1 text-white/40 hover:text-white"
                    style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                    İptal
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}
                    className="flex-1 gap-2 text-black font-semibold" style={{ backgroundColor: '#C9A96E' }}>
                    <Save className="w-4 h-4" />
                    Kaydet
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}