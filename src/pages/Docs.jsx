import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Book, Video, FileText, MessageCircle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Docs() {
  const docCategories = [
    {
      icon: Book,
      title: 'Getting Started',
      description: 'Everything you need to launch your first storefront',
      guides: ['Quick start guide', 'Creating your profile', 'Selecting apps', 'Customizing your store']
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Step-by-step video walkthroughs',
      guides: ['Dashboard overview', 'Marketing best practices', 'Analytics deep dive', 'Advanced customization']
    },
    {
      icon: FileText,
      title: 'Marketing Resources',
      description: 'Templates and strategies to boost conversions',
      guides: ['Email templates', 'Social media copy', 'Content calendar', 'Traffic generation']
    },
    {
      icon: MessageCircle,
      title: 'Support',
      description: 'Get help when you need it',
      guides: ['Contact support', 'Community forum', 'Feature requests', 'Report issues']
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
            Documentation & Resources
          </h1>
          <p className="text-base md:text-xl lg:text-2xl max-w-3xl mx-auto mb-6 md:mb-8" style={{ color: '#2E2E42' }}>
            Everything you need to succeed with ELVT Social
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5" style={{ color: '#6B6B80' }} />
            <input
              type="text"
              placeholder="Search documentation..."
              className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-3 md:py-4 rounded-xl text-base md:text-lg shadow-md"
              style={{ backgroundColor: 'white', border: '1px solid rgba(139, 92, 246, 0.15)', color: '#1A1A2E' }}
            />
          </div>
        </motion.div>

        {/* Documentation Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-20">
          {docCategories.map((category, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              className="rounded-2xl p-8 border shadow-lg hover:shadow-xl transition-shadow" style={{ 
                backgroundColor: 'white',
                borderColor: 'rgba(139, 92, 246, 0.15)'
              }}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F0EDFF' }}>
                  <category.icon className="w-7 h-7" style={{ color: '#7C3AED' }} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2" style={{ color: '#1A1A2E' }}>{category.title}</h2>
                  <p style={{ color: '#2E2E42' }}>{category.description}</p>
                </div>
              </div>

              <ul className="space-y-3">
                {category.guides.map((guide, guideIdx) => (
                  <li key={guideIdx}>
                    <button className="text-left hover:opacity-70 transition-opacity" style={{ color: '#2E2E42' }}>
                      → {guide}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl p-12 text-center border shadow-xl" style={{ 
            backgroundColor: 'white',
            borderColor: 'rgba(139, 92, 246, 0.15)'
          }}
        >
          <h2 className="text-3xl font-bold mb-6" style={{ 
            background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #A78BFA 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Still need help?</h2>
          <p className="text-xl mb-8" style={{ color: '#2E2E42' }}>
            Our support team is here to assist you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('FAQ')}>
              <Button size="lg" variant="outline" className="px-8" style={{ borderColor: '#7C3AED', color: '#7C3AED' }}>
                View FAQs
              </Button>
            </Link>
            <Button size="lg" className="px-8 text-white shadow-lg" style={{ backgroundColor: '#7C3AED' }}>
              Contact Support
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}