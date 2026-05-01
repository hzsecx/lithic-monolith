import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 border border-current flex items-center justify-center">
                <div className="w-3 h-3 bg-current" />
              </div>
              <span className="font-display text-xl font-semibold tracking-wider uppercase">
                Lithic
              </span>
            </div>
            <p className="text-sm leading-relaxed opacity-60 max-w-xs">
              The world's most distinguished marble collections. The raw power of stone, the elegance of architecture.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase mb-6 opacity-40">Explore</h4>
            <div className="flex flex-col gap-3">
              <Link to="/products" className="text-sm opacity-60 hover:opacity-100 transition-opacity">Collection</Link>
              <Link to="/products?category=slab" className="text-sm opacity-60 hover:opacity-100 transition-opacity">Marble Slabs</Link>
              <Link to="/products?category=tile" className="text-sm opacity-60 hover:opacity-100 transition-opacity">Marble Tiles</Link>
              <Link to="/products?category=block" className="text-sm opacity-60 hover:opacity-100 transition-opacity">Marble Blocks</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase mb-6 opacity-40">Company</h4>
            <div className="flex flex-col gap-3">
              <Link to="/about" className="text-sm opacity-60 hover:opacity-100 transition-opacity">About</Link>
              <Link to="/contact" className="text-sm opacity-60 hover:opacity-100 transition-opacity">Contact</Link>
              <Link to="/project" className="text-sm opacity-60 hover:opacity-100 transition-opacity">My Project Palette</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase mb-6 opacity-40">Contact</h4>
            <div className="flex flex-col gap-3 text-sm opacity-60">
              <p>info@lithicmonolith.com</p>
              <p>+90 (212) 555 0123</p>
              <p>Istanbul, Turkey</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-current/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs opacity-30">© 2026 Lithic Monolith. All rights reserved.</p>
          <p className="text-xs opacity-30 tracking-widest uppercase">World, Curated.</p>
        </div>
      </div>
    </footer>
  );
}