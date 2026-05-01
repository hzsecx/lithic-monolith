import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, ExternalLink } from 'lucide-react';

const FINISHES = [
  { label: 'Polished', id: 'polished' },
  { label: 'Honed', id: 'honed' },
  { label: 'Leathered', id: 'leathered' },
];

export default function HeroSection({ heroImage }) {
  const [activeFinish, setActiveFinish] = useState(0);

  return (
    <section className="relative h-screen overflow-hidden bg-black">
      {/* Background Image */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: 'easeOut' }}
      >
        <img
          src={heroImage}
          alt="Marble quarry landscape"
          className="w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-white px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xs sm:text-sm tracking-[0.5em] uppercase mb-5"
          style={{ color: '#C9A96E' }}
        >
          World, Curated.
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="font-display text-5xl sm:text-7xl lg:text-[7rem] font-bold leading-[0.9] text-center tracking-tight"
          style={{ color: '#C9A96E' }}
        >
          THE WORLD,
          <br />
          <span className="italic font-normal text-white">Curated.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 text-sm sm:text-base max-w-md text-center leading-relaxed text-white/70"
        >
          Exceptional marble collections sourced from the world's most prestigious quarries.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <Link
            to="/products"
            className="flex items-center gap-2 border border-white/70 px-8 py-3.5 text-xs tracking-[0.25em] uppercase text-white hover:bg-white hover:text-black transition-all duration-300 group"
          >
            Explore Collection
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/contact"
            className="flex items-center gap-2 border border-white/30 px-8 py-3.5 text-xs tracking-[0.25em] uppercase text-white/80 hover:border-white/60 hover:text-white transition-all duration-300"
          >
            Request Sample
          </Link>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-0 left-0 right-0 z-20"
      >
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 pb-8 flex items-end justify-between">
          <div className="flex items-center gap-6">
            <span className="text-white/40 text-xs tracking-[0.4em] uppercase">Surface</span>
            <div className="flex gap-1">
              {FINISHES.map((finish, i) => (
                <button
                  key={finish.id}
                  onClick={() => setActiveFinish(i)}
                  className={`px-4 py-2 text-xs tracking-wider uppercase transition-all duration-300 rounded-full ${
                    activeFinish === i
                      ? 'text-black'
                      : 'text-white/50 hover:text-white'
                  }`}
                  style={activeFinish === i ? { backgroundColor: '#C9A96E' } : {}}
                >
                  {finish.label}
                </button>
              ))}
            </div>
          </div>

          {/* Request Sample floating */}
          <Link
            to="/contact"
            className="hidden lg:flex items-center gap-2 border border-white/20 bg-black/40 backdrop-blur-sm px-4 py-2 text-xs tracking-wider text-white/70 hover:text-white hover:border-white/40 transition-all"
          >
            <ExternalLink className="w-3 h-3" />
            Request Sample
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center pb-5">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ChevronDown className="w-5 h-5 text-white/40" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}