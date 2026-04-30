import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, MapPin } from 'lucide-react';

export default function ProductCard({ product, index, isLarge }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: (index % 4) * 0.08 }}
      className={`group ${isLarge ? 'md:col-span-2' : ''}`}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className={`relative overflow-hidden bg-muted ${isLarge ? 'aspect-[16/10]' : 'aspect-[3/4]'}`}>
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground font-display text-lg">{product.name?.[0]}</span>
            </div>
          )}

          {/* Vein Glow Sweep */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/8 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />

          {/* Bottom Gradient */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Geological Profile on Hover */}
          <div className="absolute bottom-0 left-0 right-0 p-5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
            <div className="backdrop-blur-sm bg-black/20 rounded-lg p-3 border border-white/10">
              <div className="grid grid-cols-3 gap-2 text-[10px] text-white/70 tracking-wider uppercase">
                {product.origin && (
                  <div>
                    <p className="text-white/40">Menşei</p>
                    <p className="text-white">{product.origin}</p>
                  </div>
                )}
                {product.hardness && (
                  <div>
                    <p className="text-white/40">Sertlik</p>
                    <p className="text-white">{product.hardness} Mohs</p>
                  </div>
                )}
                {product.vein_type && (
                  <div>
                    <p className="text-white/40">Damar</p>
                    <p className="text-white">{product.vein_type}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.stock_status === 'low_stock' && (
              <span className="bg-foreground text-background text-[10px] tracking-[0.15em] uppercase px-2.5 py-1">
                Sınırlı
              </span>
            )}
            {product.featured && (
              <span className="bg-primary text-primary-foreground text-[10px] tracking-[0.15em] uppercase px-2.5 py-1">
                Öne Çıkan
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="mt-3 flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium group-hover:underline underline-offset-4">{product.name}</h3>
            <div className="flex items-center gap-1 mt-1">
              {product.origin && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {product.origin}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">${product.price_per_sqm}</p>
            <p className="text-[10px] text-muted-foreground">/m²</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}