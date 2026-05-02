import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Package, MapPin, Ruler, Layers, Gem, ShoppingBag, ZoomIn, ChevronLeft, ChevronRight, Bell, AlertTriangle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import GeologicalSiblings from '../components/products/GeologicalSiblings';

const STOCK_CONFIG = {
  in_stock:      { label: 'In Stock',         color: '#5EC4A1', bg: 'rgba(94,196,161,0.1)',  border: 'rgba(94,196,161,0.25)'  },
  low_stock:     { label: 'Low Stock',         color: '#FBBF24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.25)'  },
  out_of_stock:  { label: 'Out of Stock',      color: '#EF4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)'   },
  made_to_order: { label: 'Made to Order',     color: '#A78BFA', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.25)' },
};

const FINISH_LABELS = {
  polished: 'Polished',
  honed: 'Honed',
  leathered: 'Leathered',
  brushed: 'Brushed',
  tumbled: 'Tumbled',
};

const PATTERN_LABELS = {
  minimal: 'Minimal Veining',
  moderate: 'Moderate Veining',
  high_movement: 'High Movement',
};

const CATEGORY_LABELS = {
  slab: 'Slab',
  tile: 'Tile',
  block: 'Block',
  countertop: 'Countertop',
  mosaic: 'Mosaic',
};

export default function ProductDetail() {
  const productId = window.location.pathname.split('/product/')[1];
  const [quantity, setQuantity] = useState(1);
  const [zoomed, setZoomed] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySent, setNotifySent] = useState(false);
  const [notifyLoading, setNotifyLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const products = await base44.entities.MarbleProduct.list();
      return products.find(p => p.id === productId);
    },
    enabled: !!productId,
  });

  const addToProject = useMutation({
    mutationFn: (data) => base44.entities.ProjectItem.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectItems'] });
      toast({ title: 'Added to project palette', description: `${product.name} has been added.` });
    },
  });

  if (isLoading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-muted border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-24 min-h-screen flex flex-col items-center justify-center">
        <p className="font-display text-2xl">Product not found</p>
        <Link to="/products" className="mt-4 text-sm underline">Back to collection</Link>
      </div>
    );
  }

  const allImages = [product.image_url, ...(product.gallery_urls || [])].filter(Boolean);

  const isAvailable = !product.stock_status || product.stock_status === 'in_stock' || product.stock_status === 'low_stock';
  const stockCfg = STOCK_CONFIG[product.stock_status] || STOCK_CONFIG.in_stock;

  const handleNotify = async () => {
    if (!notifyEmail) return;
    setNotifyLoading(true);
    await base44.integrations.Core.SendEmail({
      to: notifyEmail,
      subject: `Stok Bildirimi — ${product.name}`,
      body: `Merhaba,\n\n"${product.name}" ürünü stoka girdiğinde sizi bilgilendireceğiz.\n\nTeşekkürler,\nLithic Monolith Ekibi`,
    });
    // Also notify admin
    await base44.integrations.Core.SendEmail({
      to: 'info@lithicmonolith.com',
      subject: `Stok Talebi — ${product.name}`,
      body: `${notifyEmail} adresi "${product.name}" (ID: ${product.id}) ürünü stoka girince bildirim almak istiyor.`,
    });
    setNotifySent(true);
    setNotifyLoading(false);
  };

  const handleAddToProject = () => {
    addToProject.mutate({
      product_id: product.id,
      product_name: product.name,
      product_image: product.image_url,
      quantity_sqm: quantity,
      price_per_sqm: product.price_per_sqm,
    });
  };

  const specs = [
    { icon: MapPin, label: 'Origin', value: product.origin },
    { icon: Gem, label: 'Hardness', value: product.hardness ? `${product.hardness} Mohs` : null },
    { icon: Ruler, label: 'Dimensions', value: product.slab_width_cm && product.slab_height_cm ? `${product.slab_width_cm} × ${product.slab_height_cm} cm` : null },
    { icon: Layers, label: 'Thickness', value: product.thickness_cm ? `${product.thickness_cm} cm` : null },
    { icon: Package, label: 'Block', value: product.block_number },
  ].filter(s => s.value);

  return (
    <div className="pt-20 lg:pt-24 min-h-screen">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-6">
        {/* Breadcrumb */}
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Collection
        </Link>

        {/* Main Content: 70/30 Split */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-12">
          {/* Left: Slab Viewer */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div
              className={`relative overflow-hidden bg-muted cursor-zoom-in ${zoomed ? 'aspect-auto min-h-[80vh]' : 'aspect-[4/3]'}`}
              onClick={() => setZoomed(!zoomed)}
            >
              {allImages[activeImage] ? (
                <img
                  src={allImages[activeImage]}
                  alt={product.name}
                  className={`w-full h-full transition-all duration-500 ${zoomed ? 'object-contain scale-150' : 'object-cover'}`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-display text-4xl text-muted-foreground">{product.name?.[0]}</span>
                </div>
              )}

              <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm p-2 rounded-full">
                <ZoomIn className="w-4 h-4" />
              </div>

              {allImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <button onClick={(e) => { e.stopPropagation(); setActiveImage(i => Math.max(0, i - 1)); }}>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs">{activeImage + 1} / {allImages.length}</span>
                  <button onClick={(e) => { e.stopPropagation(); setActiveImage(i => Math.min(allImages.length - 1, i + 1)); }}>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-16 flex-shrink-0 overflow-hidden border-2 transition-all ${
                      i === activeImage ? 'border-foreground' : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right: Technical Specs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:sticky lg:top-28 lg:h-fit"
          >
            {product.category && (
              <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
                {CATEGORY_LABELS[product.category] || product.category}
              </span>
            )}

            <h1 className="font-display text-3xl lg:text-4xl font-semibold mt-2 tracking-tight">
              {product.name}
            </h1>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-semibold">${product.price_per_sqm}</span>
              <span className="text-sm text-muted-foreground">/ m²</span>
            </div>

            {/* Stock Status Badge */}
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: stockCfg.bg, color: stockCfg.color, border: `1px solid ${stockCfg.border}` }}>
              {product.stock_status === 'out_of_stock' && <AlertTriangle className="w-3 h-3" />}
              {product.stock_status === 'made_to_order' && <Clock className="w-3 h-3" />}
              {product.stock_status === 'low_stock' && <AlertTriangle className="w-3 h-3" />}
              {stockCfg.label}
            </div>

            {/* Live Batch Tracker */}
            {product.slabs_remaining && product.total_slabs_in_block && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-xs tracking-wider uppercase text-muted-foreground">Live Inventory</p>
                <p className="text-sm mt-1">
                  <span className="font-semibold">{product.block_number}</span> — {' '}
                  <span className="font-semibold">{product.slabs_remaining}</span> /{' '}
                  {product.total_slabs_in_block} slabs remaining
                </p>
                <div className="mt-2 h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(product.slabs_remaining / product.total_slabs_in_block) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {product.description && (
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            )}

            {specs.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-3">
                {specs.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-[10px] tracking-wider uppercase text-muted-foreground">{label}</span>
                    </div>
                    <p className="text-sm font-medium">{value}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex gap-2 flex-wrap">
              {product.finish && (
                <span className="px-3 py-1.5 text-xs border border-border rounded-full">
                  {FINISH_LABELS[product.finish] || product.finish}
                </span>
              )}
              {product.pattern_density && (
                <span className="px-3 py-1.5 text-xs border border-border rounded-full">
                  {PATTERN_LABELS[product.pattern_density] || product.pattern_density}
                </span>
              )}
              {product.vein_type && (
                <span className="px-3 py-1.5 text-xs border border-border rounded-full">
                  {product.vein_type}
                </span>
              )}
            </div>

            {/* Quantity & Add to Project */}
            <div className="mt-8 space-y-4">
              {isAvailable ? (
                <>
                  <div>
                    <label className="text-xs tracking-wider uppercase text-muted-foreground mb-2 block">
                      Quantity (m²)
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="w-10 h-10 border border-border rounded flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <Input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 text-center"
                      />
                      <button
                        onClick={() => setQuantity(q => q + 1)}
                        className="w-10 h-10 border border-border rounded flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <Button
                    onClick={handleAddToProject}
                    disabled={addToProject.isPending}
                    className="w-full h-12 text-sm tracking-widest uppercase"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Add to Project — ${(product.price_per_sqm * quantity).toFixed(0)}
                  </Button>
                </>
              ) : (
                <div className="p-4 rounded-lg border space-y-3" style={{ borderColor: stockCfg.border, backgroundColor: stockCfg.bg }}>
                  <div className="flex items-start gap-2">
                    {product.stock_status === 'made_to_order' ? (
                      <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: stockCfg.color }} />
                    ) : (
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: stockCfg.color }} />
                    )}
                    <div>
                      <p className="text-sm font-medium" style={{ color: stockCfg.color }}>
                        {product.stock_status === 'made_to_order'
                          ? 'Bu ürün sipariş üzerine üretilmektedir.'
                          : 'Bu ürün şu an stokta mevcut değil.'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {product.stock_status === 'made_to_order'
                          ? 'Üretim süresi ve fiyat için bizimle iletişime geçin.'
                          : 'Stoka girdiğinde size e-posta ile bildirim göndereceğiz.'}
                      </p>
                    </div>
                  </div>

                  {product.stock_status === 'out_of_stock' && (
                    notifySent ? (
                      <div className="flex items-center gap-2 text-sm" style={{ color: '#5EC4A1' }}>
                        <Bell className="w-4 h-4" />
                        Bildirim talebiniz alındı. Stoka girince haberdar edileceksiniz.
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          type="email"
                          placeholder="E-posta adresiniz"
                          value={notifyEmail}
                          onChange={e => setNotifyEmail(e.target.value)}
                          className="flex-1 h-9 text-sm"
                        />
                        <Button
                          onClick={handleNotify}
                          disabled={notifyLoading || !notifyEmail}
                          size="sm"
                          className="gap-1.5 whitespace-nowrap"
                        >
                          <Bell className="w-3.5 h-3.5" />
                          {notifyLoading ? 'Gönderiliyor...' : 'Bildir'}
                        </Button>
                      </div>
                    )
                  )}
                </div>
              )}

              <Link
                to="/contact"
                className="block w-full text-center text-sm border border-border py-3 rounded hover:bg-muted transition-colors tracking-wider uppercase"
              >
                Request Sample
              </Link>
            </div>
          </motion.div>
        </div>

        <GeologicalSiblings currentProduct={product} />
      </div>
    </div>
  );
}