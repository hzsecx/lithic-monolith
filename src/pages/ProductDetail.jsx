import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Package, MapPin, Ruler, Layers, Gem, ShoppingBag, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import GeologicalSiblings from '../components/products/GeologicalSiblings';

export default function ProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = window.location.pathname.split('/product/')[1];
  const [quantity, setQuantity] = useState(1);
  const [zoomed, setZoomed] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
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
      toast({ title: 'Proje paletine eklendi', description: `${product.name} başarıyla eklendi.` });
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
        <p className="font-display text-2xl">Ürün bulunamadı</p>
        <Link to="/products" className="mt-4 text-sm underline">Koleksiyona dön</Link>
      </div>
    );
  }

  const allImages = [product.image_url, ...(product.gallery_urls || [])].filter(Boolean);

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
    { icon: MapPin, label: 'Menşei', value: product.origin },
    { icon: Gem, label: 'Sertlik', value: product.hardness ? `${product.hardness} Mohs` : null },
    { icon: Ruler, label: 'Boyut', value: product.slab_width_cm && product.slab_height_cm ? `${product.slab_width_cm} × ${product.slab_height_cm} cm` : null },
    { icon: Layers, label: 'Kalınlık', value: product.thickness_cm ? `${product.thickness_cm} cm` : null },
    { icon: Package, label: 'Blok', value: product.block_number },
  ].filter(s => s.value);

  return (
    <div className="pt-20 lg:pt-24 min-h-screen">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-6">
        {/* Breadcrumb */}
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Koleksiyona Dön
        </Link>

        {/* Main Content: 70/30 Split */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-12">
          {/* Left: Slab Viewer */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
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

              {/* Image Navigation */}
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

            {/* Thumbnail Strip */}
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
            {/* Category Badge */}
            {product.category && (
              <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
                {product.category === 'slab' ? 'Levha' : product.category === 'tile' ? 'Karo' : product.category === 'block' ? 'Blok' : product.category === 'countertop' ? 'Tezgah' : 'Mozaik'}
              </span>
            )}

            <h1 className="font-display text-3xl lg:text-4xl font-semibold mt-2 tracking-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-semibold">${product.price_per_sqm}</span>
              <span className="text-sm text-muted-foreground">/ m²</span>
            </div>

            {/* Live Batch Tracker */}
            {product.slabs_remaining && product.total_slabs_in_block && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-xs tracking-wider uppercase text-muted-foreground">Canlı Envanter</p>
                <p className="text-sm mt-1">
                  <span className="font-semibold">{product.block_number}</span> — Kalan{' '}
                  <span className="font-semibold">{product.slabs_remaining}</span> /{' '}
                  {product.total_slabs_in_block} levha
                </p>
                <div className="mt-2 h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(product.slabs_remaining / product.total_slabs_in_block) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            )}

            {/* Specs Grid */}
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

            {/* Finish & Pattern */}
            <div className="mt-4 flex gap-2 flex-wrap">
              {product.finish && (
                <span className="px-3 py-1.5 text-xs border border-border rounded-full">
                  {product.finish === 'polished' ? 'Cilalı' : product.finish === 'honed' ? 'Honlanmış' : product.finish === 'leathered' ? 'Deri Doku' : product.finish === 'brushed' ? 'Fırçalanmış' : 'Eskitme'}
                </span>
              )}
              {product.pattern_density && (
                <span className="px-3 py-1.5 text-xs border border-border rounded-full">
                  {product.pattern_density === 'minimal' ? 'Minimal Desen' : product.pattern_density === 'moderate' ? 'Orta Desen' : 'Yoğun Desen'}
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
              <div>
                <label className="text-xs tracking-wider uppercase text-muted-foreground mb-2 block">
                  Miktar (m²)
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
                Projeye Ekle — ${(product.price_per_sqm * quantity).toFixed(0)}
              </Button>

              <Link
                to="/contact"
                className="block w-full text-center text-sm border border-border py-3 rounded hover:bg-muted transition-colors tracking-wider uppercase"
              >
                Numune Talep Et
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Geological Siblings */}
        <GeologicalSiblings currentProduct={product} />
      </div>
    </div>
  );
}