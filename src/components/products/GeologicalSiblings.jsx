import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

export default function GeologicalSiblings({ currentProduct }) {
  const { data: allProducts = [] } = useQuery({
    queryKey: ['allProducts'],
    queryFn: () => base44.entities.MarbleProduct.list('-created_date', 100),
  });

  const siblings = allProducts.filter(p =>
    p.id !== currentProduct?.id && (
      p.color_family === currentProduct?.color_family ||
      p.origin === currentProduct?.origin
    )
  ).slice(0, 4);

  if (siblings.length === 0) return null;

  return (
    <section className="mt-24 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-2">Geological Siblings</p>
        <h2 className="font-display text-2xl lg:text-3xl font-semibold tracking-tight">
          Similar Formations
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {siblings.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </section>
  );
}