import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, Eye, EyeOff, GripVertical,
  ArrowLeft, ImageIcon, Save, X, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const SIZE_LABELS = {
  normal: 'Normal',
  tall: 'Tall (büyük)',
  plain: 'Plain (açık zemin)',
};

const SIZE_COLORS = {
  normal: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  tall: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  plain: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
};

const EMPTY_FORM = {
  label: '',
  path: '',
  image_url: '',
  size: 'normal',
  sort_order: 0,
  is_active: true,
};

export default function AdminCategories() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editingCard, setEditingCard] = useState(null); // null | 'new' | {card}
  const [form, setForm] = useState(EMPTY_FORM);

  const { data: cards = [], isLoading } = useQuery({
    queryKey: ['categoryCards'],
    queryFn: () => base44.entities.CategoryCard.list('sort_order', 100),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.CategoryCard.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categoryCards'] });
      toast({ title: 'Kart oluşturuldu' });
      closeForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.CategoryCard.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categoryCards'] });
      toast({ title: 'Kart güncellendi' });
      closeForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.CategoryCard.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categoryCards'] });
      toast({ title: 'Kart silindi' });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }) => base44.entities.CategoryCard.update(id, { is_active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categoryCards'] }),
  });

  const openNew = () => {
    setForm({ ...EMPTY_FORM, sort_order: cards.length + 1 });
    setEditingCard('new');
  };

  const openEdit = (card) => {
    setForm({
      label: card.label || '',
      path: card.path || '',
      image_url: card.image_url || '',
      size: card.size || 'normal',
      sort_order: card.sort_order || 0,
      is_active: card.is_active ?? true,
    });
    setEditingCard(card);
  };

  const closeForm = () => {
    setEditingCard(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCard === 'new') {
      createMutation.mutate(form);
    } else {
      updateMutation.mutate({ id: editingCard.id, data: form });
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0D1B2A' }}>
        <p className="text-white/50">Erişim yok</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20" style={{ backgroundColor: '#0D1B2A' }}>
      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-white/40 hover:text-white/70 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <p className="text-xs tracking-[0.35em] uppercase mb-1" style={{ color: '#C9A96E' }}>Admin</p>
              <h1 className="font-display text-3xl text-white font-semibold">Category Cards</h1>
            </div>
          </div>
          <Button
            onClick={openNew}
            className="gap-2 text-black font-semibold"
            style={{ backgroundColor: '#C9A96E' }}
          >
            <Plus className="w-4 h-4" />
            Yeni Kart
          </Button>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Toplam Kart', value: cards.length },
            { label: 'Aktif', value: cards.filter(c => c.is_active).length },
            { label: 'Pasif', value: cards.filter(c => !c.is_active).length },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-4 text-center"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <p className="font-display text-2xl text-white font-bold">{s.value}</p>
              <p className="text-xs text-white/40 mt-1 tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Card List */}
        {isLoading ? (
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-20 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {cards.map((card, idx) => (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="flex items-center gap-4 rounded-xl px-4 py-3 group"
                style={{
                  background: card.is_active ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  opacity: card.is_active ? 1 : 0.55,
                }}
              >
                {/* Drag handle visual */}
                <GripVertical className="w-4 h-4 text-white/20 flex-shrink-0" />

                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                  {card.image_url ? (
                    <img src={card.image_url} alt={card.label} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-white/20" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-white text-sm">{card.label}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${SIZE_COLORS[card.size] || SIZE_COLORS.normal}`}>
                      {SIZE_LABELS[card.size] || card.size}
                    </span>
                  </div>
                  <p className="text-xs text-white/40 mt-0.5 truncate">{card.path}</p>
                </div>

                {/* Sort order */}
                <span className="text-xs text-white/30 w-6 text-center flex-shrink-0">#{card.sort_order}</span>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => toggleMutation.mutate({ id: card.id, is_active: !card.is_active })}
                    className="p-2 rounded-lg transition-colors text-white/40 hover:text-white hover:bg-white/10"
                    title={card.is_active ? 'Gizle' : 'Göster'}
                  >
                    {card.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => openEdit(card)}
                    className="p-2 rounded-lg transition-colors text-white/40 hover:text-white hover:bg-white/10"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(card.id)}
                    className="p-2 rounded-lg transition-colors text-white/40 hover:text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Live preview link */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs tracking-wider text-white/30 hover:text-white/60 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Ana sayfada önizle
          </Link>
        </div>
      </div>

      {/* Edit / Create Drawer */}
      <AnimatePresence>
        {editingCard !== null && (
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
              {/* Drawer Header */}
              <div
                className="flex items-center justify-between px-6 py-5"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase mb-0.5" style={{ color: '#C9A96E' }}>
                    {editingCard === 'new' ? 'Yeni' : 'Düzenle'}
                  </p>
                  <h2 className="font-display text-xl text-white">Category Card</h2>
                </div>
                <button onClick={closeForm} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Image Preview */}
                <div
                  className="w-full h-44 rounded-xl overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {form.image_url ? (
                    <img src={form.image_url} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                      <ImageIcon className="w-8 h-8 text-white/20" />
                      <p className="text-xs text-white/30">Görsel URL girin</p>
                    </div>
                  )}
                </div>

                {/* Fields */}
                <FormField label="Etiket (Label)">
                  <Input
                    value={form.label}
                    onChange={(e) => setForm(p => ({ ...p, label: e.target.value }))}
                    placeholder="Marble Slabs"
                    required
                    className="dark-input"
                    style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: 'white' }}
                  />
                </FormField>

                <FormField label="Yönlendirme Yolu (Path)">
                  <Input
                    value={form.path}
                    onChange={(e) => setForm(p => ({ ...p, path: e.target.value }))}
                    placeholder="/products?category=slab"
                    required
                    style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: 'white' }}
                  />
                </FormField>

                <FormField label="Görsel URL">
                  <Input
                    value={form.image_url}
                    onChange={(e) => setForm(p => ({ ...p, image_url: e.target.value }))}
                    placeholder="https://images.unsplash.com/..."
                    style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: 'white' }}
                  />
                </FormField>

                <FormField label="Kart Boyutu">
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(SIZE_LABELS).map(([val, lbl]) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setForm(p => ({ ...p, size: val }))}
                        className={`py-2.5 rounded-lg text-xs font-medium border transition-all ${
                          form.size === val
                            ? 'text-black border-transparent'
                            : 'text-white/50 border-white/10 hover:border-white/20'
                        }`}
                        style={form.size === val ? { backgroundColor: '#C9A96E' } : { backgroundColor: 'rgba(255,255,255,0.04)' }}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </FormField>

                <FormField label="Sıralama (1 = ilk)">
                  <Input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => setForm(p => ({ ...p, sort_order: Number(e.target.value) }))}
                    min={0}
                    style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: 'white' }}
                  />
                </FormField>

                <FormField label="Durum">
                  <div className="flex gap-2">
                    {[{ val: true, lbl: '👁 Aktif' }, { val: false, lbl: '🚫 Pasif' }].map(({ val, lbl }) => (
                      <button
                        key={String(val)}
                        type="button"
                        onClick={() => setForm(p => ({ ...p, is_active: val }))}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-medium border transition-all ${
                          form.is_active === val
                            ? 'text-black border-transparent'
                            : 'text-white/50 border-white/10 hover:border-white/20'
                        }`}
                        style={form.is_active === val ? { backgroundColor: '#C9A96E' } : { backgroundColor: 'rgba(255,255,255,0.04)' }}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </FormField>

                {/* Submit */}
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={closeForm}
                    className="flex-1 text-white/50 hover:text-white border border-white/10"
                  >
                    İptal
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="flex-1 gap-2 text-black font-semibold"
                    style={{ backgroundColor: '#C9A96E' }}
                  >
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

function FormField({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] tracking-[0.2em] uppercase text-white/40">{label}</label>
      {children}
    </div>
  );
}