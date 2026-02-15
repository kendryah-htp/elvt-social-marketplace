import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { CheckCircle2, AlertTriangle, Zap, Users, DollarSign, Bug } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function LaunchGuide() {
  const [expandedSection, setExpandedSection] = useState('overview');

  const sections = {
    overview: {
      title: 'Platform Overview',
      icon: Zap,
      content: [
        {
          heading: 'What Is ELVT Social?',
          items: [
            'Premium affiliate marketplace with white-label capabilities',
            'Creators build storefronts, promote curated apps, earn 30% commission',
            'Admins onboard users, set custom pricing, earn $12-$29/user/month',
            'AI co-pilot (MILO) guides users at every step',
            'No transaction fees for creators/admins—platform earns from base $17/user'
          ]
        },
        {
          heading: 'Three Core User Types',
          items: [
            '🎯 Affiliates: Sign up free, customize storefront, earn 30% per sale',
            '👥 Admins: White-label team, onboard users, earn recurring revenue',
            '🛒 Buyers: Browse apps, purchase via affiliate links, receive access'
          ]
        }
      ]
    },
    affiliate: {
      title: 'Affiliate Journey',
      icon: Users,
      content: [
        {
          heading: 'Step 1: Signup (Join Page)',
          items: [
            'User clicks "Get Started Free" → Redirects to /Join',
            'Email-based signup (auto-creates affiliate profile)',
            'Redirect → /Onboarding (guided 3-step flow)',
            'No email verification required yet (platform auto-validates)'
          ]
        },
        {
          heading: 'Step 2: Onboarding (3-Step Wizard)',
          items: [
            'Choose Theme: Luxury, Minimal, or Vibrant',
            'Select Apps: Pick 3+ apps to promote on storefront',
            'Personalize: Add bio, avatar, social links (optional)',
            'Success: Storefront goes live with unique slug'
          ]
        },
        {
          heading: 'Step 3: Dashboard (AffiliateDashboard)',
          items: [
            'Real-time metrics: Earnings, visits, conversions',
            'Storefront management: URL, theme, app selection',
            'Custom products: Add own products (admin-enabled)',
            'Recent sales: See commissions earned'
          ]
        },
        {
          heading: 'Step 4: Share & Earn',
          items: [
            'Copy storefront URL from dashboard',
            'Share on TikTok, Instagram, YouTube, blogs',
            'Every purchase through link = 30% commission',
            'Payout when reaching $10 (within 7 days)'
          ]
        }
      ]
    },
    buyer: {
      title: 'Buyer Journey',
      icon: DollarSign,
      content: [
        {
          heading: 'Entry Point: Affiliate Storefront',
          items: [
            'Affiliate shares unique link: elvt.social/storefront?ref=john_doe',
            'Buyer lands on personalized storefront with affiliate\'s apps',
            'See affiliate\'s bio, theme, selected apps'
          ]
        },
        {
          heading: 'Browse & Demo',
          items: [
            'View all apps on storefront (app cards)',
            'Click app → Detailed view with description, price, rating',
            'Demo button → Embedded preview (iframe or video)',
            'All tracking maintains affiliate credit'
          ]
        },
        {
          heading: 'Purchase Flow',
          items: [
            'Click "Buy Now" → /PurchaseFlow?appId=X&ref=affiliate_slug',
            'Order summary: App price, affiliate support callout',
            'Payment form: Name, email, card (Stripe)',
            'Stripe processes payment (buyer never sees API keys)'
          ]
        },
        {
          heading: 'Post-Purchase',
          items: [
            'Success page confirmation',
            'Confirmation email sent (with app access details)',
            'Affiliate gets $XX.XX commission (30%)',
            'Commission recorded in affiliate dashboard'
          ]
        }
      ]
    },
    admin: {
      title: 'Admin Journey',
      icon: Users,
      content: [
        {
          heading: 'Setup: AdminSetupGuide',
          items: [
            'Clear revenue breakdown: $17 platform fee vs admin margin',
            'Example: Charge $29/user = $12/month profit per user',
            'Plus 30% commission on all product sales through affiliate links'
          ]
        },
        {
          heading: 'AdminPanel Features',
          items: [
            'User management: Invite users via email',
            'App curation: Select 5-12 apps for your ecosystem',
            'Email templates: Customize purchase/welcome emails',
            'Resources: Create FAQs & guides for users',
            'Analytics: Track MRR, user count, conversions'
          ]
        },
        {
          heading: 'User Onboarding',
          items: [
            'Send email invites → Users complete /Onboarding',
            'Users automatically assigned to your admin team',
            'Earnings counted toward your MRR (monthly recurring revenue)',
            'Dashboard shows real-time user count & revenue'
          ]
        },
        {
          heading: 'Scaling Strategy',
          items: [
            'Add custom products for users to sell',
            'Rotate apps based on conversion rates',
            'Provide affiliate tips (content calendar, scripts)',
            'White-label: Custom domain support (future)'
          ]
        }
      ]
    },
    critical: {
      title: 'Critical Issues to Fix',
      icon: AlertTriangle,
      content: [
        {
          heading: '🔴 Payment Processing',
          items: [
            'ISSUE: Stripe integration not tested end-to-end',
            'FIX: Test with real Stripe test card (4242 4242 4242 4242)',
            'FIX: Verify payment intent creation & webhook handling',
            'FIX: Confirm purchase records are created with affiliate credit'
          ]
        },
        {
          heading: '🟠 Email System',
          items: [
            'ISSUE: Confirmation emails may fail in sandbox',
            'FIX: Set up SendGrid/Resend integration for production',
            'FIX: Create email template for purchase confirmations',
            'FIX: Test with real email addresses'
          ]
        },
        {
          heading: '🟠 Loading States',
          items: [
            'ISSUE: Some async operations lack spinners/feedback',
            'FIX: Add loading state to Purchase form submission',
            'FIX: Add loading state to Onboarding step transitions',
            'FIX: Add skeleton loaders to dashboard data fetches'
          ]
        },
        {
          heading: '🟡 Mobile Responsiveness',
          items: [
            'ISSUE: Some pages not fully tested on mobile',
            'FIX: Test PurchaseFlow on iPhone 12 & Android',
            'FIX: Test Storefront on various screen sizes',
            'FIX: Verify forms are touch-friendly'
          ]
        },
        {
          heading: '🟡 Error Recovery',
          items: [
            'ISSUE: Failed purchases don\'t have retry logic',
            'FIX: Add "Try Again" button on payment failures',
            'FIX: Implement error boundary on checkout page',
            'FIX: Log errors to monitoring service (Sentry)'
          ]
        }
      ]
    },
    recommendations: {
      title: 'Launch Recommendations',
      icon: CheckCircle2,
      content: [
        {
          heading: '✅ Pre-Launch Checklist (This Week)',
          items: [
            'Test full buyer journey: Join → Onboarding → Buy → Success',
            'Test full affiliate journey: Join → Storefront → Share → Earn',
            'Test admin journey: Create team → Invite user → Monitor analytics',
            'Create 3 test transactions end-to-end with Stripe',
            'Verify all emails are sent (purchase, onboarding, welcome)',
            'Test on mobile (Safari iPhone & Chrome Android)',
            'Run Lighthouse audit (target: 80+ on all metrics)',
            'Security audit: No API keys in frontend, all secrets in env vars'
          ]
        },
        {
          heading: '⚡ Day 1 Production Setup',
          items: [
            'Enable real Stripe keys (not test mode)',
            'Set up SendGrid/Resend for email delivery',
            'Enable monitoring (Sentry for errors, LogRocket for UX)',
            'Set up analytics (track affiliate signups, purchases, earnings)',
            'Pre-populate with 10-15 real apps (curated catalog)',
            'Create admin account for support team',
            'Brief support team on common issues & resolutions'
          ]
        },
        {
          heading: '🚀 First Week Optimizations',
          items: [
            'Monitor error logs daily (Sentry)',
            'Fix bugs reported by early users within 4 hours',
            'Send "Success Stories" email to early affiliates',
            'Optimize onboarding UX based on drop-off analytics',
            'Create FAQ page with real user questions',
            'Respond personally to support inquiries',
            'Track conversion funnel (signup → storefront → sale)'
          ]
        },
        {
          heading: '💎 Long-Term Viability',
          items: [
            'Ensure affiliate commission payout system is bulletproof',
            'Build reputation system (ratings for apps & affiliates)',
            'Create affiliate academy (blog posts, video tutorials)',
            'Implement fraud detection (fake purchases, click farms)',
            'Build affiliate tier system (bronze → gold → platinum)',
            'Create partnership program for high-volume affiliates'
          ]
        }
      ]
    }
  };

  return (
    <div className="min-h-screen elvt-gradient py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gradient mb-4">Launch Readiness Guide</h1>
          <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
            Complete breakdown of all user journeys, critical fixes, and recommendations
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-8">
              {Object.entries(sections).map(([key, section]) => {
                const Icon = section.icon;
                return (
                  <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span className="hidden md:inline">{section.title.split(' ')[0]}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {Object.entries(sections).map(([key, section]) => (
              <TabsContent key={key} value={key} className="space-y-6">
                {section.content.map((block, idx) => (
                  <motion.div
                    key={idx}
                    variants={item}
                    className="elvt-glass rounded-xl p-6"
                  >
                    <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                      {block.heading}
                    </h3>
                    <ul className="space-y-3">
                      {block.items.map((listItem, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                          <span style={{ color: 'var(--text-secondary)' }}>{listItem}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}