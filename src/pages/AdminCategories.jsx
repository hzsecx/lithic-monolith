import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical, ImageIcon, Save, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';

const SIZE_LABELS = { normal: 'Normal', tall: 'Tall', plain: 'Plain' };
const SIZE_COLORS = {
  normal: { bg: 'rgba(108,142,245,0.12)', text: '#6C8EF5', border: 'rgba(108,142,245,0.2)' },
  tall: { bg: 'rgba(168,85,247,0.12)', text: '#A855F7', border: 'rgba(168,85,247,0.2)' },
  plain: { bg: 'rgba(251,191,36,0.12)', text: '#FBBF24', border: 'rgba(251,191,36,0.2)' },
};

const EMPTY_FORM = { label: '', path: '', image_url: '', size: 'normal', sort_order: 0, is_active: true };

const inputStyle = { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' };

function FormField({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] tracking-[0.2em] uppercase font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</label>
      {children}
    </div>
  );
}

export default function AdminCategories() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editingCard, setEditingCard] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const { data: cards = [], isLoading } = useQuery({
    queryKey: ['categoryCards'],
    queryFn: () => base44.entities.CategoryCard.list('sort_order', 100),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.CategoryCard.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categoryCards'] }); toast({ title: 'Kart oluşturuldu' }); closeForm(); },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.CategoryCard.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categoryCards'] }); toast({ title: 'Kart güncellendi' }); closeForm(); },
  });
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.CategoryCard.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categoryCards'] }); toast({ title: 'Kart silindi' }); },
  });
  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }) => base44.entities.CategoryCard.update(id, { is_active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categoryCards'] }),
  });

  const openNew = () => { setForm({ ...EMPTY_FORM, sort_order: cards.length + 1 }); setEditingCard('new'); };
  const openEdit = (card) => {
    setForm({ label: card.label || '', path: card.path || '', image_url: card.image_url || '', size: card.size || 'normal', sort_order: card.sort_order || 0, is_active: card.is_active ?? true });
    setEditingCard(card);
  };
  const closeForm = () => { setEditingCard(null); setForm(EMPTY_FORM); };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCard === 'new') createMutation.mutate(form);
    else updateMutation.mutate({ id: editingCard.id, data: form });
  };

  if (user?.role !== 'admin') return null;

  return (
    <AdminLayout title="Category Cards" subtitle="Ana Sayfa">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Toplam', value: cards.length },
          { label: 'Aktif', value: cards.filter(c => c.is_active).length },
          { label: 'Pasif', value: cards.filter(c => !c.is_active).length },
        ].map((s) => (
          <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="font-display text-2xl text-white font-bold">{s.value}</p>
            <p className="text-[11px] text-white/35 mt-1 tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-white/25 hover:text-white/50 transition-colors">
          <ExternalLink className="w-3 h-3" />
          Ana sayfada önizle
        </Link>
        <Button onClick={openNew} className="gap-2 text-black font-semibold" style={{ backgroundColor: '#C9A96E' }}>
          <Plus className="w-4 h-4" />
          Yeni Kart
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
        <div
          className="hidden sm:grid grid-cols-[16px_56px_1fr_80px_40px_80px] gap-4 px-4 py-3 text-[10px] tracking-[0.2em] uppercase font-medium"
          style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.3)' }}
        >
          <span></span><span></span><span>Kart</span><span>Boyut</span><span>#</span><span className="text-right">İşlem</span>
        </div>

        {isLoading ? (
          <div className="divide-y divide-white/5">
            {Array(5).fill(0).map((_, i) => <div key={i} className="h-16 animate-pulse" style={{ background: 'rgba(255,255,255,0.02)' }} />)}
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            {cards.map((card, idx) => {
              const sc = SIZE_COLORS[card.size] || SIZE_COLORS.normal;
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="grid sm:grid-cols-[16px_56px_1fr_80px_40px_80px] grid-cols-[16px_56px_1fr_auto] items-center gap-4 px-4 py-3 transition-colors"
                  style={{ opacity: card.is_active ? 1 : 0.45 }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <GripVertical className="w-3.5 h-3.5 text-white/15" />
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5">
                    {card.image_url ? <img src={card.image_url} alt={card.label} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-4 h-4 text-white/20" /></div>}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{card.label}</p>
                    <p className="text-xs text-white/30 mt-0.5 truncate">{card.path}</p>
                  </div>
                  <span className="hidden sm:inline-flex items-center text-[10px] font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
                    {SIZE_LABELS[card.size]}
                  </span>
                  <span className="hidden sm:block text-xs text-center" style={{ color: 'rgba(255,255,255,0.25)' }}>#{card.sort_order}</span>
                  <div className="flex items-center gap-1 justify-end">
                    <button
                      onClick={() => toggleMutation.mutate({ id: card.id, is_active: !card.is_active })}
                      title={card.is_active ? 'Gizle' : 'Göster'}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: card.is_active ? '#5EC4A1' : 'rgba(255,255,255,0.25)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {card.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => openEdit(card)}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: 'rgba(255,255,255,0.3)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'white'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(card.id)}
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
        {editingCard !== null && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={closeForm} />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md overflow-y-auto"
              style={{ background: '#0C1018', borderLeft: '1px solid rgba(201,169,110,0.15)' }}
            >
              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <div>
                  <p className="text-[9px] tracking-[0.35em] uppercase mb-0.5" style={{ color: '#C9A96E' }}>{editingCard === 'new' ? 'Yeni Kart' : 'Düzenle'}</p>
                  <h2 className="font-display text-lg text-white">{editingCard === 'new' ? 'Kart Ekle' : form.label || 'Kart'}</h2>
                </div>
                <button onClick={closeForm} className="p-2 rounded-lg" style={{ color: 'rgba(255,255,255,0.3)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="w-full h-36 rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {form.image_url ? <img src={form.image_url} alt="preview" className="w-full h-full object-cover" /> : <div className="w-full h-full flex flex-col items-center justify-center gap-2"><ImageIcon className="w-7 h-7 text-white/15" /><p className="text-xs text-white/25">Görsel URL girin</p></div>}
                </div>

                <FormField label="Etiket">
                  <Input value={form.label} onChange={(e) => setForm(p => ({ ...p, label: e.target.value }))} placeholder="Marble Slabs" required style={inputStyle} />
                </FormField>
                <FormField label="Yönlendirme Yolu">
                  <Input value={form.path} onChange={(e) => setForm(p => ({ ...p, path: e.target.value }))} placeholder="/products?category=slab" required style={inputStyle} />
                </FormField>
                <FormField label="Görsel URL">
                  <Input value={form.image_url} onChange={(e) => setForm(p => ({ ...p, image_url: e.target.value }))} placeholder="https://..." style={inputStyle} />
                </FormField>
                <FormField label="Kart Boyutu">
                  <div className="grid grid-cols-3 gap-1.5">
                    {Object.entries(SIZE_LABELS).map(([val, lbl]) => (
                      <button key={val} type="button" onClick={() => setForm(p => ({ ...p, size: val }))}
                        className="py-2 rounded-lg text-xs font-medium border transition-all"
                        style={form.size === val ? { backgroundColor: '#C9A96E', color: '#000', borderColor: 'transparent' } : { backgroundColor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', borderColor: 'rgba(255,255,255,0.08)' }}
                      >{lbl}</button>
                    ))}
                  </div>
                </FormField>
                <FormField label="Sıralama">
                  <Input type="number" value={form.sort_order} onChange={(e) => setForm(p => ({ ...p, sort_order: Number(e.target.value) }))} min={0} style={inputStyle} />
                </FormField>
                <FormField label="Durum">
                  <div className="flex gap-2">
                    {[{ val: true, lbl: 'Aktif' }, { val: false, lbl: 'Pasif' }].map(({ val, lbl }) => (
                      <button key={String(val)} type="button" onClick={() => setForm(p => ({ ...p, is_active: val }))}
                        className="flex-1 py-2 rounded-lg text-xs font-medium border transition-all"
                        style={form.is_active === val ? { backgroundColor: '#C9A96E', color: '#000', borderColor: 'transparent' } : { backgroundColor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', borderColor: 'rgba(255,255,255,0.08)' }}
                      >{lbl}</button>
                    ))}
                  </div>
                </FormField>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="ghost" onClick={closeForm} className="flex-1 text-white/40 hover:text-white" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>İptal</Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="flex-1 gap-2 text-black font-semibold" style={{ backgroundColor: '#C9A96E' }}>
                    <Save className="w-4 h-4" />Kaydet
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