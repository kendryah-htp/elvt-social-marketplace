import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, TrendingUp, Users, Zap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { trackConversion } from '@/components/AnalyticsTracker';

export default function Join() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setInitialLoad(false);

    trackConversion('signup_started');

    try {
      const user = await base44.auth.me().catch(() => null);
      
      // Redirect to login if not authenticated
      if (!user) {
        base44.auth.redirectToLogin(createPageUrl('Join'));
        return;
      }

      // Check if affiliate profile already exists
      const existing = await base44.entities.AffiliateProfile.filter({ user_email: user.email });
      
      if (existing.length > 0) {
        navigate(createPageUrl('AffiliateDashboard'));
        return;
      }

      // Create affiliate profile with unique slug
      let slug = user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
      // Add timestamp to ensure uniqueness
      const timestamp = Date.now().toString().slice(-6);
      slug = `${slug}-${timestamp}`;
      
      await base44.entities.AffiliateProfile.create({
        user_email: user.email,
        full_name: user.full_name || user.email,
        slug: slug,
        onboarding_completed: false,
        is_active: true
      });

      trackConversion('signup_completed', { user_email: user.email });
      navigate(createPageUrl('Onboarding'));
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen elvt-gradient pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="elvt-glass px-4 md:px-6 py-2 md:py-3 rounded-full inline-flex items-center gap-2 mb-4 md:mb-6 border" style={{ borderColor: 'var(--border)' }}>
            <Sparkles className="w-3 md:w-4 h-3 md:h-4" style={{ color: 'var(--accent)' }} />
            <span className="font-semibold text-xs md:text-sm" style={{ color: 'var(--accent)' }}>FREE AFFILIATE PROGRAM</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight px-4">
            Start Earning with
            <span className="text-gradient block mt-1 md:mt-2">Premium Products</span>
          </h1>
          
          <p className="text-base md:text-xl max-w-2xl mx-auto mb-6 md:mb-8 px-4" style={{ color: 'var(--text-secondary)' }}>
            Get your own branded storefront and earn up to 30% commission on every sale. Setup takes less than 3 minutes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4 md:space-y-6 px-4 md:px-0"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8" style={{ color: 'var(--text-primary)' }}>What You Get:</h2>
            
            {[
              {
                icon: Zap,
                title: "Instant Branded Storefront",
                description: "Your own link-in-bio page with customizable themes. Perfect for Instagram, TikTok, and more."
              },
              {
                icon: TrendingUp,
                title: "30% Commission Rate",
                description: "Earn generous commissions on premium apps and training programs worth promoting."
              },
              {
                icon: Users,
                title: "Real-Time Dashboard",
                description: "Track your earnings, sales, and storefront analytics in one beautiful dashboard."
              }
            ].map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="elvt-glass rounded-xl p-4 md:p-6 flex gap-3 md:gap-4 border" style={{ borderColor: 'rgba(139, 92, 246, 0.15)' }}
              >
                <div className="w-10 md:w-12 h-10 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  <benefit.icon className="w-5 md:w-6 h-5 md:h-6" style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2" style={{ color: 'var(--text-primary)' }}>
                    {benefit.title}
                  </h3>
                  <p className="text-xs md:text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Signup Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="elvt-glass rounded-xl md:rounded-2xl p-6 md:p-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center text-gradient">
              Start Your Journey
            </h2>
            
            <form onSubmit={handleSignup} className="space-y-4 md:space-y-6">
              <div className="text-center">
                <p className="mb-4 md:mb-6 text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>
                  Click below to create your free affiliate account. You'll be redirected to complete the quick onboarding.
                </p>
                
                {error && (
                  <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-2 md:p-3 mb-4 md:mb-6 text-sm">
                    {error}
                  </div>
                )}
                
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="w-full font-bold py-5 md:py-6 text-base md:text-lg group pulse-glow text-white h-12 md:h-auto"
                  style={{ backgroundColor: 'var(--accent)' }}
                >
                  {isLoading ? (
                    <span>Setting up your account...</span>
                  ) : (
                    <>
                      Get Started Free
                      <ArrowRight className="ml-2 w-4 md:w-5 h-4 md:h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>

              <div className="pt-4 md:pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="space-y-3 md:space-y-4 text-xs md:text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
                    </div>
                    <p>No credit card required</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
                    </div>
                    <p>Get your storefront live in under 3 minutes</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
                    </div>
                    <p>Start earning immediately</p>
                  </div>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}