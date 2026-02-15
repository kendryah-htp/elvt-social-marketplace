import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LayoutDashboard, LogOut, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { settings } = useTheme();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me().catch(() => null)
  });

  const { data: profile } = useQuery({
    queryKey: ['affiliate-profile', user?.email],
    queryFn: async () => {
      const profiles = await base44.entities.AffiliateProfile.filter({ user_email: user.email });
      return profiles[0] || null;
    },
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
                {settings?.logo_url ? (
                  <img src={settings.logo_url} alt="Logo" className="h-10 w-auto" />
                ) : (
                  <>
                    <div className="relative">
                      <div className="absolute inset-0 blur-lg opacity-30 group-hover:opacity-50 transition-opacity" style={{ backgroundColor: 'var(--accent)' }} />
                      <Sparkles className="w-8 h-8 relative" style={{ color: 'var(--accent)' }} />
                    </div>
                    <span className="text-2xl font-bold text-gradient">{settings?.platform_name || 'ELVT Social'}</span>
                  </>
                )}
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
                    {profile && (
                      <Link to={createPageUrl('AffiliateDashboard')}>
                        <Button variant="outline" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }} className="hover:bg-[var(--accent)] hover:text-white transition-all">
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Dashboard
                        </Button>
                      </Link>
                    )}
                    {user.role === 'admin' && (
                      <Link to={createPageUrl('AdminPanel')}>
                        <Button variant="ghost" style={{ color: 'var(--accent)' }}>
                          Admin
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      style={{ color: 'var(--text-secondary)' }}
                      className="hover:opacity-70"
                    >
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => base44.auth.redirectToLogin()}
                    className="font-semibold pulse-glow"
                    style={{ backgroundColor: 'var(--accent)', color: 'white' }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2"
                style={{ color: 'var(--accent)' }}
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
            className="md:hidden"
            style={{ backgroundColor: 'var(--bg-primary)', borderTop: '1px solid var(--border)' }}
          >
            <div className="px-6 py-4 space-y-3">
              <Link
                to={createPageUrl('AppCatalog')}
                className="block py-2 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link
                to={createPageUrl('Join')}
                className="block py-2 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Become an Affiliate
              </Link>
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
                      className="block py-2 transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left py-2 transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => base44.auth.redirectToLogin()}
                  className="w-full text-left py-2 font-semibold"
                  style={{ color: 'var(--accent)' }}
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
                  {settings?.logo_url ? (
                    <img src={settings.logo_url} alt="Logo" className="h-8 w-auto" />
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" style={{ color: 'var(--accent)' }} />
                      <span className="text-xl font-bold text-gradient">{settings?.platform_name || 'ELVT Social'}</span>
                    </>
                  )}
                </div>
                <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
                  Premium marketplace for high-value digital products and affiliate opportunities.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Marketplace</h4>
                <div className="space-y-2">
                  <Link to={createPageUrl('AppCatalog')} className="block text-sm transition-colors hover:opacity-70" style={{ color: 'var(--text-secondary)' }}>
                    Browse Apps
                  </Link>
                  <Link to={createPageUrl('Join')} className="block text-sm transition-colors hover:opacity-70" style={{ color: 'var(--text-secondary)' }}>
                    Become an Affiliate
                  </Link>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Support</h4>
                <div className="space-y-2">
                  {settings?.footer_links?.filter(l => l.label && l.url).slice(0, 2).map((link, i) => (
                    <a key={i} href={link.url} className="block text-sm transition-colors hover:opacity-70" style={{ color: 'var(--text-secondary)' }}>
                      {link.label}
                    </a>
                  ))}
                  {settings?.contact_email && (
                    <a href={`mailto:${settings.contact_email}`} className="block text-sm transition-colors hover:opacity-70" style={{ color: 'var(--text-secondary)' }}>
                      Contact Us
                    </a>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Legal</h4>
                <div className="space-y-2">
                  {settings?.footer_links?.filter(l => l.label && l.url).slice(2, 4).map((link, i) => (
                    <a key={i} href={link.url} className="block text-sm transition-colors hover:opacity-70" style={{ color: 'var(--text-secondary)' }}>
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="pt-8 text-center" style={{ borderTop: '1px solid var(--border)' }}>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                © 2026 {settings?.platform_name || 'ELVT Social'}. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}