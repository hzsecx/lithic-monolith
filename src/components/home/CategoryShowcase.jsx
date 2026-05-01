import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const categories = [
  {
    id: 'products',
    label: 'Collection',
    path: '/products',
    image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?w=400&q=80',
  },
  {
    id: 'slab',
    label: 'Marble Slabs',
    path: '/products?category=slab',
    image: 'https://images.unsplash.com/photo-1617957743240-92b5e4b01c9b?w=400&q=80',
  },
  {
    id: 'tile',
    label: 'Marble Tiles',
    path: '/products?category=tile',
    image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&q=80',
  },
  {
    id: 'block',
    label: 'Marble Blocks',
    path: '/products?category=block',
    image: 'https://images.unsplash.com/photo-1581922814484-0b48460b7010?w=400&q=80',
  },
  {
    id: 'about',
    label: 'About',
    path: '/about',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80',
  },
  {
    id: 'contact',
    label: 'Contact',
    path: '/contact',
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&q=80',
  },
  {
    id: 'project',
    label: 'My Project Palette',
    path: '/project',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80',
  },
];

export default function CategoryShowcase() {
  return (
    <section className="py-0 overflow-hidden" style={{ backgroundColor: '#0A0A0A' }}>
      {/* Divider line with gold */}
      <div className="h-px w-full" style={{ background: 'linear-gradient(to right, transparent, #C9A96E44, transparent)' }} />

      {/* Horizontal scrolling strip */}
      <div className="relative">
        <div className="flex overflow-x-auto scrollbar-hide gap-px" style={{ borderTop: '1px solid #C9A96E22', borderBottom: '1px solid #C9A96E22' }}>
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex-shrink-0"
              style={{ width: '160px' }}
            >
              <Link
                to={cat.path}
                className="group block relative overflow-hidden"
                style={{ border: '1px solid #C9A96E22' }}
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-cover opacity-60 transition-all duration-500 group-hover:opacity-80 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-xs text-white font-medium tracking-wide leading-tight">{cat.label}</p>
                </div>
                {/* Gold hover line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                  style={{ backgroundColor: '#C9A96E' }}
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom gold rule */}
      <div className="h-px w-full mt-0" style={{ background: 'linear-gradient(to right, #C9A96E88, #C9A96E22, transparent)' }} />
    </section>
  );
}