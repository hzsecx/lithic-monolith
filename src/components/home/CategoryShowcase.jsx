import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const categories = [
  { id: 'slab', label: 'Levhalar', desc: 'Büyük ölçekli projeler için' },
  { id: 'tile', label: 'Karolar', desc: 'Zemin ve duvar kaplamaları' },
  { id: 'block', label: 'Bloklar', desc: 'Ham ocak blokları' },
  { id: 'countertop', label: 'Tezgahlar', desc: 'Mutfak ve banyo' },
  { id: 'mosaic', label: 'Mozaikler', desc: 'Dekoratif desenler' },
];

export default function CategoryShowcase() {
  return (
    <section className="py-24 lg:py-32 bg-foreground text-background overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-xs tracking-[0.4em] uppercase opacity-40 mb-3">
            Kategoriler
          </p>
          <h2 className="font-display text-4xl lg:text-6xl font-semibold tracking-tight">
            Mineral Arşivi
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-current/10">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                to={`/products?category=${cat.id}`}
                className="group block bg-foreground p-8 lg:p-10 hover:bg-background/5 transition-all duration-500 h-full"
              >
                <span className="text-xs text-background/30 tracking-wider font-mono">
                  0{i + 1}
                </span>
                <h3 className="font-display text-2xl lg:text-3xl font-semibold mt-4 mb-2 group-hover:translate-x-2 transition-transform duration-300">
                  {cat.label}
                </h3>
                <p className="text-sm opacity-40 leading-relaxed">
                  {cat.desc}
                </p>
                <div className="mt-6 w-8 h-px bg-current opacity-20 group-hover:w-16 group-hover:opacity-60 transition-all duration-500" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}