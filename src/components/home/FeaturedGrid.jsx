import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export default function FeaturedGrid({ products }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-3">
            Featured
          </p>
          <h2 className="font-display text-4xl lg:text-6xl font-semibold tracking-tight">
            Distinguished Collection
          </h2>
        </motion.div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {products.slice(0, 6).map((product, index) => {
            const isLarge = index === 0 || index === 3;
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`group ${isLarge ? 'md:col-span-2 lg:col-span-2' : ''}`}
              >
                <Link to={`/product/${product.id}`} className="block">
                  <div className={`relative overflow-hidden bg-muted ${isLarge ? 'aspect-[16/9]' : 'aspect-[4/5]'}`}>
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground text-sm">Image</span>
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Vein Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                    {/* Product Info on Hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-white/60 text-xs tracking-[0.2em] uppercase mb-1">
                            {product.origin || 'Turkey'}
                          </p>
                          <h3 className="text-white font-display text-xl lg:text-2xl font-semibold">
                            {product.name}
                          </h3>
                          <div className="flex gap-3 mt-2">
                            {product.finish && (
                              <span className="text-white/50 text-xs uppercase tracking-wider">
                                {product.finish}
                              </span>
                            )}
                            {product.hardness && (
                              <span className="text-white/50 text-xs">
                                Hardness: {product.hardness}
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    {/* Stock Badge */}
                    {product.stock_status === 'low_stock' && (
                      <div className="absolute top-4 left-4 bg-foreground/80 text-background text-[10px] tracking-[0.2em] uppercase px-3 py-1.5">
                        Limited Stock
                      </div>
                    )}
                  </div>

                  {/* Below Image Info */}
                  <div className="mt-3 flex justify-between items-baseline">
                    <h3 className="font-medium text-sm">{product.name}</h3>
                    <span className="text-sm text-muted-foreground">
                      ${product.price_per_sqm}/m²
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View All */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm tracking-[0.2em] uppercase border-b border-foreground pb-1 hover:opacity-60 transition-opacity"
          >
            View Full Collection
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}