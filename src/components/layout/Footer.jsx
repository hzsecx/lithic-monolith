import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0A0A0A', borderTop: '1px solid #C9A96E22' }}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <span className="font-display text-2xl font-bold tracking-widest uppercase block mb-5" style={{ color: '#C9A96E' }}>
              Lithic
            </span>
            <p className="text-sm leading-relaxed text-white/40 max-w-xs">
              The world's most distinguished marble collections. The raw power of stone, the elegance of architecture.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase mb-6 text-white/30">Explore</h4>
            <div className="flex flex-col gap-3">
              <Link to="/products" className="text-sm text-white/50 hover:text-white transition-colors">Collection</Link>
              <Link to="/products?category=slab" className="text-sm text-white/50 hover:text-white transition-colors">Marble Slabs</Link>
              <Link to="/products?category=tile" className="text-sm text-white/50 hover:text-white transition-colors">Marble Tiles</Link>
              <Link to="/products?category=block" className="text-sm text-white/50 hover:text-white transition-colors">Marble Blocks</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase mb-6 text-white/30">Company</h4>
            <div className="flex flex-col gap-3">
              <Link to="/about" className="text-sm text-white/50 hover:text-white transition-colors">About</Link>
              <Link to="/contact" className="text-sm text-white/50 hover:text-white transition-colors">Contact</Link>
              <Link to="/project" className="text-sm text-white/50 hover:text-white transition-colors">My Project Palette</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase mb-6 text-white/30">Contact</h4>
            <div className="flex flex-col gap-3 text-sm text-white/50">
              <p>info@lithicmonolith.com</p>
              <p>+90 (212) 555 0123</p>
              <p>Istanbul, Turkey</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderTop: '1px solid #C9A96E22' }}>
          <p className="text-xs text-white/20">© 2026 Lithic Monolith. All rights reserved.</p>
          <p className="text-xs tracking-[0.3em] uppercase" style={{ color: '#C9A96E44' }}>World, Curated.</p>
        </div>
      </div>
    </footer>
  );
}