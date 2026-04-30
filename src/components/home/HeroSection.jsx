import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';

const FINISHES = [
  { label: 'Cilalı', id: 'polished' },
  { label: 'Honlanmış', id: 'honed' },
  { label: 'Deri Doku', id: 'leathered' },
];

export default function HeroSection({ heroImage }) {
  const [activeFinish, setActiveFinish] = useState(0);

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <img
          src={heroImage}
          alt="Mermer ocağı manzarası"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-white px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xs sm:text-sm tracking-[0.4em] uppercase mb-6 opacity-70"
        >
          Dünya, Küratörlüğünde
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="font-display text-5xl sm:text-7xl lg:text-[8rem] font-bold leading-[0.9] text-center tracking-tight"
        >
          DÜNYA,
          <br />
          <span className="italic font-normal">Küratörlüğünde.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 text-sm sm:text-base max-w-md text-center leading-relaxed opacity-70"
        >
          Dünyanın en prestijli ocaklarından çıkarılmış, eşsiz mermer koleksiyonları.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <Link
            to="/products"
            className="flex items-center gap-2 bg-white text-black px-8 py-4 text-sm tracking-widest uppercase hover:bg-white/90 transition-all group"
          >
            Koleksiyonu Keşfet
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/contact"
            className="flex items-center gap-2 border border-white/40 px-8 py-4 text-sm tracking-widest uppercase hover:bg-white/10 transition-all"
          >
            Numune Talep Et
          </Link>
        </motion.div>
      </div>

      {/* Texture Scrubber */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-0 left-0 right-0 z-20"
      >
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 pb-8">
          <div className="flex items-center gap-6">
            <span className="text-white/40 text-xs tracking-[0.3em] uppercase hidden sm:block">
              Yüzey
            </span>
            <div className="flex gap-1 bg-white/10 backdrop-blur-md rounded-full p-1">
              {FINISHES.map((finish, i) => (
                <button
                  key={finish.id}
                  onClick={() => setActiveFinish(i)}
                  className={`px-4 py-2 text-xs tracking-wider uppercase rounded-full transition-all duration-300 ${
                    activeFinish === i
                      ? 'bg-white text-black'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {finish.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center pb-6">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-5 h-5 text-white/40" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}