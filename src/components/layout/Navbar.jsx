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
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-6 pt-4">
        <motion.header
          className="w-full max-w-[1400px] transition-all duration-500"
          style={{
            background: 'linear-gradient(135deg, rgba(20,18,14,0.82) 0%, rgba(30,26,18,0.78) 50%, rgba(18,16,12,0.85) 100%)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(201,169,110,0.18)',
            borderRadius: '16px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
        <div className="px-6 lg:px-10">
          <div className="flex items-center justify-between h-14 lg:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <span
                className="font-display text-xl lg:text-2xl font-bold tracking-widest uppercase"
                style={{ color: 'rgba(255,255,255,0.95)' }}
              >
                Lithic
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm font-light transition-all duration-300"
                  style={{
                    color: location.pathname === link.path ? '#C9A96E' : 'rgba(255,255,255,0.75)',
                  }}
                  onMouseEnter={e => e.target.style.color = '#C9A96E'}
                  onMouseLeave={e => e.target.style.color = location.pathname === link.path ? '#C9A96E' : 'rgba(255,255,255,0.75)'}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-5">
              <Link to="/products" className="hidden lg:flex text-white/50 hover:text-white/80 transition-colors">
                <Search className="w-4 h-4" />
              </Link>
              <Link
                to="/project"
                className="hidden lg:flex items-center gap-2 text-sm font-light transition-all duration-300"
                style={{ color: '#C9A96E' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Cart{cartItems.length > 0 ? ` (${cartItems.length})` : ''}</span>
              </Link>
              <div className="hidden lg:block w-px h-4 bg-white/10" />

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
                    className="hidden lg:block text-sm font-light transition-colors"
                    style={{ color: 'rgba(255,255,255,0.75)' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#C9A96E'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
                  >
                    Sign In
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
      </div>

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