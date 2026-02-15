import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, TrendingUp, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Home() {
  return (
    <div className="min-h-screen elvt-gradient overflow-hidden">
      {/* Hero Section */}
      <div className="relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDIxMiwgMTc1LCA1NSwgMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-10" />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 -right-40 w-96 h-96 bg-[#D4AF37] rounded-full blur-[120px] opacity-20"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#D4AF37] rounded-full blur-[120px] opacity-20"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 py-32 md:py-40 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-5xl mx-auto"
          >
            {/* Badge with pulsing animation */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block mb-8"
            >
              <motion.div
                animate={{ boxShadow: ["0 0 0 0 rgba(212, 175, 55, 0)", "0 0 0 8px rgba(212, 175, 55, 0)"] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="elvt-glass px-6 py-3 rounded-full inline-flex items-center gap-3 border border-[#D4AF37]/20"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                </motion.div>
                <span className="text-[#D4AF37] font-bold text-sm tracking-wider">ELVT SOCIAL MARKETPLACE</span>
              </motion.div>
            </motion.div>
            
            {/* Hero headline with stagger effect */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Your Premium
              <motion.span 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-gradient block mt-3"
              >
                Affiliate Marketplace
              </motion.span>
            </motion.h1>
            
            {/* Description with fade-in */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-xl md:text-2xl mb-12 leading-relaxed max-w-3xl mx-auto font-light"
              style={{ color: 'var(--text-secondary)' }}
            >
              Discover world-class apps, tools, and training. Build your own branded storefront and earn generous commissions on every sale.
            </motion.p>
            
            {/* CTA buttons with hover effects */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-5 justify-center items-center"
            >
              <Link to={createPageUrl('AppCatalog')}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    size="lg" 
                    className="bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0A] font-bold px-10 py-7 text-lg group shadow-[0_8px_30px_rgba(212,175,55,0.3)] hover:shadow-[0_8px_40px_rgba(212,175,55,0.5)] transition-all duration-300"
                  >
                    Browse Marketplace
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </Button>
                </motion.div>
              </Link>
              
              <Link to={createPageUrl('Join')}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A0A0A] px-10 py-7 text-lg font-bold backdrop-blur-sm transition-all duration-300"
                  >
                    Become an Affiliate
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-black mb-6 text-gradient tracking-tight"
          >
            Why ELVT Social?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl font-light"
            style={{ color: 'var(--text-secondary)' }}
          >
            The only marketplace built for high-ticket creators and affiliates
          </motion.p>
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.6, ease: "easeOut" }}
              whileHover={{ y: -12, scale: 1.02 }}
              className="elvt-glass rounded-3xl p-10 text-center group cursor-pointer relative overflow-hidden border border-[#D4AF37]/10"
            >
              {/* Hover gradient effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={false}
              />
              
              <motion.div 
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 flex items-center justify-center group-hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-500 relative z-10"
              >
                <feature.icon className="w-10 h-10 text-[#D4AF37]" />
              </motion.div>
              
              <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-[#D4AF37] transition-colors duration-300 relative z-10" style={{ color: 'var(--text-primary)' }}>
                {feature.title}
              </h3>
              
              <p className="text-lg leading-relaxed font-light relative z-10" style={{ color: 'var(--text-secondary)' }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-32 pb-40">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="elvt-glass rounded-[2rem] p-16 md:p-20 text-center relative overflow-hidden border border-[#D4AF37]/20"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 via-transparent to-[#D4AF37]/5" />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37] rounded-full blur-[120px]"
          />
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-black mb-8 text-gradient relative z-10 tracking-tight"
          >
            Ready to Elevate Your Income?
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto relative z-10 font-light leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Join hundreds of affiliates earning with premium products. Get your free branded storefront in under 3 minutes.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="relative z-10"
          >
            <Link to={createPageUrl('Join')}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  className="bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0A] font-black px-14 py-8 text-xl shadow-[0_10px_40px_rgba(212,175,55,0.4)] hover:shadow-[0_15px_50px_rgba(212,175,55,0.6)] transition-all duration-300"
                >
                  Start Free Today
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}