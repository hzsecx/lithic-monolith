import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Send, MapPin, Phone, Mail } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    company: '',
    project_type: '',
    product_name: '',
    message: '',
  });

  const mutation = useMutation({
    mutationFn: (data) => base44.entities.SampleRequest.create(data),
    onSuccess: () => {
      toast({ title: 'Talebiniz alındı', description: 'Ekibimiz en kısa sürede sizinle iletişime geçecektir.' });
      setForm({ full_name: '', email: '', phone: '', company: '', project_type: '', product_name: '', message: '' });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="pt-20 lg:pt-24 min-h-screen">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-3">İletişim</p>
            <h1 className="font-display text-4xl lg:text-5xl font-semibold tracking-tight mb-6">
              Projeniz Hakkında
              <br />
              <span className="italic font-normal">Konuşalım.</span>
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-12 max-w-md">
              Numune talebi, fiyat bilgisi veya özel proje danışmanlığı için formu doldurun.
              Ekibimiz 24 saat içinde sizinle iletişime geçecektir.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">Adres</p>
                  <p className="text-sm text-muted-foreground mt-0.5">Maslak, İstanbul, Türkiye</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">Telefon</p>
                  <p className="text-sm text-muted-foreground mt-0.5">+90 (212) 555 01 23</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">E-posta</p>
                  <p className="text-sm text-muted-foreground mt-0.5">info@lithicmonolith.com</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs tracking-wider uppercase text-muted-foreground mb-2 block">Ad Soyad *</label>
                  <Input
                    required
                    value={form.full_name}
                    onChange={(e) => updateField('full_name', e.target.value)}
                    className="bg-transparent"
                  />
                </div>
                <div>
                  <label className="text-xs tracking-wider uppercase text-muted-foreground mb-2 block">E-posta *</label>
                  <Input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="bg-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs tracking-wider uppercase text-muted-foreground mb-2 block">Telefon</label>
                  <Input
                    value={form.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="bg-transparent"
                  />
                </div>
                <div>
                  <label className="text-xs tracking-wider uppercase text-muted-foreground mb-2 block">Firma</label>
                  <Input
                    value={form.company}
                    onChange={(e) => updateField('company', e.target.value)}
                    className="bg-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs tracking-wider uppercase text-muted-foreground mb-2 block">Proje Tipi</label>
                <Select value={form.project_type} onValueChange={(v) => updateField('project_type', v)}>
                  <SelectTrigger className="bg-transparent">
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Konut</SelectItem>
                    <SelectItem value="commercial">Ticari</SelectItem>
                    <SelectItem value="hospitality">Otelcilik</SelectItem>
                    <SelectItem value="institutional">Kurumsal</SelectItem>
                    <SelectItem value="other">Diğer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs tracking-wider uppercase text-muted-foreground mb-2 block">İlgilendiğiniz Ürün</label>
                <Input
                  value={form.product_name}
                  onChange={(e) => updateField('product_name', e.target.value)}
                  placeholder="Örn: Calacatta Gold Levha"
                  className="bg-transparent"
                />
              </div>
              <div>
                <label className="text-xs tracking-wider uppercase text-muted-foreground mb-2 block">Mesajınız</label>
                <Textarea
                  value={form.message}
                  onChange={(e) => updateField('message', e.target.value)}
                  placeholder="Projeniz hakkında bilgi verin..."
                  className="bg-transparent min-h-[120px]"
                />
              </div>
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full h-12 tracking-widest uppercase text-sm"
              >
                <Send className="w-4 h-4 mr-2" />
                {mutation.isPending ? 'Gönderiliyor...' : 'Formu Gönder'}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}