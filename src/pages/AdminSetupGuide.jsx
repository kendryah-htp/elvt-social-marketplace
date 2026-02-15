import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Users, DollarSign, Zap, ArrowRight, Shield, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function AdminSetupGuide() {
  return (
    <div className="min-h-screen elvt-gradient py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gradient mb-4">Admin Team Setup Guide</h1>
          <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
            Build your white-label platform and earn recurring revenue from your user base
          </p>
        </motion.div>

        {/* Revenue Model */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="elvt-glass rounded-2xl p-8 mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <DollarSign className="w-8 h-8" style={{ color: 'var(--accent)' }} />
            Platform Revenue Model
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { label: 'Platform Fee', amount: '$17/user/month', color: 'text-green-400' },
              { label: 'Your Revenue', amount: 'Your Price - $17', color: 'text-purple-400' },
              { label: 'Affiliate Commission', amount: '30% on Product Sales', color: 'text-blue-400' }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className={`text-3xl font-bold mb-2 ${item.color}`}>{item.amount}</div>
                <p style={{ color: 'var(--text-secondary)' }}>{item.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-black/30 rounded-lg p-4" style={{ borderLeft: '4px solid var(--accent)' }}>
            <p style={{ color: 'var(--text-secondary)' }}>
              <strong>Example</strong>: If you charge $29/month per user and onboard 100 users:
              <br />
              <span style={{ color: 'var(--accent)' }}>${29 - 17} × 100 = $1,200/month</span> (your revenue)
              <br />
              Plus 30% commissions from all product sales your users make.
            </p>
          </div>
        </motion.div>

        {/* 5 Step Process */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-8">Getting Started in 5 Steps</h2>
          
          <div className="space-y-4">
            {[
              {
                num: 1,
                title: 'Create Your Admin Team',
                desc: 'Set your team name, brand, and pricing (minimum $17)',
                icon: Users
              },
              {
                num: 2,
                title: 'Curate Your App Marketplace',
                desc: 'Select 5-12 high-converting apps for your users to promote',
                icon: Zap
              },
              {
                num: 3,
                title: 'Invite Your First Users',
                desc: 'Send invitations to your community members (email)',
                icon: Users
              },
              {
                num: 4,
                title: 'Watch the MRR Grow',
                desc: 'Real-time dashboard shows users, revenue, and conversions',
                icon: TrendingUp
              },
              {
                num: 5,
                title: 'Scale & Optimize',
                desc: 'Add custom products, rotate apps, grow your ecosystem',
                icon: ArrowRight
              }
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.05 }}
                  className="elvt-glass rounded-xl p-6 flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
                    {step.num}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{step.title}</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>
                  </div>
                  <Icon className="flex-shrink-0 w-6 h-6 mt-1" style={{ color: 'var(--accent)', opacity: 0.5 }} />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Key Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-8">Why Become an Admin</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              'Recurring revenue from users',
              '30% commission on all sales',
              'White-label your own ecosystem',
              'Full data & team isolation',
              'No technical setup required',
              'Automated billing & payouts',
              'Built-in AI support for users',
              'Scalable to 1000+ users'
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="flex items-start gap-3"
              >
                <CheckCircle2 className="flex-shrink-0 w-5 h-5 mt-1" style={{ color: 'var(--accent)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Security & Compliance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="elvt-glass rounded-2xl p-8 mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Shield className="w-8 h-8" style={{ color: 'var(--accent)' }} />
            Security & Compliance
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Data Isolation', desc: 'Your users data is completely isolated. Cannot see other admins data.' },
              { title: 'Payment Security', desc: 'All payments handled by Stripe. PCI-DSS compliant. No card data stored.' },
              { title: 'GDPR Ready', desc: 'Full compliance with GDPR, CCPA, and international privacy standards.' },
              { title: 'Transparent Billing', desc: '$17 platform fee is fixed and clearly displayed to users.' }
            ].map((item, i) => (
              <div key={i}>
                <h4 className="font-bold mb-2">{item.title}</h4>
                <p style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Build Your Empire?</h2>
          <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
            Start your admin team and scale your ecosystem today
          </p>
          <Link to={createPageUrl('AdminPanel')}>
            <Button 
              size="lg" 
              className="px-10 py-6 text-lg font-bold"
              style={{ backgroundColor: 'var(--accent)', color: 'white' }}
            >
              Go to Admin Dashboard
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}