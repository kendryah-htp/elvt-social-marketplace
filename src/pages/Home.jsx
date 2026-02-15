import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap, Users, TrendingUp, CheckCircle2, Star, Shield, Clock, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import SocialProofFeed from '@/components/SocialProofFeed';

export default function Home() {
  const { data: apps = [] } = useQuery({
    queryKey: ['featured-apps'],
    queryFn: async () => {
      const allApps = await base44.entities.App.filter({ is_active: true });
      return allApps.filter(app => app.badges?.includes('featured')).slice(0, 3);
    }
  });

  return (
    <div className="min-h-screen elvt-gradient overflow-hidden">
      <SocialProofFeed />
      {/* 1. Hero Block */}
      <div className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 -right-40 w-96 h-96 rounded-full blur-[120px]"
            style={{ backgroundColor: 'var(--accent)', opacity: 0.2 }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block mb-6"
            >
              <div className="elvt-glass px-6 py-3 rounded-full inline-flex items-center gap-3 border pulse-glow" style={{ borderColor: 'var(--border)' }}>
                <Sparkles className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                <span className="font-bold text-sm tracking-wider" style={{ color: 'var(--accent)' }}>PREMIUM AFFILIATE MARKETPLACE</span>
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-5xl md:text-7xl font-black mb-6 leading-tight"
            >
              Never Wonder What to Post Again. <span className="text-gradient">Let MILO Help You Build Your Empire</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-xl md:text-2xl mb-6 leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              Meet MILO, your personalized AI co-pilot trained on your unique brand voice and expertise. Generate blog posts, social content, and product recommendations aligned with how YOU speak. Build your branded storefront and earn generous commissions. No more content blocks. No more inconsistency.
            </motion.p>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-sm mb-10 font-light"
              style={{ color: 'var(--text-muted)' }}
            >
              "I did the heavy lifting so you don't have to." 
              <a 
                href="https://btb.elvt.social/bio"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 underline transition-colors hover:opacity-80"
                style={{ color: 'var(--accent)' }}
              >
                Learn the vision.
              </a>
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to={createPageUrl('Join')}>
                <Button size="lg" className="px-10 py-7 text-lg font-bold pulse-glow" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to={createPageUrl('AppCatalog')}>
                <Button size="lg" variant="outline" className="px-10 py-7 text-lg font-bold" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                  Explore Apps
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* 2. Trust Signals Block */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-lg font-semibold mb-8" style={{ color: 'var(--text-muted)' }}>Trusted by Successful Creators</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { stat: '500+', label: 'Active Storefronts' },
              { stat: '$2M+', label: 'Earnings Paid' },
              { stat: '30%', label: 'Average Commission' }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="elvt-glass rounded-xl p-6"
              >
                <div className="text-4xl font-black mb-2 text-gradient">{item.stat}</div>
                <p style={{ color: 'var(--text-secondary)' }}>{item.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 3. Choose Your Path Block */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">Find Your Perfect Solution</h2>
          <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
            Whether you're a creator, marketer, or entrepreneur, we have the tools to accelerate your success
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Users, title: "I'm a Creator", desc: "Monetize with your branded storefront + MILO AI creates content in your voice", link: 'SolutionsByRole' },
            { icon: TrendingUp, title: "I'm a Marketer", desc: "Curated apps + AI content ideas + affiliate earnings from day one", link: 'SolutionsByRole' },
            { icon: Target, title: "Achieve Lead Gen", desc: "Content funnels built faster with MILO + affiliate monetization", link: 'SolutionsByUseCase' }
          ].map((path, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <Link to={createPageUrl(path.link)}>
                <div className="elvt-glass rounded-2xl p-8 text-center cursor-pointer group hover:elvt-glow transition-all duration-300 h-full">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <path.icon className="w-8 h-8" style={{ color: 'var(--accent)' }} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{path.title}</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>{path.desc}</p>
                  <Button className="mt-6" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
                    Learn More
                  </Button>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 4. Mechanism / How It Works */}
      <div className="max-w-7xl mx-auto px-6 py-20" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">Your 3-Step Path to Passive Income</h2>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            From idea to earning, MILO handles the hardest part: content creation
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12">
          {[
            { step: '01', title: '✨ Ask MILO', desc: 'Tell MILO what to write. Get blog posts, social content, email copy in seconds—all in your brand voice', icon: Sparkles },
            { step: '02', title: 'Share & Build', desc: 'Publish your content, build your audience, and share your curated storefront link', icon: Zap },
            { step: '03', title: 'Earn Commissions', desc: 'Get paid 30% on every sale + build long-term audience loyalty', icon: TrendingUp }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="relative"
            >
              <div className="text-6xl font-black mb-4" style={{ color: 'var(--accent)', opacity: 0.2 }}>{item.step}</div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--accent)' }}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 5. Feature Grid */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">Everything You Need to Succeed</h2>
          <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
            From content creation to monetization, we've built the tools that actually solve creator problems
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Sparkles, title: '✨ MILO AI Co-Pilot', desc: 'Generate blog posts & content in YOUR brand voice instantly' },
            { icon: Shield, title: 'Curated App Catalog', desc: 'Pre-vetted products you can confidently promote' },
            { icon: TrendingUp, title: 'Built-in Blog Engine', desc: 'Guided onboarding + SEO templates included' },
            { icon: Clock, title: 'Instant Payouts', desc: 'Get paid fast for every sale and referral' }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="elvt-glass rounded-xl p-6 card-hover"
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <feature.icon className="w-6 h-6" style={{ color: 'var(--accent)' }} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{feature.title}</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 6. 3-Step Process (Visual) */}
      <div className="max-w-5xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">Your Path to Success in 3 Simple Steps</h2>
          <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>From signup to earning, we guide you every step of the way</p>
        </motion.div>

        <div className="space-y-8">
          {[
            { num: 1, title: 'Sign Up Free', desc: 'Create your account in under 60 seconds. No credit card required.' },
            { num: 2, title: 'Customize Your Store', desc: 'Pick your favorite apps and design your storefront with our drag-and-drop builder.' },
            { num: 3, title: 'Share & Earn', desc: 'Drop your link in your bio and start earning commissions automatically.' }
          ].map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="elvt-glass rounded-xl p-8 flex items-start gap-6"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
                {step.num}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>
              </div>
              <CheckCircle2 className="flex-shrink-0 w-8 h-8" style={{ color: 'var(--accent)' }} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* 7. Templates / Examples */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">Launch Instantly with Proven Templates</h2>
          <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
            Stop building from scratch. Choose from expertly designed apps to get online in minutes
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {apps.map((app, idx) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              whileHover={{ y: -8 }}
            >
              <Link to={createPageUrl('AppDetail') + '?id=' + app.id}>
                <div className="elvt-glass rounded-2xl overflow-hidden cursor-pointer group hover:elvt-glow transition-all duration-300">
                  {app.thumbnail_url && (
                    <div className="aspect-video overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                      <img src={app.thumbnail_url} alt={app.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{app.name}</h3>
                    <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{app.short_description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>${app.price}</span>
                      {app.social_proof_rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4" style={{ fill: 'var(--accent)', color: 'var(--accent)' }} />
                          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{app.social_proof_rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to={createPageUrl('AppCatalog')}>
            <Button size="lg" variant="outline" className="px-8 py-6" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
              Browse All Templates
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* 8. Pricing Preview */}
      <div className="max-w-5xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="elvt-glass rounded-3xl p-12 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">Simple, Transparent Pricing</h2>
          <p className="text-xl mb-8" style={{ color: 'var(--text-secondary)' }}>
            Get started free and scale your success with flexible commission rates
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
            <div className="text-center">
              <div className="text-5xl font-black mb-2" style={{ color: 'var(--accent)' }}>Free</div>
              <p style={{ color: 'var(--text-secondary)' }}>To start your storefront</p>
            </div>
            <div className="hidden md:block w-px h-16" style={{ backgroundColor: 'var(--border)' }} />
            <div className="text-center">
              <div className="text-5xl font-black mb-2" style={{ color: 'var(--accent)' }}>30%</div>
              <p style={{ color: 'var(--text-secondary)' }}>Commission on sales</p>
            </div>
          </div>
          <Link to={createPageUrl('Pricing')}>
            <Button size="lg" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
              View All Plans
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* 9. FAQ */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">Common Questions</h2>
          <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
            Everything you need to know about MILO, earning, and success
          </p>
        </motion.div>

        <div className="space-y-6">
          {[
            { q: 'How does MILO know my brand voice?', a: 'Admins set up resources, guides, and FAQs. MILO learns from them and generates content that sounds exactly like you.' },
            { q: 'Can I really avoid content blocks with MILO?', a: 'Yes. Just ask MILO "write a blog post about X" and you get a full draft in your voice in seconds. No more staring at blank pages.' },
            { q: 'What if I have no experience with affiliate marketing?', a: 'We have guided onboarding for everything: blog setup, storefront customization, content strategies. MILO also answers your questions 24/7.' },
            { q: 'How much do I earn?', a: 'Up to 30% per sale, paid automatically within 7 days. Admins set margins—you earn the difference between what customers pay and the platform fee.' }
          ].map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="elvt-glass rounded-xl p-6"
            >
              <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{faq.q}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>{faq.a}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to={createPageUrl('FAQ')}>
            <Button variant="outline" className="px-8" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
              Read All FAQs
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* 10. Final CTA */}
      <div className="max-w-7xl mx-auto px-6 py-20 pb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="elvt-glass rounded-3xl p-16 text-center relative overflow-hidden border pulse-glow" style={{ borderColor: 'var(--border)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br opacity-10" style={{ background: `radial-gradient(circle, var(--accent) 0%, transparent 70%)` }} />
          <h2 className="text-5xl md:text-6xl font-black mb-6 text-gradient relative z-10">
            Stop Waiting, Start Earning Today
          </h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto relative z-10" style={{ color: 'var(--text-secondary)' }}>
            Join thousands of creators who are already building their income with ELVT Social. Your financial freedom journey begins now.
          </p>
          <Link to={createPageUrl('Join')}>
            <Button size="lg" className="px-14 py-8 text-xl font-black relative z-10 pulse-glow" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
              Claim Your Free Storefront
              <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}