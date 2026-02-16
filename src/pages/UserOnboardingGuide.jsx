import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Star, Zap, TrendingUp, User, Share2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function UserOnboardingGuide() {
  return (
    <div className="min-h-screen elvt-gradient py-12 md:py-20 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-gradient mb-3 md:mb-4">Welcome to ELVT Social</h1>
          <p className="text-base md:text-xl" style={{ color: 'var(--text-secondary)' }}>
            Your personal marketplace to earn recurring revenue from premium apps & products
          </p>
        </motion.div>

        {/* What You Get */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-8">What You Get</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Star, title: 'Curated Apps', desc: 'Access to premium templates & tools selected by your admin' },
              { icon: TrendingUp, title: '30% Commissions', desc: 'Earn 30% on every app sale you make' },
              { icon: User, title: 'Personal Storefront', desc: 'Your branded page with your unique referral link' },
              { icon: Zap, title: 'Real-Time Analytics', desc: 'Track visitors, conversions, and earnings 24/7' },
              { icon: Share2, title: 'Easy Sharing', desc: 'One-click sharing to TikTok, Instagram, YouTube & more' },
              { icon: CheckCircle2, title: 'AI Support', desc: '24/7 support via Milo (world-class AI co-pilot)' }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="elvt-glass rounded-xl p-6"
                >
                  <Icon className="w-8 h-8 mb-3" style={{ color: 'var(--accent)' }} />
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Getting Started */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-8">Getting Started (5 Minutes)</h2>
          
          <div className="space-y-4">
            {[
              { step: '1', title: 'Accept Your Invitation', desc: 'Check your email for the invite link and click to join' },
              { step: '2', title: 'Complete Your Profile', desc: 'Add photo, bio, and social links (takes 2 minutes)' },
              { step: '3', title: 'Explore the Marketplace', desc: 'Browse apps, watch demos, choose what resonates' },
              { step: '4', title: 'Publish Your Storefront', desc: 'Select apps, customize your theme, go live' },
              { step: '5', title: 'Share & Start Earning', desc: 'Copy your link, share on social, earn commissions' }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
                className="elvt-glass rounded-xl p-6 flex items-start gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How You Earn */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="elvt-glass rounded-2xl p-8 mb-12"
        >
          <h2 className="text-3xl font-bold mb-6">How You Earn</h2>
          
          <div className="bg-black/30 rounded-lg p-6 mb-8">
            <p className="text-lg mb-4">
              <strong>Commission Structure: 30% on all app sales</strong>
            </p>
            
            <div className="bg-black/50 rounded p-4 font-mono text-sm">
              <div className="mb-2">Customer buys app: <span style={{ color: 'var(--accent)' }}>$99</span></div>
              <div className="mb-2">Your commission (30%): <span style={{ color: 'var(--accent)' }}>$29.70</span></div>
              <div>Customer gets: Full app access</div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { metric: 'Min. Payout', value: '$10', desc: 'Reach $10 earned, get paid in 7 days' },
              { metric: 'Payout Schedule', value: 'Weekly', desc: 'Earnings sent to your bank account' },
              { metric: 'No Limits', value: '∞', desc: 'Earn as much as you want' }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>{item.metric}</div>
                <div className="text-3xl font-bold mb-2" style={{ color: 'var(--accent)' }}>{item.value}</div>
                <p style={{ color: 'var(--text-muted)' }} className="text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Best Practices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-8">Success Tips</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: '📊 Pick the Right Apps', desc: 'Choose 3-5 apps that align with your audience\'s needs' },
              { title: '🎯 Be Authentic', desc: 'Share your honest experience using the products' },
              { title: '🚀 Promote Consistently', desc: 'Share your link regularly on TikTok, Instagram, YouTube' },
              { title: '💬 Build Community', desc: 'Engage with followers, answer questions, build trust' },
              { title: '🔄 Rotate & Optimize', desc: 'Test different apps, track conversion rates, focus on winners' },
              { title: '📈 Monitor Analytics', desc: 'Check your dashboard daily to see what\'s working' }
            ].map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="elvt-glass rounded-xl p-4"
              >
                <h3 className="font-bold mb-2">{tip.title}</h3>
                <p style={{ color: 'var(--text-secondary)' }} className="text-sm">{tip.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-8">Common Questions</h2>
          
          <div className="space-y-4">
            {[
              { q: 'Do I have to pay anything?', a: 'No. It\'s free to join and create your storefront.' },
              { q: 'Can I sell my own products?', a: 'Yes, if your admin enables the custom products feature.' },
              { q: 'When do I get paid?', a: 'When you reach $10 earned, payment within 7 days.' },
              { q: 'Is there customer support?', a: 'Yes! Chat with Milo (AI) 24/7 or email support@elvt.social' }
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="elvt-glass rounded-xl p-4"
              >
                <h3 className="font-bold mb-2">{faq.q}</h3>
                <p style={{ color: 'var(--text-secondary)' }}>{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Start Earning?</h2>
          <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
            Create your storefront and share with your audience today
          </p>
          <Link to={createPageUrl('Home')}>
            <Button 
              size="lg" 
              className="px-10 py-6 text-lg font-bold"
              style={{ backgroundColor: 'var(--accent)', color: 'white' }}
            >
              Go to Your Dashboard
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}