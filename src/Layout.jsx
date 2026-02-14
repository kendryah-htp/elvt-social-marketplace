import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LayoutDashboard, LogOut, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const location = useLocation();

  useEffect(() => {
    const savedTheme = localStorage.getItem('elvt-theme') || 'dark';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeName) => {
    const root = document.documentElement;
    const themes = {
      dark: {
        '--bg-primary': '#0A0A0A',
        '--bg-secondary': '#1A1A1A',
        '--bg-tertiary': '#2A2A2A',
        '--text-primary': '#F5F0EB',
        '--text-secondary': '#E5E0DB',
        '--text-muted': '#A0A0A0',
        '--accent': '#D4AF37',
        '--border': 'rgba(212, 175, 55, 0.1)',
      },
      light: {
        '--bg-primary': '#FFFFFF',
        '--bg-secondary': '#F8F6F2',
        '--bg-tertiary': '#EDE8E0',
        '--text-primary': '#1A1A1A',
        '--text-secondary': '#333333',
        '--text-muted': '#666666',
        '--accent': '#D4AF37',
        '--border': 'rgba(0, 0, 0, 0.1)',
      }
    };
    const themeVars = themes[themeName] || themes.dark;
    Object.entries(themeVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  };

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('elvt-theme', newTheme);
    applyTheme(newTheme);
  };

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me().catch(() => null)
  });

  const { data: profile } = useQuery({
    queryKey: ['affiliate-profile', user?.email],
    queryFn: () => base44.entities.AffiliateProfile.filter({ user_email: user.email }).then(p => p[0]),
    enabled: !!user?.email
  });

  const isPublicPage = ['Home', 'AppCatalog', 'AppDetail', 'Join', 'Storefront', 'PurchaseFlow', 'PurchaseSuccess'].includes(currentPageName);

  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <div className="min-h-screen elvt-gradient">
      {/* Navigation */}
      {isPublicPage && (
        <nav className="fixed top-0 left-0 right-0 z-50 elvt-glass border-b border-[#D4AF37]/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <Link to={createPageUrl('Home')} className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#D4AF37] blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                  <Sparkles className="w-8 h-8 text-[#D4AF37] relative" />
                </div>
                <span className="text-2xl font-bold text-gradient">ELVT Social</span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8">
                <Link 
                  to={createPageUrl('AppCatalog')}
                  className="hover:text-[#D4AF37] transition-colors font-medium"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Marketplace
                </Link>
                <Link 
                  to={createPageUrl('Join')}
                  className="hover:text-[#D4AF37] transition-colors font-medium"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Become an Affiliate
                </Link>

                {user ? (
                  <div className="flex items-center gap-3">
                    {user.role === 'admin' && (
                      <div className="flex items-center gap-1 bg-black/20 rounded-lg p-1">
                        <button
                          onClick={() => changeTheme('dark')}
                          className={`px-3 py-1 rounded transition-colors ${theme === 'dark' ? 'bg-[#D4AF37] text-black' : 'text-[#D4AF37]'}`}
                        >
                          Dark
                        </button>
                        <button
                          onClick={() => changeTheme('light')}
                          className={`px-3 py-1 rounded transition-colors ${theme === 'light' ? 'bg-[#D4AF37] text-black' : 'text-[#D4AF37]'}`}
                        >
                          Light
                        </button>
                      </div>
                    )}
                    {profile && (
                      <Link to={createPageUrl('AffiliateDashboard')}>
                        <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]">
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Dashboard
                        </Button>
                      </Link>
                    )}
                    {user.role === 'admin' && (
                      <Link to={createPageUrl('AdminPanel')}>
                        <Button variant="ghost" className="text-[#D4AF37]">
                          Admin
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      style={{ color: 'var(--text-secondary)' }}
                      className="hover:text-[#D4AF37]"
                    >
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => base44.auth.redirectToLogin()}
                    className="bg-[#D4AF37] hover:bg-[#E5C158] text-black font-semibold"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-[#D4AF37] p-2"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
          {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[#D4AF37]/10"
            style={{ backgroundColor: 'var(--bg-primary)' }}
          >
            <div className="px-6 py-4 space-y-3">
              <Link
                to={createPageUrl('AppCatalog')}
                className="block py-2 hover:text-[#D4AF37] transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link
                to={createPageUrl('Join')}
                className="block py-2 hover:text-[#D4AF37] transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Become an Affiliate
              </Link>
              {user && user.role === 'admin' && (
                <div className="flex gap-2 py-2">
                  <button
                    onClick={() => { changeTheme('dark'); setMobileMenuOpen(false); }}
                    className={`flex-1 px-2 py-1 rounded text-sm ${theme === 'dark' ? 'bg-[#D4AF37] text-black' : 'text-[#D4AF37]'}`}
                  >
                    Dark
                  </button>
                  <button
                    onClick={() => { changeTheme('light'); setMobileMenuOpen(false); }}
                    className={`flex-1 px-2 py-1 rounded text-sm ${theme === 'light' ? 'bg-[#D4AF37] text-black' : 'text-[#D4AF37]'}`}
                  >
                    Light
                  </button>
                </div>
              )}
              {user ? (
                <>
                  {profile && (
                    <Link
                      to={createPageUrl('AffiliateDashboard')}
                      className="block py-2 hover:text-[#D4AF37] transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link
                      to={createPageUrl('AdminPanel')}
                      className="block py-2 hover:text-[#D4AF37] transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left py-2 hover:text-[#D4AF37] transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => base44.auth.redirectToLogin()}
                  className="w-full text-left py-2 text-[#D4AF37] font-semibold"
                >
                  Sign In
                </button>
              )}
            </div>
          </motion.div>
          )}
          </AnimatePresence>
        </nav>
      )}

      {/* Page Content */}
      <main className={isPublicPage ? 'pt-20' : ''}>
        {children}
      </main>

      {/* Footer */}
      {isPublicPage && (
        <footer className="border-t border-[#D4AF37]/10 mt-20">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-6 h-6 text-[#D4AF37]" />
                  <span className="text-xl font-bold text-gradient">ELVT Social</span>
                </div>
                <p className="text-[#E5E0DB] text-sm">
                  Premium marketplace for high-value digital products and affiliate opportunities.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-[#F5F0EB] mb-3">Marketplace</h4>
                <div className="space-y-2">
                  <Link to={createPageUrl('AppCatalog')} className="block text-[#E5E0DB] hover:text-[#D4AF37] text-sm transition-colors">
                    Browse Apps
                  </Link>
                  <Link to={createPageUrl('Join')} className="block text-[#E5E0DB] hover:text-[#D4AF37] text-sm transition-colors">
                    Become an Affiliate
                  </Link>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-[#F5F0EB] mb-3">Support</h4>
                <div className="space-y-2">
                  <a href="mailto:support@elvtsocial.com" className="block text-[#E5E0DB] hover:text-[#D4AF37] text-sm transition-colors">
                    Contact Us
                  </a>
                  <a href="#" className="block text-[#E5E0DB] hover:text-[#D4AF37] text-sm transition-colors">
                    Help Center
                  </a>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-[#F5F0EB] mb-3">Legal</h4>
                <div className="space-y-2">
                  <a href="#" className="block text-[#E5E0DB] hover:text-[#D4AF37] text-sm transition-colors">
                    Terms of Service
                  </a>
                  <a href="#" className="block text-[#E5E0DB] hover:text-[#D4AF37] text-sm transition-colors">
                    Privacy Policy
                  </a>
                </div>
              </div>
            </div>
            <div className="border-t border-[#D4AF37]/10 pt-8 text-center">
              <p className="text-[#E5E0DB] text-sm">
                © 2026 ELVT Social. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}