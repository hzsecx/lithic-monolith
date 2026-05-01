import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Save, Settings } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function AdminSettings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    address: '',
    phone: '',
    email: '',
    working_hours: '',
    google_maps_url: '',
  });

  const { data: settings = [] } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: () => base44.entities.SiteSettings.list(),
  });

  useEffect(() => {
    if (settings.length > 0) {
      const s = settings[0];
      setForm({
        address: s.address || '',
        phone: s.phone || '',
        email: s.email || '',
        working_hours: s.working_hours || '',
        google_maps_url: s.google_maps_url || '',
      });
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (settings.length > 0) {
        return base44.entities.SiteSettings.update(settings[0].id, data);
      } else {
        return base44.entities.SiteSettings.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
      toast({ title: 'Saved', description: 'Site information updated successfully.' });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  if (user?.role !== 'admin') {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Access restricted to administrators.</p>
      </div>
    );
  }

  return (
    <div className="pt-20 lg:pt-24 min-h-screen">
      <div className="max-w-2xl mx-auto px-6 lg:px-12 py-12 lg:py-20">
        <div className="flex items-center gap-3 mb-10">
          <Settings className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground">Admin</p>
            <h1 className="font-display text-3xl font-semibold tracking-tight">Site Information</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-xs tracking-wider uppercase text-muted-foreground mb-2 block">Address</label>
            <Input
              value={form.address}
              onChange={(e) => setForm(p => ({ ...p, address: e.target.value }))}
              placeholder="Maslak, Istanbul, Turkey"
              className="bg-transparent"
            />
          </div>
          <div>
            <label className="text-xs tracking-wider uppercase text-muted-foreground mb-2 block">Phone</label>
            <Input
              value={form.phone}
              onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))}
              placeholder="+90 (212) 555 01 23"
              className="bg-transparent"
            />
          </div>
          <div>
            <label className="text-xs tracking-wider uppercase text-muted-foreground mb-2 block">Email</label>
            <Input
              value={form.email}
              onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder="info@lithicmonolith.com"
              className="bg-transparent"
            />
          </div>
          <div>
            <label className="text-xs tracking-wider uppercase text-muted-foreground mb-2 block">Working Hours</label>
            <Input
              value={form.working_hours}
              onChange={(e) => setForm(p => ({ ...p, working_hours: e.target.value }))}
              placeholder="Mon–Fri: 09:00–18:00"
              className="bg-transparent"
            />
          </div>
          <div>
            <label className="text-xs tracking-wider uppercase text-muted-foreground mb-2 block">Google Maps Embed URL</label>
            <Input
              value={form.google_maps_url}
              onChange={(e) => setForm(p => ({ ...p, google_maps_url: e.target.value }))}
              placeholder="https://maps.google.com/embed?..."
              className="bg-transparent"
            />
          </div>

          <Button type="submit" disabled={mutation.isPending} className="w-full h-12 tracking-widest uppercase text-sm">
            <Save className="w-4 h-4 mr-2" />
            {mutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </div>
  );
}