import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Sparkles, Zap, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Pricing() {
  const plans = [
    {
      name: 'Free',
      icon: Sparkles,
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        'Create your branded storefront',
        'Access to all apps',
        '20% commission on sales',
        'Real-time analytics',
        'Email support'
      ],
      cta: 'Start Free',
      highlight: false
    },
    {
      name: 'Pro',
      icon: Zap,
      price: '$29',
      period: 'per month',
      description: 'For serious affiliates',
      features: [
        'Everything in Free',
        '30% commission on sales',
        'Priority app placement',
        'Advanced analytics',
        'Custom domain support',
        'Priority support'
      ],
      cta: 'Upgrade to Pro',
      highlight: true
    },
    {
      name: 'Enterprise',
      icon: Crown,
      price: 'Custom',
      period: 'contact us',
      description: 'For teams and agencies',
      features: [
        'Everything in Pro',
        'Custom commission rates',
        'White-label options',
        'Dedicated account manager',
        'API access',
        'Custom integrations'
      ],
      cta: 'Contact Sales',
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen elvt-gradient">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-gradient">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Choose the plan that fits your ambition. Scale up as you grow, cancel anytime.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              whileHover={{ y: -8 }}
              className={`elvt-glass rounded-2xl p-8 relative ${plan.highlight ? 'border-2 pulse-glow' : ''}`}
              style={{ borderColor: plan.highlight ? 'var(--accent)' : 'var(--border)' }}
            >
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
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black" style={{ color: 'var(--accent)' }}>{plan.price}</span>
                  {plan.period !== 'contact us' && <span style={{ color: 'var(--text-secondary)' }}>/{plan.period}</span>}
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

              <Link to={plan.name === 'Enterprise' ? createPageUrl('FAQ') : createPageUrl('Join')}>
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
              { q: 'Can I switch plans anytime?', a: 'Absolutely! Upgrade or downgrade your plan at any time. Changes take effect immediately.' },
              { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.' },
              { q: 'Is there a contract or commitment?', a: 'No contracts. You can cancel your subscription at any time with no penalties.' },
              { q: 'How do commissions work?', a: 'You earn a percentage on every sale made through your storefront. Commissions are paid out automatically.' }
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