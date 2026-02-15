import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ExternalLink } from 'lucide-react';

export default function Sitemap() {
  const pages = [
    { name: 'Home', slug: 'Home', description: 'Landing page' },
    { name: 'App Catalog', slug: 'AppCatalog', description: 'Browse all apps and products' },
    { name: 'App Detail', slug: 'AppDetail', description: 'Individual app details (with ?id=)' },
    { name: 'Join', slug: 'Join', description: 'Become an affiliate' },
    { name: 'Onboarding', slug: 'Onboarding', description: 'Affiliate onboarding wizard' },
    { name: 'Purchase Flow', slug: 'PurchaseFlow', description: 'Checkout (with ?appId=&ref=)' },
    { name: 'Purchase Success', slug: 'PurchaseSuccess', description: 'Order confirmation' },
    { name: 'Storefront', slug: 'Storefront', description: 'Affiliate storefront (with ?slug=)' },
    { name: 'Affiliate Dashboard', slug: 'AffiliateDashboard', description: 'Affiliate control panel' },
    { name: 'Admin Panel', slug: 'AdminPanel', description: 'Admin dashboard (admin only)' },
    { name: 'FAQ', slug: 'FAQ', description: 'Frequently asked questions' },
    { name: 'Pricing', slug: 'Pricing', description: 'Pricing plans' },
    { name: 'Blog', slug: 'Blog', description: 'Blog posts' },
    { name: 'Blog Onboarding', slug: 'BlogOnboarding', description: 'Blog setup guide' },
    { name: 'Docs', slug: 'Docs', description: 'Documentation' },
    { name: 'Solutions by Role', slug: 'SolutionsByRole', description: 'Solutions for different roles' },
    { name: 'Solutions by Use Case', slug: 'SolutionsByUseCase', description: 'Solutions by use case' },
    { name: 'Content Studio', slug: 'ContentStudio', description: 'Content creation tools' },
    { name: 'Admin Setup Guide', slug: 'AdminSetupGuide', description: 'Admin setup instructions' },
    { name: 'User Onboarding Guide', slug: 'UserOnboardingGuide', description: 'User onboarding instructions' },
    { name: 'MILO', slug: 'Milo', description: 'AI content assistant' },
  ];

  const getFullUrl = (slug) => {
    return `https://market.htpelevate.com${createPageUrl(slug)}`;
  };

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
              <Link to={createPageUrl(page.slug)}>
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
                    {page.slug}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 p-6 elvt-glass rounded-2xl"
        >
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Quick Links</h2>
          <div className="space-y-2">
            {pages.map(page => (
              <div key={page.slug} className="flex items-center justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>{page.name}</span>
                <a
                  href={getFullUrl(page.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-mono hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--accent)' }}
                >
                  {getFullUrl(page.slug)}
                </a>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}