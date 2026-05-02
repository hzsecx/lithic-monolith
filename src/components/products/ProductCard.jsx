import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, HandHelping } from 'lucide-react';

export default function ProductCard({ product, index, isLarge, dark }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: (index % 4) * 0.08 }}
      className={`group ${isLarge ? 'col-span-1 xl:col-span-1' : ''}`}
    >
      <Link to={`/product/${product.id}`} className="block">
        {/* Image container */}
        <div
          className="relative overflow-hidden rounded-xl aspect-[3/4]"
          style={{ border: '1px solid rgba(201,169,110,0.55)', boxShadow: '0 0 18px 4px rgba(201,169,110,0.25), 0 0 6px 1px rgba(201,169,110,0.15)' }}
        >
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: dark ? '#1a2940' : undefined }}
            >
              <span className="font-display text-lg" style={{ color: dark ? 'rgba(255,255,255,0.3)' : undefined }}>
                {product.name?.[0]}
              </span>
            </div>
          )}

          {/* Shimmer sweep on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/8 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />

          {/* Bottom gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Badges top-left */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.stock_status === 'low_stock' && (
              <span
                className="text-[10px] tracking-[0.15em] uppercase px-2.5 py-1 rounded"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', backdropFilter: 'blur(8px)' }}
              >
                Limited
              </span>
            )}
            {product.featured && (
              <span
                className="text-[10px] tracking-[0.15em] uppercase px-2.5 py-1 rounded"
                style={{ backgroundColor: '#C9A96E', color: '#0D1B2A' }}
              >
                Featured
              </span>
            )}
          </div>

          {/* Price + request sample bottom overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white leading-tight">{product.name}</h3>
                {product.origin && (
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" style={{ color: '#C9A96E' }} />
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{product.origin}</span>
                  </div>
                )}
              </div>
              {product.price_per_sqm && (
                <div className="text-right">
                  <p
                    className="text-lg font-bold"
                    style={{ color: '#C9A96E' }}
                  >
                    ${product.price_per_sqm}
                  </p>
                  <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>/m²</p>
                </div>
              )}
            </div>

            {/* Request Sample button — visible on hover */}
            <div className="mt-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <div
                className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-xs font-medium tracking-wider"
                style={{ backgroundColor: '#1B4D3E', color: 'white', border: '1px solid rgba(255,255,255,0.15)' }}
                onClick={(e) => e.preventDefault()}
              >
                <HandHelping className="w-3.5 h-3.5" />
                Request Sample
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}