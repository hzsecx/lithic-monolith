import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Search, User, LogOut, Settings } from 'lucide-react';
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
                    <AnimatePresence>
                      {userMenuOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                          <motion.div
                            initial={{ opacity: 0, rotateX: -15, y: -8, scale: 0.95 }}
                            animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
                            exit={{ opacity: 0, rotateX: -15, y: -8, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="absolute right-0 top-10 z-50 min-w-[180px] py-2 rounded-xl shadow-2xl overflow-hidden"
                            style={{
                              background: 'linear-gradient(135deg, rgba(30,30,30,0.95) 0%, rgba(15,15,15,0.98) 100%)',
                              border: '1px solid rgba(201,169,110,0.25)',
                              backdropFilter: 'blur(24px)',
                              transformOrigin: 'top right',
                              transformStyle: 'preserve-3d',
                              boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,169,110,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
                            }}
                          >
                            {/* Gold top line */}
                            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, #C9A96E, transparent)' }} />
                            
                            <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                              <p className="text-[10px] tracking-[0.2em] uppercase mb-0.5" style={{ color: '#C9A96E' }}>Signed in as</p>
                              <p className="text-xs text-white/60 truncate">{user.full_name || user.email}</p>
                            </div>

                            <div className="p-1.5 space-y-0.5">
                              {user?.role === 'admin' && (
                                <Link
                                  to="/lefevef/admin/panel"
                                  onClick={() => setUserMenuOpen(false)}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 text-xs tracking-wider rounded-lg transition-all"
                                  style={{ color: 'rgba(255,255,255,0.6)' }}
                                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(201,169,110,0.1)'}
                                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                  <div
                                    className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: 'rgba(201,169,110,0.15)', border: '1px solid rgba(201,169,110,0.2)' }}
                                  >
                                    <Settings className="w-3 h-3" style={{ color: '#C9A96E' }} />
                                  </div>
                                  <span className="text-white/70">Admin Panel</span>
                                </Link>
                              )}
                              <button
                                onClick={() => { base44.auth.logout(); setUserMenuOpen(false); }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-xs tracking-wider rounded-lg transition-all group"
                                style={{ color: 'rgba(255,255,255,0.6)' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(201,169,110,0.1)'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <div
                                  className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                                  style={{ backgroundColor: 'rgba(201,169,110,0.15)', border: '1px solid rgba(201,169,110,0.2)' }}
                                >
                                  <LogOut className="w-3 h-3" style={{ color: '#C9A96E' }} />
                                </div>
                                <span className="text-white/70">Sign Out</span>
                              </button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
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