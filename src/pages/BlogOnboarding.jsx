import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, PenTool, Share2, TrendingUp, Zap, ArrowRight, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function BlogOnboarding() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    blogTitle: '',
    tagline: '',
    category: 'business'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen elvt-gradient py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gradient mb-4">Start Your Blog</h1>
          <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
            Build thought leadership, attract your audience, and drive traffic to your storefront
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between mb-4">
            {[1, 2, 3].map(num => (
              <div
                key={num}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                  step >= num ? 'elvt-glass' : 'bg-gray-700'
                }`}
                style={{ backgroundColor: step >= num ? 'var(--accent)' : undefined, color: step >= num ? 'white' : 'var(--text-muted)' }}
              >
                {num}
              </div>
            ))}
          </div>
          <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full transition-all"
              style={{ backgroundColor: 'var(--accent)', width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Why Blog */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-bold mb-8">Why Blogging Works</h2>
            
            <div className="grid gap-6">
              {[
                { icon: TrendingUp, title: 'Drive Traffic', desc: 'Each blog post brings organic search traffic to your storefront' },
                { icon: PenTool, title: 'Build Authority', desc: 'Share expertise, establish credibility, become the go-to expert' },
                { icon: Share2, title: 'Social Content', desc: 'Repurpose blog posts into 10+ social media pieces (TikTok, Instagram, LinkedIn)' },
                { icon: Zap, title: 'Boost Conversions', desc: 'Content readers are 3x more likely to buy from you' }
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="elvt-glass rounded-xl p-6 flex items-start gap-4"
                  >
                    <Icon className="flex-shrink-0 w-8 h-8 mt-1" style={{ color: 'var(--accent)' }} />
                    <div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <Button
              onClick={() => setStep(2)}
              size="lg"
              className="w-full py-6 text-lg font-bold"
              style={{ backgroundColor: 'var(--accent)', color: 'white' }}
            >
              Let's Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        )}

        {/* Step 2: Setup Blog */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-bold mb-8">Set Up Your Blog</h2>
            
            <div className="elvt-glass rounded-xl p-8 space-y-6">
              <div>
                <label className="block text-lg font-bold mb-2">Blog Name</label>
                <Input
                  name="blogTitle"
                  value={formData.blogTitle}
                  onChange={handleChange}
                  placeholder="e.g., 'The Creator's Blueprint', 'Digital Marketing Diary'"
                  style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)', padding: '12px' }}
                />
                <p style={{ color: 'var(--text-muted)' }} className="text-sm mt-2">Make it memorable and SEO-friendly</p>
              </div>

              <div>
                <label className="block text-lg font-bold mb-2">Tagline</label>
                <Input
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  placeholder="e.g., 'Insights on building your empire' (optional)"
                  style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)', padding: '12px' }}
                />
              </div>

              <div>
                <label className="block text-lg font-bold mb-2">Primary Topic</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border)', width: '100%' }}
                >
                  <option value="business">💼 Business & Growth</option>
                  <option value="marketing">📢 Marketing & Sales</option>
                  <option value="creator">🎬 Creator Economy</option>
                  <option value="tech">💻 Technology</option>
                  <option value="lifestyle">✨ Lifestyle & Personal Dev</option>
                  <option value="other">📚 Other</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                size="lg"
                className="flex-1 py-6"
                style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
              >
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                size="lg"
                className="flex-1 py-6 font-bold"
                style={{ backgroundColor: 'var(--accent)', color: 'white' }}
              >
                Next: Best Practices
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Best Practices */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-bold mb-8">Blog Success Playbook</h2>
            
            <div className="space-y-6">
              {[
                {
                  title: '📝 Write for Your Audience',
                  tips: [
                    'Use language your audience uses',
                    'Start with a hook (first 2 sentences MUST grab attention)',
                    'Answer real questions your audience has',
                    'Target 1,500-2,500 words per post (sweet spot for SEO + readability)'
                  ]
                },
                {
                  title: '🎯 SEO & Distribution',
                  tips: [
                    'Use keyword-rich titles (include your target keyword)',
                    'Add meta descriptions (160 chars max)',
                    'Link to your storefront naturally (1-2 times per post)',
                    'Share each post on TikTok, Instagram Reels, LinkedIn, Twitter'
                  ]
                },
                {
                  title: '⚡ Publishing Schedule',
                  tips: [
                    'Publish 2x per week (minimum) for first month',
                    'Use consistent posting day/time (e.g., Tuesdays & Fridays at 9am)',
                    'Plan 30 days of content before launching',
                    'Repurpose 1 blog post into 10 social media pieces'
                  ]
                },
                {
                  title: '💰 Monetization Tips',
                  tips: [
                    'Link relevant apps in each blog post (natural product placement)',
                    'Create a "Resources" section at end with affiliate products',
                    'Write "roundup" posts (5 Best Tools for X) — high conversion',
                    'Track which blog posts drive most sales, write more like them'
                  ]
                }
              ].map((section, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="elvt-glass rounded-xl p-6"
                >
                  <h3 className="text-xl font-bold mb-4">{section.title}</h3>
                  <ul className="space-y-2">
                    {section.tips.map((tip, i) => (
                      <li key={i} className="flex gap-3">
                        <CheckCircle2 className="flex-shrink-0 w-5 h-5 mt-0.5" style={{ color: 'var(--accent)' }} />
                        <span style={{ color: 'var(--text-secondary)' }}>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Alert */}
            <div className="elvt-glass rounded-xl p-6 border" style={{ borderColor: 'var(--accent)' }}>
              <div className="flex gap-3">
                <AlertCircle className="flex-shrink-0 w-6 h-6" style={{ color: 'var(--accent)' }} />
                <div>
                  <p className="font-bold mb-1">Pro Tip: Content = Traffic = Revenue</p>
                  <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
                    Each blog post is a long-term asset. A post written today could generate affiliate commissions for years. Consistency beats perfection.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(2)}
                variant="outline"
                size="lg"
                className="flex-1 py-6"
                style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
              >
                Back
              </Button>
              <Link to={createPageUrl('Blog')} className="flex-1">
                <Button
                  size="lg"
                  className="w-full py-6 font-bold"
                  style={{ backgroundColor: 'var(--accent)', color: 'white' }}
                >
                  Start Writing
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}