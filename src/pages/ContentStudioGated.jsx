import React, { useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Lock, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ContentStudioGated() {
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me().catch(() => null)
  });

  const { data: subscription } = useQuery({
    queryKey: ['subscription', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const subs = await base44.entities.UserSubscription.filter({
        user_email: user.email
      });
      return subs[0] || null;
    },
    enabled: !!user?.email
  });

  if (userLoading) {
    return <div className="flex items-center justify-center min-h-screen"><Sparkles className="w-8 h-8 animate-spin" style={{ color: 'var(--accent)' }} /></div>;
  }

  if (subscription?.status === 'active') {
    // Render actual Content Studio (import from existing ContentStudio page)
    return <ContentStudio />;
  }

  return (
    <div className="min-h-screen elvt-gradient pt-20 flex items-center">
      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Lock className="w-20 h-20 mx-auto mb-6" style={{ color: 'var(--accent)' }} />
          <h1 className="text-4xl font-bold text-gradient mb-4">Premium Feature Unlocked</h1>
          <p className="text-xl mb-8" style={{ color: 'var(--text-secondary)' }}>
            Content Studio is available to paid subscribers only.
          </p>

          {!user ? (
            <>
              <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
                Sign in to access your subscription or upgrade to Content Studio.
              </p>
              <Button
                onClick={() => base44.auth.redirectToLogin()}
                size="lg"
                className="text-white !text-inherit px-8"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                Sign In
              </Button>
            </>
          ) : (
            <>
              <div className="elvt-glass rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Unlock Content Studio for Just $17.99/month
                </h3>
                <ul className="text-left space-y-3 mb-8" style={{ color: 'var(--text-secondary)' }}>
                  <li>✓ AI-powered prompt library</li>
                  <li>✓ Advanced content templates</li>
                  <li>✓ Team collaboration tools</li>
                  <li>✓ Priority support</li>
                </ul>
                <Button
                  size="lg"
                  className="w-full text-white !text-inherit font-semibold mb-4"
                  style={{ backgroundColor: 'var(--accent)' }}
                  onClick={() => window.location.href = '/checkout?product=content-studio'}
                >
                  Upgrade Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>

              <p style={{ color: 'var(--text-secondary)' }}>
                Already subscribed?{' '}
                <Link to={createPageUrl('BillingPortal')} className="font-semibold hover:opacity-70" style={{ color: 'var(--accent)' }}>
                  Manage your subscription
                </Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}