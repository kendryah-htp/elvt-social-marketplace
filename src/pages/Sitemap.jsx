import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ExternalLink } from 'lucide-react';

export default function Sitemap() {
  const pages = [
    { name: 'Home', slug: 'Home', description: 'Landing page', url: 'https://market.htpelevate.com/' },
    { name: 'App Catalog', slug: 'AppCatalog', description: 'Browse all apps', url: 'https://market.htpelevate.com/AppCatalog' },
    { name: 'App Detail', slug: 'AppDetail', description: 'Individual app (add ?id=)', url: 'https://market.htpelevate.com/AppDetail?id=APP_ID' },
    { name: 'Join Affiliate', slug: 'Join', description: 'Become an affiliate', url: 'https://market.htpelevate.com/Join' },
    { name: 'Affiliate Onboarding', slug: 'Onboarding', description: 'Setup your storefront', url: 'https://market.htpelevate.com/Onboarding' },
    { name: 'Checkout', slug: 'PurchaseFlow', description: 'Purchase flow (add ?appId=&ref=)', url: 'https://market.htpelevate.com/PurchaseFlow?appId=APP_ID' },
    { name: 'Order Confirmation', slug: 'PurchaseSuccess', description: 'Success page', url: 'https://market.htpelevate.com/PurchaseSuccess' },
    { name: 'Affiliate Storefront', slug: 'Storefront', description: 'Public storefront (add ?slug=)', url: 'https://market.htpelevate.com/Storefront?slug=USERNAME' },
    { name: 'Affiliate Dashboard', slug: 'AffiliateDashboard', description: 'Manage storefront', url: 'https://market.htpelevate.com/AffiliateDashboard' },
    { name: 'Admin Panel', slug: 'AdminPanel', description: 'Admin only', url: 'https://market.htpelevate.com/AdminPanel' },
    { name: 'FAQ', slug: 'FAQ', description: 'FAQs', url: 'https://market.htpelevate.com/FAQ' },
    { name: 'Pricing', slug: 'Pricing', description: 'Pricing plans', url: 'https://market.htpelevate.com/Pricing' },
    { name: 'Blog', slug: 'Blog', description: 'Blog posts', url: 'https://market.htpelevate.com/Blog' },
    { name: 'Blog Setup', slug: 'BlogOnboarding', description: 'Blog onboarding', url: 'https://market.htpelevate.com/BlogOnboarding' },
    { name: 'Docs', slug: 'Docs', description: 'Documentation', url: 'https://market.htpelevate.com/Docs' },
    { name: 'Solutions by Role', slug: 'SolutionsByRole', description: 'Role-based solutions', url: 'https://market.htpelevate.com/SolutionsByRole' },
    { name: 'Solutions by Use Case', slug: 'SolutionsByUseCase', description: 'Use case solutions', url: 'https://market.htpelevate.com/SolutionsByUseCase' },
    { name: 'Content Studio', slug: 'ContentStudio', description: 'Content tools', url: 'https://market.htpelevate.com/ContentStudio' },
    { name: 'Admin Setup', slug: 'AdminSetupGuide', description: 'Setup instructions', url: 'https://market.htpelevate.com/AdminSetupGuide' },
    { name: 'User Guide', slug: 'UserOnboardingGuide', description: 'User onboarding', url: 'https://market.htpelevate.com/UserOnboardingGuide' },
    { name: 'MILO AI', slug: 'Milo', description: 'AI assistant', url: 'https://market.htpelevate.com/Milo' },
  ];

  return (
    <div className="min-h-screen elvt-gradient">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
            Sitemap
          </h1>
          <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
            All live pages on ELVT Social marketplace
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {pages.map((page, idx) => (
            <motion.div
              key={page.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <a
                href={page.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="elvt-glass rounded-xl p-6 hover:elvt-glow transition-all cursor-pointer group h-full">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gradient group-hover:scale-105 transition-transform">
                      {page.name}
                    </h3>
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent)' }} />
                  </div>
                  <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                    {page.description}
                  </p>
                  <div className="break-all text-xs font-mono p-2 rounded" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--accent)' }}>
                    {page.url}
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}