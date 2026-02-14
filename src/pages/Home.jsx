import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, TrendingUp, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Home() {
  return (
    <div className="min-h-screen elvt-gradient">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDIxMiwgMTc1LCA1NSwgMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
        
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block mb-6"
            >
              <div className="elvt-glass px-6 py-3 rounded-full inline-flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[#D4AF37] font-semibold text-sm">ELVT SOCIAL MARKETPLACE</span>
              </div>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Your Premium
              <span className="text-gradient block mt-2">Affiliate Marketplace</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-[#E5E0DB] mb-12 leading-relaxed max-w-3xl mx-auto">
              Discover world-class apps, tools, and training. Build your own branded storefront and earn generous commissions on every sale.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl('AppCatalog')}>
                <Button size="lg" className="bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0A] font-semibold px-8 py-6 text-lg group">
                  Browse Marketplace
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link to={createPageUrl('Join')}>
                <Button size="lg" variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A0A0A] px-8 py-6 text-lg">
                  Become an Affiliate
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
            Why ELVT Social?
          </h2>
          <p className="text-xl text-[#E5E0DB]">
            The only marketplace built for high-ticket creators and affiliates
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Zap,
              title: "Premium Apps",
              description: "Curated collection of high-converting apps, templates, and training programs worth promoting."
            },
            {
              icon: Users,
              title: "Branded Storefronts",
              description: "Get your own link-in-bio page with customizable themes. Perfect for social media bios."
            },
            {
              icon: TrendingUp,
              title: "Generous Commissions",
              description: "Earn up to 30% commission on every sale. Track your earnings in real-time."
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="elvt-glass rounded-2xl p-8 text-center group cursor-pointer"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#D4AF37]/10 flex items-center justify-center group-hover:elvt-gold-glow transition-all">
                <feature.icon className="w-8 h-8 text-[#D4AF37]" />
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-[#F5F0EB] group-hover:text-[#D4AF37] transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-[#E5E0DB] leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="elvt-glass rounded-3xl p-12 md:p-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Ready to Elevate Your Income?
          </h2>
          
          <p className="text-xl text-[#E5E0DB] mb-10 max-w-2xl mx-auto">
            Join hundreds of affiliates earning with premium products. Get your free branded storefront in under 3 minutes.
          </p>
          
          <Link to={createPageUrl('Join')}>
            <Button size="lg" className="bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0A] font-bold px-12 py-6 text-lg">
              Start Free Today
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}