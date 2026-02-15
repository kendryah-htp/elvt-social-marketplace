import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import LuxuryTheme from '@/components/storefront/LuxuryTheme';
import MinimalTheme from '@/components/storefront/MinimalTheme';
import VibrantTheme from '@/components/storefront/VibrantTheme';

const themeComponents = {
  luxury: LuxuryTheme,
  minimal: MinimalTheme,
  vibrant: VibrantTheme
};

export default function Storefront() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');

  // Track storefront visit
  useEffect(() => {
    if (slug) {
      base44.functions.invoke('trackVisit', {
        affiliate_slug: slug,
        referrer: document.referrer
      }).catch(() => {}); // Silent fail
    }
  }, [slug]);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['storefront-profile', slug],
    queryFn: async () => {
      const profiles = await base44.entities.AffiliateProfile.filter({ slug });
      return profiles[0];
    },
    enabled: !!slug
  });

  const { data: apps = [] } = useQuery({
    queryKey: ['storefront-apps', profile?.selected_app_ids],
    queryFn: async () => {
      if (!profile?.selected_app_ids?.length) return [];
      const allApps = await base44.entities.App.filter({ is_active: true });
      return allApps.filter(app => profile.selected_app_ids.includes(app.id));
    },
    enabled: !!profile?.selected_app_ids
  });

  const { data: products = [] } = useQuery({
    queryKey: ['storefront-products', profile?.id],
    queryFn: () => base44.entities.AffiliateProduct.filter({ 
      affiliate_id: profile.id,
      is_active: true 
    }),
    enabled: !!profile?.id
  });

  const handleAppClick = (app) => {
    navigate(createPageUrl('AppDetail') + '?id=' + app.id + '&ref=' + slug);
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen elvt-gradient flex items-center justify-center"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-t-transparent rounded-full mx-auto mb-4"
            style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
          />
          <p style={{ color: 'var(--text-secondary)' }} className="font-semibold">Loading storefront...</p>
        </div>
      </motion.div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen elvt-gradient flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Storefront Not Found</h1>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>This affiliate storefront doesn't exist</p>
        </div>
      </div>
    );
  }

  const ThemeComponent = themeComponents[profile.theme] || LuxuryTheme;

  return (
    <ThemeComponent
      profile={profile}
      apps={apps}
      products={products}
      onAppClick={handleAppClick}
    />
  );
}