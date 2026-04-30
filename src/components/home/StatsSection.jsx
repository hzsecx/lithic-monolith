import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { value: '150+', label: 'Mermer Çeşidi' },
  { value: '24', label: 'Ülke' },
  { value: '40+', label: 'Yıllık Deneyim' },
  { value: '10K+', label: 'Tamamlanan Proje' },
];

export default function StatsSection() {
  return (
    <section className="py-20 border-y border-border">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center lg:text-left"
            >
              <p className="font-display text-4xl lg:text-5xl font-bold tracking-tight">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground mt-2 tracking-wide">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}