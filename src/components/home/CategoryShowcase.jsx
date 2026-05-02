import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const categories = [
  {
    id: 'slab',
    label: 'Marble Slabs',
    path: '/products?category=slab',
    image: 'https://images.unsplash.com/photo-1612200902862-b2a25bd83213?w=600&q=80',
    tall: true,
  },
  {
    id: 'tile',
    label: 'Marble Tiles',
    path: '/products?category=tile',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80',
  },
  {
    id: 'block',
    label: 'Marble Blocks',
    path: '/products?category=block',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80',
    wide: true,
  },
  {
    id: 'tile2',
    label: 'Marble Tiles',
    path: '/products?category=tile',
    image: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=600&q=80',
  },
  {
    id: 'block2',
    label: 'Marble Blocks',
    path: '/products?category=block',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
  },
  {
    id: 'about',
    label: 'About',
    path: '/about',
    image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=600&q=80',
  },
  {
    id: 'contact',
    label: 'Contact',
    path: '/contact',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80',
    plain: true,
  },
  {
    id: 'project',
    label: 'My Project Palette',
    path: '/project',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    plain: true,
  },
];

function GoldDots() {
  return (
    <div className="flex items-center gap-1 ml-auto flex-shrink-0">
      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#C9A96E' }} />
      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#C9A96E80' }} />
    </div>
  );
}

function CategoryCard({ cat, index, className = '', style = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className={`relative overflow-hidden rounded-2xl group ${className}`}
      style={style}
    >
      <Link to={cat.path} className="block w-full h-full">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={cat.image}
            alt={cat.label}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {cat.plain && (
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(240,238,235,0.85)' }} />
          )}
          {!cat.plain && (
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.25))' }} />
          )}
        </div>

        {/* Frosted label chip */}
        <div className="absolute top-4 left-4 right-4">
          <div
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl w-full"
            style={{
              background: cat.plain ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.35)',
            }}
          >
            <span
              className="font-display text-base font-semibold flex-1"
              style={{ color: cat.plain ? '#1a1a1a' : '#fff' }}
            >
              {cat.label}
            </span>
            <GoldDots />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function CategoryShowcase() {
  return (
    <section className="py-16 lg:py-20" style={{ backgroundColor: '#111' }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="relative inline-block">
            <h2 className="font-display text-4xl lg:text-5xl text-white font-normal">
              Collection
            </h2>
            <div
              className="absolute -top-1 -right-4 w-2 h-2 rounded-full"
              style={{ backgroundColor: '#C9A96E' }}
            />
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#C9A96E' }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#C9A96E80' }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#C9A96E40' }} />
          </div>
        </div>

        {/* Masonry Grid — 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

          {/* Column 1 — single tall card */}
          <div className="flex flex-col gap-3">
            <CategoryCard
              cat={categories[0]}
              index={0}
              style={{ height: '440px' }}
            />
          </div>

          {/* Column 2 — two medium + one short */}
          <div className="flex flex-col gap-3">
            <CategoryCard
              cat={categories[1]}
              index={1}
              style={{ height: '200px' }}
            />
            <CategoryCard
              cat={categories[3]}
              index={2}
              style={{ height: '200px' }}
            />
            <CategoryCard
              cat={categories[5]}
              index={3}
              style={{ height: '120px' }}
            />
          </div>

          {/* Column 3 — wide top + two bottom cards */}
          <div className="flex flex-col gap-3">
            <CategoryCard
              cat={categories[2]}
              index={2}
              style={{ height: '200px' }}
            />
            <CategoryCard
              cat={categories[4]}
              index={3}
              style={{ height: '100px' }}
            />
            <div className="grid grid-cols-2 gap-3 flex-1">
              <CategoryCard
                cat={categories[6]}
                index={4}
                style={{ height: '140px' }}
              />
              <CategoryCard
                cat={categories[7]}
                index={5}
                style={{ height: '140px' }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}