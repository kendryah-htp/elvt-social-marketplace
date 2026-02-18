import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Target, ShoppingCart, BookOpen, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function SolutionsByUseCase() {
  const useCases = [
    {
      icon: Target,
      title: 'Lead Generation',
      description: 'Build funnels that convert visitors into customers',
      apps: ['Landing page templates', 'Email marketing tools', 'CRM integrations', 'Lead magnet creators'],
      results: 'Generate 3x more qualified leads',
      cta: 'Explore Lead Gen Tools'
    },
    {
      icon: ShoppingCart,
      title: 'E-commerce',
      description: 'Launch and scale your online store effortlessly',
      apps: ['Storefront templates', 'Payment integrations', 'Inventory management', 'Checkout optimizers'],
      results: 'Increase sales by 40%',
      cta: 'Explore E-commerce Tools',
      highlight: true
    },
    {
      icon: BookOpen,
      title: 'Content Creation',
      description: 'Create, manage, and monetize your content',
      apps: ['Content templates', 'SEO tools', 'Social media schedulers', 'Analytics dashboards'],
      results: 'Save 10+ hours per week',
      cta: 'Explore Content Tools'
    },
    {
      icon: TrendingUp,
      title: 'Audience Growth',
      description: 'Grow and engage your audience at scale',
      apps: ['Email automation', 'Social media tools', 'Community platforms', 'Growth analytics'],
      results: 'Double your audience in 90 days',
      cta: 'Explore Growth Tools'
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
            Solutions by Use Case
          </h1>
          <p className="text-base md:text-xl lg:text-2xl max-w-3xl mx-auto" style={{ color: '#2E2E42' }}>
            Find the perfect apps for your specific business goals
          </p>
        </motion.div>

        {/* Use Case Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-20">
          {useCases.map((useCase, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              whileHover={{ y: -8 }}
              className={`rounded-2xl p-8 border-2 shadow-xl hover:shadow-2xl transition-shadow ${useCase.highlight ? 'shadow-2xl' : ''}`}
              style={{ 
                backgroundColor: 'white',
                borderColor: useCase.highlight ? '#7C3AED' : 'rgba(139, 92, 246, 0.2)'
              }}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F0EDFF' }}>
                  <useCase.icon className="w-7 h-7" style={{ color: '#7C3AED' }} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2" style={{ color: '#1A1A2E' }}>{useCase.title}</h2>
                  <p style={{ color: '#2E2E42' }}>{useCase.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3" style={{ color: '#6B6B80' }}>INCLUDED APPS:</h3>
                <div className="flex flex-wrap gap-2">
                  {useCase.apps.map((app, appIdx) => (
                    <span
                      key={appIdx}
                      className="px-3 py-1 rounded-lg text-sm"
                      style={{ backgroundColor: '#F0EDFF', color: '#2E2E42' }}
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6 p-4 rounded-lg border shadow-sm" style={{ 
                backgroundColor: 'white',
                borderColor: 'rgba(139, 92, 246, 0.15)'
              }}>
                <span className="text-sm font-semibold" style={{ color: '#6B6B80' }}>EXPECTED RESULTS: </span>
                <span className="font-bold" style={{ color: '#7C3AED' }}>{useCase.results}</span>
              </div>

              <Link to={createPageUrl('AppCatalog')}>
                <Button className="w-full gap-2 text-white shadow-lg hover:shadow-xl transition-shadow" style={{ backgroundColor: '#7C3AED' }}>
                  {useCase.cta}
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
          }}>Need a custom solution?</h2>
          <p className="text-xl mb-8" style={{ color: '#2E2E42' }}>
            Mix and match apps to create your perfect tech stack
          </p>
          <Link to={createPageUrl('AppCatalog')}>
            <Button size="lg" className="px-10 py-6 text-white shadow-lg hover:shadow-xl transition-shadow" style={{ backgroundColor: '#7C3AED' }}>
              Browse All Apps
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}