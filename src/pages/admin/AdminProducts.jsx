import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, ArrowLeft, Save, X, ImageIcon, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const CATEGORIES = ['slab', 'tile', 'block', 'mosaic', 'countertop'];
const STOCK_STATUSES = ['in_stock', 'low_stock', 'out_of_stock', 'made_to_order'];
const STOCK_COLORS = {
  in_stock: 'bg-green-500/15 text-green-300 border-green-500/30',
  low_stock: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  out_of_stock: 'bg-red-500/15 text-red-300 border-red-500/30',
  made_to_order: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
};
const STOCK_LABELS = {
  in_stock: 'Stokta',
  low_stock: 'Az Stok',
  out_of_stock: 'Stok Yok',
  made_to_order: 'Sipariş',
};

const EMPTY_FORM = {
  name: '',
  category: 'slab',
  price_per_sqm: '',
  stock_status: 'in_stock',
  origin: '',
  image_url: '',
  description: '',
};

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      toast({ title: 'Ürün oluşturuldu' });
      closeForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.MarbleProduct.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      toast({ title: 'Ürün güncellendi' });
      closeForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.MarbleProduct.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      toast({ title: 'Ürün silindi' });
    },
  });

  const openNew = () => {
    setForm(EMPTY_FORM);
    setEditingProduct('new');
  };

  const openEdit = (product) => {
    setForm({
      name: product.name || '',
      category: product.category || 'slab',
      price_per_sqm: product.price_per_sqm ?? '',
      stock_status: product.stock_status || 'in_stock',
      origin: product.origin || '',
      image_url: product.image_url || '',
      description: product.description || '',
    });
    setEditingProduct(product);
  };

  const closeForm = () => {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form, price_per_sqm: Number(form.price_per_sqm) };
    if (editingProduct === 'new') {
      createMutation.mutate(data);
    } else {
      updateMutation.mutate({ id: editingProduct.id, data });
    }
  };

  const filtered = products.filter(p =>
    !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.origin?.toLowerCase().includes(search.toLowerCase())
  );

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0D1B2A' }}>
        <p className="text-white/50">Erişim yok</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20" style={{ backgroundColor: '#0D1B2A' }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/lefevef/admin/panel" className="text-white/40 hover:text-white/70 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <p className="text-xs tracking-[0.35em] uppercase mb-1" style={{ color: '#C9A96E' }}>Admin</p>
              <h1 className="font-display text-3xl text-white font-semibold">Ürünler</h1>
            </div>
          </div>
          <Button onClick={openNew} className="gap-2 text-black font-semibold" style={{ backgroundColor: '#C9A96E' }}>
            <Plus className="w-4 h-4" />
            Yeni Ürün
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Toplam', value: products.length },
            { label: 'Stokta', value: products.filter(p => p.stock_status === 'in_stock').length },
            { label: 'Az Stok', value: products.filter(p => p.stock_status === 'low_stock').length },
            { label: 'Stok Yok', value: products.filter(p => p.stock_status === 'out_of_stock').length },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="font-display text-2xl text-white font-bold">{s.value}</p>
              <p className="text-xs text-white/40 mt-1 tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input
            placeholder="İsim veya köken ile ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 text-white placeholder:text-white/30"
            style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: 'white' }}
          />
        </div>

        {/* Product List */}
        {isLoading ? (
          <div className="space-y-3">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-20 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((product, idx) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="flex items-center gap-4 rounded-xl px-4 py-3"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-white/20" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-white text-sm">{product.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${STOCK_COLORS[product.stock_status] || STOCK_COLORS.in_stock}`}>
                      {STOCK_LABELS[product.stock_status] || product.stock_status}
                    </span>
                  </div>
                  <p className="text-xs text-white/40 mt-0.5">
                    {product.category} {product.origin ? `· ${product.origin}` : ''}
                  </p>
                </div>

                {/* Price */}
                <span className="text-sm font-semibold flex-shrink-0" style={{ color: '#C9A96E' }}>
                  ${product.price_per_sqm}/m²
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => openEdit(product)}
                    className="p-2 rounded-lg transition-colors text-white/40 hover:text-white hover:bg-white/10"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(product.id)}
                    className="p-2 rounded-lg transition-colors text-white/40 hover:text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-white/30 py-16">Ürün bulunamadı</p>
            )}
          </div>
        )}
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {editingProduct !== null && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={closeForm}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md overflow-y-auto"
              style={{
                background: 'linear-gradient(135deg, #111927 0%, #0D1B2A 100%)',
                borderLeft: '1px solid rgba(201,169,110,0.2)',
              }}
            >
              <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase mb-0.5" style={{ color: '#C9A96E' }}>
                    {editingProduct === 'new' ? 'Yeni' : 'Düzenle'}
                  </p>
                  <h2 className="font-display text-xl text-white">Ürün</h2>
                </div>
                <button onClick={closeForm} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Image Preview */}
                <div className="w-full h-44 rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {form.image_url ? (
                    <img src={form.image_url} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                      <ImageIcon className="w-8 h-8 text-white/20" />
                      <p className="text-xs text-white/30">Görsel URL girin</p>
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

                <FormField label="Kategori">
                  <div className="grid grid-cols-3 gap-2">
                    {CATEGORIES.map(cat => (
                      <button key={cat} type="button" onClick={() => setForm(p => ({ ...p, category: cat }))}
                        className={`py-2.5 rounded-lg text-xs font-medium border transition-all capitalize ${form.category === cat ? 'text-black border-transparent' : 'text-white/50 border-white/10 hover:border-white/20'}`}
                        style={form.category === cat ? { backgroundColor: '#C9A96E' } : { backgroundColor: 'rgba(255,255,255,0.04)' }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </FormField>

                <FormField label="Stok Durumu">
                  <div className="grid grid-cols-2 gap-2">
                    {STOCK_STATUSES.map(s => (
                      <button key={s} type="button" onClick={() => setForm(p => ({ ...p, stock_status: s }))}
                        className={`py-2.5 rounded-lg text-xs font-medium border transition-all ${form.stock_status === s ? 'text-black border-transparent' : 'text-white/50 border-white/10 hover:border-white/20'}`}
                        style={form.stock_status === s ? { backgroundColor: '#C9A96E' } : { backgroundColor: 'rgba(255,255,255,0.04)' }}
                      >
                        {STOCK_LABELS[s]}
                      </button>
                    ))}
                  </div>
                </FormField>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="ghost" onClick={closeForm} className="flex-1 text-white/50 hover:text-white border border-white/10">
                    İptal
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="flex-1 gap-2 text-black font-semibold" style={{ backgroundColor: '#C9A96E' }}>
                    <Save className="w-4 h-4" />
                    Kaydet
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputStyle = { backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: 'white' };

function FormField({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] tracking-[0.2em] uppercase text-white/40">{label}</label>
      {children}
    </div>
  );
}