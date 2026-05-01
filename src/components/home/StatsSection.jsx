import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { value: '50+', label: 'Global Quarries' },
  { value: '200+', label: 'Curated Collections' },
  { value: '10+', label: 'Years of Excellence' },
  { value: '5000+', label: 'Global Projects' },
];

export default function StatsSection() {
  return (
    <section className="py-16 lg:py-20" style={{ backgroundColor: '#0A0A0A', borderTop: '1px solid #222', borderBottom: '1px solid #222' }}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-white/10">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center px-6 py-8 first:pl-0 last:pr-0"
            >
              <p
                className="font-display text-5xl lg:text-7xl font-bold tracking-tight leading-none"
                style={{ color: '#C9A96E' }}
              >
                {stat.value}
              </p>
              <p className="text-xs tracking-[0.3em] uppercase text-white/40 mt-3">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}