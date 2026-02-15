import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Sparkles, Zap, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Pricing() {
  const userPlans = [
    {
      name: 'Free Affiliate',
      icon: Sparkles,
      price: '$0',
      period: 'forever',
      description: 'Promote premium apps, build your audience',
      features: [
        'Create your branded storefront',
        'Access to curated app catalog',
        'Promote partner apps & templates',
        '30% commission on affiliate sales',
        'Real-time analytics dashboard',
        'MILO AI support (read-only)',
        'Email support'
      ],
      cta: 'Start Free',
      highlight: false,
      tier: 'user'
    }
  ];

  const adminPlans = [
    {
      name: 'Admin Base',
      icon: Zap,
      price: '$399',
      period: 'per month',
      description: 'Build your platform, set your pricing',
      features: [
        'Your own white-label marketplace',
        'Set custom user pricing ($17+ platform fee)',
        'Recurring revenue from subscriptions',
        '30% commission on product sales',
        'Pre-load your products on storefronts',
        'User & affiliate management',
        'Full MILO AI customization',
        'Analytics & revenue tracking',
        'Dedicated support'
      ],
      cta: 'Start Admin Platform',
      highlight: true,
      tier: 'admin',
      stripePriceId: 'price_1T0Sec0490AThCZF6BXcwifn'
    },
    {
      name: 'Founding Member',
      icon: Crown,
      price: '$77',
      originalPrice: '$97',
      period: 'per month',
      description: 'Limited slots available—lifetime rate locked in',
      features: [
        'Everything in Admin Base',
        'Lifetime founding member discount (40% off)',
        'Priority onboarding & setup',
        'Early access to new features',
        'VIP community access',
        'Quarterly business reviews'
      ],
      cta: 'Claim Founding Slot',
      highlight: false,
      tier: 'admin',
      stripePriceId: 'price_1T0Se80490AThCZFK3OSa8Ox',
      badge: 'Limited Time'
    }
  ];

  return (
    <div className="min-h-screen elvt-gradient">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-gradient">
            Pricing That Scales With You
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Start free as an affiliate. Launch your platform as an admin. Both paths to recurring revenue.
          </p>
        </motion.div>

        {/* Affiliate Section */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: 'var(--text-primary)' }}>Affiliate (Start Free)</h2>
          <div className="max-w-3xl mx-auto">
            {userPlans.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="elvt-glass rounded-2xl p-8 relative border-2" style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <plan.icon className="w-6 h-6" style={{ color: 'var(--accent)' }} />
                  </div>
                  <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{plan.name}</h3>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black" style={{ color: 'var(--accent)' }}>{plan.price}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>/{plan.period}</span>
                  </div>
                  <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIdx) => (
                    <li key={featureIdx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
                      <span style={{ color: 'var(--text-secondary)' }}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to={createPageUrl('Join')}>
                  <Button 
                    className="w-full font-bold"
                    style={{ backgroundColor: 'var(--accent)', color: 'white' }}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Admin Section */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold mb-4 text-center" style={{ color: 'var(--text-primary)' }}>Launch Your Platform (Admin)</h2>
          <p className="text-center mb-12 text-lg" style={{ color: 'var(--text-secondary)' }}>Build your marketplace. Keep $17+ per user per month. Earn 30% on every product sale.</p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {adminPlans.map((plan, idx) => (

              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 }}
                whileHover={{ y: -8 }}
                className={`elvt-glass rounded-2xl p-8 relative ${plan.highlight ? 'border-2 pulse-glow' : 'border'}`}
                style={{ borderColor: plan.highlight ? 'var(--accent)' : 'var(--border)' }}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: '#FF6B35', color: 'white' }}>
                    {plan.badge}
                  </div>
                )}
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
                    Most Popular
                  </div>
                )}

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <plan.icon className="w-6 h-6" style={{ color: 'var(--accent)' }} />
                  </div>
                  <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{plan.name}</h3>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-black" style={{ color: 'var(--accent)' }}>{plan.price}</span>
                    {plan.originalPrice && (
                      <span className="text-lg line-through" style={{ color: 'var(--text-muted)' }}>{plan.originalPrice}</span>
                    )}
                    <span style={{ color: 'var(--text-secondary)' }}>/{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIdx) => (
                    <li key={featureIdx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
                      <span style={{ color: 'var(--text-secondary)' }}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to={createPageUrl('Join')}>
                  <Button 
                    className="w-full font-bold"
                    style={plan.highlight ? { backgroundColor: 'var(--accent)', color: 'white' } : { backgroundColor: 'var(--bg-tertiary)', color: 'var(--accent)' }}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Revenue Model Explainer */}
        <div className="max-w-5xl mx-auto mb-24 elvt-glass rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-8 text-center text-gradient">How the Revenue Model Works</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>As an Affiliate</h3>
              <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                You get <span style={{ color: 'var(--accent)' }} className="font-bold">30% commission</span> on every app or product sold through your storefront, plus <span style={{ color: 'var(--accent)' }} className="font-bold">MILO AI</span> to create content in your voice.
              </p>
              <p style={{ color: 'var(--text-secondary)' }}>
                <strong>Example:</strong> A customer buys a $100 app through your link → You earn $30.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>As an Admin</h3>
              <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                You earn <span style={{ color: 'var(--accent)' }} className="font-bold">recurring revenue</span> by setting your own user pricing. Platform fee is $17/user/month—you keep the rest.
              </p>
              <p style={{ color: 'var(--text-secondary)' }}>
                <strong>Example:</strong> You charge users $47/month → You keep $30/month per user + 30% on their product sales.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-8 text-center text-gradient">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              { q: 'How do I know which path is right for me?', a: 'Start free as an affiliate to test the platform and earn commissions. When you\'re ready to build your own platform and earn recurring revenue, upgrade to Admin.' },
              { q: 'Can I be both an affiliate AND an admin?', a: 'Yes! Run your platform as an admin while also earning affiliate commissions on products you promote.' },
              { q: 'What\'s included with MILO?', a: 'MILO is our AI co-pilot that learns your brand voice and generates blog posts, social content, and email copy in seconds. Free affiliates get read-only access; Admins get full customization.' },
              { q: 'How do payouts work?', a: 'Affiliate commissions and admin revenue are processed automatically within 7 days of each sale. Transparent, no surprises.' },
              { q: 'Can I change my pricing later?', a: 'Absolutely. As an admin, adjust your user pricing anytime. Affiliate tracking remains unaffected—all dynamic and flexible.' },
              { q: 'No long-term contracts?', a: 'Correct. Cancel anytime, keep what you earn, no penalties.' }
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="elvt-glass rounded-xl p-6"
              >
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{faq.q}</h3>
                <p style={{ color: 'var(--text-secondary)' }}>{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}