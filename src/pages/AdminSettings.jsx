import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Save, MapPin, Phone, Mail, Clock, Map } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';

const inputStyle = { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' };

function SettingField({ icon: IconComp, label, children }) {
  const Icon = IconComp;
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-xl"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="flex items-center gap-3 sm:w-48 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.2)' }}>
          <Icon className="w-4 h-4" style={{ color: '#C9A96E' }} />
        </div>
        <label className="text-sm font-medium text-white/60">{label}</label>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

export default function AdminSettings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({ address: '', phone: '', email: '', working_hours: '', google_maps_url: '' });

  const { data: settings = [] } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: () => base44.entities.SiteSettings.list(),
  });

  useEffect(() => {
    if (settings.length > 0) {
      const s = settings[0];
      setForm({ address: s.address || '', phone: s.phone || '', email: s.email || '', working_hours: s.working_hours || '', google_maps_url: s.google_maps_url || '' });
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (settings.length > 0) return base44.entities.SiteSettings.update(settings[0].id, data);
      return base44.entities.SiteSettings.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
      toast({ title: 'Kaydedildi', description: 'Site bilgileri güncellendi.' });
    },
  });

  if (user?.role !== 'admin') return null;

  const fields = [
    { key: 'address', label: 'Adres', icon: MapPin, placeholder: 'Maslak, İstanbul, Türkiye' },
    { key: 'phone', label: 'Telefon', icon: Phone, placeholder: '+90 (212) 555 01 23' },
    { key: 'email', label: 'E-posta', icon: Mail, placeholder: 'info@lithicmonolith.com' },
    { key: 'working_hours', label: 'Çalışma Saatleri', icon: Clock, placeholder: 'Pzt–Cum: 09:00–18:00' },
    { key: 'google_maps_url', label: 'Google Maps URL', icon: Map, placeholder: 'https://maps.google.com/embed?...' },
  ];

  return (
    <AdminLayout title="Site Ayarları" subtitle="Ayarlar">
      <div className="max-w-2xl space-y-3">
        {fields.map(({ key, label, icon, placeholder }) => (
          <SettingField key={key} icon={icon} label={label}>
            <Input
              value={form[key]}
              onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))}
              placeholder={placeholder}
              style={inputStyle}
            />
          </SettingField>
        ))}

        <div className="pt-2">
          <Button
            onClick={() => mutation.mutate(form)}
            disabled={mutation.isPending}
            className="gap-2 text-black font-semibold px-8"
            style={{ backgroundColor: '#C9A96E' }}
          >
            <Save className="w-4 h-4" />
            {mutation.isPending ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}