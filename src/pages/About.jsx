import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ABOUT_IMAGE = '/__generating__/img_bb5a174bd368.png';

const values = [
  { num: '01', title: 'Geological Integrity', desc: 'We trace every slab to its source, honouring nature\'s work spanning millions of years.' },
  { num: '02', title: 'Architectural Excellence', desc: 'We supply marble that meets the highest standards for the world\'s most prestigious projects.' },
  { num: '03', title: 'Sustainable Extraction', desc: 'Environmentally conscious quarrying and responsible resource management are our foundation.' },
  { num: '04', title: 'Global Reach', desc: 'Operating in 24 countries, we provide access to premium marble across the globe.' },
];

export default function About() {
  return (
    <div className="pt-20 lg:pt-24 min-h-screen">
      {/* Hero */}
      <div className="relative h-[60vh] lg:h-[70vh] overflow-hidden">
        <img src={ABOUT_IMAGE} alt="Architectural marble staircase" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" />
        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[1600px] mx-auto"
          >
            <p className="text-xs tracking-[0.4em] uppercase text-white/60 mb-3">About Us</p>
            <h1 className="font-display text-4xl lg:text-7xl font-bold text-white tracking-tight">
              The Story of Stone,
              <br />
              <span className="italic font-normal">Our Story.</span>
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Story */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-6">Our Vision</p>
            <h2 className="font-display text-3xl lg:text-4xl font-semibold leading-snug tracking-tight">
              We bridge the world's deepest quarries with the world's most elegant spaces.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base leading-[1.8] text-muted-foreground"
          >
            <p className="mb-6">
              For over 40 years, Lithic Monolith has sourced the finest natural stone from the world's most
              prestigious quarries, processing and delivering them to architectural projects across the globe.
            </p>
            <p>
              Every marble slab is a unique masterpiece of millions of years of geological process.
              We unite these masterpieces with the elegance of modern architecture, giving spaces
              a timeless character.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Values */}
      <div className="border-y border-border">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {values.map((v, i) => (
              <motion.div
                key={v.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="text-xs text-muted-foreground font-mono">{v.num}</span>
                <h3 className="font-display text-xl font-semibold mt-3 mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl lg:text-5xl font-semibold tracking-tight mb-6">
            Let's Shape Your Project Together
          </h2>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-4 text-sm tracking-widest uppercase hover:opacity-90 transition-opacity"
          >
            Get in Touch
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}