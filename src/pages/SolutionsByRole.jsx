import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Users, Target, Briefcase, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function SolutionsByRole() {
  const roles = [
    {
      icon: Users,
      title: 'For Creators',
      description: 'Build your personal brand and monetize your content',
      benefits: [
        'Create a professional link-in-bio storefront',
        'Promote apps that align with your content',
        'Earn passive income from your audience',
        'Track performance with creator-focused analytics'
      ],
      cta: 'Start as Creator',
      highlight: true
    },
    {
      icon: Target,
      title: 'For Marketers',
      description: 'Access premium products to promote and maximize ROI',
      benefits: [
        'High-converting products with proven track records',
        'Marketing materials and swipe copy provided',
        'Advanced tracking and attribution',
        'A/B test different product combinations'
      ],
      cta: 'Start as Marketer'
    },
    {
      icon: Briefcase,
      title: 'For Entrepreneurs',
      description: 'Build a scalable affiliate business without inventory',
      benefits: [
        'No product creation or fulfillment needed',
        'Scale to multiple storefronts and niches',
        'White-label options for agencies',
        'Dedicated account support'
      ],
      cta: 'Start as Entrepreneur'
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAFA' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6" style={{ 
            background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #A78BFA 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Solutions by Role
          </h1>
          <p className="text-base md:text-xl lg:text-2xl max-w-3xl mx-auto" style={{ color: '#2E2E42' }}>
            Whether you're a creator, marketer, or entrepreneur, we have tailored tools to accelerate your success
          </p>
        </motion.div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-20">
          {roles.map((role, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              whileHover={{ y: -8 }}
              className={`rounded-2xl p-8 border-2 shadow-xl hover:shadow-2xl transition-shadow ${role.highlight ? 'shadow-2xl' : ''}`}
              style={{ 
                backgroundColor: 'white',
                borderColor: role.highlight ? '#7C3AED' : 'rgba(139, 92, 246, 0.2)'
              }}
            >
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: '#F0EDFF' }}>
                <role.icon className="w-8 h-8" style={{ color: '#7C3AED' }} />
              </div>

              <h2 className="text-2xl font-bold mb-3" style={{ color: '#1A1A2E' }}>{role.title}</h2>
              <p className="mb-6" style={{ color: '#2E2E42' }}>{role.description}</p>

              <ul className="space-y-3 mb-8">
                {role.benefits.map((benefit, benefitIdx) => (
                  <li key={benefitIdx} className="flex items-start gap-2">
                    <span style={{ color: '#7C3AED' }}>✓</span>
                    <span className="text-sm" style={{ color: '#2E2E42' }}>{benefit}</span>
                  </li>
                ))}
              </ul>

              <Link to={createPageUrl('Join')}>
                <Button className="w-full gap-2 text-white shadow-lg hover:shadow-xl transition-shadow" style={{ backgroundColor: '#7C3AED' }}>
                  {role.cta}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl p-12 text-center border shadow-xl" style={{ 
            backgroundColor: 'white',
            borderColor: 'rgba(139, 92, 246, 0.15)'
          }}
        >
          <h2 className="text-3xl font-bold mb-4" style={{ 
            background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #A78BFA 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Not sure which role fits you?</h2>
          <p className="text-xl mb-8" style={{ color: '#2E2E42' }}>
            Start free and explore all features. You can customize your approach as you grow.
          </p>
          <Link to={createPageUrl('Join')}>
            <Button size="lg" className="px-10 py-6 text-white shadow-lg hover:shadow-xl transition-shadow" style={{ backgroundColor: '#7C3AED' }}>
              Get Started Free
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}