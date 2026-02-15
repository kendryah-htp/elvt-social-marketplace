import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function HeroSection() {
  return (
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
              <Button size="lg" className="px-10 py-7 text-lg font-bold pulse-glow text-white" style={{ backgroundColor: 'var(--accent)' }}>
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
  );
}