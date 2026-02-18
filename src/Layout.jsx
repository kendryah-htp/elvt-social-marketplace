import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LayoutDashboard, LogOut, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeProvider, { useTheme } from '@/components/ThemeProvider';
import ErrorBoundary from '@/components/ErrorBoundary';

function LayoutContent({ children, currentPageName }) {
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

  const isPublicPage = ['Home', 'AppCatalog', 'AppDetail', 'Join', 'Storefront', 'PurchaseFlow', 'PurchaseSuccess', 'Milo'].includes(currentPageName);

  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <div className="min-h-screen elvt-gradient">
      {/* Navigation */}
      {isPublicPage && (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b" style={{ 
          background: 'rgba(255, 255, 255, 0.85)', 
          backdropFilter: 'saturate(180%) blur(20px)', 
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          borderColor: 'rgba(139, 92, 246, 0.15)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 8px 32px rgba(139, 92, 246, 0.08)'
        }}>
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
                    <span className="text-2xl font-bold" style={{ 
                      background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #A78BFA 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>{settings?.platform_name || 'ELVT Social'}</span>
                  </>
                )}
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8">
                <Link 
                  to={createPageUrl('AppCatalog')}
                  className="transition-colors font-semibold hover:text-[#7C3AED]"
                  style={{ color: '#1A1A2E' }}
                >
                  Product
                </Link>
                <div className="relative group">
                  <button className="transition-colors font-medium hover:opacity-70" style={{ color: 'var(--text-secondary)' }}>
                    Solutions
                  </button>
                  <div className="absolute top-full left-0 mt-1 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="elvt-glass rounded-lg p-2 border" style={{ borderColor: 'var(--border)' }}>
                      <Link to={createPageUrl('SolutionsByRole')} className="block px-4 py-2 rounded transition-colors hover:opacity-70" style={{ color: 'var(--text-secondary)' }}>
                        By Role
                      </Link>
                      <Link to={createPageUrl('SolutionsByUseCase')} className="block px-4 py-2 rounded transition-colors hover:opacity-70" style={{ color: 'var(--text-secondary)' }}>
                        By Use Case
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="relative group">
                  <button className="transition-colors font-medium hover:opacity-70" style={{ color: 'var(--text-secondary)' }}>
                    Resources
                  </button>
                  <div className="absolute top-full left-0 mt-1 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="elvt-glass rounded-lg p-2 border" style={{ borderColor: 'var(--border)' }}>
                      <Link to={createPageUrl('AppCatalog') + '?category=templates'} className="block px-4 py-2 rounded transition-colors hover:opacity-70" style={{ color: 'var(--text-secondary)' }}>
                        Templates
                      </Link>
                      <Link to={createPageUrl('Docs')} className="block px-4 py-2 rounded transition-colors hover:opacity-70" style={{ color: 'var(--text-secondary)' }}>
                        Docs
                      </Link>
                      <Link to={createPageUrl('Blog')} className="block px-4 py-2 rounded transition-colors hover:opacity-70" style={{ color: 'var(--text-secondary)' }}>
                        Blog
                      </Link>
                    </div>
                  </div>
                </div>
                <Link 
                  to={createPageUrl('Pricing')}
                  className="transition-colors font-medium hover:opacity-70"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Pricing
                </Link>
                <Link 
                  to={createPageUrl('BlogOnboarding')}
                  className="transition-colors font-medium hover:opacity-70"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Blog
                </Link>
                <Link 
                  to={createPageUrl('Milo')}
                  className="transition-colors font-medium hover:opacity-70 pulse-glow"
                  style={{ color: 'var(--accent)' }}
                >
                  ✨ MILO
                </Link>
                <Link 
                  to={createPageUrl('ContentStudio')}
                  className="transition-colors font-medium hover:opacity-70"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Content Studio
                </Link>
                <Link 
                  to={createPageUrl('FAQ')}
                  className="transition-colors font-medium hover:opacity-70"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Support
                </Link>
                <div className="relative group">
                  <button className="transition-colors font-medium hover:opacity-70" style={{ color: 'var(--text-secondary)' }}>
                    Guides
                  </button>
                  <div className="absolute top-full left-0 mt-1 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="elvt-glass rounded-lg p-2 border" style={{ borderColor: 'var(--border)' }}>
                      <Link to={createPageUrl('AdminSetupGuide')} className="block px-4 py-2 rounded transition-colors hover:opacity-70" style={{ color: 'var(--text-secondary)' }}>
                        Admin Setup
                      </Link>
                      <Link to={createPageUrl('UserOnboardingGuide')} className="block px-4 py-2 rounded transition-colors hover:opacity-70" style={{ color: 'var(--text-secondary)' }}>
                        User Onboarding
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-4 pl-4 border-l" style={{ borderColor: 'rgba(139, 92, 246, 0.2)' }}>
                  <Link 
                    to={createPageUrl('Milo')}
                    className="transition-all font-bold px-4 py-2 rounded-lg"
                    style={{ 
                      background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
                      color: 'white',
                      boxShadow: '0 2px 8px rgba(139, 92, 246, 0.25)'
                    }}
                  >
                    ✨ MILO
                  </Link>
                  
                  {user ? (
                    <div className="flex items-center gap-2">
                      {profile && (
                        <Link to={createPageUrl('AffiliateDashboard')}>
                          <Button variant="ghost" className="font-semibold hover:bg-purple-50" style={{ color: '#1A1A2E' }}>
                            Dashboard
                          </Button>
                        </Link>
                      )}
                      {user.role === 'admin' && (
                        <Link to={createPageUrl('AdminPanel')}>
                          <Button variant="ghost" className="font-semibold hover:bg-purple-50" style={{ color: '#7C3AED' }}>
                            Admin
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="hover:bg-purple-50"
                        style={{ color: '#6B6B80' }}
                      >
                        <LogOut className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => base44.auth.redirectToLogin()}
                      className="font-bold px-6"
                      style={{ backgroundColor: '#7C3AED', color: 'white' }}
                    >
                      Sign In
                    </Button>
                  )}
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2"
                style={{ color: '#7C3AED' }}
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
                Product
              </Link>
              <div className="py-2">
                <div className="font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Solutions</div>
                <Link to={createPageUrl('SolutionsByRole')} className="block py-1 pl-4 text-sm transition-colors" style={{ color: 'var(--text-muted)' }} onClick={() => setMobileMenuOpen(false)}>
                  By Role
                </Link>
                <Link to={createPageUrl('SolutionsByUseCase')} className="block py-1 pl-4 text-sm transition-colors" style={{ color: 'var(--text-muted)' }} onClick={() => setMobileMenuOpen(false)}>
                  By Use Case
                </Link>
              </div>
              <div className="py-2">
                <div className="font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Resources</div>
                <Link to={createPageUrl('AppCatalog') + '?category=templates'} className="block py-1 pl-4 text-sm transition-colors" style={{ color: 'var(--text-muted)' }} onClick={() => setMobileMenuOpen(false)}>
                  Templates
                </Link>
                <Link to={createPageUrl('Docs')} className="block py-1 pl-4 text-sm transition-colors" style={{ color: 'var(--text-muted)' }} onClick={() => setMobileMenuOpen(false)}>
                  Docs
                </Link>
                <Link to={createPageUrl('Blog')} className="block py-1 pl-4 text-sm transition-colors" style={{ color: 'var(--text-muted)' }} onClick={() => setMobileMenuOpen(false)}>
                  Blog
                </Link>
              </div>
              <Link
                to={createPageUrl('Pricing')}
                className="block py-2 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to={createPageUrl('Milo')}
                className="block py-2 transition-colors"
                style={{ color: 'var(--accent)' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                ✨ MILO
              </Link>
              <Link
                to={createPageUrl('ContentStudio')}
                className="block py-2 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Content Studio
              </Link>
              <Link
                to={createPageUrl('FAQ')}
                className="block py-2 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Support
              </Link>
              <div className="py-2">
                <div className="font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Guides</div>
                <Link to={createPageUrl('AdminSetupGuide')} className="block py-1 pl-4 text-sm transition-colors" style={{ color: 'var(--text-muted)' }} onClick={() => setMobileMenuOpen(false)}>
                  Admin Setup
                </Link>
                <Link to={createPageUrl('UserOnboardingGuide')} className="block py-1 pl-4 text-sm transition-colors" style={{ color: 'var(--text-muted)' }} onClick={() => setMobileMenuOpen(false)}>
                  User Onboarding
                </Link>
              </div>
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

export default function Layout({ children, currentPageName }) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LayoutContent children={children} currentPageName={currentPageName} />
      </ThemeProvider>
    </ErrorBoundary>
  );
}