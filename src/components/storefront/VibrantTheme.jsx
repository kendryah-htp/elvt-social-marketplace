import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Youtube, Facebook, Linkedin, Twitter, Globe, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const socialIcons = {
  instagram: Instagram,
  youtube: Youtube,
  facebook: Facebook,
  linkedin: Linkedin,
  twitter: Twitter,
  website: Globe
};

export default function VibrantTheme({ profile, apps, products, onAppClick, onProductClick }) {
  const activeSocials = Object.entries(profile.social_links || {}).filter(([_, url]) => url);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            {profile.avatar_url && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="relative inline-block mb-6"
              >
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-2xl"
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-2 -right-2 text-yellow-300"
                >
                  <Sparkles className="w-8 h-8" />
                </motion.div>
              </motion.div>
            )}
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-white drop-shadow-lg">
              {profile.full_name}
            </h1>
            
            {profile.bio && (
              <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed font-medium">
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
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-purple-900 transition-all shadow-lg"
                    >
                      <Icon className="w-6 h-6" />
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
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-4xl font-extrabold mb-12 text-center text-white drop-shadow-lg"
          >
            ✨ Amazing Apps & Tools ✨
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((app, idx) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05, rotate: 2 }}
                onClick={() => onAppClick(app)}
                className="bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden cursor-pointer border-2 border-white/20 shadow-2xl"
              >
                {app.thumbnail_url && (
                  <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-500 overflow-hidden">
                    <img
                      src={app.thumbnail_url}
                      alt={app.name}
                      className="w-full h-full object-cover mix-blend-overlay"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-white flex-1">
                      {app.name}
                    </h3>
                    <span className="text-2xl font-extrabold text-yellow-300">
                      ${app.price}
                    </span>
                  </div>
                  
                  {app.short_description && (
                    <p className="text-white/80 text-sm mb-4 line-clamp-2">
                      {app.short_description}
                    </p>
                  )}
                  
                  <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-purple-900 font-bold shadow-lg">
                    Get It Now! 🚀
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
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-4xl font-extrabold mb-12 text-center text-white drop-shadow-lg"
          >
            💎 My Exclusive Products 💎
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl"
              >
                {product.thumbnail_url && (
                  <div className="aspect-video bg-gradient-to-br from-blue-500 to-teal-500 overflow-hidden">
                    <img
                      src={product.thumbnail_url}
                      alt={product.name}
                      className="w-full h-full object-cover mix-blend-overlay"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-white flex-1">
                      {product.name}
                    </h3>
                    {product.price && (
                      <span className="text-2xl font-extrabold text-yellow-300">
                        ${product.price}
                      </span>
                    )}
                  </div>
                  
                  {product.description && (
                    <p className="text-white/80 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  
                  <Button
                    onClick={() => window.open(product.external_link, '_blank')}
                    className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold shadow-lg flex items-center justify-center gap-2"
                  >
                    Check It Out! <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-white/20 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-white/90 text-sm font-bold">
            Powered by{' '}
            <span className="text-yellow-300">ELVT Social</span> ✨
          </p>
        </div>
      </div>
    </div>
  );
}