import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap, Users, TrendingUp, CheckCircle2, Star, Shield, Clock, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import SocialProofFeed from '@/components/SocialProofFeed';
import TrustSignals from '@/components/TrustSignals';
import HeroSection from '@/components/HeroSection';
import StatCard from '@/components/StatCard';
import FeatureCard from '@/components/FeatureCard';
import LazyImage from '@/components/LazyImage';
import AnalyticsTracker, { trackConversion } from '@/components/AnalyticsTracker';

export default function Home() {
  return <HomeContent />;
}

function HomeContent() {
  const { data: apps = [] } = useQuery({
    queryKey: ['featured-apps'],
    queryFn: async () => {
      const allApps = await base44.entities.App.filter({ is_active: true });
      return allApps.filter(app => app.badges?.includes('featured')).slice(0, 3);
    }
  });

  return (
    <div className="min-h-screen elvt-gradient overflow-hidden">
      <AnalyticsTracker />
      <SocialProofFeed />
      
      {/* 1. Hero Block */}
      <HeroSection />

      {/* Trust Signals - Moved up for early confidence */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <TrustSignals />
      </div>

      {/* 3. Choose Your Path Block */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-gradient">Find Your Perfect Solution</h2>
          <p className="text-base md:text-lg lg:text-xl px-4" style={{ color: 'var(--text-secondary)' }}>
            Whether you're a creator, marketer, or entrepreneur, we have the tools to accelerate your success
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
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
                <div className="elvt-glass rounded-xl md:rounded-2xl p-6 md:p-8 text-center cursor-pointer group hover:elvt-glow hover:scale-[1.02] transition-all duration-500 h-full">
                  <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <path.icon className="w-6 h-6 md:w-8 md:h-8" style={{ color: 'var(--accent)' }} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3" style={{ color: 'var(--text-primary)' }}>{path.title}</h3>
                   <p className="text-sm md:text-base leading-relaxed flex-1 mb-4" style={{ color: 'var(--text-secondary)' }}>{path.desc}</p>
                   <Button className="mt-4 md:mt-6 w-full font-semibold text-white text-sm md:text-base py-5 md:py-6" style={{ backgroundColor: 'var(--accent)' }}>
                     Learn More <ArrowRight className="ml-2 w-4 h-4" />
                   </Button>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 4. Mechanism / How It Works */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 md:mb-4 text-gradient px-4 tracking-tight">Your 3-Step Path to Passive Income</h2>
          <p className="text-base md:text-lg lg:text-xl max-w-3xl mx-auto px-4" style={{ color: 'var(--text-secondary)' }}>
            From idea to earning, MILO handles the hardest part: content creation
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
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
              className="relative px-4 md:px-0"
            >
              <div className="text-5xl md:text-6xl font-black mb-3 md:mb-4" style={{ color: 'var(--accent)', opacity: 0.2 }}>{item.step}</div>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center mb-3 md:mb-4" style={{ backgroundColor: 'var(--accent)' }}>
                <item.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
              <p className="text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 5. Feature Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 md:mb-4 text-gradient px-4 tracking-tight">Everything You Need to Succeed</h2>
          <p className="text-base md:text-lg lg:text-xl px-4" style={{ color: 'var(--text-secondary)' }}>
            From content creation to monetization, we've built the tools that actually solve creator problems
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { icon: Zap, title: '✨ MILO AI Co-Pilot', desc: 'Generate blog posts & content in YOUR brand voice instantly' },
            { icon: Shield, title: 'Curated App Catalog', desc: 'Pre-vetted products you can confidently promote' },
            { icon: TrendingUp, title: 'Built-in Blog Engine', desc: 'Guided onboarding + SEO templates included' },
            { icon: Clock, title: 'Instant Payouts', desc: 'Get paid fast for every sale and referral' }
          ].map((feature, idx) => (
            <FeatureCard key={idx} {...feature} index={idx} />
          ))}
        </div>
      </div>

      {/* 6. 3-Step Process (Visual) */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-24 bg-gradient-to-r from-[var(--bg-secondary)] to-transparent rounded-2xl md:rounded-3xl p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 md:mb-4 text-gradient px-4 tracking-tight">Your Path to Success in 3 Simple Steps</h2>
          <p className="text-base md:text-lg lg:text-xl px-4" style={{ color: 'var(--text-secondary)' }}>From signup to earning, we guide you every step of the way</p>
        </motion.div>

        <div className="space-y-4 md:space-y-8">
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
              className="elvt-glass rounded-xl p-4 md:p-8 flex items-start gap-4 md:gap-6 hover:elvt-glow transition-all duration-500"
            >
              <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl md:text-2xl font-black" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
                {step.num}
              </div>
              <div className="flex-1">
                <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-2" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                <p className="text-sm md:text-lg" style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>
              </div>
              <CheckCircle2 className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8" style={{ color: 'var(--accent)' }} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* 7. Templates / Examples */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 md:mb-4 text-gradient px-4 tracking-tight">Launch Instantly with Proven Templates</h2>
          <p className="text-base md:text-lg lg:text-xl px-4" style={{ color: 'var(--text-secondary)' }}>
            Stop building from scratch. Choose from expertly designed apps to get online in minutes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {apps.map((app, idx) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              whileHover={{ y: -8 }}
            >
              <Link to={createPageUrl('AppDetail') + '?id=' + app.id} onClick={() => trackConversion('app_clicked', { app_id: app.id, app_name: app.name })}>
                <div className="elvt-glass rounded-xl md:rounded-2xl overflow-hidden cursor-pointer group hover:elvt-glow hover:scale-[1.02] transition-all duration-500">
                 {app.thumbnail_url && (
                   <div className="aspect-video overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                     <LazyImage src={app.thumbnail_url} alt={app.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" width={400} height={300} />
                   </div>
                 )}
                 <div className="p-4 md:p-6">
                   <h3 className="text-lg md:text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{app.name}</h3>
                   <p className="text-xs md:text-sm mb-3 md:mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{app.short_description}</p>
                   <div className="flex items-center justify-between">
                     <span className="text-xl md:text-2xl font-bold" style={{ color: 'var(--accent)' }}>${app.price}</span>
                     {app.social_proof_rating && (
                       <div className="flex items-center gap-1">
                         <Star className="w-4 h-4" style={{ fill: 'var(--accent)', color: 'var(--accent)' }} />
                         <span className="text-sm md:text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{app.social_proof_rating.toFixed(1)}</span>
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
          className="text-center mt-8 md:mt-12"
        >
          <Link to={createPageUrl('AppCatalog')}>
            <Button size="lg" className="px-6 md:px-8 py-5 md:py-6 text-sm md:text-base text-white font-semibold w-full md:w-auto" style={{ backgroundColor: 'var(--accent)' }}>
              Browse All Templates
              <ArrowRight className="ml-2 w-4 md:w-5 h-4 md:h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* 8. Pricing Preview */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="elvt-glass rounded-2xl md:rounded-3xl p-6 md:p-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 md:mb-4 text-gradient tracking-tight">Simple, Transparent Pricing</h2>
          <p className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 px-4" style={{ color: 'var(--text-secondary)' }}>
            Get started free and scale your success with flexible commission rates
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4 mb-6 md:mb-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black mb-2" style={{ color: 'var(--accent)' }}>Free</div>
              <p className="text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>To start your storefront</p>
            </div>
            <div className="hidden md:block w-px h-16" style={{ backgroundColor: 'var(--border)' }} />
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black mb-2" style={{ color: 'var(--accent)' }}>30%</div>
              <p className="text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>Commission on sales</p>
            </div>
          </div>
          <Link to={createPageUrl('Pricing')} onClick={() => trackConversion('pricing_clicked')}>
            <Button size="lg" className="text-white font-semibold text-sm md:text-base py-5 md:py-6 w-full md:w-auto px-8" style={{ backgroundColor: 'var(--accent)' }}>
              View All Plans
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* 9. FAQ */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 md:mb-4 text-gradient px-4 tracking-tight">Common Questions</h2>
          <p className="text-base md:text-lg lg:text-xl px-4" style={{ color: 'var(--text-secondary)' }}>
            Everything you need to know about MILO, earning, and success
          </p>
        </motion.div>

        <div className="space-y-4 md:space-y-6">
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
              className="elvt-glass rounded-xl p-4 md:p-6 hover:border-[var(--accent)] transition-all duration-300"
            >
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3" style={{ color: 'var(--text-primary)' }}>{faq.q}</h3>
              <p className="text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>{faq.a}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8 md:mt-12"
        >
          <Link to={createPageUrl('FAQ')}>
            <Button className="px-6 md:px-8 py-5 md:py-6 text-sm md:text-base text-white font-semibold w-full md:w-auto" style={{ backgroundColor: 'var(--accent)' }}>
              Read All FAQs
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* 10. Final CTA */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-24 pb-20 md:pb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="elvt-glass rounded-2xl md:rounded-3xl p-8 md:p-12 lg:p-16 text-center relative overflow-hidden border pulse-glow" style={{ borderColor: 'var(--accent)', borderWidth: '2px' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br opacity-10" style={{ background: `radial-gradient(circle, var(--accent) 0%, transparent 70%)` }} />
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 text-gradient relative z-10 tracking-tighter">
            Stop Waiting, Start Earning Today
          </h2>
          <p className="text-base md:text-lg lg:text-xl mb-8 md:mb-10 max-w-3xl mx-auto relative z-10 px-4" style={{ color: 'var(--text-secondary)' }}>
            Join thousands of creators who are already building their income with ELVT Social. Your financial freedom journey begins now.
          </p>
          <Link to={createPageUrl('Join')}>
            <Button size="lg" className="px-8 md:px-14 py-6 md:py-8 text-base md:text-xl font-black relative z-10 pulse-glow text-white w-full md:w-auto" style={{ backgroundColor: 'var(--accent)' }}>
              Claim Your Free Storefront
              <ArrowRight className="ml-2 w-5 md:w-6 h-5 md:h-6" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}