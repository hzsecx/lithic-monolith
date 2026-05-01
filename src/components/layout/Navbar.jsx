import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Search, User, LogOut } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { user } = useAuth();

  const { data: cartItems = [] } = useQuery({
    queryKey: ['projectItems'],
    queryFn: () => base44.entities.ProjectItem.list(),
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Collection', path: '/products' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const isDark = isHome && !scrolled;

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: scrolled || !isHome ? 'rgba(10,10,10,0.95)' : 'transparent',
          backdropFilter: scrolled || !isHome ? 'blur(16px)' : 'none',
          borderBottom: scrolled || !isHome ? '1px solid #C9A96E22' : 'none',
        }}
      >
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <span
                className="font-display text-xl lg:text-2xl font-bold tracking-widest uppercase"
                style={{ color: isDark ? '#C9A96E' : '#C9A96E' }}
              >
                Lithic
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-xs tracking-[0.3em] uppercase transition-all duration-300"
                  style={{
                    color: location.pathname === link.path ? '#C9A96E' : 'rgba(255,255,255,0.7)',
                  }}
                  onMouseEnter={e => e.target.style.color = '#C9A96E'}
                  onMouseLeave={e => e.target.style.color = location.pathname === link.path ? '#C9A96E' : 'rgba(255,255,255,0.7)'}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <Link to="/products" className="hidden lg:flex text-white/60 hover:text-white transition-colors">
                <Search className="w-4 h-4" />
              </Link>
              <Link to="/project" className="relative text-white/60 hover:text-white transition-colors">
                <ShoppingBag className="w-4 h-4" />
                {cartItems.length > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 text-black text-[10px] font-bold rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#C9A96E' }}
                  >
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {/* User Icon */}
              <div className="relative">
                {user ? (
                  <>
                    <button
                      onClick={() => setUserMenuOpen(o => !o)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-black text-xs font-bold uppercase"
                      style={{ backgroundColor: '#C9A96E' }}
                    >
                      {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </button>
                    {userMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                        <div
                          className="absolute right-0 top-10 z-50 min-w-[160px] py-2 rounded-sm shadow-xl"
                          style={{ backgroundColor: '#111', border: '1px solid #C9A96E33' }}
                        >
                          <p className="px-4 py-2 text-xs text-white/40 truncate border-b border-white/10">
                            {user.full_name || user.email}
                          </p>
                          <button
                            onClick={() => { base44.auth.logout(); setUserMenuOpen(false); }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs tracking-wider text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            Sign Out
                          </button>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => base44.auth.redirectToLogin()}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <User className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden text-white/70 hover:text-white transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100]"
            style={{ backgroundColor: '#0A0A0A' }}
          >
            <div className="flex justify-between items-center p-6" style={{ borderBottom: '1px solid #C9A96E22' }}>
              <span className="font-display text-xl font-bold tracking-widest uppercase" style={{ color: '#C9A96E' }}>
                Lithic
              </span>
              <button onClick={() => setMobileOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-0 mt-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{ borderBottom: '1px solid #C9A96E11' }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className="block px-6 py-5 font-display text-2xl text-white hover:text-[#C9A96E] transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}