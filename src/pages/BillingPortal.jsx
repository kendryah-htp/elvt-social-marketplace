import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CreditCard, Calendar, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function BillingPortal() {
  const [redirecting, setRedirecting] = useState(false);

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

  const handleBillingPortal = async () => {
    setRedirecting(true);
    try {
      const response = await base44.functions.invoke('createBillingPortalSession', {
        user_email: user.email
      });
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (err) {
      toast.error('Failed to open billing portal');
      setRedirecting(false);
    }
  };

  if (userLoading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent)' }} /></div>;
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen text-center"><p style={{ color: 'var(--text-secondary)' }}>Please log in to view billing information.</p></div>;
  }

  return (
    <div className="min-h-screen elvt-gradient pt-20">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-gradient mb-2">Billing & Subscription</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your Content Studio subscription</p>
        </motion.div>

        {subscription ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="elvt-glass rounded-2xl p-8 mb-8"
          >
            <div className="flex items-start gap-4 mb-6">
              {subscription.status === 'active' ? (
                <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#10b981' }} />
              ) : (
                <AlertCircle className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#ef4444' }} />
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {subscription.subscription_type === 'admin_custom' ? 'Premium Plan' : 'Content Studio Plan'}
                </h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Status: <span className={subscription.status === 'active' ? 'text-green-400' : 'text-red-400'} className="font-semibold capitalize">
                    {subscription.status}
                  </span>
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Monthly Price</span>
                </div>
                <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  ${subscription.monthly_price?.toFixed(2)}
                </p>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Next Billing Date</span>
                </div>
                <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  {subscription.next_billing_date ? new Date(subscription.next_billing_date).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            <Button
              onClick={handleBillingPortal}
              disabled={redirecting}
              className="w-full py-3 font-semibold text-white !text-inherit"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              {redirecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Redirecting...
                </>
              ) : (
                'Manage Billing & Payment Methods'
              )}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="elvt-glass rounded-2xl p-12 text-center"
          >
            <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--accent)' }} />
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No Active Subscription</h2>
            <p style={{ color: 'var(--text-secondary)' }} className="mb-6">
              You don't have an active Content Studio subscription yet.
            </p>
            <Button
              className="text-white !text-inherit"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              Start Your Free Trial
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}