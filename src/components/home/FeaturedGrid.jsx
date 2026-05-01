import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const CATEGORY_IMAGES = {
  slab: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  tile: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
  block: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80',
  countertop: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
};

export default function FeaturedGrid({ products }) {
  // Show placeholder layout even with no products
  const hasProducts = products && products.length > 0;

  const slabs = hasProducts ? (products.filter(p => p.category === 'slab')[0] || products[0]) : null;
  const tiles = hasProducts ? (products.filter(p => p.category === 'tile')[0] || products[1]) : null;
  const blocks = hasProducts ? (products.filter(p => p.category === 'block')[0] || products[2]) : null;
  const featured = hasProducts ? (products[3] || products[0]) : null;

  const heroImage = hasProducts ? (products[0]?.image_url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80') : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80';

  return (
    <section className="py-16 lg:py-24" style={{ backgroundColor: '#0A0A0A' }}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 flex items-end justify-between"
        >
          <div>
            <p className="text-xs tracking-[0.4em] uppercase mb-2" style={{ color: '#C9A96E' }}>
              Distinguished
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Our Collections
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden lg:flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-white/40 hover:text-white transition-colors"
          >
            View All <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {/* Grid Layout matching mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Large Left Card — OUR COLLECTIONS hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:row-span-2"
          >
            <Link to="/products" className="group block h-full">
              <div
                className="relative overflow-hidden h-full min-h-[500px] lg:min-h-[640px]"
                style={{ border: '1px solid #C9A96E33' }}
              >
                <img
                  src={heroImage}
                  alt="Our Collections"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: '#C9A96E' }}>
                    Featured
                  </p>
                  <h3 className="font-display text-3xl font-bold text-white mb-2">
                    Our Collections
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed line-clamp-3">
                    Exceptional marble collections sourced from the world's most prestigious quarries, offering unmatched beauty and quality.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs tracking-wider text-white/40 group-hover:text-white/70 transition-colors">
                    Explore <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Top Right — Marble Slabs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Link to="/products?category=slab" className="group block">
              <div
                className="relative overflow-hidden"
                style={{ border: '1px solid #C9A96E33' }}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={slabs?.image_url || CATEGORY_IMAGES.slab || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'}
                    alt="Marble Slabs"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-5" style={{ backgroundColor: '#111' }}>
                  <h3 className="font-display text-xl font-bold text-white mb-1">Marble Slabs</h3>
                  <p className="text-xs text-white/40 leading-relaxed line-clamp-2">
                    Exceptional marble collections sourced with unmatched quality and precision.
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Top Right 2 — Marble Tiles */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <Link to="/products?category=tile" className="group block">
              <div
                className="relative overflow-hidden"
                style={{ border: '1px solid #C9A96E33' }}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={tiles?.image_url || CATEGORY_IMAGES.tile || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80'}
                    alt="Marble Tiles"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-5" style={{ backgroundColor: '#111' }}>
                  <h3 className="font-display text-xl font-bold text-white mb-1">Marble Tiles</h3>
                  <p className="text-xs text-white/40 leading-relaxed line-clamp-2">
                    Marble Tiles can far surpass stone durability for premium residential and commercial.
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Bottom Right — Marble Blocks */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/products?category=block" className="group block">
              <div
                className="relative overflow-hidden"
                style={{ border: '1px solid #C9A96E33' }}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={blocks?.image_url || CATEGORY_IMAGES.block || 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80'}
                    alt="Marble Blocks"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-5" style={{ backgroundColor: '#111' }}>
                  <h3 className="font-display text-xl font-bold text-white mb-1">Marble Blocks</h3>
                  <p className="text-xs text-white/40 leading-relaxed line-clamp-2">
                    Marble blocks cut from the finest stone formations and quarry locations worldwide.
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Bottom Right 2 — Project Palette */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
          >
            <Link to="/project" className="group block">
              <div
                className="relative overflow-hidden"
                style={{ border: '1px solid #C9A96E33' }}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={featured?.image_url || CATEGORY_IMAGES.countertop || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80'}
                    alt="My Project Palette"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-5" style={{ backgroundColor: '#111' }}>
                  <h3 className="font-display text-xl font-bold text-white mb-1" style={{ color: '#C9A96E' }}>
                    My Project Palette
                  </h3>
                  <p className="text-xs text-white/40 leading-relaxed line-clamp-2">
                    Curate your perfect marble collection and manage your project selections.
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>

        </div>

        {/* View All Mobile */}
        <div className="mt-8 text-center lg:hidden">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-white/40 hover:text-white transition-colors border-b border-white/20 pb-1"
          >
            View Full Collection <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}