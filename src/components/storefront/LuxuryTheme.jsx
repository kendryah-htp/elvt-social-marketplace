import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Youtube, Facebook, Linkedin, Twitter, Globe, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const socialIcons = {
  instagram: Instagram,
  youtube: Youtube,
  facebook: Facebook,
  linkedin: Linkedin,
  twitter: Twitter,
  website: Globe
};

export default function LuxuryTheme({ profile, apps, products, onAppClick, onProductClick }) {
  const activeSocials = Object.entries(profile.social_links || {}).filter(([_, url]) => url);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDIxMiwgMTc1LCA1NSwgMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
        
        <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {profile.avatar_url && (
              <motion.img
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                src={profile.avatar_url}
                alt={profile.full_name}
                className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-[#D4AF37] elvt-gold-glow object-cover"
              />
            )}
            
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gradient">
              {profile.full_name}
            </h1>
            
            {profile.bio && (
              <p className="text-xl text-[#E5E0DB] max-w-2xl mx-auto mb-8 leading-relaxed">
                {profile.bio}
              </p>
            )}
            
            {activeSocials.length > 0 && (
              <div className="flex justify-center gap-4 mb-8">
                {activeSocials.map(([platform, url]) => {
                  const Icon = socialIcons[platform];
                  return Icon ? (
                    <motion.a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      className="w-12 h-12 rounded-full elvt-glass flex items-center justify-center text-[#D4AF37] hover:elvt-gold-glow transition-all"
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  ) : null;
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Apps Section */}
      {apps.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 py-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold mb-12 text-center text-[#D4AF37]"
          >
            Premium Apps & Tools
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((app, idx) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                onClick={() => onAppClick(app)}
                className="elvt-glass rounded-2xl overflow-hidden cursor-pointer group"
              >
                {app.thumbnail_url && (
                  <div className="aspect-video bg-[#2A2A2A] overflow-hidden">
                    <img
                      src={app.thumbnail_url}
                      alt={app.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-[#F5F0EB] group-hover:text-[#D4AF37] transition-colors">
                      {app.name}
                    </h3>
                    <span className="text-2xl font-bold text-[#D4AF37]">
                      ${app.price}
                    </span>
                  </div>
                  
                  {app.short_description && (
                    <p className="text-[#E5E0DB] text-sm mb-4 line-clamp-2">
                      {app.short_description}
                    </p>
                  )}
                  
                  <Button className="w-full bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0A] font-semibold">
                    View Details
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Products Section */}
      {products.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 py-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold mb-12 text-center text-[#D4AF37]"
          >
            My Products
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="elvt-glass rounded-2xl overflow-hidden group"
              >
                {product.thumbnail_url && (
                  <div className="aspect-video bg-[#2A2A2A] overflow-hidden">
                    <img
                      src={product.thumbnail_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-[#F5F0EB]">
                      {product.name}
                    </h3>
                    {product.price && (
                      <span className="text-2xl font-bold text-[#D4AF37]">
                        ${product.price}
                      </span>
                    )}
                  </div>
                  
                  {product.description && (
                    <p className="text-[#E5E0DB] text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  
                  <Button
                    onClick={() => window.open(product.external_link, '_blank')}
                    className="w-full bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0A] font-semibold flex items-center justify-center gap-2"
                  >
                    Learn More <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-[#D4AF37]/20 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-[#E5E0DB] text-sm">
            Powered by{' '}
            <span className="text-[#D4AF37] font-semibold">ELVT Social</span>
          </p>
        </div>
      </div>
    </div>
  );
}