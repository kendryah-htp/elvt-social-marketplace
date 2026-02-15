import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        { q: 'How do I create my storefront?', a: 'Sign up for free, customize your profile, select apps you want to promote, and your storefront link is ready to share instantly.' },
        { q: 'Is there a free trial?', a: 'Yes! The free plan is available forever with no credit card required. You can upgrade to Pro anytime.' },
        { q: 'How long does setup take?', a: 'Most users complete their storefront setup in under 5 minutes. No technical skills needed.' }
      ]
    },
    {
      category: 'Earnings & Payments',
      questions: [
        { q: 'How much can I earn?', a: 'Earnings vary by traffic and conversion rates. You earn 20-30% commission on every sale. Top affiliates earn $5,000+ monthly.' },
        { q: 'When do I get paid?', a: 'Commissions are paid out automatically within 7 days of each successful sale via your preferred payment method.' },
        { q: 'What payment methods are supported?', a: 'We support PayPal, direct bank transfer, and Stripe. Minimum payout is $50.' },
        { q: 'Can I track my earnings in real-time?', a: 'Yes! Your dashboard shows live stats including clicks, conversions, and earnings.' }
      ]
    },
    {
      category: 'Products & Promotion',
      questions: [
        { q: 'What kind of apps can I promote?', a: 'Premium apps, templates, training programs, funnels, automation tools, and more. All products are vetted for quality.' },
        { q: 'Can I promote multiple apps?', a: 'Yes! Feature as many apps as you want on your storefront. Mix and match based on your audience.' },
        { q: 'Do you provide marketing materials?', a: 'Yes, every app comes with promotional assets including images, copy templates, and social media content.' }
      ]
    },
    {
      category: 'Technical & Support',
      questions: [
        { q: 'Can I use my own domain?', a: 'Yes! Pro and Enterprise plans include custom domain support.' },
        { q: 'Is my storefront mobile-friendly?', a: 'Absolutely. All storefronts are fully responsive and optimized for mobile devices.' },
        { q: 'What kind of support do you offer?', a: 'Free plans get email support. Pro plans get priority support. Enterprise gets dedicated account managers.' },
        { q: 'Can I integrate with other tools?', a: 'Yes, we have integrations with popular email marketing, CRM, and analytics tools. API access available for Enterprise.' }
      ]
    }
  ];

  return (
    <div className="min-h-screen elvt-gradient">
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-gradient">
            Frequently Asked Questions
          </h1>
          <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
            Everything you need to know about ELVT Social. Can't find what you're looking for?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button className="gap-2" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
              <Mail className="w-4 h-4" />
              Email Support
            </Button>
            <Button variant="outline" className="gap-2" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
              <MessageCircle className="w-4 h-4" />
              Live Chat
            </Button>
          </div>
        </motion.div>

        {/* FAQ Categories */}
        {faqs.map((category, categoryIdx) => (
          <motion.div
            key={categoryIdx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIdx * 0.1 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              {category.category}
            </h2>

            <div className="space-y-4">
              {category.questions.map((faq, faqIdx) => {
                const globalIndex = `${categoryIdx}-${faqIdx}`;
                const isOpen = openIndex === globalIndex;

                return (
                  <div
                    key={faqIdx}
                    className="elvt-glass rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                      className="w-full p-6 flex items-center justify-between text-left hover:opacity-80 transition-opacity"
                    >
                      <span className="text-lg font-semibold pr-4" style={{ color: 'var(--text-primary)' }}>
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        style={{ color: 'var(--accent)' }}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="px-6 pb-6" style={{ color: 'var(--text-secondary)' }}>
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}